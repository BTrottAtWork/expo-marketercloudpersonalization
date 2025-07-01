import MarketerCloudPersonalizationRN, { addListenerForCampaignTarget } from "../../src";
import { emitMockEvent } from "../../__mocks__/MarketerCloudPersonalizationRNModule";

describe("MarketerCloudPersonalizationRNModule", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    test("addListenerForCampaignTarget", () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "listenForCampaignTarget");
        const handlerSpy = jest.fn(() => {});
        const sub = addListenerForCampaignTarget("my_target", handlerSpy);
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_target"));

        expect(handlerSpy).not.toHaveBeenCalled();
        emitMockEvent("mcp_data_campaign", {target: "my_target"});
        expect(handlerSpy).toHaveBeenCalledWith(expect.objectContaining({target: "my_target"}));

        sub.remove();
    });

    test("stopListeningForCampaignTarget is only called once when only one listener for a target", () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "stopListeningForCampaignTarget");
        const sub = addListenerForCampaignTarget("my_target", () => {});
        sub.remove();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_target"));
    });

    test("stopListeningForCampaignTarget is only called once multiple listeners for the same target", () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "stopListeningForCampaignTarget");
        const sub1 = addListenerForCampaignTarget("my_target", () => {});
        const sub2 = addListenerForCampaignTarget("my_target", () => {});
        sub1.remove();
        sub2.remove();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_target"));
    });

    test("getAccountId", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "getAccountId");
        await MarketerCloudPersonalizationRN.getAccountId();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test("setAccountId", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "setAccountId");
        await MarketerCloudPersonalizationRN.setAccountId("my_account_id");
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_account_id"));
    });

    test("getAnonymousId", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "getAnonymousId");
        await MarketerCloudPersonalizationRN.getAnonymousId();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test("getUserId", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "getUserId");
        await MarketerCloudPersonalizationRN.getUserId();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test("setUserId", () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "setUserId");
        MarketerCloudPersonalizationRN.setUserId("my_user_id");
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_user_id"));
    });

    test("viewItem", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "viewItem");
        await MarketerCloudPersonalizationRN.viewItem("my_item_id");
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_item_id"));
    });

    test("viewCategory", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "viewCategory");
        await MarketerCloudPersonalizationRN.viewCategory("my_category_id");
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_category_id"));
    });

    test("trackAction", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "trackAction");
        await MarketerCloudPersonalizationRN.trackAction("my_action");
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_action"));
    });

    test("addToCart", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "addToCart");
        await MarketerCloudPersonalizationRN.addToCart("my_product_id", 1);
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_product_id"), 1);
    });

    test("trackClickthrough", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "trackClickthrough");
        await MarketerCloudPersonalizationRN.trackClickthrough("my_campaign_id");
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_campaign_id"));
    });

    test("trackDismissal", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "trackDismissal");
        await MarketerCloudPersonalizationRN.trackDismissal("my_campaign_id");
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_campaign_id"));
    });

    test("trackImpression", async () => {
        const spy = jest.spyOn(MarketerCloudPersonalizationRN, "trackImpression");
        await MarketerCloudPersonalizationRN.trackImpression("my_campaign_id");
        expect(spy).toHaveBeenCalledWith(expect.stringMatching("my_campaign_id"));
    });
})