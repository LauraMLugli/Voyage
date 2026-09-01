import { createContext, PropsWithChildren, useState } from "react";

type AuthContextProps = {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setILoggedIn] = useState(false);
  const logIn = () => {
    setILoggedIn(true);
  };

  const logOut = () => {
    setILoggedIn(false);
  };
  return (
    <AuthContext value={{ isLoggedIn, logIn, logOut }}>{children}</AuthContext>
  );
}
