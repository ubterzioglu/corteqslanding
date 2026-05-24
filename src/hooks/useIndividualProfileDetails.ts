import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  buildFallbackIndividualProfileDetails,
  mapIndividualProfileRow,
  type IndividualProfileDetailsCore,
  type IndividualProfileUpdateInput,
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const displayName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name;
    const name = user?.user_metadata?.name;
    return fullName || name || "CorteQS Üyesi";
  }, [user?.user_metadata?.full_name, user?.user_metadata?.name]);

  const email = user?.email ?? "-";

  const loadDetails = async () => {
    if (!enabled || !user) {
      setDetails(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    const fallback = buildFallbackIndividualProfileDetails({
      userId: user.id,
      displayName,
      email,
    });

    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("individual_profile_details")
      .select(PROFILE_DETAILS_SELECT)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      setDetails(fallback);
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setDetails(mapIndividualProfileRow(data, fallback));
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthLoading) return;

    let isMounted = true;

    void (async () => {
      await loadDetails();
      if (!isMounted) return;
    })();

    return () => {
      isMounted = false;
    };
  }, [displayName, email, enabled, isAuthLoading, user]);

  const saveDetails = async (input: IndividualProfileUpdateInput) => {
    if (!user) {
      throw new Error("Oturum bulunamadi.");
    }

    setIsSaving(true);
    setSaveErrorMessage(null);

    try {
      const baseDetails = details ?? buildFallbackIndividualProfileDetails({
        userId: user.id,
        displayName,
        email,
      });

      const nextFrontCard = {
        ...baseDetails.frontCard,
        world_message: input.worldMessage,
        linkedin_url: input.linkedin || null,
        linkedin_visible: true,
      };

      const nextDetailCard = {
        ...baseDetails.detailCard,
        about_text: input.bio,
        languages: input.languages.slice(0, 5),
        interests: input.interests.slice(0, 12),
      };

      const nextProfileSettings = {
        ...baseDetails.controlPanel,
        country: input.country || null,
        city: input.city || null,
        years_in_city: input.yearsInCity || null,
        phone: input.phone || null,
        birth_date: baseDetails.controlPanel.birthDate === "-" ? null : baseDetails.controlPanel.birthDate,
        education: input.education || null,
        school: input.school || null,
        institution: input.institution || null,
        bio: input.bio || null,
        linkedin: input.linkedin || null,
        profile_visible: input.profileVisible,
      };

      const { error: detailsError } = await supabase.from("individual_profile_details").upsert(
        {
          user_id: user.id,
          tagline: input.tagline || null,
          status_text: input.statusText || null,
          active_country: input.activeCountry || null,
          active_city: input.activeCity || null,
          hometown: input.hometown || null,
          job_seeking: input.jobSeeking,
          front_card: nextFrontCard,
          detail_card: nextDetailCard,
          profile_settings: nextProfileSettings,
        },
        { onConflict: "user_id" },
      );

      if (detailsError) {
        throw detailsError;
      }

      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({ full_name: input.displayName || null })
        .eq("user_id", user.id);

      if (profileError) {
        throw profileError;
      }

      await loadDetails();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Profil kaydedilemedi.";
      setSaveErrorMessage(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading: isLoading || isAuthLoading,
    errorMessage,
    details,
    isSaving,
    saveErrorMessage,
    saveDetails,
    refreshDetails: loadDetails,
  };
};
