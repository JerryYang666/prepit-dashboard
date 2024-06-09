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
  workspace_roles: {};
  student_id: string;
  profile_img_url: string;
}

interface PrepitUserSessionContextProps {
  user: User | null;
  signOut: () => void;
  firstNameCacheCookieKey: string;
  lastNameCacheCookieKey: string;
  emailCacheCookieKey: string;
  profileImgUrlCacheCookieKey: string;
}

const PrepitUserSessionContext = createContext<PrepitUserSessionContextProps>({
  user: null,
  signOut: () => {},
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
  const [user, setUser] = useState<User | null>(null);
  const accessTokenCookieKey = "access_token";
  const refreshTokenCookieKey = "refresh_token";
  const firstNameCacheCookieKey = "first_name";
  const lastNameCacheCookieKey = "last_name";
  const emailCacheCookieKey = "email";
  const profileImgUrlCacheCookieKey = "profile_img_url";

  useEffect(() => {
    const readJWT = (token: string) => {
      try {
        const pub_key = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY;
        if (!pub_key) {
          console.error("JWT_PUBLIC_KEY not found in environment");
          return;
        }
        const decodedToken = jwt.verify(token, pub_key) as User;
        console.log("Decoded JWT:", decodedToken);
        setUser(decodedToken);
        // cache key information into cookies for 30 days
        Cookies.set(firstNameCacheCookieKey, decodedToken.first_name, {
          expires: 30,
        });
        Cookies.set(lastNameCacheCookieKey, decodedToken.last_name, {
          expires: 30,
        });
        Cookies.set(emailCacheCookieKey, decodedToken.email, {
          expires: 30,
        });
        Cookies.set(profileImgUrlCacheCookieKey, decodedToken.profile_img_url, {
          expires: 30,
        });
      } catch (error) {
        console.error("Invalid JWT:", error);
        setUser(null);
      }
    };

    const accessToken = Cookies.get(accessTokenCookieKey);
    if (accessToken) {
      readJWT(accessToken);
    }
  }, []);

  const signOut = () => {
    setUser(null);
    Cookies.remove(accessTokenCookieKey);
    Cookies.remove(refreshTokenCookieKey);
    Cookies.remove(firstNameCacheCookieKey);
    Cookies.remove(lastNameCacheCookieKey);
    Cookies.remove(emailCacheCookieKey);
    Cookies.remove(profileImgUrlCacheCookieKey);
  };

  return (
    <PrepitUserSessionContext.Provider
      value={{
        user,
        signOut,
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
