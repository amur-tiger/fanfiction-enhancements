import { Synchronizer } from "./DropBox";

export interface ValueGetter<T> {
	(): Promise<T>;
}

export interface ValueSetter<T> {
	(T): Promise<void>;
}

export interface ValueSubscriberCallback<T> {
	(T): Promise<any> | any;
}

export interface SmartValue<T> {
	name: string;

	/**
	 * Retrieves the value from cache. If the value is not in the cache and a getter is present, it
	 * fetches a new value from the api. The fetched value is saved to the cache before returning.
	 */
	get(): Promise<T>;

	/**
	 * Sets the value. If a getter is present but no setter, this will throw an exception instead of writing
	 * the value to the cache. If a setter is present, it will be written to the api as well
	 * as the cache. All subscribers are notified of the new value when no error occurred.
	 * @param value
	 */
	set(value: T): Promise<void>;

	/**
	 * Subscribes to value changes. The callback will be triggered when a new value is set with the set()-method or the
	 * value changes due to an update event or update from the api.
	 * @param callback
	 */
	subscribe(callback: ValueSubscriberCallback<T>): symbol;

	/**
	 * Removes the subscription with the given key. When a value changes, the associated callback will then no longer
	 * be called.
	 * @param key
	 */
	unsubscribe(key: symbol): void;

	/**
	 * Removes all subscribers. If the script runner supports value change notifications, this will detach the
	 * listener as well. Calling this method will not prevent users from adding new subscribers or
	 * getting or setting the value!
	 */
	dispose(): void;

	/**
	 * Updates the cache with a newer value and triggers all subscriber callbacks with it. The updated value is assumed
	 * to be more recent than the current and will not be written to the api, even if a setter is present.
	 * @param value
	 */
	update(value: T): Promise<void>;
}

abstract class SmartValueBase<T> implements SmartValue<T> {
	// todo: key should be of type "symbol"
	// see https://github.com/Microsoft/TypeScript/issues/1863 and https://github.com/Microsoft/TypeScript/pull/26797
	private subscribers: { [key: string]: ValueSubscriberCallback<T> } = {};

	protected constructor(
		public readonly name: string,
		protected readonly getter?: ValueGetter<T>,
		protected readonly setter?: ValueSetter<T>,
	) {
	}

	public async get(): Promise<T> {
		let value = await this.getCached();
		if (value === undefined && this.getter) {
			value = await this.getter();
			await this.setCached(value);
		}

		return value as T;
	}

	public async set(value: T): Promise<void> {
		if (this.setter) {
			await this.setter(value);
		} else if (this.getter) {
			throw new Error("This value cannot be set.");
		}

		await this.setCached(value);
		await this.trigger(value);
	}

	public subscribe(callback: ValueSubscriberCallback<T>): symbol {
		const key = Symbol();
		this.subscribers[key as any] = callback;

		return key;
	}

	public unsubscribe(key: symbol): void {
		delete this.subscribers[key as any];
	}

	public dispose(): void {
		this.subscribers = {};
	}

	public async update(value: T): Promise<void> {
		await this.setCached(value);
		await this.trigger(value);
	}

	protected async trigger(value: T): Promise<void> {
		await Promise.all(Object.getOwnPropertySymbols(this.subscribers)
			.map(sym => this.subscribers[sym as any](value))
			.filter(promise => promise && promise.then));
	}

	protected abstract getCached(): Promise<T>;

	protected abstract setCached(value: T): Promise<void>;
}

export class SmartValueLocal<T> extends SmartValueBase<T> {
	constructor(
		public readonly name: string,
		private readonly storage: Storage,
		protected readonly getter?: ValueGetter<T>,
		protected readonly setter?: ValueSetter<T>,
	) {
		super(name, getter, setter);
	}

	protected getCached(): Promise<T> {
		const data = this.storage.getItem(this.name);
		if (!data) {
			return Promise.resolve(undefined);
		}

		return Promise.resolve(JSON.parse(data));
	}

	protected setCached(value: T): Promise<void> {
		const data = JSON.stringify(value);
		this.storage.setItem(this.name, data);
		this.storage.setItem(this.name + "+timestamp", new Date().getTime() + "");

		return Promise.resolve();
	}
}

export class SmartValueRoaming<T> extends SmartValueBase<T> {
	private token: number;

	constructor(
		public readonly name: string,
		protected readonly getter?: ValueGetter<T>,
		protected readonly setter?: ValueSetter<T>,
		private readonly synchronizer?: Synchronizer,
	) {
		super(name, getter, setter);

		if (typeof GM_addValueChangeListener !== "undefined") {
			this.token = GM_addValueChangeListener(name, async (k, o, value, remote) => {
				if (remote) {
					await this.trigger(JSON.parse(value as string));
				}
			});
		}
	}

	public async set(value: T): Promise<void> {
		await super.set(value);

		if (this.synchronizer) {
			await this.synchronizer.synchronize();
		}
	}

	public dispose(): void {
		super.dispose();

		if (!this.token) {
			return;
		}

		if (typeof GM_removeValueChangeListener !== "undefined") {
			GM_removeValueChangeListener(this.token);
		}

		this.token = undefined;
	}

	protected async getCached(): Promise<T> {
		const data = await GM.getValue(this.name);
		if (!data) {
			return;
		}

		return JSON.parse(data as string);
	}

	protected async setCached(value: T): Promise<void> {
		await GM.setValue(this.name, JSON.stringify(value));
		await GM.setValue(this.name + "+timestamp", new Date().getTime());
	}
}
