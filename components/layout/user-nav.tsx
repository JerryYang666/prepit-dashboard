"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { usePrepitUserSession } from "@/contexts/PrepitUserSessionContext";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function UserNav() {
  const {
    user,
    signOut,
    firstNameCacheCookieKey,
    lastNameCacheCookieKey,
    emailCacheCookieKey,
    profileImgUrlCacheCookieKey,
  } = usePrepitUserSession();
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImgUrl, setProfileImgUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFirstName(
      user?.first_name ?? Cookies.get(firstNameCacheCookieKey) ?? "",
    );
    setLastName(user?.last_name ?? Cookies.get(lastNameCacheCookieKey) ?? "");
    setEmail(user?.email ?? Cookies.get(emailCacheCookieKey) ?? "");
    setProfileImgUrl(
      user?.profile_img_url ?? Cookies.get(profileImgUrlCacheCookieKey) ?? "",
    );
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profileImgUrl} alt={firstName} />
            <AvatarFallback>{firstName[0] + lastName[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p
              className="text-sm font-medium leading-none w-[80%]"
              style={{ wordWrap: "break-word" }}
            >
              {firstName} {lastName}
            </p>
            <p
              className="text-xs leading-none text-muted-foreground w-[80%]"
              style={{ wordWrap: "break-word" }}
            >
              {email}
            </p>
            <Badge className="ml-2 absolute right-2">Pro</Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icons.profile className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icons.billing className="w-4 h-4 mr-2" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icons.settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            window.location.href = "/";
          }}
        >
          <Icons.logout className="w-4 h-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
