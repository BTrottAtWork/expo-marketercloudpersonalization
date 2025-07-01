import { LocalEventEmitter } from "../../../src/utils/localEventEmitter"

describe("LocalEventEmitter", () => {

    describe("addListener and emit", () => {
        test("added listener is called when specified event is emitted", () => {
            const classUnderTest = new LocalEventEmitter();
            const listenerSpy = jest.fn();
            classUnderTest.addListener("test", listenerSpy);
            classUnderTest.emit("test");
            classUnderTest.emit("test2");
            classUnderTest.emit("test3");
            expect(listenerSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("removeListener", () => {
        test("listener not called when removed from emitter registry", () => {
            const classUnderTest = new LocalEventEmitter();
            const listenerSpy = jest.fn();
            classUnderTest.addListener("test", listenerSpy);
            classUnderTest.emit("test");
            classUnderTest.removeListener("test", listenerSpy);
            classUnderTest.emit("test");
            classUnderTest.emit("test");
            expect(listenerSpy).toHaveBeenCalledTimes(1);
        });

        test("Works fine when listener never registered", () => {
            const classUnderTest = new LocalEventEmitter();
            const listenerSpy = jest.fn();
            classUnderTest.addListener("test", listenerSpy);
            classUnderTest.emit("test");
            classUnderTest.removeListener("test", listenerSpy);      
            classUnderTest.removeListener("test_non_existent", listenerSpy);   
            expect(listenerSpy).toHaveBeenCalledTimes(1);
        });
    });
});