import { getContext } from "@jsx/context";
import { type Signal, createSignal } from "./signal";

export function createGmSignal<T>(name: string): Signal<T | undefined> {
  let isLocalChange = false;

  const signal = createSignal<T | undefined>(undefined, (value) => {
    if (!isLocalChange) {
      try {
        isLocalChange = true;
        if (value == null) {
          GM.deleteValue(name);
          GM.deleteValue(`${name}+timestamp`);
        } else {
          GM.setValue(name, JSON.stringify(value));
          GM.setValue(`${name}+timestamp`, Date.now());
        }
      } finally {
        isLocalChange = false;
      }
    }
  });

  GM.getValue(name).then((value) => {
    try {
      isLocalChange = true;
      signal(value ? JSON.parse(value as string) : value);
    } finally {
      isLocalChange = false;
    }
  });

  const token = GM_addValueChangeListener(name, (name, oldValue, newValue) => {
    if (!isLocalChange) {
      try {
        isLocalChange = true;
        signal(JSON.parse(newValue as string));
      } finally {
        isLocalChange = false;
      }
    }
  });

  getContext()?.onDispose(() => () => GM_removeValueChangeListener(token));

  return signal;
}
