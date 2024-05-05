"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams, redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import GithubSignInButton from "../github-auth-button";
import { useSession } from "next-auth/react";
import GoogleSignInButton from "../google-auth-button";
import { lastUsedLoginProviderLocalStorageKey } from "@/constants/constants";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [lastUsedLoginProvider, setLastUsedLoginProvider] = useState<
    string | null
  >(null);
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: UserFormValue) => {
    localStorage.setItem(lastUsedLoginProviderLocalStorageKey, "email");
    signIn("credentials", {
      email: data.email,
      callbackUrl: callbackUrl ?? "/dashboard",
    });
  };

  const { data: session } = useSession();
  if (session) {
    // Redirect to the dashboard if the user is already authenticated
    redirect("/dashboard");
  }

  useEffect(() => {
    setLastUsedLoginProvider(
      localStorage.getItem(lastUsedLoginProviderLocalStorageKey),
    );
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      disabled={loading}
                      {...field}
                    />
                    {lastUsedLoginProvider === "email" && (
                      <Badge className="absolute -top-2 -right-2">
                        Last Used
                      </Badge>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Continue With Email
          </Button>
        </form>
      </Form>
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
        <GithubSignInButton />
        {lastUsedLoginProvider === "github" && (
          <Badge className="absolute -top-2 -right-2">Last Used</Badge>
        )}
      </div>
    </>
  );
}
