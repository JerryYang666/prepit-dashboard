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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import { usePrepitUserSession } from "@/contexts/PrepitUserSessionContext";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { studentJoinWorkspace } from "@/app/api/workspace/workspace";
import { toast } from "sonner";

export function UserNav() {
  const {
    user,
    signOut,
    refreshUserInfoFromNewAccessToken,
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
  const [joinWorkspaceFormOpen, setJoinWorkspaceFormOpen] = useState(false);
  const [joinWorkspaceId, setJoinWorkspaceId] = useState("");
  const [joinWorkspacePassword, setJoinWorkspacePassword] = useState("");

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

  // register a listener to update user info when the access token changes
  useEffect(() => {
    const handleInfoUpdate = () => {
      refreshUserInfoFromNewAccessToken();
    };
    window.addEventListener("accessTokenAutoRefreshed", handleInfoUpdate);
    return () => {
      window.removeEventListener("accessTokenAutoRefreshed", handleInfoUpdate);
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <DropdownMenu modal={false}>
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
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Dialog
              open={joinWorkspaceFormOpen}
              onOpenChange={setJoinWorkspaceFormOpen}
            >
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={(event) => {
                    event.preventDefault();
                    setJoinWorkspaceFormOpen(true);
                  }}
                >
                  <Icons.joinWorkspace className="w-4 h-4 mr-2" />
                  Join CaseBook
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join casebook</DialogTitle>
                  <DialogDescription>
                    Enter the casebook ID and password to join
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                  <Input
                    type="text"
                    placeholder="Casebook ID"
                    value={joinWorkspaceId}
                    onChange={(e) => setJoinWorkspaceId(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={joinWorkspacePassword}
                    onChange={(e) => setJoinWorkspacePassword(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="default"
                    onClick={() => {
                      if (!joinWorkspaceId || !joinWorkspacePassword) {
                        toast.error(
                          "Please enter both the casebook ID and password",
                        );
                        return;
                      }
                      studentJoinWorkspace({
                        workspace_id: joinWorkspaceId,
                        password: joinWorkspacePassword,
                      })
                        .then(() => {
                          setJoinWorkspaceFormOpen(false);
                          setJoinWorkspaceId("");
                          setJoinWorkspacePassword("");
                          toast.success("Joined casebook successfully");
                        })
                        .catch((error) => {
                          toast.error("Failed to join casebook");
                        });
                    }}
                  >
                    Join
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
    </>
  );
}
