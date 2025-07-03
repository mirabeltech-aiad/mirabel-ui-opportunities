
import { useState, useEffect } from "react";
import { Card, CardContent } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Textarea } from "@OpportunityComponents/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

const ArchitectNotesTab = () => {
  // Architect Notes state
  const [architectNotes, setArchitectNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", description: "", category: "upgrade" });

  useEffect(() => {
    // Load architect notes from localStorage
    const savedNotes = localStorage.getItem("architect_notes");
    if (savedNotes) {
      setArchitectNotes(JSON.parse(savedNotes));
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

    const updatedNotes = [...architectNotes, note];
    setArchitectNotes(updatedNotes);
    localStorage.setItem("architect_notes", JSON.stringify(updatedNotes));
    
    setNewNote({ title: "", description: "", category: "upgrade" });
    setIsAddingNote(false);
    
    toast({
      title: "Success",
      description: "Architect note has been added",
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

    const updatedNotes = architectNotes.map(note => 
      note.id === editingNote.id 
        ? { ...note, ...newNote, updatedAt: new Date().toISOString() }
        : note
    );

    setArchitectNotes(updatedNotes);
    localStorage.setItem("architect_notes", JSON.stringify(updatedNotes));
    
    setNewNote({ title: "", description: "", category: "upgrade" });
    setIsAddingNote(false);
    setEditingNote(null);
    
    toast({
      title: "Success",
      description: "Architect note has been updated",
    });
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = architectNotes.filter(note => note.id !== noteId);
    setArchitectNotes(updatedNotes);
    localStorage.setItem("architect_notes", JSON.stringify(updatedNotes));
    
    toast({
      title: "Success",
      description: "Architect note has been deleted",
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
      case 'upgrade': return 'bg-blue-100 text-blue-700';
      case 'bugfix': return 'bg-red-100 text-red-700';
      case 'feature': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Architect Notes</h2>
        <p className="text-gray-500">Manual notes on platform upgrades and changes</p>
      </div>

      {/* Add/Edit Note Form */}
      {isAddingNote && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Enter note title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="upgrade">Platform Upgrade</option>
                  <option value="feature">New Feature</option>
                  <option value="bugfix">Bug Fix</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newNote.description}
                  onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                  placeholder="Enter detailed description of the changes..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={editingNote ? handleUpdateNote : handleAddNote}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingNote ? 'Update Note' : 'Add Note'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNote(false);
                    setEditingNote(null);
                    setNewNote({ title: "", description: "", category: "upgrade" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Note Button */}
      {!isAddingNote && (
        <div className="mb-6">
          <Button
            onClick={() => setIsAddingNote(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Note
          </Button>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {architectNotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No architect notes yet. Add your first note to get started.</p>
            </CardContent>
          </Card>
        ) : (
          architectNotes
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((note) => (
              <Card key={note.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{note.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getCategoryColor(note.category)}`}>
                          {note.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(note.createdAt)}
                          {note.updatedAt !== note.createdAt && (
                            <span className="ml-2">(Updated: {formatDate(note.updatedAt)})</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {note.description && (
                    <p className="text-gray-700 whitespace-pre-wrap">{note.description}</p>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default ArchitectNotesTab;
