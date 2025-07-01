import { useDataCampaign } from "../../../src/hooks/useDataCampaign";
import {  act, renderHook } from "@testing-library/react-native";
import { emitMockEvent } from "../../../__mocks__/MarketerCloudPersonalizationRNModule";

const mockCampaignEvent = {
    target: "my_target", 
    campaignId: "my_id", 
    data: {
        text: "hello world"
    }       
}

export interface TestCampaignType {
    text: string;
};

describe("useDataCampaign", () => {

    test("No campaigns fired should render null", () => {
        const {result} = renderHook(() => useDataCampaign<TestCampaignType>(["my_target", "remove_one", "remove_all"]));
        expect(result.current.ready).toBeFalsy();
        expect(result.current.campaigns).toMatchSnapshot();
    });

    test("Campaign fired for another target should render null", () => {
        const {result} = renderHook(() => useDataCampaign<TestCampaignType>(["my_target", "remove_one", "remove_all"]));
        act(() => {
            emitMockEvent("mcp_data_campaign", {...mockCampaignEvent, target: "not_my_target"});
        })
    
        expect(result.current.ready).toBeFalsy();
        expect(result.current.campaigns).toMatchSnapshot();
    });

    test("Campaign fired for my target should render hello world", () => {
        const {result} = renderHook(() => useDataCampaign<TestCampaignType>(["my_target", "remove_one", "remove_all"]));
        expect(result.current.ready).toBeFalsy();
        act(()=> {
            emitMockEvent("mcp_data_campaign", mockCampaignEvent);
        })
        expect(result.current.ready).toBeTruthy();
        expect(result.current.campaigns.length).toBeGreaterThan(0);
    });

    test("continue to render hello world when single campaign is removed.", () => {
        const {result} = renderHook(() => useDataCampaign<TestCampaignType>(["my_target", "dont_care", "remove"]));
        
        act(() => {
            emitMockEvent("mcp_data_campaign", mockCampaignEvent);
            emitMockEvent("mcp_data_campaign", {...mockCampaignEvent, target: "data_event_2", campaignId: "two"});
            emitMockEvent("mcp_data_campaign", {...mockCampaignEvent, target: "remove", campaignId: "three"}); 
        })

        act(() => {
            result.current.removeCampaign("three");
        })
        
        expect(result.current.ready).toBeTruthy();
        expect(result.current.campaigns).toMatchSnapshot();
    });

    test("render null when all campaigns are removed.", () => {
        const {result} = renderHook(() => useDataCampaign<TestCampaignType>(["my_target", "remove_one", "remove_all"]));
        
        act(() => {
            emitMockEvent("mcp_data_campaign", mockCampaignEvent);
            emitMockEvent("mcp_data_campaign", {...mockCampaignEvent, target: "remove_one"});
            emitMockEvent("mcp_data_campaign", {...mockCampaignEvent, target: "remove_all"});
        });

        act(() => {
            result.current.clearCampaigns();
        });
        
        expect(result.current.ready).toBeFalsy();
        expect(result.current.campaigns).toMatchSnapshot();
    });

    test("custom prioritization handler is called if passed.", () => {
        const handler = jest.fn().mockReturnValue([mockCampaignEvent]);
        const {result} = renderHook(() => useDataCampaign<TestCampaignType>(["my_target"], {displayLimit: 1, prioritizationAttributesInOrderOfImportance: ["text"]}, handler));

        act( () => {
            emitMockEvent("mcp_data_campaign", mockCampaignEvent);
        });
        
        expect(handler).toHaveBeenCalledTimes(1);
    });

});