export type DataCampaignEvent<EventPayloadType> = {
  target: string;
  campaignId: string;
  campaignName: string;
  experienceId: string;
  experienceName: string;
  messageId: string;
  isControlGroup: boolean;
  data: EventPayloadType;
};

export type UseDataCampaignOptions<DataCampaignPayloadType> = {
  supressControlGroup?: boolean;
  prioritizationOptions?: DataCampaignPrioritizationOptions;
  customPrioritizationHandler?: (
    campaigns: DataCampaignEvent<DataCampaignPayloadType>[],
    opts?: DataCampaignPrioritizationOptions,
  ) => DataCampaignEvent<DataCampaignPayloadType>[];
};

export type DataCampaignPrioritizationOptions = {
  /**
   * After sorting based on the prioritization rules, how may winners should be allowed to display?
   * If not set or set to 0, the default will be show all and simply use the configuration for sorting.
   */
  displayLimit?: number;

  /**
   * List of custom data campaign attributes, by their name, in the order of their importance with respect
   * to prioritization.
   *
   * When this value is passed, any campaigns that do not have the identified prioritzation
   * attributes will be completely ignored and left out of results.  One exception to this rule is when there is
   * only a single campaign to have prioritization rules applied, for performance this would not have
   * prioritization rules applied, indcluding being filtered b/c it is missing required priority attributes.
   */
  prioritizationAttributesInOrderOfImportance: string[];
};

export type DataCampaignEventHandler<EventPayloadType> = (
  event: DataCampaignEvent<EventPayloadType>,
) => void;

export type MarketerCloudPersonalizationRNModuleEvents<T> = {
  mcp_data_campaign: (campaignData: DataCampaignEvent<T>) => void;
};
