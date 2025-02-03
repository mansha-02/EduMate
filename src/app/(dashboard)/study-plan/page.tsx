"use client"

import { useState, useEffect, useCallback } from "react";
import StudyPlanForm from '@/components/StudyPlanForm';
import { StoredPlan } from "@/components/study-plan/StoredPlan";
import { Separator } from "@/components/ui/separator";
import type { StudyPlan } from "@/components/study-plan/StoredPlan";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export default function StudyPlanPage() {
  const { data: session } = useSession();
  const [storedPlans, setStoredPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const data = await apiClient.getStudyPlan(session.user.id);
      if (data.error) {
        console.error("API returned error:", data.error);
        setStoredPlans([]);
        return;
      }
      
      if (data.plans && Array.isArray(data.plans)) {
        // Validate the structure of each plan
        const validPlans = data.plans.filter((plan: StudyPlan) => {
          return plan && 
                 plan._id && 
                 plan.overview &&
                 Array.isArray(plan.weeklyPlans);
        });
        
        console.log("Valid plans:", validPlans);
        setStoredPlans(validPlans);
      } else {
        console.error("Invalid plans data structure:", data);
        setStoredPlans([]);
      }
    } catch (error) {
      console.error("Error fetching stored plans:", error);
      setStoredPlans([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handlePlanDelete = (planId: string) => {
    setStoredPlans(plans => plans.filter(plan => plan._id !== planId));
  };

  const handlePlanGenerated = async (newPlan: Partial<StudyPlan>) => {
    if (!session?.user?.id || !newPlan.overview) return;
    
    try {
      // Create the plan using the API
      await apiClient.createStudyPlan(
        session.user.id,
        typeof newPlan.overview === 'string' ? newPlan.overview : newPlan.overview.subject,
        new Date().toISOString()
      );
      
      // Refresh the plans list
      fetchPlans();
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Study Plan Generator</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Create and manage your study plans</span>
        </div>
      </div>
      <div className="max-w-10xl">
        <StudyPlanForm onPlanGenerated={handlePlanGenerated} />
      </div>

      {/* Stored Plans Section */}
      {loading ? (
        <div className="mt-12">
          <Separator className="my-8" />
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      ) : storedPlans.length > 0 && (
        <div className="mt-12">
          <Separator className="my-8" />
          <h2 className="text-2xl font-bold mb-6">Your Study Plans</h2>
          <div className="space-y-6">
            {storedPlans.map((plan) => (
              <StoredPlan
                key={plan._id}
                plan={plan}
                onDelete={handlePlanDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}