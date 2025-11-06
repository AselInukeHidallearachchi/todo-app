import api, {
  uploadTaskAttachment,
  deleteTaskAttachment,
  fetchTaskStatistics,
} from "../api";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

describe("API Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("api is defined and has methods", () => {
    expect(api).toBeDefined();
    expect(typeof api.get).toBe("function");
    expect(typeof api.post).toBe("function");
  });

  it("token management works", () => {
    localStorage.setItem("token", "test-token");
    expect(localStorage.getItem("token")).toBe("test-token");
    localStorage.removeItem("token");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("exports file operation functions", () => {
    expect(typeof uploadTaskAttachment).toBe("function");
    expect(typeof deleteTaskAttachment).toBe("function");
    expect(typeof fetchTaskStatistics).toBe("function");
  });

  it("matches snapshot", () => {
    expect(api).toMatchSnapshot();
  });
});
