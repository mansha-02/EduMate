"use client";

import { useEffect, useState } from "react";
import { ContributionCalendar } from "react-contribution-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FaFire, FaCalendarAlt, FaTrophy } from "react-icons/fa";

interface StudySession {
  duration: number;
  startTime: string;
  endTime: string;
  mode: string;
}

interface DailySession {
  count: number;
  totalDuration: number;
  sessions: StudySession[];
}

interface StudyStats {
  currentStreak: number;
  bestStreak: number;
  totalDays: number;
  studySessions: {
    [key: string]: DailySession;
  };
}

interface CalendarDataPoint {
  level: number;
  data: {
    count: number;
    duration: number;
    details: string;
  };
}

interface SessionData {
  studySessions: {
    [key: string]: DailySession;
  };
  totalStudyHours: number;
  currentStreak: number;
  bestStreak: number;
  lastStudyDate: string;
}

const customTheme = {
  level0: "#e0f7fa",
  level1: "#b2ebf2",
  level2: "#80deea",
  level3: "#4dd0e1",
  level4: "#26c6da",
};

export default function DashboardHome() {
  const { data: session } = useSession();
  const [studyData, setStudyData] = useState<Array<Record<string, CalendarDataPoint>>>([{}]);
  const [stats, setStats] = useState<StudyStats>({
    currentStreak: 0,
    bestStreak: 0,
    totalDays: 0,
    studySessions: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudyData = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch("/api/users/stats");
        if (!response.ok) throw new Error("Failed to fetch study data");
        const data: SessionData = await response.json();
        const calendarData: Record<string, CalendarDataPoint> = {};

        Object.entries(data.studySessions || {}).forEach(([date, sessionData]) => {
          if (sessionData) {
            calendarData[date] = {
              level: Math.min(Math.floor((sessionData.count || 0) / 2), 4),
              data: {
                count: sessionData.count,
                duration: sessionData.totalDuration,
                details: `${sessionData.count} study sessions (${Math.round(
                  sessionData.totalDuration / 60
                )} minutes)`,
              },
            };
          }
        });

        setStudyData([calendarData]);
        setStats({
          currentStreak: data.currentStreak || 0,
          bestStreak: data.bestStreak || 0,
          totalDays: Object.keys(data.studySessions || {}).length,
          studySessions: data.studySessions || {},
        });
      } catch (error) {
        console.error("Error fetching study data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-200 to-blue-300">
        <PacmanLoader color="#026aa7" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 bg-gradient-to-br from-cyan-100 to-blue-200 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-gray-800">📊 Study Dashboard</h1>
      <Card className="shadow-lg border border-cyan-500 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">Study Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <ContributionCalendar data={studyData} styleOptions={{ theme: customTheme }} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-lg border border-cyan-500 bg-white text-center p-4">
          <FaFire className="text-4xl text-red-500 mx-auto" />
          <p className="text-lg font-bold text-gray-700">{stats.currentStreak} Days</p>
          <p className="text-sm text-gray-500">Current Streak</p>
        </Card>

        <Card className="shadow-lg border border-cyan-500 bg-white text-center p-4">
          <FaCalendarAlt className="text-4xl text-blue-500 mx-auto" />
          <p className="text-lg font-bold text-gray-700">{stats.totalDays} Days</p>
          <p className="text-sm text-gray-500">Total Study Days</p>
        </Card>

        <Card className="shadow-lg border border-cyan-500 bg-white text-center p-4">
          <FaTrophy className="text-4xl text-yellow-500 mx-auto" />
          <p className="text-lg font-bold text-gray-700">{stats.bestStreak} Days</p>
          <p className="text-sm text-gray-500">Best Streak</p>
        </Card>
      </div>
    </div>
  );
}
