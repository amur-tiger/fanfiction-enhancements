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
      await vi.waitFor(() => {
        expect(data()).toBe("hello");
      });
    });

    it("should take the value from an async init function", async () => {
      const data = createSignal(async () => "hello");

      expect(data()).toBeUndefined();
      await vi.waitFor(() => {
        expect(data()).toBe("hello");
      });
    });

    it("should update context for init promise", async () => {
      const fn = vi.fn();
      const data = createSignal(Promise.resolve("hello"));

      context(() => {
        data();
      }, fn);

      await vi.waitFor(() => {
        expect(fn).toHaveBeenCalled();
      });
    });

    it("should update context for async function init", async () => {
      const fn = vi.fn();
      const data = createSignal(async () => "hello");

      context(() => {
        data();
      }, fn);

      await vi.waitFor(() => {
        expect(fn).toHaveBeenCalled();
      });
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

      await vi.waitFor(() => {
        expect(fn).toHaveBeenCalledOnce();
      });
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

      await vi.waitFor(() => {
        expect(innerFn).toHaveBeenCalledOnce();
        expect(outerFn).not.toHaveBeenCalled();
      });
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

      await vi.waitFor(() => {
        expect(innerFn).not.toHaveBeenCalled();
        expect(outerFn).toHaveBeenCalledOnce();
      });
    });
  });

  describe("saveChange", () => {
    it("should call save handler on change", () => {
      const fn = vi.fn();
      const data = createSignal<number>(9, {
        saveChange: fn,
      });

      data.set(28);

      expect(fn).toHaveBeenCalledWith(28);
    });

    it("should not call save handler for async init", async () => {
      const fn = vi.fn();
      const data = createSignal(Promise.resolve(9), {
        saveChange: fn,
      });

      await vi.waitFor(() => {
        expect(data()).toBe(9);
      });
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("handleExternalChange", () => {
    it("should not register external change handler if value is not read", () => {
      const fn = vi.fn();
      createSignal(9, {
        handleExternalChange: fn,
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it("should only register external change handler once", () => {
      const fn = vi.fn();
      const data = createSignal(9, {
        handleExternalChange: fn,
      });

      context(() => {
        context(() => {
          data();
          data();
        });
        data();
      });

      expect(fn).toHaveBeenCalledOnce();
    });

    it("should update the value", () => {
      let setter;
      const data = createSignal(9, {
        handleExternalChange({ set }) {
          setter = set;
        },
      });

      data();

      expect(setter).toBeDefined();
      setter!(28);

      expect(data()).toBe(28);
    });

    it("should run the context", async () => {
      const fn = vi.fn();
      let setter;
      const data = createSignal(9, {
        handleExternalChange({ set }) {
          setter = set;
        },
      });

      context(() => {
        data();
      }, fn);

      expect(setter).toBeDefined();
      setter!(28);

      await vi.waitFor(() => {
        expect(fn).toHaveBeenCalled();
      });
    });

    it("should not call the save handler if updated via external change handler", () => {
      const fn = vi.fn();
      let setter;
      const data = createSignal(9, {
        saveChange: fn,
        handleExternalChange({ set }) {
          setter = set;
        },
      });

      data();

      expect(setter).toBeDefined();
      setter!(28);

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
