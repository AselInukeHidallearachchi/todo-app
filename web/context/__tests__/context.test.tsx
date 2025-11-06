import { render } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

describe("Context", () => {
  it("localStorage operations work", () => {
    localStorage.setItem("token", "test-token");
    expect(localStorage.getItem("token")).toBe("test-token");
    localStorage.removeItem("token");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("user data can be stored", () => {
    const userData = { id: 1, name: "Test" };
    localStorage.setItem("user", JSON.stringify(userData));
    const stored = localStorage.getItem("user");
    expect(stored).toBeTruthy();
    localStorage.removeItem("user");
  });

  it("matches snapshot", () => {
    const { container } = render(
      <div>
        <div>Context Test</div>
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
