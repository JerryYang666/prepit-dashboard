"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { lastUsedLoginProviderLocalStorageKey } from "@/constants/constants";
import { getGoogleSignInUrl } from "@/app/api/auth/auth";

export default function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() => {
        localStorage.setItem(lastUsedLoginProviderLocalStorageKey, "google");
        const currentUrl = window.location.href;
        getGoogleSignInUrl(currentUrl).then((response) => {
          // Redirect to the Google sign-in page
          window.location.href = response.url;
        });
      }}
    >
      <Icons.google className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
}
