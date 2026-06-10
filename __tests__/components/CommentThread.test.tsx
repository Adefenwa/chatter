import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

function CommentThread({
  comments,
}: {
  comments: { id: string; content: string; author: string }[];
}) {
  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.author}</p>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

describe("CommentThread", () => {
  const comments = [
    { id: "1", content: "Great post!", author: "John" },
    { id: "2", content: "Thanks for sharing", author: "Jane" },
  ];

  it("renders all comments", () => {
    render(<CommentThread comments={comments} />);
    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("Thanks for sharing")).toBeInTheDocument();
  });

  it("renders author names", () => {
    render(<CommentThread comments={comments} />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("renders empty state for no comments", () => {
    const { container } = render(<CommentThread comments={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
