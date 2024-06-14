import request from "@/lib/request";

export interface GetGoogleSignInUrlResponse {
  url: string;
}

const api = {
  getGoogleSignInUrl: "/get_google_signin_url",
};

export function getGoogleSignInUrl(
  currentUrl: string,
): Promise<GetGoogleSignInUrlResponse> {
  return request({
    url: `${api.getGoogleSignInUrl}?came_from=${encodeURIComponent(currentUrl)}`,
    method: "get",
  });
}
