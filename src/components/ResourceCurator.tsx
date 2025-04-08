"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, BookOpen, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Resource {
  title: string;
  description: string;
  type: string;
  link: string;
}

interface ResourceCuratorProps {
  onCreateResources: (subject: string) => Promise<void>;
}

export default function ResourceCurator({ onCreateResources }: ResourceCuratorProps) {
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [resources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }

    setLoading(true);
    try {
      await onCreateResources(subject.trim());
      setSubject("");
      toast({
        variant: "success",
        title: "Success",
        description: "Resources generated successfully",
      });
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err && 
          typeof err.response === 'object' && err.response !== null && 'data' in err.response &&
          typeof err.response.data === 'object' && err.response.data !== null && 'error' in err.response.data &&
          err.response.data.error === 'RESOURCE_EXISTS' && 'message' in err.response.data) {
        setError(err.response.data.message as string);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 p-6 sm:p-8 border-2 border-black rounded-xl shadow-lg">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter the topic you want to learn"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setError(null);
              }}
              className={cn(
                "bg-white border-2 border-black text-gray-900 placeholder-gray-500 text-lg p-4 rounded-lg focus:ring-2 focus:ring-cyan-300 transition-all",
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading || !subject.trim()}
            className="w-full sm:w-auto flex justify-center items-center text-lg py-4 px-6 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 transition-all shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </form>

        {!error && resources.length > 0 && (
          <ScrollArea className="h-[calc(100vh-400px)] sm:h-[calc(100vh-300px)] w-full mt-6">
            <div className="grid grid-cols-1 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="bg-white border-2 border-black rounded-lg shadow-md">
                  <CardHeader className="p-4 flex items-center gap-3">
                    <BookOpen className="text-cyan-600 w-6 h-6" />
                    <div>
                      <CardTitle className="text-xl text-gray-800">{resource.title}</CardTitle>
                      <div className="text-sm text-gray-500">{resource.type}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-cyan-600 hover:text-cyan-800 transition-all text-sm font-semibold"
                    >
                      Learn More <ExternalLink className="ml-1 w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}