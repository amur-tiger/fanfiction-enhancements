import { createSignal, type Signal } from "./signal";

export default function createGmSignal<T>(name: string): Signal<T | undefined> {
  return createSignal<T | undefined>(
    GM.getValue(name).then((value) => {
      if (!value) {
        return undefined;
      }
      try {
        return JSON.parse(value as string);
      } catch (e) {}
    }),
    {
      saveChange: (value) => {
        if (value == null) {
          GM.deleteValue(name);
          GM.deleteValue(`${name}+timestamp`);
        } else {
          GM.setValue(name, JSON.stringify(value));
          GM.setValue(`${name}+timestamp`, Date.now());
        }
      },

      handleExternalChange({ set }) {
        const token = GM_addValueChangeListener(name, (name, oldValue, newValue) => {
          if (!newValue) {
            set(undefined);
          }
          try {
            set(JSON.parse(newValue as string));
          } catch (e) {}
        });
        return () => GM_removeValueChangeListener(token);
      },
    },
  );
}
