import scoped, { Scope } from "./scope";

export default function effect(callback: () => void | (() => void)) {
  scoped(() => {
    const cleanup = callback();
    if (typeof cleanup === "function") {
      Scope.getCurrent()?.onDispose(cleanup);
    }
  });
}
