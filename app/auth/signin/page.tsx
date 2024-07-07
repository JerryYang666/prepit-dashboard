"use client";
import Link from "next/link";
import UserAuthForm from "@/components/forms/user-auth-form";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";

export default function AuthenticationPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const refresh = urlParams.get("refresh");
      const access = urlParams.get("access");
      const firstLevelDomain =
        "." + window.location.hostname.split(".").slice(-2).join(".");
      const dashboardPath = "/dashboard";
      const signInPath = "/auth/signin";

      if (refresh && access) {
        // if any of the tokens are a string called "error", remove the tokens
        // and show an error message
        if (refresh === "error" || access === "error") {
          urlParams.delete("refresh");
          urlParams.delete("access");
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

        urlParams.delete("refresh");
        urlParams.delete("access");

        window.location.href = dashboardPath;
      }

      const refreshToken = Cookies.get("refresh_token");
      const isUuid = refreshToken?.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      );
      if (refreshToken && isUuid) {
        window.location.href = dashboardPath;
      } else {
        // delete the tokens if they exist
        Cookies.remove("refresh_token", { domain: firstLevelDomain });
        Cookies.remove("access_token", { domain: firstLevelDomain });
      }
    }
  }, []);

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-800" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="8%"
            viewBox="65 65 180 180"
          >
            <path
              fill="#96C8F1"
              opacity="1.000000"
              stroke="none"
              d="M80.842354,190.161987 
                  C84.257790,189.765442 87.206535,189.372726 89.223938,189.104050 
                  C85.217133,185.319397 80.218445,181.778122 76.790863,177.088547 
                  C71.413055,169.730728 72.193718,160.670593 72.187607,152.047287 
                  C72.177689,138.062592 72.383026,124.077881 72.433670,110.092957 
                  C72.494125,93.400871 82.878014,82.302971 99.494781,82.071281 
                  C120.478409,81.778709 141.471268,81.818787 162.456207,82.059662 
                  C178.022491,82.238358 188.977310,92.134697 189.611725,108.032066 
                  C190.300735,125.298294 189.887863,142.659180 188.946442,159.923752 
                  C188.192886,173.742645 180.391556,184.549423 169.372284,192.058807 
                  C141.948761,210.747421 112.164528,212.684174 81.384407,201.746902 
                  C76.379433,199.968460 72.222412,195.803650 67.673447,192.741852 
                  C67.901680,192.104721 68.129913,191.467575 68.358154,190.830444 
                  C72.363983,190.608902 76.369820,190.387360 80.842354,190.161987 
                z"
            />
            <path
              fill="#504E96"
              opacity="1.000000"
              stroke="none"
              d="M231.018433,131.962402 
                C245.319443,145.415115 251.796463,175.503281 231.960556,199.990250 
                C234.274902,199.990250 236.328278,199.558456 238.076965,200.103745 
                C240.088135,200.730865 242.626801,201.827332 243.437408,203.462845 
                C244.090912,204.781433 243.035828,207.637390 241.845062,209.066681 
                C234.479538,217.907501 224.337158,221.613297 213.365250,222.702118 
                C198.209839,224.206116 183.841797,221.616730 171.402054,212.000229 
                C170.356369,211.191879 169.368774,210.306351 168.376297,209.431610 
                C165.877441,207.229172 165.150131,204.548370 167.436676,201.994125 
                C169.703659,199.461685 172.472015,199.893631 174.938675,202.046844 
                C190.119003,215.298187 207.243973,215.521454 225.676666,208.718369 
                C223.841965,208.017548 221.801819,207.616180 220.227325,206.536041 
                C218.470139,205.330536 216.101593,203.625290 215.909332,201.921967 
                C215.718277,200.229279 217.457489,197.406311 219.109818,196.557281 
                C238.379944,186.655624 240.081879,151.002869 222.703537,137.703537 
                C216.807419,133.191360 210.193604,132.000412 203.037827,132.019760 
                C200.918091,132.025497 198.139038,131.652786 196.807388,130.314163 
                C193.791336,127.282265 196.131393,123.153496 201.132721,122.619293 
                C211.490433,121.512962 220.890274,124.116173 229.199966,130.470963 
                C229.728577,130.875198 230.242889,131.298111 231.018433,131.962402 
              z"
            />
          </svg>
          &nbsp;&nbsp;prepit.ai
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The best AI case interviewer&rdquo;
            </p>
            <footer className="text-sm"></footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 h-full flex items-center">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="relative mx-auto flex w-full h-full flex-col justify-center space-y-6 sm:w-[380px] max-w-[380px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in or create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign in. <br />
              We&apos;ll create an account for you if you don&apos;t have one.
            </p>
          </div>
          <UserAuthForm />
          <div className="h-10"></div>
          <div className="px-0 text-center text-sm text-muted-foreground absolute bottom-1 left-1/2 transform -translate-x-1/2 w-full">
            By clicking continue, you agree to our{" "}
            <Link
              href="https://bucket-57h03x.s3.us-east-2.amazonaws.com/static/prepit.ai_privacy_policy_20240706.pdf"
              className="underline underline-offset-4 hover:text-primary"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
            <br />
            Prepit.ai is a product of Coursey, LLC.
            <br />© 2024 Coursey, LLC. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
