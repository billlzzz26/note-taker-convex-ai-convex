import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteEditorDialog, NotesList, type Note } from './note-editor';

describe('NoteEditorDialog', () => {
  const mockOnSave = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create mode when no note is provided', () => {
    render(
      <NoteEditorDialog onSave={mockOnSave} isOpen={true} onOpenChange={mockOnOpenChange} />
    );
    
    expect(screen.getByText('Create New Note')).toBeInTheDocument();
  });

  it('renders edit mode when note is provided', () => {
    const existingNote: Note = {
      _id: '1',
      title: 'Test Note',
      content: 'Test content',
      tags: ['Work', 'Important'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    render(
      <NoteEditorDialog 
        note={existingNote} 
        onSave={mockOnSave} 
        isOpen={true} 
        onOpenChange={mockOnOpenChange} 
      />
    );
    
    expect(screen.getByText('Edit Note')).toBeInTheDocument();
  });

  it('calls onSave with correct data when creating note', async () => {
    render(
      <NoteEditorDialog onSave={mockOnSave} isOpen={true} onOpenChange={mockOnOpenChange} />
    );

    const titleInput = screen.getByPlaceholderText('Note title...');
    const contentTextarea = screen.getByPlaceholderText('Write your note...');
    
    fireEvent.change(titleInput, { target: { value: 'New Note Title' } });
    fireEvent.change(contentTextarea, { target: { value: 'New Note Content' } });
    
    const saveButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'New Note Title',
        content: 'New Note Content',
        tags: [],
        updatedAt: expect.any(Number)
      });
    });
  });

  it('prevents saving when title is empty', () => {
    render(
      <NoteEditorDialog onSave={mockOnSave} isOpen={true} onOpenChange={mockOnOpenChange} />
    );

    const saveButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(saveButton);

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('can add tags', async () => {
    render(
      <NoteEditorDialog onSave={mockOnSave} isOpen={true} onOpenChange={mockOnOpenChange} />
    );

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    const tagInput = screen.getByPlaceholderText('Add tag...');
    fireEvent.change(tagInput, { target: { value: 'Work' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
    });
  });
});

describe('NotesList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const mockNotes: Note[] = [
    {
      _id: '1',
      title: 'First Note',
      content: 'Content of first note',
      tags: ['Work'],
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000
    },
    {
      _id: '2',
      title: 'Second Note',
      content: 'Content of second note',
      tags: ['Personal', 'Idea'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no notes', () => {
    render(<NotesList notes={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('No notes yet')).toBeInTheDocument();
  });

  it('renders list of notes', () => {
    render(<NotesList notes={mockNotes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.getByText('Second Note')).toBeInTheDocument();
  });

  it('filters notes by search query', () => {
    render(<NotesList notes={mockNotes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const searchInput = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(searchInput, { target: { value: 'First' } });

    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.queryByText('Second Note')).not.toBeInTheDocument();
  });

  it('calls onEdit when clicking a note', () => {
    render(<NotesList notes={mockNotes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const firstNote = screen.getByText('First Note');
    fireEvent.click(firstNote);

    expect(mockOnEdit).toHaveBeenCalledWith(mockNotes[0]);
  });
});

describe('Note data structure', () => {
  it('has correct Note interface', () => {
    const note: Note = {
      _id: 'test-id',
      title: 'Test Title',
      content: 'Test Content',
      tags: ['Tag1', 'Tag2'],
      createdAt: 1234567890,
      updatedAt: 1234567890
    };

    expect(note._id).toBe('test-id');
    expect(note.title).toBe('Test Title');
    expect(note.content).toBe('Test Content');
    expect(note.tags).toHaveLength(2);
    expect(note.createdAt).toBe(1234567890);
    expect(note.updatedAt).toBe(1234567890);
  });
});
