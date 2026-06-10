import { describe, it, expect } from "vitest";

type Post = { id: string; created_at: string; title: string };

function sortByLatest(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

describe("sortByLatest", () => {
  it("sorts posts by newest first", () => {
    const posts: Post[] = [
      { id: "1", created_at: "2024-01-01", title: "Old" },
      { id: "2", created_at: "2024-03-01", title: "New" },
      { id: "3", created_at: "2024-02-01", title: "Middle" },
    ];
    const sorted = sortByLatest(posts);
    expect(sorted[0].title).toBe("New");
    expect(sorted[2].title).toBe("Old");
  });

  it("returns empty array for empty input", () => {
    expect(sortByLatest([])).toEqual([]);
  });
});
