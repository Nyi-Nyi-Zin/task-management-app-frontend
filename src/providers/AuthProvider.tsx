import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { checkCurrentUser } from "../apicalls/auth";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      const response = await checkCurrentUser();
      if (response.isSuccess) {
        dispatch(setUser(response.userDoc));
      } else {
        localStorage.removeItem("token");
        dispatch(setUser(null));
        navigate("/");
        throw new Error(response.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(message);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return <section>{children}</section>;
};

export default AuthProvider;
