"use client";

import { useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTimerStore } from "@/store/timerStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw } from "lucide-react";

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};


export function StudyTimer() {
  const { toast } = useToast();
  const timer = useTimerStore();

  const handleSessionComplete = useCallback(async () => {
    if (timer.mode === "focus") {
      try {
        const startTime = new Date(Date.now() - timer.focusTime * 60 * 1000);
        const endTime = new Date();

        const response = await fetch("/api/study-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            duration: timer.focusTime * 60,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            mode: "focus",
          }),
        });

        if (!response.ok) throw new Error("Failed to save session");
        const data = await response.json();

        toast({
          variant: "success",
          title: "Focus Session Complete! 🎉",
          description: `Current streak: ${data.stats.currentStreak} days! Time for a break.`,
          duration: 5000,
        });

        window.dispatchEvent(new CustomEvent("study-session-completed"));

        timer.setMode("break");
        timer.setTimeLeft(timer.breakTime * 60);
        timer.setProgress(0);
      } catch (error) {
        console.error("Error saving session:", error);
        toast({
          variant: "error",
          title: "Error",
          description: "Failed to save your study session",
          duration: 5000,
        });
      }
    } else {
      toast({
        variant: "success",
        title: "Break Time Over",
        description: "Ready for another focus session?",
        duration: 5000,
      });
      timer.setMode("focus");
      timer.setTimeLeft(timer.focusTime * 60);
      timer.setProgress(0);
    }
  }, [timer, toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer.isActive) {
        timer.tick();
        if (timer.timeLeft <= 0) {
          timer.setIsActive(false);
          handleSessionComplete();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, handleSessionComplete]);

  return (
    <Card className="w-full max-w-lg mx-auto bg-cyan-900 text-white shadow-xl rounded-lg p-6">
      <CardContent className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold tracking-wide uppercase text-center">
          {timer.mode === "focus" ? "Focus Mode" : "Break Mode"}
        </h2>
        <div className="text-6xl font-mono font-bold">{formatTime(timer.timeLeft)}</div>
        <Progress value={timer.progress} className="w-full h-2 rounded-lg bg-cyan-600" />
        <div className="flex gap-4">
          <Button
            onClick={() => timer.setIsActive(!timer.isActive)}
            variant="outline"
            className="flex items-center gap-2 px-6 py-2"
          >
            {timer.isActive ? <Pause size={20} /> : <Play size={20} />} {timer.isActive ? "Pause" : "Start"}
          </Button>
          <Button onClick={() => timer.reset()} variant="destructive" className="flex items-center gap-2 px-6 py-2">
            <RotateCcw size={20} /> Reset
          </Button>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div>
            <Label className="text-sm">Focus Duration</Label>
            <Select
              value={timer.focusTime.toString()}
              onValueChange={(value) => {
                timer.setFocusTime(parseInt(value));
                if (timer.mode === "focus") {
                  timer.setTimeLeft(parseInt(value) * 60);
                }
              }}
              disabled={timer.isActive}
            >
              <SelectTrigger className="mt-1 bg-cyan-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-cyan-800 text-white">
                {[15, 25, 30, 45, 60].map((time) => (
                  <SelectItem key={time} value={time.toString()}>{time} min</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Break Duration</Label>
            <Select
              value={timer.breakTime.toString()}
              onValueChange={(value) => {
                timer.setBreakTime(parseInt(value));
                if (timer.mode === "break") {
                  timer.setTimeLeft(parseInt(value) * 60);
                }
              }}
              disabled={timer.isActive}
            >
              <SelectTrigger className="mt-1 bg-cyan-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-cyan-800 text-white">
                {[5, 10, 15, 20].map((time) => (
                  <SelectItem key={time} value={time.toString()}>{time} min</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}