"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StudyPlanDisplay from './StudyPlanDisplay';
import { Loader2, BookOpen, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { StudyPlan } from "@/components/study-plan/StoredPlan";
import { apiClient } from '@/lib/api-client';
import { useSession } from 'next-auth/react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface StudyPlanFormProps {
  onPlanGenerated: (plan: Partial<StudyPlan>) => void;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    }
  };
  message?: string;
}

export default function StudyPlanForm({ onPlanGenerated }: StudyPlanFormProps) {
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState<Date>();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPlan(null);
    
    if (!session?.user?.id) {
      toast({
        variant: "error",
        title: "Authentication Required", 
        description: "You must be logged in to generate a study plan",
      });
      return;
    }

    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }
    
    if (!date) {
      setError("Please select an exam date");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.createStudyPlan(
        session.user.id,
        subject.trim(),
        date.toISOString().split('T')[0]
      );

      if (response.success && response.plan) {
        setPlan(response.plan);
        setSubject('');
        setDate(undefined);
        toast({
          variant: "success",
          title: "Plan Generated",
          description: "Study plan generated successfully",
        });
        setTimeout(() => onPlanGenerated(response.plan), 100);
      } else {
        throw new Error(response.error || 'Failed to generate plan');
      }
    } catch (err: unknown) {
      console.error('Error creating plan:', err);
      setError("Failed to create study plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 p-6 border-2 border-black rounded-xl shadow-lg">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your study topic..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-white text-gray-900 p-4 rounded-lg border border-black shadow-md focus:ring-2 focus:ring-cyan-400"
                />
                <BookOpen className="absolute top-3 right-4 text-cyan-600" />
              </div>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-full bg-white text-gray-900 p-4 rounded-lg border border-black shadow-md hover:bg-cyan-100">
                    <CalendarDays className="mr-2 text-cyan-600" />
                    {date ? format(date, "PPP") : <span>dd-mm-yyyy</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-cyan-700 transition-all"
              disabled={isLoading || !subject.trim() || !date}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Create Study Plan'}
            </Button>
          </div>
        </form>

        {plan && (
          <div className="mt-6 bg-white rounded-lg border border-black p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Generated Study Plan</h3>
            <StudyPlanDisplay plan={plan} />
          </div>
        )}
      </div>
    </div>
  );
}