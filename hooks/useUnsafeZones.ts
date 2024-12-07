import { useEffect, useCallback } from "react";
import { useStorageState } from "@/utils/UseStorageState";
import { getUnsafeZone } from "@/api/unsafeZoneHelper";
import { IUnsafeZoneResponse } from "@/components/componentTypes";
import { useSession } from "@/context/AuthContext";
import useLocation from "@/hooks/useLocation";

export function useUnsafeZones() {
  const { userData } = useSession();
  const { location } = useLocation();
  const [[loading, unsafeZones], setUnsafeZones] =
    useStorageState<IUnsafeZoneResponse[]>("unsafeZones");

  const fetchUnsafeZones = useCallback(async () => {
    if (userData.id && location) {
      try {
        const response = await getUnsafeZone(userData.id, {
          userLat: location.latitude,
          userLong: location.longitude,
          proximity: userData.proximity,
        });
        if (response) {
          setUnsafeZones(response);
        }
      } catch (error) {
        console.error("Error fetching unsafe zones:", error);
      }
    }
  }, [userData.id, location, setUnsafeZones]);

  useEffect(() => {
    fetchUnsafeZones();
    const intervalId = setInterval(fetchUnsafeZones, 300000);
    return () => clearInterval(intervalId);
  }, [fetchUnsafeZones]);

  return {
    unsafeZones,
    loading,
    fetchUnsafeZones,
  };
}
