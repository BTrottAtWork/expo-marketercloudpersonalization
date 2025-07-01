import ExpoModulesCore
import Evergage

public class MarketerCloudPersonalizationRNModule: Module {
    
  private var activeCampaigns: [String: EVGCampaign] = [:]
  private var listeners: Set<String> = []
    
  private func campaignHandler (campaign: EVGCampaign) {
      
      NSLog("MarketerCloudPersonalizationRNModule: campaignHandler: \(campaign)")
      
      if listeners.contains(campaign.target) {
          activeCampaigns[campaign.campaignId] = campaign
          
          let payload: [String: Any] = [
            "target": campaign.target,
            "campaignId": campaign.campaignId,
            "campaignName": campaign.campaignName,
            "experienceId": campaign.experienceId,
            "experienceName": campaign.experienceName,
            "messageId": campaign.messageId,
            "isControlGroup": campaign.isControlGroup,
            "data": campaign.data
          ]
          
          self.sendEvent("mcp_data_campaign", payload)
      }
  }
    
  public func definition() -> ModuleDefinition {
      Name("MarketerCloudPersonalizationRN")

      Events("mcp_data_campaign")
                  
      AsyncFunction("stopListeningForCampaignTarget") { (campaignTarget: String) in
          let evergage = Evergage.sharedInstance()
          if let context = evergage.globalContext {
              context.setCampaignHandler(nil, forTarget: campaignTarget)
          }
          
          if self.listeners.contains(campaignTarget) {
              self.listeners.remove(campaignTarget)
          }
      }
      
      AsyncFunction("listenForCampaignTarget") { (campaignTarget: String) in
        let evergage = Evergage.sharedInstance()
        weak var weakSelf = self
        if let context = evergage.globalContext {
          context.setCampaignHandler(weakSelf?.campaignHandler, forTarget: campaignTarget)
        }

        self.listeners.insert(campaignTarget)
      }
      
      AsyncFunction("getAccountId") {
        let evergage = Evergage.sharedInstance()
        return evergage.accountId
      }
    
      AsyncFunction("setAccountId") { (value: String) in
        let evergage = Evergage.sharedInstance()
        evergage.accountId = value
      }
                    
      AsyncFunction("getAnonymousId") {
        let evergage = Evergage.sharedInstance()
        return evergage.anonymousId
      }
      
      AsyncFunction("getUserId") {
        let evergage = Evergage.sharedInstance()
        return evergage.userId
      }
                    
      Function("setUserId") { (value: String) in
        let evergage = Evergage.sharedInstance()
        evergage.userId = value
      }
      
      AsyncFunction("viewItem") { (id: String) in
        let evergage = Evergage.sharedInstance()
        if let context = evergage.globalContext {
            context.viewItem(EVGProduct(id: id))
        }
      }
      
      AsyncFunction("viewCategory") { (id: String) in
        let evergage = Evergage.sharedInstance()
        if let context = evergage.globalContext {
            context.viewCategory(EVGCategory(id: id))
        }
      }
      
      AsyncFunction("trackAction") { (action: String) in
        let evergage = Evergage.sharedInstance()
        if let context = evergage.globalContext {
          context.trackAction(action)
        }
      }
      
      AsyncFunction("addToCart") { (productId: String, quantity: Int) in
        let evergage = Evergage.sharedInstance()
        if let context = evergage.globalContext {
            context.add(toCart: EVGLineItem(item: EVGProduct(id: productId), quantity: NSNumber(value: quantity)))
        }
      }
      
      AsyncFunction("trackClickthrough") { (campaignId: String) in
        let evergage = Evergage.sharedInstance()
        if let context = evergage.globalContext {
            if let c = activeCampaigns[campaignId] {
                context.trackClickthrough(c)
            }
        }
      }
      
      AsyncFunction("trackDismissal") { (campaignId: String) in
          let evergage = Evergage.sharedInstance()
          if let context = evergage.globalContext {
              if let c = activeCampaigns[campaignId] {
                  context.trackDismissal(c)
              }
          }
      }
      
      AsyncFunction("trackImpression") { (campaignId: String) in
          let evergage = Evergage.sharedInstance()
          if let context = evergage.globalContext {
              if let c = activeCampaigns[campaignId] {
                  context.trackImpression(c)
              }
          }
      }
  }
}
