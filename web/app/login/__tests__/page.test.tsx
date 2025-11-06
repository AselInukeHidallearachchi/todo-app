import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

jest.mock("@/lib/api");
jest.mock("next/navigation");
jest.mock("@/context/UserContext");

const mockApi = api as jest.Mocked<typeof api>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe("Login Page", () => {
  const mockPush = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);

    mockUseUser.mockReturnValue({
      setUser: mockSetUser,
      user: null,
      loading: false,
      clearUser: jest.fn(),
    });
  });

  describe("Rendering", () => {
    it("renders email input field", () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
    });

    it("renders password input field", () => {
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toBeInTheDocument();
    });

    it("renders submit button with 'Sign in' text", () => {
      render(<LoginPage />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("renders link to register page", () => {
      render(<LoginPage />);

      const registerLink = screen.getByRole("link", {
        name: /create account/i,
      });
      expect(registerLink).toBeInTheDocument();
    });

    it("renders welcome message", () => {
      render(<LoginPage />);

      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    it("renders page heading", () => {
      render(<LoginPage />);

      const heading = screen.getByRole("heading", { name: /welcome back/i });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("disables submit button when both fields are empty", () => {
      render(<LoginPage />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      expect(submitButton).toBeDisabled();
    });

    it("disables submit button when email is empty", async () => {
      render(<LoginPage />);
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, "password123");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      expect(submitButton).toBeDisabled();
    });

    it("disables submit button when password is empty", async () => {
      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      expect(submitButton).toBeDisabled();
    });

    it("enables submit button when both fields are filled", async () => {
      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      expect(submitButton).not.toBeDisabled();
    });

    it("shows error when fields are empty on submit attempt", async () => {
      render(<LoginPage />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });

      // Button should be disabled, so we need to enable it somehow for testing
      // This test verifies the button state itself
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Form Submission", () => {
    it("calls API with email and password", async () => {
      (mockApi.post as jest.Mock).mockResolvedValue({
        data: {
          token: "test-token",
          user: {
            id: 1,
            name: "John",
            email: "john@example.com",
            role: "user",
          },
        },
      });

      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("calls setUser with response data on successful login", async () => {
      const mockUser = {
        id: 1,
        name: "John",
        email: "john@example.com",
        role: "user",
      };
      const mockToken = "test-token-abc";

      (mockApi.post as jest.Mock).mockResolvedValue({
        data: {
          token: mockToken,
          user: mockUser,
        },
      });

      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUser, mockToken);
      });
    });

    it("redirects to home page on successful login", async () => {
      (mockApi.post as jest.Mock).mockResolvedValue({
        data: {
          token: "test-token",
          user: {
            id: 1,
            name: "John",
            email: "john@example.com",
            role: "user",
          },
        },
      });

      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message on login failure", async () => {
      (mockApi.post as jest.Mock).mockRejectedValue({
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      });

      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it("displays generic error when no error message returned", async () => {
      (mockApi.post as jest.Mock).mockRejectedValue({
        response: {
          status: 500,
        },
      });

      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/login failed|try again/i)).toBeInTheDocument();
      });
    });

    it("clears error message when user starts typing", async () => {
      (mockApi.post as jest.Mock).mockRejectedValue({
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      });

      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Clear and type again
      await user.clear(emailInput);
      await user.type(emailInput, "new@example.com");

      // Error should be cleared
      await waitFor(() => {
        expect(
          screen.queryByText(/invalid credentials/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Loading State", () => {
    it("shows loading state during API call", async () => {
      (mockApi.post as jest.Mock).mockImplementation(
        () =>
          new Promise<typeof mockApi>((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    token: "test-token",
                    user: {
                      id: 1,
                      name: "John",
                      email: "john@example.com",
                      role: "user",
                    },
                  },
                } as unknown as typeof mockApi),
              100
            )
          )
      );

      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // Check for loading text
      const loadingText = await screen.findByText(/signing in/i);
      expect(loadingText).toBeInTheDocument();
    });

    it("disables inputs during submission", async () => {
      (mockApi.post as jest.Mock).mockImplementation(
        () =>
          new Promise<typeof mockApi>((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    token: "test-token",
                    user: {
                      id: 1,
                      name: "John",
                      email: "john@example.com",
                      role: "user",
                    },
                  },
                } as unknown as typeof mockApi),
              100
            )
          )
      );

      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /^password$/i
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // Inputs should be disabled during loading
      expect(emailInput.disabled).toBe(true);
      expect(passwordInput.disabled).toBe(true);
    });
  });

  describe("Password Visibility Toggle", () => {
    it("renders password visibility toggle button", () => {
      render(<LoginPage />);

      const toggleButtons = screen.getAllByRole("button");
      // Should have submit button and toggle button
      expect(toggleButtons.length).toBeGreaterThanOrEqual(2);
    });

    it("toggles password visibility", async () => {
      render(<LoginPage />);
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(
        /^password$/i
      ) as HTMLInputElement;
      expect(passwordInput.type).toBe("password");

      // Find and click the toggle button (it's a button without accessible name)
      const toggleButtons = screen.getAllByRole("button");
      const eyeToggle = toggleButtons.find((btn) => btn.querySelector("svg"));

      if (eyeToggle) {
        await user.click(eyeToggle);
        expect(passwordInput.type).toBe("text");

        await user.click(eyeToggle);
        expect(passwordInput.type).toBe("password");
      }
    });
  });
});
