import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  INDIVIDUAL_FEATURE_KEY_LIST,
  type FeatureSource,
  type IndividualFeatureKey,
} from "@/lib/features";

type FeatureRow = {
  feature_key: string;
  is_enabled: boolean;
  source: string;
};

type FeatureState = {
  isEnabled: boolean;
  source: FeatureSource;
};

type FeatureStateMap = Partial<Record<IndividualFeatureKey, FeatureState>>;

export const useFeatureFlags = (enabled = true) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [featureMap, setFeatureMap] = useState<FeatureStateMap>({});

  const loadFeatures = useCallback(async () => {
    if (!enabled) {
      setFeatureMap({});
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    if (!user) {
      setFeatureMap({});
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.rpc("get_current_user_features");

    if (error) {
      setFeatureMap({});
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    const nextMap: FeatureStateMap = {};
    const rows = (data ?? []) as FeatureRow[];

    for (const row of rows) {
      if (!INDIVIDUAL_FEATURE_KEY_LIST.includes(row.feature_key as IndividualFeatureKey)) {
        continue;
      }

      const source: FeatureSource =
        row.source === "override" || row.source === "role_default" || row.source === "fallback"
          ? row.source
          : "fallback";

      nextMap[row.feature_key as IndividualFeatureKey] = {
        isEnabled: Boolean(row.is_enabled),
        source,
      };
    }

    setFeatureMap(nextMap);
    setIsLoading(false);
  }, [enabled, user]);

  useEffect(() => {
    if (isAuthLoading) return;
    void loadFeatures();
  }, [isAuthLoading, loadFeatures]);

  const isFeatureEnabled = useCallback(
    (featureKey: IndividualFeatureKey) => {
      return featureMap[featureKey]?.isEnabled ?? false;
    },
    [featureMap],
  );

  const featureSources = useMemo(() => {
    const map: Partial<Record<IndividualFeatureKey, FeatureSource>> = {};
    for (const key of INDIVIDUAL_FEATURE_KEY_LIST) {
      map[key] = featureMap[key]?.source ?? "fallback";
    }
    return map;
  }, [featureMap]);

  return {
    isLoading: isLoading || isAuthLoading,
    errorMessage,
    isFeatureEnabled,
    featureMap,
    featureSources,
    refreshFeatures: loadFeatures,
  };
};
