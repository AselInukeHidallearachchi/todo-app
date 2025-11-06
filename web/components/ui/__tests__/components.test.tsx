import { render } from "@testing-library/react";
import { Button } from "../button";
import { Input } from "../input";
import { Badge } from "../badge";

describe("UI Components", () => {
  it("Button renders and matches snapshot", () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.querySelector("button")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("Input renders and matches snapshot", () => {
    const { container } = render(<Input placeholder="Enter text" />);
    expect(container.querySelector("input")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("Badge renders and matches snapshot", () => {
    const { container } = render(<Badge>Label</Badge>);
    expect(container.textContent).toContain("Label");
    expect(container).toMatchSnapshot();
  });
});
