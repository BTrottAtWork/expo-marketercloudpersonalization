import {
  DataCampaignEvent,
  DataCampaignPrioritizationOptions,
} from "../MarketerCloudPersonalizationRN.types";

export const defaultPrioritizationHandler = (
  camps: DataCampaignEvent<any>[],
  prioritizationOptions?: DataCampaignPrioritizationOptions,
) => {
  /**
   * If prioritizationOptions were not passed, or only 1 campaign is available, then there is no need to
   * do any further processing.  Just return what was passed in.
   */
  if (!prioritizationOptions || camps.length < 2) {
    return camps;
  }

  /**
   *
   * all prioritization attributes defined in the prioritizationOptions must be present on every campaign that will
   * have prioritization rules applied.  Campaigns without the required attributes are filtered from the results
   * prior to further processing.
   */
  const filteredCamps = camps.filter((camp) => {
    return prioritizationOptions.prioritizationAttributesInOrderOfImportance.every(
      (attribute) => camp.data.hasOwnProperty(attribute),
    );
  });

  /**
   * If at this point we have filtered campaigns to the point that our list only contains 1 or 0 campaigns,
   * then return the current list with no further processing.
   */
  if (filteredCamps.length < 2) {
    return filteredCamps;
  }

  //sort by comparing attributes in the order specified in prioritizationOptions.prioritizationAttributesInOrderOfImportance
  const prioritySortedCamps = camps.sort((left, right): number => {
    for (
      let i = 0;
      i <
      prioritizationOptions.prioritizationAttributesInOrderOfImportance.length;
      i++
    ) {
      const key =
        prioritizationOptions.prioritizationAttributesInOrderOfImportance[i];
      if (left.data[key] < right.data[key]) {
        return -1;
      } else if (left.data[key] > right.data[key]) {
        return 1;
      }
    }

    return 0;
  });

  /**
   * No further processing needed if
   * 1. There is no display limit set (undefined/null/0) or
   * 2. The display limit is larger than the number of campaigns after filtering/sorting
   */
  if (
    !prioritizationOptions.displayLimit ||
    prioritizationOptions.displayLimit === 0 ||
    prioritizationOptions.displayLimit >= prioritySortedCamps.length
  ) {
    return prioritySortedCamps;
  }

  /**
   * return the first (displayLimit) number of items in the campaign list after all rules have been applied.
   */
  return prioritySortedCamps.slice(0, prioritizationOptions.displayLimit);
};
