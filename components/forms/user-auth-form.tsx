"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import GoogleSignInButton from "../google-auth-button";
import InstitutionAuthButton from "../institution-auth-button";
import { lastUsedLoginProviderLocalStorageKey } from "@/constants/constants";
import { Badge } from "@/components/ui/badge";
import EmailDefaultForm from "./email-default-form";
import EmailOtpForm from "./email-otp-form";
import EmailOtpNameForm from "./email-otp-name-form";

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [lastUsedLoginProvider, setLastUsedLoginProvider] = useState<
    string | null
  >(null);
  const [email, setEmail] = useState<string | null>(null);
  const [emailSignInEventId, setEmailSignInEventId] = useState<string | null>(
    null,
  );
  const [emailSignInState, setEmailSignInState] = useState(0); // 0-> initial, 1-> otp sent and not new account, 2-> otp sent and new account

  useEffect(() => {
    setLastUsedLoginProvider(
      localStorage.getItem(lastUsedLoginProviderLocalStorageKey),
    );
  }, []);

  return (
    <>
      {emailSignInState === 0 && (
        <EmailDefaultForm
          lastUsedLoginProvider={lastUsedLoginProvider}
          setEmail={setEmail}
          setEmailSignInEventId={setEmailSignInEventId}
          setEmailSignInState={setEmailSignInState}
        />
      )}
      {emailSignInState === 1 && (
        <EmailOtpForm
          email={email}
          event_id={emailSignInEventId}
          setEmailSignInState={setEmailSignInState}
        />
      )}
      {emailSignInState === 2 && (
        <EmailOtpNameForm
          email={email}
          event_id={emailSignInEventId}
          setEmailSignInState={setEmailSignInState}
        />
      )}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="relative">
        <GoogleSignInButton />
        {lastUsedLoginProvider === "google" && (
          <Badge className="absolute -top-2 -right-2">Last Used</Badge>
        )}
      </div>
      <div className="relative">
        <InstitutionAuthButton />
        {lastUsedLoginProvider === "institution" && (
          <Badge className="absolute -top-2 -right-2">Last Used</Badge>
        )}
      </div>
      {/* <div className="relative">
        <GithubSignInButton />
        {lastUsedLoginProvider === "github" && (
          <Badge className="absolute -top-2 -right-2">Last Used</Badge>
        )}
      </div> */}
    </>
  );
}
