import { describe, it, expect } from "vitest";

function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

describe("calculateReadTime", () => {
  it("returns 1 min for short content", () => {
    expect(calculateReadTime("Hello world")).toBe(1);
  });

  it("returns correct time for 200 words", () => {
    const content = Array(200).fill("word").join(" ");
    expect(calculateReadTime(content)).toBe(1);
  });

  it("returns correct time for 400 words", () => {
    const content = Array(400).fill("word").join(" ");
    expect(calculateReadTime(content)).toBe(2);
  });

  it("handles empty string", () => {
    expect(calculateReadTime("")).toBe(1);
  });
});
