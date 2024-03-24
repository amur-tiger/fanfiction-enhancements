import { type Signal, createSignal, type SignalEx } from "./signal";
import effect from "./effect";
import { tryParse } from "../utils";

export default function createGmSignal<T>(name: string): Signal<T | undefined> {
  const signal = createSignal<T | undefined>(
    GM.getValue(name).then((value) => tryParse<T>(value as string)),
    {
      onChange: (value) => {
        if (value == null) {
          GM.deleteValue(name);
          GM.deleteValue(`${name}+timestamp`);
        } else {
          GM.setValue(name, JSON.stringify(value));
          GM.setValue(`${name}+timestamp`, Date.now());
        }
      },
    },
  ) as SignalEx<T | undefined>;

  effect(() => {
    const token = GM_addValueChangeListener(name, (name, oldValue, newValue) =>
      signal.set(tryParse(newValue as string), { silent: true }),
    );
    return () => GM_removeValueChangeListener(token);
  });

  return signal;
}
