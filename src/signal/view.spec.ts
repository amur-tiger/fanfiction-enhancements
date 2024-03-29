import { describe, expect, it, vi } from "vitest";
import { createSignal, isSignal } from "./signal";
import view from "./view";
import scoped from "./scope";

describe(view, () => {
  it("should return a signal", () => {
    const signal = createSignal({ prop: 1 });
    const prop = view(signal, "prop");

    expect(isSignal(prop)).toBe(true);
  });

  it("should return a property", () => {
    const signal = createSignal({ prop: 1 });
    const prop = view(signal, "prop");

    expect(prop()).toBe(1);
  });

  it("should return a property with accessor", () => {
    const signal = createSignal({ prop: 1 });
    const prop = view(signal, {
      get: (s) => s.prop,
      set: (p, s) => ({ ...p, prop: s }),
    });

    expect(prop()).toBe(1);
  });

  it("should set the property", async () => {
    const signal = createSignal({ prop: 1, other: 9 });
    const prop = view(signal, "prop");

    prop.set(2);

    await vi.waitFor(
      () => {
        expect(prop()).toBe(2);
        expect(signal()).toStrictEqual({ prop: 2, other: 9 });
      },
      { interval: 1 },
    );
  });

  it("should set the property with accessor", async () => {
    const signal = createSignal({ prop: 1, other: 9 });
    const prop = view(signal, {
      get: (s) => s.prop,
      set: (p, s) => ({ ...p, prop: s }),
    });

    prop.set(2);

    await vi.waitFor(
      () => {
        expect(prop()).toBe(2);
        expect(signal()).toStrictEqual({ prop: 2, other: 9 });
      },
      { interval: 1 },
    );
  });

  it("should notify the context", async () => {
    const fn = vi.fn();
    const signal = createSignal({ prop: 1 });
    const prop = view(signal, "prop");

    scoped(() => {
      prop();
    }, fn);

    prop.set(2);

    await vi.waitFor(
      () => {
        expect(fn).toHaveBeenCalledOnce();
      },
      { interval: 1 },
    );
  });

  it("should notify the parent signal", async () => {
    const fn = vi.fn();
    const signal = createSignal({ prop: 1 });
    const prop = view(signal, "prop");

    scoped(() => {
      signal();
    }, fn);

    prop.set(2);

    await vi.waitFor(
      () => {
        expect(fn).toHaveBeenCalledOnce();
      },
      { interval: 1 },
    );
  });

  it("should use provided equals method", async () => {
    const fn = vi.fn();
    const signal = createSignal({ prop: 1 });
    const prop = view(signal, "prop", () => true);

    scoped(() => {
      prop();
    }, fn);

    signal.set({ prop: 2 });

    await Promise.resolve();
    expect(fn).not.toHaveBeenCalled();
  });
});
