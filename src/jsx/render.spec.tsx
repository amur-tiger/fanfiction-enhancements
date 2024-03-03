import { describe, expect, it, vi } from "vitest";
import render from "./render";
import useRef from "./ref";

describe("render", () => {
  it("should render html tags", () => {
    const result = render("div", { class: "container" });

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("className", "container");
    expect(result).toHaveProperty("childElementCount", 0);
  });

  it("should attach children", () => {
    const result = render("div", null, render("p", { align: "center" }));

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 1);
    expect((result as HTMLDivElement).children.item(0)).toBeInstanceOf(HTMLParagraphElement);
    expect((result as HTMLDivElement).children.item(0)).toHaveProperty("align", "center");
  });

  it("should render strings", () => {
    const result = render("div", null, "text");

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "text");
  });

  it("should render numbers", () => {
    const result = render("div", null, 13);

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "13");
  });

  it("should not render undefined", () => {
    const result = render("div", null, undefined);

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "");
  });

  it("should not render null", () => {
    const result = render("div", null, null);

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "");
  });

  it("should not render false", () => {
    const result = render("div", null, false);

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "");
  });

  it("should not render true", () => {
    const result = render("div", null, true);

    expect(result).toBeInstanceOf(HTMLDivElement);
    expect(result).toHaveProperty("childElementCount", 0);
    expect(result).toHaveProperty("textContent", "");
  });

  it("should return custom component", () => {
    const props = Symbol("props");
    const ret = Symbol("return");
    const component = vi.fn(() => ret);

    const result = render(component as never, props as never);

    expect(result).toBe(ret);
    expect(component).toHaveBeenCalledWith(props);
  });

  it("should call references", () => {
    const cb = vi.fn();
    const ref = useRef(cb);

    const result = render("div", { ref });

    expect(cb).toHaveBeenCalledWith(result);
  });
});
