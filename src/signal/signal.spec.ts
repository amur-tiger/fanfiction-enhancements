import { describe, expect, it, vi } from "vitest";
import context from "./context";
import { createSignal, isSignal } from "./signal";

describe(createSignal, () => {
  describe("init", () => {
    it("should use undefined as default", () => {
      const data = createSignal();

      expect(data()).toBeUndefined();
    });

    it("should save the given value", () => {
      const data = createSignal("hello");

      expect(data()).toBe("hello");
    });

    it("should execute the init function", () => {
      const data = createSignal(() => "hello");

      expect(data()).toBe("hello");
    });

    it("should take the value from a promise", async () => {
      const data = createSignal(Promise.resolve("hello"));

      expect(data()).toBeUndefined();
      await vi.waitFor(
        () => {
          expect(data()).toBe("hello");
        },
        { interval: 1 },
      );
    });

    it("should take the value from an async init function", async () => {
      const data = createSignal(async () => "hello");

      expect(data()).toBeUndefined();
      await vi.waitFor(
        () => {
          expect(data()).toBe("hello");
        },
        { interval: 1 },
      );
    });

    it("should update context for init promise", async () => {
      const fn = vi.fn();
      const data = createSignal(Promise.resolve("hello"));

      context(() => {
        data();
      }, fn);

      await vi.waitFor(
        () => {
          expect(fn).toHaveBeenCalled();
        },
        { interval: 1 },
      );
    });

    it("should update context for async function init", async () => {
      const fn = vi.fn();
      const data = createSignal(async () => "hello");

      context(() => {
        data();
      }, fn);

      await vi.waitFor(
        () => {
          expect(fn).toHaveBeenCalled();
        },
        { interval: 1 },
      );
    });
  });

  describe("peek", () => {
    it("should return the value", () => {
      const data = createSignal("boo");

      expect(data.peek()).toBe("boo");
    });

    it("should not notify the context", () => {
      const fn = vi.fn();
      const data = createSignal("boo");

      context(() => {
        data.peek();
      }, fn);

      data.set("baz");

      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("set", () => {
    it("should set the value directly", () => {
      const data = createSignal(7);
      data.set(13);

      expect(data()).toBe(13);
    });

    it("should set the value via function", () => {
      const data = createSignal(7);
      data.set((prev) => prev + 4);

      expect(data()).toBe(11);
    });

    it("should not need to bind signal to set", () => {
      const data = createSignal(7);
      data.set.call(undefined, 13 as never);

      expect(data()).toBe(13);
    });

    it("should re-run context on change", async () => {
      const fn = vi.fn();
      const data = createSignal(6);

      context(() => {
        data();
      }, fn);

      data.set(3);

      await vi.waitFor(
        () => {
          expect(fn).toHaveBeenCalledOnce();
        },
        { interval: 1 },
      );
    });

    it("should not run parent context", async () => {
      const innerFn = vi.fn();
      const outerFn = vi.fn();
      const data = createSignal(6);

      context(() => {
        context(() => {
          data();
        }, innerFn);
      }, outerFn);

      data.set(3);

      await vi.waitFor(
        () => {
          expect(innerFn).toHaveBeenCalledOnce();
          expect(outerFn).not.toHaveBeenCalled();
        },
        { interval: 1 },
      );
    });

    it("should not run child context if parent is called", async () => {
      const innerFn = vi.fn();
      const outerFn = vi.fn();
      const data = createSignal(6);

      context(() => {
        context(() => {
          data();
        }, innerFn);
        data();
      }, outerFn);

      data.set(3);

      await vi.waitFor(
        () => {
          expect(innerFn).not.toHaveBeenCalled();
          expect(outerFn).toHaveBeenCalledOnce();
        },
        { interval: 1 },
      );
    });
  });

  describe("onChange", () => {
    it("should call change handler on change", () => {
      const fn = vi.fn();
      const data = createSignal<number>(9, {
        onChange: fn,
      });

      data.set(28);

      expect(fn).toHaveBeenCalledWith(28);
    });

    it("should not call change handler for async init", async () => {
      const fn = vi.fn();
      const data = createSignal(Promise.resolve(9), {
        onChange: fn,
      });

      await vi.waitFor(
        () => {
          expect(data()).toBe(9);
        },
        { interval: 1 },
      );
      expect(fn).not.toHaveBeenCalled();
    });
  });
});

describe(isSignal, () => {
  it("should give negative", () => {
    expect(isSignal(false)).toBe(false);
    expect(isSignal(13)).toBe(false);
    expect(isSignal("signal")).toBe(false);
    expect(isSignal({ value: 99 })).toBe(false);
  });

  it("should give positive", () => {
    expect(isSignal(createSignal(0))).toBe(true);
  });
});
