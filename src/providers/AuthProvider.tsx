import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { checkCurrentUser } from "../apicalls/auth";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: checkCurrentUser,
    retry: false,
  });

  React.useEffect(() => {
    if (query.data) {
      const res: any = query.data;
      if (res && res.isSuccess) {
        dispatch(setUser(res.userDoc ?? res.data));
      } else {
        localStorage.removeItem("token");
        dispatch(setUser(null));
        navigate("/");
        toast.error(res?.message ?? "Not authenticated");
      }
    }

    if (query.error) {
      const err: any = query.error;
      toast.error(err?.message ?? "Failed to validate user");
      localStorage.removeItem("token");
      dispatch(setUser(null));
      navigate("/");
    }
  }, [query.data, query.error]);

  return <section>{children}</section>;
};

export default AuthProvider;
