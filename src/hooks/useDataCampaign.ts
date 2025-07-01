import { EventSubscription } from "expo-modules-core";
import { useState, useEffect, useRef } from "react";

import { addListenerForCampaignTarget } from "..";
import {
  DataCampaignEvent,
  DataCampaignPrioritizationOptions,
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
  prioritizationOptions?: DataCampaignPrioritizationOptions,
  customPrioritizationHandler?: (
    campaigns: DataCampaignEvent<DataCampaignPayloadType>[],
    opts?: DataCampaignPrioritizationOptions,
  ) => DataCampaignEvent<DataCampaignPayloadType>[],
) => {
  const data = useRef({});
  const [campaigns, setCampaigns] = useState<
    DataCampaignEvent<DataCampaignPayloadType>[]
  >([]);
  const [campaignReady, setCampaignReady] = useState(false);
  const listenersRef = useRef<Record<string, EventSubscription>>({});

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

          const activeTargets = targets.filter((t) => data.current[t]);
          const activeCampaigns = activeTargets.map((t) => data.current[t]);
          const prioritizedCampaigns = customPrioritizationHandler
            ? customPrioritizationHandler(
                activeCampaigns,
                prioritizationOptions,
              )
            : defaultPrioritizationHandler(
                activeCampaigns,
                prioritizationOptions,
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
