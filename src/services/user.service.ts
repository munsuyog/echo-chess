import { apiService } from './api.service';
import type { AuthTokens, ApiResponse } from '../types/user.type';

export interface RefreshTokenPayload {
  refresh_token: string;
}

export const userService = {
  guestLogin: () => 
    apiService.post<ApiResponse<AuthTokens>>(`/oauth/guestLogin`),

  refreshToken: (data: RefreshTokenPayload) => 
    apiService.post<ApiResponse<AuthTokens>>(`/oauth/refreshToken`, data),
};
