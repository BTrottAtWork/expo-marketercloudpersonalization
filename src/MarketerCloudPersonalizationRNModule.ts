import { requireNativeModule, NativeModule } from "expo-modules-core";
import { MarketerCloudPersonalizationRNModuleEvents } from "./MarketerCloudPersonalizationRN.types";

declare class MarketerCloudPersonalizationRNModule extends NativeModule<
  MarketerCloudPersonalizationRNModuleEvents<any>
> {
  getAccountId(): Promise<string>;
  setAccountId(accountId: string): Promise<void>;
  getAnonymousId(): Promise<string>;
  getUserId(): Promise<string>;
  setUserId(userId: string): void;
  viewItem(itemId: string): Promise<void>;
  viewCategory(categoryId: string): Promise<void>;
  trackAction(action: string): Promise<void>;
  addToCart(productId: string, quantity: number): Promise<void>;
  trackClickthrough(campaignId: string): Promise<void>;
  trackDismissal(campaignId: string): Promise<void>;
  trackImpression(campaignId: string): Promise<void>;
  listenForCampaignTarget(campaignTarget: string): Promise<void>;
  stopListeningForCampaignTarget(campaignTarget: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MarketerCloudPersonalizationRNModule>(
  "MarketerCloudPersonalizationRN",
);
