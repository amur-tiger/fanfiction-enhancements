import { describe, expect, it, vi } from "vitest";
import { createSignal } from "./signal";
import effect from "./effect";

describe(effect, () => {
  it("should run immediately", () => {
    const fn = vi.fn();

    effect(fn);

    expect(fn).toHaveBeenCalledOnce();
  });

  it("should run when the contained signals update", async () => {
    const fn = vi.fn();
    const signal = createSignal(1);

    effect(() => {
      signal();
      fn();
    });

    signal.set(2);

    await vi.waitFor(
      () => {
        expect(fn).toHaveBeenCalledTimes(2);
      },
      { interval: 1 },
    );
  });

  it("should call the cleanup function on dispose", async () => {
    const fn = vi.fn();
    const signal = createSignal(1);

    effect(() => {
      signal();
      return fn;
    });

    signal.set(2);

    await vi.waitFor(
      () => {
        expect(fn).toHaveBeenCalledOnce();
      },
      { interval: 1 },
    );
  });
});
