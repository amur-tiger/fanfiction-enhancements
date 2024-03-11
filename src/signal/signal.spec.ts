import { describe, expect, it, vi } from "vitest";
import RenderContext from "../jsx/RenderContext";
import { createSignal, isSignal } from "./signal";

describe(createSignal, () => {
  it("should save the given value", () => {
    const data = createSignal("hello");

    expect(data()).toBe("hello");
  });

  it("should set the value directly", () => {
    const data = createSignal(7);
    data(13);

    expect(data()).toBe(13);
  });

  it("should set the value via function", () => {
    const data = createSignal(7);
    data((prev) => prev + 4);

    expect(data()).toBe(11);
  });

  it("should rerender render context on change", () => {
    const context = new RenderContext();
    const data = createSignal(6);
    context.render(() => data() as never);
    vi.spyOn(context, "rerender").mockReturnValue();

    data(3);

    expect(context.rerender).toHaveBeenCalled();
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
