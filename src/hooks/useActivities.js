import { useCallback, useEffect, useState } from "react";
import { activityApi } from "../lib/api";
import { fallbackActivities } from "../data/masterActivities";

export function useActivities() {
  const [activities, setActivities] = useState(fallbackActivities);
  const [source, setSource] = useState("fallback"); // "api" | "fallback"

  const load = useCallback(async () => {
    try {
      const data = await activityApi.getAll();
      if (Array.isArray(data) && data.length) {
        setActivities(data);
        setSource("api");
      }
    } catch {
      setActivities(fallbackActivities);
      setSource("fallback");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addActivity = useCallback(
    async (activityName) => {
      try {
        const created = await activityApi.create({ activityName, active: true });
        await load();
        return created;
      } catch {
        const local = { activityId: `local-${Date.now()}`, activityName, active: true };
        setActivities((prev) => [...prev, local]);
        return local;
      }
    },
    [load],
  );

  return { activities, source, addActivity };
}
