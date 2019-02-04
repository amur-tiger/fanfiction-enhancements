import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as td from "testdouble";

import {
	SmartValueLocal,
	SmartValueRoaming,
	ValueGetter,
	ValueSetter,
	ValueSubscriberCallback,
} from "../../src/api/SmartValue";

chai.use(chaiAsPromised);
const assert = chai.assert;

describe("SmartValue", function () {
	beforeEach(function () {
		global["GM"] = td.object<UserScriptFunctions>();
	});

	afterEach(function () {
		td.reset();
	});

	[
		["Local", (getter?, setter?) => {
			const storage = td.object<Storage>();

			return [new SmartValueLocal("name", storage, getter, setter), storage.getItem, storage.setItem];
		}],
		["Roaming", (getter?, setter?) => {
			return [new SmartValueRoaming("name", getter, setter), GM.getValue, GM.setValue];
		}],
	].forEach(([name, ctr]) => {
		const create = ctr as Function;

		describe(name as string, function () {
			it("should set name", function () {
				const [sut, cacheGetter, cacheSetter] = create();

				assert.equal(sut.name, "name");
			});

			describe("Getter", function () {
				it("should get value from cache", async function () {
					const [sut, cacheGetter, cacheSetter] = create();
					td.when(cacheGetter("name")).thenReturn(JSON.stringify(1));

					const value = await sut.get();

					assert.equal(value, 1);
				});

				it("should return undefined without api getter", async function () {
					const [sut, cacheGetter, cacheSetter] = create();
					td.when(cacheGetter("name")).thenReturn(undefined);

					const value = await sut.get();

					assert.isUndefined(value);
				});

				it("should get value from api getter", async function () {
					const apiGetter = td.function<ValueGetter<number>>();
					const [sut, cacheGetter, cacheSetter] = create(apiGetter);
					td.when(cacheGetter("name")).thenReturn(undefined);
					td.when(apiGetter()).thenResolve(1);

					const value = await sut.get();

					td.verify(cacheSetter("name", JSON.stringify(1)));
					assert.equal(value, 1);
				});
			});

			describe("Setter", function () {
				it("should write value to cache", async function () {
					const [sut, cacheGetter, cacheSetter] = create();

					await sut.set(1);

					td.verify(cacheSetter("name", JSON.stringify(1)));
					td.verify(cacheSetter("name+timestamp", td.matchers.anything()));
				});

				it("should set value in api", async function () {
					const apiGetter = td.function<ValueGetter<number>>();
					const apiSetter = td.function<ValueSetter<number>>();
					const [sut, cacheGetter, cacheSetter] = create(apiGetter, apiSetter);

					await sut.set(1);

					td.verify(cacheSetter("name", JSON.stringify(1)));
					td.verify(apiSetter(1));
				});

				it("should not set read-only values", async function () {
					const apiGetter = td.function<ValueGetter<number>>();
					const [sut, cacheGetter, cacheSetter] = create(apiGetter);

					const promise = sut.set(1);

					td.verify(cacheSetter(td.matchers.anything(), td.matchers.anything()), { times: 0 });
					await assert.isRejected(promise, Error);
				});
			});

			describe("Subscriptions", function () {
				it("should subscribe", async function () {
					const [sut, cacheGetter, cacheSetter] = create();
					const cb = td.function<ValueSubscriberCallback<number>>();

					const key = sut.subscribe(cb);

					assert.typeOf(key, "Symbol");
				});

				it("should alert subscribers with setter", async function () {
					const [sut, cacheGetter, cacheSetter] = create();
					const cb = td.function<ValueSubscriberCallback<number>>();

					sut.subscribe(cb);
					await sut.set(1);

					td.verify(cb(1));
				});

				it("should alert subscribers with update", async function () {
					const apiGetter = td.function<ValueGetter<number>>();
					const apiSetter = td.function<ValueSetter<number>>();
					const [sut, cacheGetter, cacheSetter] = create(apiGetter, apiSetter);
					const cb = td.function<ValueSubscriberCallback<number>>();

					sut.subscribe(cb);
					await sut.update(1);

					td.verify(cb(1));
					td.verify(cacheSetter("name", JSON.stringify(1)));
					td.verify(apiSetter(td.matchers.anything()), { times: 0 });
				});

				it("should unsubscribe", async function () {
					const [sut, cacheGetter, cacheSetter] = create();
					const cb = td.function<ValueSubscriberCallback<number>>();

					const key = sut.subscribe(cb);
					sut.unsubscribe(key);
					await sut.update(1);

					td.verify(cb(td.matchers.anything()), { times: 0 });
				});
			});
		});
	});
});
