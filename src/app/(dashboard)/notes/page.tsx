"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, File, Menu, NotebookText, RefreshCcw, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NoteEditor from "@/components/notes/NoteEditor";
import NotesList from "@/components/notes/NotesList";
import PacmanLoader from "react-spinners/PacmanLoader";

interface Note {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
  parentId: string | null;
}

interface NoteData {
  _id: string;
  title: string;
  content: Array<{ type: string; content: string }>;
  updatedAt: string;
  parentId: string | null;
}

export default function NotesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      const formattedNotes = data.map((note: NoteData) => ({
        ...note,
        content: Array.isArray(note.content) ? note.content[0]?.content || "" : note.content || "",
      }));
      setNotes(formattedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        variant: "error",
        title: "Error",
        description: "Failed to load notes",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes, session]);

  const createNewNote = async () => {
    setIsCreating(true);
    setSelectedNote(null);
    setShowSidebar(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <PacmanLoader color="#00ADB5" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 text-white bg-[#222831] min-h-screen">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-2">
          <NotebookText className="h-6 w-6" /> Notes
        </h1>
        <div className="flex gap-3">
          <Button
            className="md:hidden border border-cyan-400 text-cyan-400"
            onClick={() => setShowSidebar(!showSidebar)}
            variant="ghost"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button onClick={fetchNotes} variant="outline" className="border-cyan-400 text-cyan-400">
            <RefreshCcw className="h-5 w-5" />
          </Button>
          <Button onClick={createNewNote} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className={`${showSidebar ? "block" : "hidden"} md:block md:col-span-3 bg-[#393E46] rounded-lg p-4 shadow-lg border border-cyan-500`}>  
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-cyan-400 font-semibold">Your Notes</h2>
            <XCircle
              className="h-5 w-5 text-gray-300 cursor-pointer md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          </div>
          <NotesList
            notes={notes}
            selectedNote={selectedNote}
            onSelectNote={(note: Note) => {
              setSelectedNote(note);
              setShowSidebar(false);
            }}
            onRefresh={fetchNotes}
          />
        </div>

        {/* Editor */}
        <div className="md:col-span-9 bg-[#393E46] rounded-lg p-6 shadow-lg border border-cyan-500">
          {isCreating || selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onSave={async () => {
                await fetchNotes();
                setIsCreating(false);
              }}
              onCancel={() => {
                setIsCreating(false);
                setSelectedNote(null);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <File className="h-10 w-10 text-cyan-500 mb-3" />
              <p className="text-sm sm:text-base text-center">Select a note or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}