import { LocalEventEmitter } from '../src/utils/localEventEmitter';

let mockEventEmitter = new LocalEventEmitter();

const mockNativeModule = {
    listenForCampaignTarget: jest.fn(),
    stopListeningForCampaignTarget: jest.fn(),
    getAccountId: jest.fn(),
    setAccountId: jest.fn(),
    getAnonymousId: jest.fn(),
    getUserId: jest.fn(),
    setUserId: jest.fn(),
    viewItem: jest.fn(),
    viewCategory: jest.fn(),
    trackAction: jest.fn(),
    addToCart: jest.fn(),
    trackClickthrough: jest.fn(),
    trackDismissal: jest.fn(),
    trackImpression: jest.fn(),
    removeListener: jest.fn(),
    addListener: jest.fn((eventName, callback) => {
        const unsub = mockEventEmitter.addListener(eventName, callback);

        return {
            remove: () => {
                unsub();
            }
        }
    }),
    removeListeners: jest.fn(),
};

export default mockNativeModule;

export const emitMockEvent = (eventName: string, data: any) => {
    mockEventEmitter.emit(eventName, data);
};
