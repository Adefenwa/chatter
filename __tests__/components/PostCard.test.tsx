import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

function PostCard({
  title,
  excerpt,
  readTime,
}: {
  title: string;
  excerpt: string;
  readTime: number;
}) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{excerpt}</p>
      <span>{readTime} min read</span>
    </div>
  );
}

describe("PostCard", () => {
  it("renders post title", () => {
    render(<PostCard title="Test Post" excerpt="Test excerpt" readTime={5} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("renders post excerpt", () => {
    render(<PostCard title="Test Post" excerpt="Test excerpt" readTime={5} />);
    expect(screen.getByText("Test excerpt")).toBeInTheDocument();
  });

  it("renders read time", () => {
    render(<PostCard title="Test Post" excerpt="Test excerpt" readTime={5} />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });
});
