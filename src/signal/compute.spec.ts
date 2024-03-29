import { describe, expect, it } from "vitest";
import { createSignal } from "./signal";
import compute from "./compute";

describe(compute, () => {
  it("should return a signal", () => {
    const data = compute(() => 1);

    expect(data()).toBe(1);
  });

  it("should recalculate if signals change", async () => {
    const signal = createSignal(1);
    const data = compute(() => signal() * 2);

    expect(data()).toBe(2);

    signal.set(2);

    await Promise.resolve();
    expect(data()).toBe(4);
  });
});
