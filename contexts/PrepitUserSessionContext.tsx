"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  system_admin: boolean;
  workspace_role: {
    [key: string]: string;
  };
  student_id: string;
  profile_img_url: string;
}

interface PrepitUserSessionContextProps {
  user: User | null;
  userCanManageWorkspace: boolean;
  signOut: () => void;
  refreshUserInfoFromNewAccessToken: () => void;
  firstNameCacheCookieKey: string;
  lastNameCacheCookieKey: string;
  emailCacheCookieKey: string;
  profileImgUrlCacheCookieKey: string;
}

const PrepitUserSessionContext = createContext<PrepitUserSessionContextProps>({
  user: null,
  userCanManageWorkspace: false,
  signOut: () => {},
  refreshUserInfoFromNewAccessToken: () => {},
  firstNameCacheCookieKey: "",
  lastNameCacheCookieKey: "",
  emailCacheCookieKey: "",
  profileImgUrlCacheCookieKey: "",
});

export const usePrepitUserSession = () => useContext(PrepitUserSessionContext);

interface PrepitUserSessionProviderProps {
  children: React.ReactNode;
}

export const PrepitUserSessionProvider: React.FC<
  PrepitUserSessionProviderProps
> = ({ children }) => {
  // initialize user state with return value of readJWT
  const [user, setUser] = useState<User | null>(
    readJWT(Cookies.get("access_token")),
  );
  const [userCanManageWorkspace, setUserCanManageWorkspace] = useState(false);
  const accessTokenCookieKey = "access_token";
  const refreshTokenCookieKey = "refresh_token";
  const firstNameCacheCookieKey = "first_name";
  const lastNameCacheCookieKey = "last_name";
  const emailCacheCookieKey = "email";
  const profileImgUrlCacheCookieKey = "profile_img_url";

  function readJWT(token: string | undefined): User | null {
    try {
      const pub_key = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY;
      if (!pub_key) {
        console.error("JWT_PUBLIC_KEY not found in environment");
        return null;
      }
      if (token) {
        const decodedToken = jwt.verify(token, pub_key, {
          algorithms: ["RS256"],
        }) as User;
        return decodedToken;
      }
      return null;
    } catch (error) {
      console.error("Invalid JWT:", error);
    }
    return null;
  }

  function cacheUserInformation(user: User) {
    Cookies.set(firstNameCacheCookieKey, user.first_name, { expires: 30 });
    Cookies.set(lastNameCacheCookieKey, user.last_name, { expires: 30 });
    Cookies.set(emailCacheCookieKey, user.email, { expires: 30 });
    Cookies.set(profileImgUrlCacheCookieKey, user.profile_img_url, {
      expires: 30,
    });
  }

  function refreshUserInfoFromNewAccessToken() {
    const accessToken = Cookies.get(accessTokenCookieKey);
    if (accessToken) {
      const user = readJWT(accessToken);
      if (user) {
        setUser(user);
      }
    }
  }

  useEffect(() => {
    const accessToken = Cookies.get(accessTokenCookieKey);
    if (accessToken) {
      const user = readJWT(accessToken);
      if (user) {
        setUser(user);
        cacheUserInformation(user);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      const userWorkspaceRoles = user && Object.values(user.workspace_role);
      // the user need to satisfy one of the following conditions to access this page
      // 1. the user is a system admin
      // 2. the user is teacher in at least one workspace
      if (
        user &&
        (user.system_admin || userWorkspaceRoles.includes("teacher"))
      ) {
        setUserCanManageWorkspace(true);
      }
    }
  }, [user]);

  const signOut = () => {
    setUser(null);
    const firstLevelDomain =
      "." + window.location.hostname.split(".").slice(-2).join(".");
    Cookies.remove(accessTokenCookieKey, { domain: firstLevelDomain });
    Cookies.remove(refreshTokenCookieKey, { domain: firstLevelDomain });
    Cookies.remove(firstNameCacheCookieKey);
    Cookies.remove(lastNameCacheCookieKey);
    Cookies.remove(emailCacheCookieKey);
    Cookies.remove(profileImgUrlCacheCookieKey);
  };

  return (
    <PrepitUserSessionContext.Provider
      value={{
        user,
        userCanManageWorkspace,
        signOut,
        refreshUserInfoFromNewAccessToken,
        firstNameCacheCookieKey,
        lastNameCacheCookieKey,
        emailCacheCookieKey,
        profileImgUrlCacheCookieKey,
      }}
    >
      {children}
    </PrepitUserSessionContext.Provider>
  );
};
