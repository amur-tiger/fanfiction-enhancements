import { describe, expect, it } from "vitest";
import { ptToEm, rgbToHex } from "./utils";

describe("Utility Functions", () => {
  describe("Parsing RGB values", () => {
    it("should parse valid RGB values", () => {
      expect(rgbToHex("rgb(82,160,186)")).toBe("#52a0ba");
      expect(rgbToHex("rgb(151, 186, 82)")).toBe("#97ba52");
      expect(rgbToHex("rgb(242,12,146)")).toBe("#f20c92");
    });

    it("should return false on black or inherit", () => {
      expect(rgbToHex("rgb(0,0,0)")).toBe(false);
      expect(rgbToHex("inherit")).toBe(false);
    });

    it("should return false on an invalid value", () => {
      expect(rgbToHex("")).toBe(false);
      expect(rgbToHex("true")).toBe(false);
      expect(rgbToHex("#f2df0c")).toBe(false);
      expect(rgbToHex("2345.23")).toBe(false);
      expect(rgbToHex(undefined)).toBe(false);
    });
  });

  describe("Converting PT to EM", () => {
    it("should convert valid pt values", () => {
      expect(ptToEm("14pt")).toBe("1.167em");
      expect(ptToEm("6pt")).toBe("0.5em");
      expect(ptToEm("24pt")).toBe("2em");
    });

    it("should return false for 11pt and 12pt", () => {
      expect(ptToEm("11pt")).toBe(false);
      expect(ptToEm("12pt")).toBe(false);
    });

    it("should return false on an invalid value", () => {
      expect(ptToEm("24")).toBe(false);
      expect(ptToEm("size")).toBe(false);
      expect(ptToEm("16px")).toBe(false);
      expect(ptToEm("32.23")).toBe(false);
      expect(ptToEm(undefined)).toBe(false);
    });

    it("should scale sizes correctly if given", () => {
      expect(ptToEm("12pt", 12)).toBe(false);
      expect(ptToEm("14pt", 14)).toBe(false);
      expect(ptToEm("24pt", 24)).toBe(false);
      expect(ptToEm("12pt", 24)).toBe("0.5em");
      expect(ptToEm("24pt", 12)).toBe("2em");
      expect(ptToEm("24pt", 16)).toBe("1.5em");
      expect(ptToEm("12pt", 16)).toBe("0.75em");
    });
  });
});
