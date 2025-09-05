// app/context/AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

//We will currently keep user signed in or out by these arguments
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = not signed in

  //Sign in arguments
  const signIn = (username) => setUser({ username });
  //Signed out boolean
  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
