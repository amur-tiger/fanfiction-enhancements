import { describe, expect, it, vi } from "vitest";
import { createSignal } from "../signal/signal";
import { jsx } from "./jsx-runtime";

describe("render", () => {
  it("should render html tags", () => {
    const result = jsx("div", { class: "container" });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("className", "container");
    expect(result).toHaveProperty("childElementCount", 0);
  });

  it("should attach children", () => {
    const result = jsx("div", { children: jsx("p", { align: "center" }) });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 1);
    expect((result as HTMLDivElement).children.item(0)).toBeInstanceOf(HTMLParagraphElement);
    expect((result as HTMLDivElement).children.item(0)).toHaveProperty("align", "center");
  });

  it("should render strings", () => {
    const result = jsx("div", { children: "text" });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "text");
  });

  it("should render numbers", () => {
    const result = jsx("div", { children: 13 });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "13");
  });

  it("should not render undefined", () => {
    const result = jsx("div", { children: undefined });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "");
  });

  it("should not render null", () => {
    const result = jsx("div", { children: null });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "");
  });

  it("should not render false", () => {
    const result = jsx("div", { children: false });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "");
  });

  it("should not render true", () => {
    const result = jsx("div", { children: true });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "");
  });

  it("should run custom component", () => {
    const props = {
      key: Symbol("props"),
    };
    const ret = Symbol("return");
    const component = vi.fn(() => ret);

    const result = jsx(component as never, props);

    expect(result).toBe(ret);
    expect(component).toHaveBeenCalledWith(props);
  });
});
