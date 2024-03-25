import { createSignal, type Signal, type SignalEx } from "../signal/signal";
import effect from "../signal/effect";

export default function getChapterRead(storyId: number, chapterId: number): Signal<boolean> {
  const key = `ffe-story-${storyId}-chapter-${chapterId}-read`;

  const signal = createSignal<boolean>(
    GM.getValue(key).then((value) => value === "true"),
    {
      onChange(next) {
        GM.setValue(key, JSON.stringify(next));
        GM.setValue(key + "+timestamp", Date.now());
      },
    },
  ) as SignalEx<boolean>;

  effect(() => {
    const token = GM_addValueChangeListener(key, (name, oldValue, newValue) =>
      signal.set(newValue === "true", { silent: true }),
    );
    return () => GM_removeValueChangeListener(token);
  });

  return signal;
}
