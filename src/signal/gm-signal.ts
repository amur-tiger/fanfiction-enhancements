import { onDispose } from "./context";
import { type Signal, createSignal } from "./signal";
import createLock from "./lock";

export function createGmSignal<T>(name: string): Signal<T | undefined> {
  const locked = createLock();

  const signal = createSignal<T | undefined>(undefined, (value) =>
    locked(() => {
      if (value == null) {
        GM.deleteValue(name);
        GM.deleteValue(`${name}+timestamp`);
      } else {
        GM.setValue(name, JSON.stringify(value));
        GM.setValue(`${name}+timestamp`, Date.now());
      }
    }),
  );

  GM.getValue(name).then((value) => locked(() => signal(value ? JSON.parse(value as string) : value)));

  const token = GM_addValueChangeListener(name, (name, oldValue, newValue) =>
    locked(() => signal(JSON.parse(newValue as string))),
  );
  onDispose(() => () => GM_removeValueChangeListener(token));

  return signal;
}
