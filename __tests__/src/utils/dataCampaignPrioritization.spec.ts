import { DataCampaignPrioritizationOptions } from "../../../src/MarketerCloudPersonalizationRN.types";
import { defaultPrioritizationHandler } from "../../../src/utils/dataCampaignPrioritization";

type MockDataType = {
    text: string;
    rank?: string;
    createDate?: string;
}

const mockCampaignEventData: MockDataType = {
    text: "hello world",
    rank: "1",
    createDate: "2020-01-01",
};

const mockCampaignEvent = {
    target: "my_target", 
    campaignId: "my_id", 
    campaignName: "some_campaign_name",
    experienceId: "some_experience_id",
    experienceName: "some_experience_name",
    messageId: "some_message_id",
    isControlGroup: false,
    data: mockCampaignEventData,     
};

const defaultPriorityOpts: DataCampaignPrioritizationOptions = {
    displayLimit: 1,
    prioritizationAttributesInOrderOfImportance: ["rank", "createDate"],
};

const getMock = (id: string, dataOverrides: object = {}) => {
    return {...mockCampaignEvent, campaignId: id, data: {...mockCampaignEvent.data, ...dataOverrides}};
}

describe("dataCampaignPrioritization", () => {
    describe("defaultPrioritizationHandler", () => {
        test("No campaigns returns empty list", () => {
            const actual = defaultPrioritizationHandler([], defaultPriorityOpts);
            expect(actual.length).toBe(0);
        });

        test("One campaign returns itself", () => {
            const actual = defaultPrioritizationHandler([getMock("id_one", {})], defaultPriorityOpts);
            expect(actual[0].campaignId).toEqual("id_one");
        });

        test("One campaign with missing required attributes still returns", () => {
            const mock = getMock("id_one", {});
            delete mock.data.rank;
            delete mock.data.createDate;
            const actual = defaultPrioritizationHandler([getMock("id_one", {})], defaultPriorityOpts);
            expect(actual[0].campaignId).toEqual("id_one");
        });

        test("When multiple campaigns are present missing required attributes cause campaigns to be filtered out and then if we have < 2 we return with no further processing.", () => {
            const camps = [getMock("one", {}), getMock("two", {}), getMock("three", {})];
            delete camps[0].data.rank;
            delete camps[1].data.createDate;

            const actual = defaultPrioritizationHandler(camps, {...defaultPriorityOpts, displayLimit: undefined});
            expect(actual.length).toEqual(1);
            expect(actual[0].campaignId).toEqual("three");
        });

        test("When multiple campaigns are they are properly sorted and returned", () => {
            const camps = [
                getMock("one", {rank: "2", createDate: "2024-01-01"}), 
                getMock("two", {rank: "1", createDate: "2025-01-01"}), 
                getMock("three", {rank: "2", createDate: "2023-01-01"}),
            ];

            const actual = defaultPrioritizationHandler(camps, {...defaultPriorityOpts, displayLimit: undefined});
            expect(actual.length).toEqual(3);
            expect(actual[0].campaignId).toEqual("two");
            expect(actual[1].campaignId).toEqual("three");
            expect(actual[2].campaignId).toEqual("one");
        });

        test("When a tie exists the tying campaigns are in the correct positions", () => {
            const camps = [
                getMock("one", {rank: "2", createDate: "2023-01-01"}), 
                getMock("two", {rank: "1", createDate: "2025-01-01"}), 
                getMock("three", {rank: "2", createDate: "2023-01-01"}),
            ];

            const actual = defaultPrioritizationHandler(camps, {...defaultPriorityOpts, displayLimit: undefined});
            expect(actual.length).toEqual(3);
            expect(actual[0].campaignId).toEqual("two");
            expect(actual[1].campaignId).toMatch(/three|one/);
            expect(actual[2].campaignId).toMatch(/three|one/);
        });

        test("When a displayLimit is specified, the correct number of items is returned", () => {
            const camps = [
                getMock("one", {rank: "2", createDate: "2023-01-01"}), 
                getMock("two", {rank: "1", createDate: "2025-01-01"}), 
                getMock("three", {rank: "2", createDate: "2023-01-01"}),
            ];

            const actual = defaultPrioritizationHandler(camps, {...defaultPriorityOpts, displayLimit: 1});
            expect(actual.length).toEqual(1);
            expect(actual[0].campaignId).toEqual("two");
        });
    });
})