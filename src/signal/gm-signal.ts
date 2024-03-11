import RenderContext from "@jsx/RenderContext";
import { type Signal, createSignal } from "./signal";

export function createGmSignal<T>(name: string): Signal<T | undefined> {
  let isLocalChange = false;

  const signal = createSignal<T | undefined>(undefined, (value) => {
    if (!isLocalChange) {
      console.log("%s change to %o", name, value);
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
      signal(JSON.parse(newValue as string));
    }
  });

  const context = RenderContext.findCurrent();
  if (context) {
    context.onDispose(() => GM_removeValueChangeListener(token));
  }

  return signal;
}
