import context, { onDispose } from "./context";

export default function effect(callback: () => void | (() => void)) {
  context(() => {
    const cleanup = callback();
    if (typeof cleanup === "function") {
      onDispose(cleanup);
    }
  });
}
