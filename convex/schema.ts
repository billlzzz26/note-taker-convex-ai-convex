import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    contentFormat: v.optional(v.string()),
    contentVersion: v.optional(v.number()),
    lastSyncedAt: v.optional(v.number()),
    updatedByClientId: v.optional(v.string()),
  }).index("by_createdAt", ["createdAt"])
    .index("by_tags", ["tags"])
    .index("by_contentVersion", ["contentVersion"]),

  threads: defineTable({
    title: v.string(),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
        toolCalls: v.optional(
          v.array(
            v.object({
              toolName: v.string(),
              args: v.any(),
              result: v.any(),
            })
          )
        ),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),
});
