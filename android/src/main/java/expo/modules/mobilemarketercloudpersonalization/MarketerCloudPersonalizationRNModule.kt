package expo.modules.mobilemarketercloudpersonalization

import com.evergage.android.Campaign
import com.evergage.android.Evergage
import com.evergage.android.promote.Category
import com.evergage.android.promote.LineItem
import com.evergage.android.promote.Product
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.ConcurrentHashMap
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class MarketerCloudPersonalizationRNModule : Module() {

  private var listeners: MutableSet<String> = mutableSetOf();
  private var activeCampaigns: MutableMap<String, Campaign> = ConcurrentHashMap<String, Campaign>();

  override fun definition() = ModuleDefinition {
    Name("MarketerCloudPersonalizationRN")
    Events("mcp_data_campaign")

    AsyncFunction("stopListeningForCampaignTarget") { campaignTarget: String ->
      val evergage = Evergage.getInstance()
      val context = evergage.globalContext
      context?.setCampaignHandler(null, campaignTarget)

      if(listeners.contains(campaignTarget)) {
        listeners.remove(campaignTarget)
      }
    }

    AsyncFunction("listenForCampaignTarget") { campaignTarget: String ->
      val evergage = Evergage.getInstance()
      val context = evergage.globalContext

      val handler = { campaign: Campaign ->
          activeCampaigns[campaign.campaignId] = campaign;

          val gson = Gson()
          val type = object : TypeToken<Map<String, Any>>() {}.type
          val data: Map<String, Any> = gson.fromJson(campaign.data.toString(), type)

          sendEvent("mcp_data_campaign", mapOf(
              "target" to campaignTarget,
              "campaignId" to campaign.campaignId,
              "campaignName" to campaign.campaignName,
              "experienceId" to campaign.experienceId,
              "experienceName" to campaign.experienceName,
              "messageId" to campaign.messageId,
              "isControlGroup" to campaign.isControlGroup,
              "data" to data
          ))
      }

      context?.setCampaignHandler(handler, campaignTarget)
      listeners.add(campaignTarget)
    }

    AsyncFunction("getAccountId") {
        return@AsyncFunction Evergage.getInstance().accountId
    }

    AsyncFunction("setAccountId") { value: String ->
      Evergage.getInstance().accountId = value
    }

    AsyncFunction("getAnonymousId") {
        return@AsyncFunction Evergage.getInstance().anonymousId
    }

    AsyncFunction("getUserId") {
        return@AsyncFunction Evergage.getInstance().userId
    }

    Function("setUserId") { value: String ->
      Evergage.getInstance().userId = value
    }

    AsyncFunction("viewItem") { id: String ->
     Evergage.getInstance().globalContext?.viewItem(Product(id));
    }

    AsyncFunction("viewCategory") { id: String ->
      Evergage.getInstance().globalContext?.viewCategory(Category(id))
    }

    AsyncFunction("trackAction") { action: String ->
     Evergage.getInstance().globalContext?.trackAction(action)
    }

    AsyncFunction("addToCart") { productId: String, quantity: Int ->
      Evergage.getInstance().globalContext?.addToCart(LineItem(Product(productId), quantity))
    }

    AsyncFunction("trackClickthrough") { campaignId: String ->
        activeCampaigns[campaignId]?.let {
          Evergage.getInstance().globalContext?.trackClickthrough(it)
        }
    }

    AsyncFunction("trackDismissal") { campaignId: String ->
      activeCampaigns[campaignId]?.let {
        Evergage.getInstance().globalContext?.trackDismissal(it);
      }
    }

    AsyncFunction("trackImpression") { campaignId: String ->
      activeCampaigns[campaignId]?.let {
        Evergage.getInstance().globalContext?.trackImpression(it);
      }
    }

  }
}
