"use client";

import Loading from "@/components/ui/loading";
import { useState } from "react";
import { useOnboardingData } from "./_components/useOnboardingData";
import Sidebar from "./_components/Sidebar";
import StepForm from "./_components/StepForm";
import { useSession } from "next-auth/react";
import { useCreateMutation } from "@/hooks/useCreateMutation";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data, loading } = useOnboardingData();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [answersByStep, setAnswersByStep] = useState<
    Record<number, Record<string, unknown>>
  >({});

  const sendOnboardingData = useCreateMutation({
    endpoint: "/api/onboarding/employee",
    successMessage: "Onboarding data sent successfully.",
    refetchKey: "onboarding",
    onSuccess: () => {
      router.push("/auth/login");
    },
  });

  if (loading) return <Loading />;
  if (!data) return <p className="p-8 text-red-600">Failed to load.</p>;

  const checklist = [...data.checklist]
    .filter((item) => item.fields.length > 0)
    .sort((a, b) => a.order - b.order);

  const current = checklist.find((c) => c.order === step);
  if (!current) return <p className="p-8">Invalid step.</p>;

  const maxStep = Math.max(...checklist.map((c) => c.order));

  /** Replace with real API call: */
  const persistStep = async (answers: Record<string, unknown>) => {
    const updatedAnswers = { ...answersByStep, [step]: answers };
    setAnswersByStep(updatedAnswers);
    setCompletedSteps((prev) => {
      const updated = new Set(prev).add(step);
      return updated;
    });

    const mergedAnswers = Object.assign({}, ...Object.values(updatedAnswers));

    if (step === maxStep) {
      await sendOnboardingData({
        ...mergedAnswers,
        employeeId: session?.user.id,
      });
    } else {
      setStep((s) => Math.min(maxStep, s + 1));
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        checklist={checklist}
        current={step}
        jump={setStep}
        completedSteps={completedSteps}
      />

      <div className="flex-1 overflow-auto px-5 py-6 bg-white">
        <h3 className="text-xl font-semibold mb-6">
          Step {step} / {maxStep}: {current.title}
        </h3>

        <StepForm
          item={current}
          maxStep={maxStep}
          onPrev={() => setStep((s) => Math.max(1, s - 1))}
          onNext={persistStep}
        />
      </div>
    </div>
  );
}
