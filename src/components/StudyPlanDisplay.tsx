import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Calendar, CheckCircle } from "lucide-react";

interface DailyTask {
  day: string;
  tasks: string[];
  duration: string;
}

interface WeeklyPlan {
  week: string;
  goals: string[];
  dailyTasks: DailyTask[];
}

interface StudyPlan {
  overview: {
    subject: string;
    duration: string;
    examDate: string;
  };
  weeklyPlans: WeeklyPlan[];
  recommendations: string[];
}

interface StudyPlanDisplayProps {
  plan: StudyPlan;
}

export default function StudyPlanDisplay({ plan }: StudyPlanDisplayProps) {
  return (
    <Card className="w-full bg-gradient-to-br from-cyan-500 to-blue-700 border-none rounded-xl shadow-lg text-white">
      <CardHeader className="border-b border-cyan-200 p-6">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-white" /> Study Plan for {plan.overview.subject}
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 text-lg">
          <span className="flex items-center gap-2"><Calendar className="text-white" /> Duration: {plan.overview.duration}</span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-2"><CheckCircle className="text-white" /> Exam Date: {plan.overview.examDate}</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] w-full pr-2">
          {plan.weeklyPlans.map((weeklyPlan, weekIndex) => (
            <div key={weekIndex} className="mb-8 last:mb-0">
              <h3 className="text-xl font-semibold mb-3 border-b border-cyan-200 pb-2">
                {weeklyPlan.week}
              </h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-white/90 mb-2">Goals:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {weeklyPlan.goals.map((goal, index) => (
                    <li key={index} className="text-white/80">{goal}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-white/90 mb-2">Daily Schedule:</h4>
                {weeklyPlan.dailyTasks.map((day, dayIndex) => (
                  <div key={dayIndex} className="mb-3 p-3 bg-cyan-600 rounded-lg shadow-md">
                    <h5 className="font-medium text-white">
                      {day.day} ({day.duration})
                    </h5>
                    <ul className="list-disc pl-5 space-y-1">
                      {day.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-white/80">{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3 border-b border-cyan-200 pb-2">
              Study Tips & Recommendations
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {plan.recommendations.map((tip, index) => (
                <li key={index} className="text-white/80">{tip}</li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}