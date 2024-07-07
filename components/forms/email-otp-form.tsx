import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSignIn } from "@/app/api/auth/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { lastUsedLoginProviderLocalStorageKey } from "@/constants/constants";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  otp: z.string().min(6, { message: "Enter a 6-digit OTP" }),
});

type UserFormValue = z.infer<typeof formSchema>;

interface EmailOtpFormProps {
  email: string | null;
  event_id: string | null;
  setEmailSignInState: (emailSignInState: number) => void;
}

export const EmailOtpForm: React.FC<EmailOtpFormProps> = ({
  email,
  event_id,
  setEmailSignInState,
}) => {
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  useEffect(() => {
    form.setValue("email", email!);
  }, [setEmailSignInState]);

  const processRefreshAccessToken = (refresh: string, access: string) => {
    const firstLevelDomain =
      "." + window.location.hostname.split(".").slice(-2).join(".");
    const dashboardPath = "/dashboard";
    const signInPath = "/auth/signin";

    if (refresh && access) {
      // if any of the tokens are a string called "error", remove the tokens
      // and show an error message
      if (refresh === "error" || access === "error") {
        toast.error("An error occurred. Please try again.");
        router.push(signInPath);
        return;
      }

      // refresh token valid for 15 days, under the domain first level domain
      Cookies.set("refresh_token", refresh, {
        expires: 30,
        domain: firstLevelDomain,
      });
      // access token valid for 30 minutes
      Cookies.set("access_token", access, {
        expires: 1 / 48,
        domain: firstLevelDomain,
      });

      localStorage.setItem(lastUsedLoginProviderLocalStorageKey, "email");

      window.location.href = dashboardPath;
    }
  };

  const SignIn = (data: UserFormValue) => {
    emailSignIn({
      email: email!,
      otp: data.otp,
      event_id: event_id ? event_id : undefined,
    })
      .then((response) => {
        processRefreshAccessToken(
          response.refresh_token,
          response.access_token,
        );
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      });
  };

  const useAnotherEmail = () => {
    setEmailSignInState(0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(SignIn)} className="space-y-2 w-full">
        <FormField
          name="email"
          render={() => (
            <FormItem>
              <div className="flex flex-row justify-between">
                <FormLabel>Email</FormLabel>
                <FormLabel
                  className="underline hover:cursor-pointer"
                  onClick={useAnotherEmail}
                >
                  Want to use another email?
                </FormLabel>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled
                    value={email as string}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="ml-auto w-full" type="submit">
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default EmailOtpForm;
