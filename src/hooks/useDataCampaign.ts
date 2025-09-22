import { EventSubscription } from "expo-modules-core";
import { useState, useEffect, useRef } from "react";

import { addListenerForCampaignTarget } from "..";
import {
  DataCampaignEvent,
  UseDataCampaignOptions,
} from "../MarketerCloudPersonalizationRN.types";
import MarketerCloudPersonalizationModule from "../MarketerCloudPersonalizationRNModule";
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
          const activeTargets = targets.filter((t) => data.current[t]);
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

          /**
           * Control group exclusions must be the last check to occur because we may exclude campaigns through the
           * prioritization rules, and we want to ensure we only log the impression if the ONLY reason the campaign was excluded was
           * due to the user being part of the control group.
           */
          const controlGroupExcluded = prioritizedCampaigns.filter((c) => {
            if (supressControlGroup && c.isControlGroup) {
              MarketerCloudPersonalizationModule.trackImpression(c.campaignId);
              return false;
            }

            return true;
          });

          setCampaigns(controlGroupExcluded);
          setCampaignReady(controlGroupExcluded.length > 0);
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
