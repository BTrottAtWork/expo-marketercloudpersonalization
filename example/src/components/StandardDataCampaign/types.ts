export interface StandardDataCampaignData {
    title: string,
    body: string,
    type: "card" | "banner" | "modal",
    actionType: "button" | "link" | "cta",
    actionLabel?: string,
    actionLink?: string,
    styleVariant: "default",
    dismissible: boolean,
};
  
export interface StandardDataCampaignProps {
    campaignId: string,
    actionType?: "button" | "cta" | "link", 
    onAction?: (deeplink: string) => void,
    data: StandardDataCampaignData,
};
  
export interface StandardDataCampaignComponentProps extends StandardDataCampaignData {
    campaignId: string,
    onAction: (deeplink: string) => void,
};

export interface StandardDataCampaignStyles {
    container?: any,
    mainContainer?: any,
    contentContainer?: any,
    messageContainer?: any,
    actionContainer?: any,
    action?: any,
    title?: any,
    body?: any,
    button?: any,
    buttonLabel?: any,
    buttonContainer?: any,
    linkLabel?: any,
    dismiss?: any,
    row?: any,
};