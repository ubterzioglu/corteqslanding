import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  buildFallbackIndividualProfileDetails,
  mapIndividualProfileRow,
  type IndividualProfileDetailsCore,
} from "@/lib/individual-profile";

const PROFILE_DETAILS_SELECT = [
  "user_id",
  "tagline",
  "status_text",
  "presence_status",
  "visibility_status",
  "follower_count",
  "following_count",
  "event_count",
  "active_city",
  "active_country",
  "hometown",
  "phone_verified",
  "job_seeking",
  "mentor_opt_in",
  "front_card",
  "detail_card",
  "control_panel",
  "profile_settings",
].join(", ");

export const useIndividualProfileDetails = (enabled = true) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [details, setDetails] = useState<IndividualProfileDetailsCore | null>(null);

  const displayName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name;
    const name = user?.user_metadata?.name;
    return fullName || name || "CorteQS Üyesi";
  }, [user?.user_metadata?.full_name, user?.user_metadata?.name]);

  const email = user?.email ?? "-";

  useEffect(() => {
    if (isAuthLoading) return;

    if (!enabled || !user) {
      setDetails(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const fallback = buildFallbackIndividualProfileDetails({
      userId: user.id,
      displayName,
      email,
    });

    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from("individual_profile_details")
        .select(PROFILE_DETAILS_SELECT)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        setDetails(fallback);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setDetails(mapIndividualProfileRow(data, fallback));
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [displayName, email, enabled, isAuthLoading, user]);

  return {
    isLoading: isLoading || isAuthLoading,
    errorMessage,
    details,
  };
};
