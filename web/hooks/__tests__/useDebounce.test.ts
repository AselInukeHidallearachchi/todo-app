import { useDebounce } from "../useDebounce";
import { renderHook, act } from "@testing-library/react";

describe("useDebounce Hook", () => {
  jest.useFakeTimers();

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    expect(result.current).toBe("initial");
  });

  it("debounces value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });
    // Value shouldn't change immediately
    expect(result.current).toBe("initial");

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now it should be updated
    expect(result.current).toBe("updated");
  });

  it("resets timer when value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 500 } }
    );

    rerender({ value: "second", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("first");

    rerender({ value: "third", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("first");

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe("third");
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
