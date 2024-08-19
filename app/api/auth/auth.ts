import request from "@/lib/request";

export interface GetGoogleSignInUrlResponse {
  url: string;
}

interface EmailOtpRequest {
  email: string;
}

interface EmailOtpResponse {
  new_account: boolean;
  event_id: string;
  duplicate_request: boolean;
}

interface EmailSignInRequest {
  email: string;
  otp: string;
  event_id?: string;
  first_name?: string;
  last_name?: string;
}

interface EmailSignInResponse {
  access_token: string;
  refresh_token: string;
}

const api = {
  getGoogleSignInUrl: "/get_google_signin_url",
  getEmailOtp: "/email/get_email_otp",
  emailSignIn: "/email/email_signin",
  ping: "/ping",
};

export function getGoogleSignInUrl(
  currentUrl: string,
): Promise<GetGoogleSignInUrlResponse> {
  return request({
    url: `${api.getGoogleSignInUrl}?came_from=${encodeURIComponent(currentUrl)}`,
    method: "get",
  });
}

export function getEmailOtp(data: EmailOtpRequest): Promise<EmailOtpResponse> {
  return request({
    url: api.getEmailOtp,
    method: "post",
    data,
  });
}

export function emailSignIn(data: EmailSignInRequest): Promise<EmailSignInResponse> {
  return request({
    url: api.emailSignIn,
    method: "post",
    data,
  });
}

export function ping(): Promise<void> {
  return request({
    url: api.ping,
    method: "get",
  });
}
