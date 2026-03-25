import { KILO_API_KEY } from "./lib/env";
import { tools } from "./lib/tools";

export interface ToolCallResult {
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const noteManagementSkills = `
## Tag Taxonomy
Use these standard tags when saving notes:
- priority: High, Medium, Low
- category: Work, Personal, Project, Meeting, Idea, Todo

## Auto-tagging Rules
- Words like "deadline", "due" → add priority tag
- Words like "meeting", "call" → add Meeting category
`;

const responseFormatSkills = `
## Tone and Style
- Be conversational and helpful
- Keep responses concise but informative

## Note Operations
When saving: Confirm with tags you assigned
When searching: Show number of results and summarize
When updating: Confirm what changed
When deleting: Confirm the deletion
`;

const toolsJson = tools.map(t => ({
  type: "function",
  function: {
    name: t.name,
    description: t.description,
    parameters: t.inputSchema,
  },
}));

async function chatComplete(messages: { role: string; content: string; tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }> }[], toolsList?: unknown[]) {
  const response = await fetch("https://api.kilo.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KILO_API_KEY}`,
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-5-sonnet-20241022",
      messages,
      tools: toolsList,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kilo API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function chat(
  messages: Message[],
  onToolCall?: (toolName: string, args: Record<string, unknown>) => void
) {
  const systemPrompt = `You are a personal notebook assistant. You help users save, search, update, and delete notes.

When the user asks any question that can be answered from their notes, search or list the notes first before answering.

## Note Management Skills
${noteManagementSkills}

## Response Format Rules
${responseFormatSkills}

Remember:
- Always search notes before claiming no data exists
- Use the appropriate tool for each operation
- Be helpful and conversational`;

  const allMessages: { role: string; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const response: { choices: Array<{ message: { content: string; tool_calls: Array<{ id: string; function: { name: string; arguments: string } }> } }> } = await chatComplete(allMessages, toolsJson);

  const assistantMessage = response.choices[0]?.message;
  let fullText = assistantMessage?.content || "";
  const toolCalls: ToolCallResult[] = [];

  if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
    for (const tc of assistantMessage.tool_calls) {
      const tool = tools.find((t) => t.name === tc.function.name);
      if (tool) {
        const args = JSON.parse(tc.function.arguments || "{}");
        if (onToolCall) {
          onToolCall(tool.name, args);
        }
        const result = await tool.execute(args);
        toolCalls.push({
          toolName: tool.name,
          args,
          result,
        });

        const toolResultMessage = {
          role: "tool",
          content: JSON.stringify(result),
          tool_call_id: tc.id,
        };

        const secondResponse: { choices: Array<{ message: { content: string } }> } = await chatComplete([
          ...allMessages,
          assistantMessage as never,
          toolResultMessage as never,
        ], toolsJson);

        fullText = secondResponse.choices[0]?.message?.content || "";
      }
    }
  }

  return { content: fullText, toolCalls };
}
