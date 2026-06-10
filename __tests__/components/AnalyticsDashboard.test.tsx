import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div>
      <p>{label}</p>
      <p>{value}</p>
      <span>{change}</span>
    </div>
  );
}

describe("AnalyticsDashboard MetricCard", () => {
  it("renders metric label", () => {
    render(<MetricCard label="Total Views" value="24.5k" change="+12%" />);
    expect(screen.getByText("Total Views")).toBeInTheDocument();
  });

  it("renders metric value", () => {
    render(<MetricCard label="Total Views" value="24.5k" change="+12%" />);
    expect(screen.getByText("24.5k")).toBeInTheDocument();
  });

  it("renders change percentage", () => {
    render(<MetricCard label="Total Views" value="24.5k" change="+12%" />);
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });
});
