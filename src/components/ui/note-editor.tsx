"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Check, X, Search, Tag } from "lucide-react";

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Partial<Note>) => void;
  onDelete?: (id: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AVAILABLE_TAGS = [
  "Work", "Personal", "Project", "Meeting", 
  "Idea", "Todo", "High", "Medium", "Low"
];

export function NoteEditorDialog({ 
  note, 
  onSave, 
  onDelete,
  isOpen = true,
  onOpenChange 
}: NoteEditorProps) {
  const [title, setTitle] = React.useState(note?.title || "");
  const [content, setContent] = React.useState(note?.content || "");
  const [tags, setTags] = React.useState<string[]>(note?.tags || []);
  const [newTag, setNewTag] = React.useState("");
  const [showTagInput, setShowTagInput] = React.useState(false);

  React.useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
    }
  }, [note, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      _id: note?._id,
      title: title.trim(),
      content: content.trim(),
      tags,
      updatedAt: Date.now()
    });
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
    }
    setNewTag("");
    setShowTagInput(false);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const isEditing = !!note;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Note" : "Create New Note"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              placeholder="Note title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea 
              placeholder="Write your note..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {showTagInput ? (
                <div className="flex gap-1">
                  <Input 
                    placeholder="Add tag..." 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(newTag);
                      }
                      if (e.key === "Escape") {
                        setShowTagInput(false);
                        setNewTag("");
                      }
                    }}
                    className="h-7 w-24 text-sm"
                    autoFocus
                  />
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => addTag(newTag)}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowTagInput(true)}
                  className="h-7"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {AVAILABLE_TAGS.filter(t => !tags.includes(t)).map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          {isEditing && onDelete && (
            <Button 
              variant="destructive" 
              onClick={() => onDelete(note._id)}
              className="mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            <Check className="w-4 h-4 mr-1" />
            {isEditing ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterTag, setFilterTag] = React.useState<string>("all");

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(n => n.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [notes]);

  const filteredNotes = React.useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = !searchQuery || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = filterTag === "all" || note.tags.includes(filterTag);
      
      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, filterTag]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
    });
  };

  const tagColors: Record<string, string> = {
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Personal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Project: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Meeting: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    Idea: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    Todo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  };

  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">No notes yet</p>
          <p className="text-muted-foreground text-xs mt-1">Create your first note to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger className="w-[140px]">
            <Tag className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <Card 
              key={note._id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onEdit(note)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium line-clamp-1">
                    {note.title}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note._id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {note.content}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        tagColors[tag] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDate(note.updatedAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      {filteredNotes.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No notes match your search
        </p>
      )}
    </div>
  );
}

export default { NoteEditorDialog, NotesList };
