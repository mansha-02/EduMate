"use client"

import { StudyTimer } from "@/components/timer/StudyTimer";

export default function TimerPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Timer for boosting your focus!</h1>
        
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <StudyTimer />
      </div>
    </div>
  );
}