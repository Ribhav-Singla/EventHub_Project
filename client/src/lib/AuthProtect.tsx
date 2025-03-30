import { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil";
import { Navigate } from "react-router-dom";

function AuthProtect({ children }: { children: ReactNode }) {
  const authData = useRecoilValue(authState);
  return authData.isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
}

export default AuthProtect;
