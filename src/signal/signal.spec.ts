import { describe, expect, it, vi } from "vitest";
import scoped from "./scope";
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
      await Promise.resolve();
      expect(data()).toBe("hello");
    });

    it("should update context for init promise", async () => {
      const fn = vi.fn();
      const value = Promise.resolve("hello");
      const data = createSignal(value);

      scoped(() => {
        data();
      }, fn);

      await value;
      await Promise.resolve();
      expect(fn).toHaveBeenCalled();
    });
  });

  describe("peek", () => {
    it("should return the value", () => {
      const data = createSignal("boo");

      expect(data.peek()).toBe("boo");
    });

    it("should not notify the context", async () => {
      const fn = vi.fn();
      const data = createSignal("boo");

      scoped(() => {
        data.peek();
      }, fn);

      data.set("baz");

      await Promise.resolve();
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

      scoped(() => {
        data();
      }, fn);

      data.set(3);

      await Promise.resolve();
      expect(fn).toHaveBeenCalledOnce();
    });

    it("should not run parent context", async () => {
      const innerFn = vi.fn();
      const outerFn = vi.fn();
      const data = createSignal(6);

      scoped(() => {
        scoped(() => {
          data();
        }, innerFn);
      }, outerFn);

      data.set(3);

      await Promise.resolve();
      expect(innerFn).toHaveBeenCalledOnce();
      expect(outerFn).not.toHaveBeenCalled();
    });

    it("should not run child context if parent is called", async () => {
      const innerFn = vi.fn();
      const outerFn = vi.fn();
      const data = createSignal(6);

      scoped(() => {
        scoped(() => {
          data();
        }, innerFn);
        data();
      }, outerFn);

      data.set(3);

      await Promise.resolve();
      expect(innerFn).not.toHaveBeenCalled();
      expect(outerFn).toHaveBeenCalledOnce();
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
      createSignal(Promise.resolve(9), {
        onChange: fn,
      });

      await Promise.resolve();
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
