import { EventSubscription } from "expo-modules-core";

import {
  DataCampaignEvent,
  DataCampaignEventHandler,
} from "./MarketerCloudPersonalizationRN.types";
import MarketerCloudPersonalizationRNModule from "./MarketerCloudPersonalizationRNModule";
import { useDataCampaign } from "./hooks/useDataCampaign";
import {
  CancelSubscription,
  Listener,
  LocalEventEmitter,
} from "./utils/localEventEmitter";

const campaignTargetEmitter = new LocalEventEmitter();
const _subscriptionCounters = {};
let _nativeCampaignDataSubscription: EventSubscription;

export const addListenerForCampaignTarget = <DataCampaignEventType>(
  target: string,
  handler: DataCampaignEventHandler<DataCampaignEventType | string>,
): EventSubscription => {
  if (!_nativeCampaignDataSubscription) {
    _nativeCampaignDataSubscription =
      MarketerCloudPersonalizationRNModule.addListener(
        "mcp_data_campaign",
        (campaignData: DataCampaignEvent<DataCampaignEventType>) => {
          campaignTargetEmitter.emit(campaignData.target, campaignData);
        },
      );
  }

  MarketerCloudPersonalizationRNModule.listenForCampaignTarget(target);

  if (_subscriptionCounters[target]) {
    _subscriptionCounters[target] += 1;
  } else {
    _subscriptionCounters[target] = 1;
  }

  const removeListenerFn = campaignTargetEmitter.addListener(target, handler);

  return {
    remove: () =>
      _removeListenerForCampaignTarget(target, removeListenerFn, handler),
  };
};

const _removeListenerForCampaignTarget = (
  target: string,
  subscriptionCanceller: CancelSubscription,
  listener: Listener,
) => {
  _subscriptionCounters[target] -= 1;
  if (_subscriptionCounters[target] < 1) {
    MarketerCloudPersonalizationRNModule.stopListeningForCampaignTarget(target);
  }
  subscriptionCanceller(target, listener);
};

export { useDataCampaign, DataCampaignEvent, DataCampaignEventHandler };
export default MarketerCloudPersonalizationRNModule;
