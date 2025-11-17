/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      is_active: boolean;
      email_verified_at: string | null;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface SingleResourceResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TaskStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
  };
}

export interface PreferencesResponse {
  success: boolean;
  message: string;
  data: {
    daily_digest_enabled: boolean;
    digest_time: string;
  };
}
