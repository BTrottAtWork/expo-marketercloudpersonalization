import * as MockNativeModule from "./__mocks__/MarketerCloudPersonalizationRNModule";

jest.mock("expo-marketercloudpersonalization", () => MockNativeModule.default);
jest.mock("./src/MarketerCloudPersonalizationRNModule", () => MockNativeModule.default);