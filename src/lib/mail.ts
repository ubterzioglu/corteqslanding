import { supabase } from "@/integrations/supabase/client";
import type { Submission, SubmissionInsert } from "@/lib/submissions";

export type SubmissionNotificationPayload = SubmissionInsert & {
  created_at: string;
  notes?: Submission["notes"];
  reviewed_at?: Submission["reviewed_at"];
  reviewed_by?: Submission["reviewed_by"];
};

export async function notifySubmission(submission: SubmissionNotificationPayload) {
  const { error } = await supabase.functions.invoke("send-submission-email", {
    body: { submission },
  });

  if (error) throw error;
}
