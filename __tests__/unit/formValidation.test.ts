import { describe, it, expect } from "vitest";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}

describe("Form Validation", () => {
  it("validates correct email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(validateEmail("notanemail")).toBe(false);
  });

  it("validates password of 8+ characters", () => {
    expect(validatePassword("password123")).toBe(true);
  });

  it("rejects password under 8 characters", () => {
    expect(validatePassword("pass")).toBe(false);
  });
});
