import { supabase } from "@/integrations/supabase/client";

export type SubmitSurveyResponsePayload = {
  surveySlug: string;
  respondent?: {
    name?: string;
    email?: string;
    contactOptIn?: boolean;
  };
  answers: Array<{
    questionId: string;
    value: unknown;
  }>;
  meta: {
    startedAt: string;
    honeypot: string;
  };
};

export async function submitSurveyResponse(payload: SubmitSurveyResponsePayload) {
  const { data, error } = await supabase.functions.invoke("submit-survey-response", {
    body: payload,
  });

  if (error) throw error;
  return data as { ok: boolean; responseId: string };
}

export async function getSurveyResponses(surveyId: string) {
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*, survey_answers(*, survey_questions(*))")
    .eq("survey_id", surveyId)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateResponseStatus(id: string, status: "reviewed" | "archived") {
  const { error } = await supabase
    .from("survey_responses")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}
