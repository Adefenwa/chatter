import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

function TagPill({ name }: { name: string }) {
  return <span className="tag-pill">#{name}</span>;
}

describe("TagPill", () => {
  it("renders tag name with hash", () => {
    render(<TagPill name="Technology" />);
    expect(screen.getByText("#Technology")).toBeInTheDocument();
  });

  it("renders different tag names", () => {
    render(<TagPill name="Design" />);
    expect(screen.getByText("#Design")).toBeInTheDocument();
  });
});
