
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

const DeveloperNotesTab = () => {
  const [developerNotes, setDeveloperNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", description: "", category: "bug" });

  useEffect(() => {
    const savedNotes = localStorage.getItem("developer_notes");
    if (savedNotes) {
      setDeveloperNotes(JSON.parse(savedNotes));
    }
  }, []);

  const handleAddNote = () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the note",
        variant: "destructive",
      });
      return;
    }

    const note = {
      id: Date.now(),
      ...newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...developerNotes, note];
    setDeveloperNotes(updatedNotes);
    localStorage.setItem("developer_notes", JSON.stringify(updatedNotes));
    
    setNewNote({ title: "", description: "", category: "bug" });
    setIsAddingNote(false);
    
    toast({
      title: "Success",
      description: "Developer note has been added",
    });
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({ title: note.title, description: note.description, category: note.category });
    setIsAddingNote(true);
  };

  const handleUpdateNote = () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the note",
        variant: "destructive",
      });
      return;
    }

    const updatedNotes = developerNotes.map(note => 
      note.id === editingNote.id 
        ? { ...note, ...newNote, updatedAt: new Date().toISOString() }
        : note
    );

    setDeveloperNotes(updatedNotes);
    localStorage.setItem("developer_notes", JSON.stringify(updatedNotes));
    
    setNewNote({ title: "", description: "", category: "bug" });
    setIsAddingNote(false);
    setEditingNote(null);
    
    toast({
      title: "Success",
      description: "Developer note has been updated",
    });
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = developerNotes.filter(note => note.id !== noteId);
    setDeveloperNotes(updatedNotes);
    localStorage.setItem("developer_notes", JSON.stringify(updatedNotes));
    
    toast({
      title: "Success",
      description: "Developer note has been deleted",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'bug': return 'bg-red-100 text-red-700';
      case 'todo': return 'bg-yellow-100 text-yellow-700';
      case 'research': return 'bg-blue-100 text-blue-700';
      case 'optimization': return 'bg-green-100 text-green-700';
      case 'refactor': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Developer Notes</h2>
          <p className="text-sm text-gray-500">Technical notes, bugs, and development tasks</p>
        </div>

        {isAddingNote && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="text-base font-medium mb-3">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    placeholder="Enter note title"
                    className="h-8"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                    className="w-full p-2 h-8 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="bug">Bug</option>
                    <option value="todo">TODO</option>
                    <option value="research">Research</option>
                    <option value="optimization">Optimization</option>
                    <option value="refactor">Refactor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={newNote.description}
                    onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                    placeholder="Enter detailed description..."
                    rows={3}
                    className="text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={editingNote ? handleUpdateNote : handleAddNote}
                    className="bg-indigo-600 hover:bg-indigo-700 h-8 text-sm"
                  >
                    {editingNote ? 'Update' : 'Add'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNote(false);
                      setEditingNote(null);
                      setNewNote({ title: "", description: "", category: "bug" });
                    }}
                    className="h-8 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isAddingNote && (
          <Button
            onClick={() => setIsAddingNote(true)}
            className="bg-indigo-600 hover:bg-indigo-700 h-8 text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add New Note
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {developerNotes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 text-sm">No developer notes yet. Add your first note to get started.</p>
              </CardContent>
            </Card>
          ) : (
            developerNotes
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((note) => (
                <Card key={note.id} className="border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{note.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${getCategoryColor(note.category)}`}>
                            {note.category}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(note.createdAt)}
                            {note.updatedAt !== note.createdAt && (
                              <span className="ml-1 text-xs">(Upd: {formatDate(note.updatedAt)})</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {note.description && (
                      <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-3">{note.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DeveloperNotesTab;
