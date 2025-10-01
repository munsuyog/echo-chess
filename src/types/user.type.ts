
export interface IUser {
  user_id?: number;
  is_guest?: boolean;
  email?: string;
  name?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  is_guest: boolean;
}

export interface ApiResponse<T> {
  status: "success" | "fail";
  api_version: string;
  api_code: number;
  response: {
    response_id: string;
    data: T;
  };
}
