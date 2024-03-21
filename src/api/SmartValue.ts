import { createSignal, type Signal } from "../signal/signal";

export interface ValueGetter<T> {
  (): Promise<T>;
}

export interface ValueSetter<T> {
  (value: T): Promise<void>;
}

export interface ValueSubscriberCallback<T> {
  (value: T): Promise<unknown> | unknown;
}

export function isSmartValue(value: unknown): value is SmartValue<unknown> {
  if (value == null || typeof value !== "object") {
    return false;
  }

  return ["get", "set", "subscribe", "unsubscribe", "dispose", "update"].every(
    (key) => typeof value?.[key as keyof typeof value] === "function",
  );
}

export interface SmartValue<T> {
  name: string;
  readonly signal: Signal<T | undefined>;

  /**
   * Retrieves the value from cache. If the value is not in the cache and a getter is present, it
   * fetches a new value from the api. The fetched value is saved to the cache before returning.
   */
  get(): Promise<T | undefined>;

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

export class SmartValueLS<T> implements SmartValue<T> {
  private subscribers: Record<symbol, ValueSubscriberCallback<T>> = {};
  private isLocalChange = false;
  public _signal: Signal<T | undefined> | undefined;

  public constructor(
    public readonly name: string,
    private readonly storage: Storage,
    protected readonly getter?: ValueGetter<T>,
    protected readonly setter?: ValueSetter<T>,
  ) {}

  public get signal() {
    if (!this._signal) {
      this._signal = createSignal<T | undefined>(this.get(), {
        saveChange: (value) => {
          if (!this.isLocalChange) {
            this.isLocalChange = true;
            this.set(value!).finally(() => (this.isLocalChange = false));
          }
        },
      });
    }
    return this._signal;
  }

  public async get(): Promise<T | undefined> {
    let value = await this.getCached();
    if (value == null && this.getter) {
      value = await this.getter();
      await this.setCached(value);
    }

    return value;
  }

  public async set(value: T): Promise<void> {
    const saved = await this.getCached();
    if (saved === value) {
      await this.setCached(value);

      return;
    }

    if (this.setter) {
      await this.setter(value);
    } else if (this.getter) {
      throw new Error("This value cannot be set.");
    }

    await this.setCached(value);
    await this.trigger(value);
  }

  public subscribe(callback: ValueSubscriberCallback<T>): symbol {
    const key = Symbol("smart-value-key");
    this.subscribers[key] = callback;

    return key;
  }

  public unsubscribe(key: symbol): void {
    delete this.subscribers[key];
  }

  public dispose(): void {
    this.subscribers = {};
  }

  public async update(value: T): Promise<void> {
    const saved = await this.getCached();
    await this.setCached(value);
    if (saved !== value) {
      await this.trigger(value);
    }
  }

  protected async trigger(value: T): Promise<void> {
    if (!this.isLocalChange) {
      try {
        this.isLocalChange = true;
        this.signal.set(value);
      } finally {
        this.isLocalChange = false;
      }
    }

    await Promise.all(
      Object.getOwnPropertySymbols(this.subscribers)
        .map((sym) => this.subscribers[sym](value))
        .filter((promise) => promise != null && typeof promise === "object" && "then" in promise),
    );
  }

  protected async getCached(): Promise<T | undefined> {
    const data = this.storage.getItem(this.name);
    if (!data) {
      return undefined;
    }

    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn("Malformed SmartValueLocal entry with key %s deleted", this.name);
      this.storage.removeItem(this.name);
      return undefined;
    }
  }

  protected async setCached(value: T): Promise<void> {
    const data = JSON.stringify(value);
    this.storage.setItem(this.name, data);
    this.storage.setItem(`${this.name}+timestamp`, `${new Date().getTime()}`);
  }
}
