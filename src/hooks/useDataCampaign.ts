import { EventSubscription } from "expo-modules-core";
import { useState, useEffect, useRef } from "react";

import { addListenerForCampaignTarget } from "..";
import {
  DataCampaignEvent,
  UseDataCampaignOptions,
} from "../MarketerCloudPersonalizationRN.types";
import { defaultPrioritizationHandler } from "../utils/dataCampaignPrioritization";

/**
 *
 * This hook establishes a listener for 1:M campaign targets, with MCP
 *
 * As we notify MCP of app events (actions, views, dismissals, etc...) MCP will respond with
 * campaign events where conditions are met for this user.
 *
 * Campaigns are stored and updated via the monitoring hook.
 *
 * @param targets
 * @returns
 */
export const useDataCampaign = <DataCampaignPayloadType>(
  targets: string[],
  options?: UseDataCampaignOptions<DataCampaignPayloadType>,
) => {
  const data = useRef({});
  const [campaigns, setCampaigns] = useState<
    DataCampaignEvent<DataCampaignPayloadType>[]
  >([]);
  const [campaignReady, setCampaignReady] = useState(false);
  const listenersRef = useRef<Record<string, EventSubscription>>({});
  const supressControlGroup = options?.supressControlGroup !== false;

  const removeCampaign = (campaignId: string): void => {
    const camps = campaigns.filter((c) => c.campaignId !== campaignId);
    setCampaigns(camps);
    setCampaignReady(camps.length > 0);
  };

  const clearCampaigns = () => {
    setCampaigns([]);
    data.current = {};
    setCampaignReady(false);
  };

  useEffect(() => {
    targets.forEach((t) => {
      listenersRef.current[t] = addListenerForCampaignTarget(
        t,
        (
          campaignData: DataCampaignEvent<DataCampaignPayloadType | string>,
        ): void => {
          const updatedData = { ...data.current };
          updatedData[t] = campaignData;
          data.current = updatedData;

          /**
           * Filter falsey objects, and if specified to supress control group campaigns, remove campaign from list.
           */
          const activeTargets = targets.filter((t) => {
            if (!data.current[t]) {
              return false;
            }

            if (supressControlGroup) {
              return !data.current[t].isControlGroup;
            }

            return true;
          });
          const activeCampaigns = activeTargets.map((t) => data.current[t]);
          const prioritizedCampaigns = options?.customPrioritizationHandler
            ? options.customPrioritizationHandler(
                activeCampaigns,
                options?.prioritizationOptions,
              )
            : defaultPrioritizationHandler(
                activeCampaigns,
                options?.prioritizationOptions,
              );

          setCampaigns(prioritizedCampaigns);
          setCampaignReady(prioritizedCampaigns.length > 0);
        },
      );
    });

    return () => {
      Object.values(listenersRef.current).forEach(
        (l: EventSubscription): void => l.remove(),
      );
      clearCampaigns();
    };
  }, []);

  return { ready: campaignReady, campaigns, removeCampaign, clearCampaigns };
};
