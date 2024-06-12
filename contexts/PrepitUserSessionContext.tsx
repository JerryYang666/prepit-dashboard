"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
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
  // initialize user state with return value of readJWT
  const [user, setUser] = useState<User | null>(
    readJWT(Cookies.get("access_token")),
  );
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
        console.log("Decoded JWT:", decodedToken);
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
