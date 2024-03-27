import { createSignal, type Signal } from "../signal/signal";
import effect, { listen } from "../signal/effect";

export default function getChapterRead(storyId: number, chapterId: number): Signal<boolean> {
  const key = `ffe-story-${storyId}-chapter-${chapterId}-read`;
  const signal = createSignal<boolean>(false);

  GM.getValue(key).then((value) => signal.set(value === "true", { isInternal: true }));

  listen(signal, "change", (event) => {
    if (event.isInternal) {
      return;
    }

    GM.setValue(key, JSON.stringify(event.newValue));
    GM.setValue(key + "+timestamp", Date.now());
  });

  effect(() => {
    const token = GM_addValueChangeListener(key, (name, oldValue, newValue) =>
      signal.set(newValue === "true", { isInternal: true }),
    );
    return () => GM_removeValueChangeListener(token);
  });

  return signal;
}
