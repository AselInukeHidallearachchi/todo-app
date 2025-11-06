import { render, screen } from "@testing-library/react";
import { Card } from "../card";
import "@testing-library/jest-dom";

describe("Card Component", () => {
  it("renders card with children", () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Test</div>
      </Card>
    );

    const cardElement = container.querySelector(".custom-class");
    expect(cardElement).toBeInTheDocument();
  });

  it("renders as a div element", () => {
    const { container } = render(<Card>Content</Card>);

    const card = container.firstChild;
    expect(card?.nodeName).toBe("DIV");
  });
});
