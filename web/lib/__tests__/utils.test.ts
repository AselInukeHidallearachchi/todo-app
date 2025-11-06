import { cn } from "../utils";

describe("Utils", () => {
  describe("cn function", () => {
    it("merges class names correctly", () => {
      const result = cn("px-2 py-1", "px-3");
      expect(result).toBe("py-1 px-3");
    });

    it("handles boolean values", () => {
      const result = cn("px-2", true && "py-1", false && "px-3");
      expect(result).toBe("px-2 py-1");
    });

    it("merges conflicting tailwind classes", () => {
      const result = cn("m-1", "m-2");
      expect(result).toBe("m-2");
    });

    it("handles undefined and null", () => {
      const result = cn("px-2", undefined, null, "py-1");
      expect(result).toBe("px-2 py-1");
    });

    it("handles array of classes", () => {
      const result = cn(["px-2", "py-1"], "mx-2");
      expect(result).toContain("py-1");
      expect(result).toContain("mx-2");
    });
  });
});
