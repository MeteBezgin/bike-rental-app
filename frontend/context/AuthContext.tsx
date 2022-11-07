import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { LoginData, RegisterData, User } from "../types";
import { Grid } from "@mui/material";
import Redirect from "../components/Redirect";
import NavBar from "../containers/NavBar";

interface AuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  // userData?: Partial<User>;
  user?: any;
  loading: boolean;
  error?: any;
  login: (loginData: LoginData) => void;
  register: (registerData: RegisterData) => void;
  logout: () => void;
  recallMyAccount: boolean;
  setRecallMyAccount: React.Dispatch<React.SetStateAction<boolean>>;
}

/* type userContextData = User & {
    defaultProfilePhoto: string;
  }; */

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User>();
  const [recallMyAccount, setRecallMyAccount] = useState<boolean>(false);
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const accessToken = localStorage.getItem("userToken") || "";
  const refreshToken = localStorage.getItem("refreshToken") || "";
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  axios.defaults.headers.common["x-refresh"] = refreshToken;
  const publicPaths = ["/register", "/login"];

  const router = useRouter();

  const isRoutePublic = publicPaths.includes(router.pathname.split("?")[0]);

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  }, [error, router.pathname]);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    const userToken = window.localStorage.getItem("userToken");
    let valid = false;
    if (!isRoutePublic) {
      if (userToken) {
        axios
          .request({
            url: "http://localhost:3001/api/users/getUserInfo",
            method: "GET",
          })
          .then((resp) => {
            if (resp.headers["x-access-token"])
              window.localStorage.setItem(
                "userToken",
                resp.headers["x-access-token"]
              );

            setUser(resp.data);
          })
          .catch((err) => {
            setUser(undefined);
            window.localStorage.removeItem("userToken");
            localStorage.removeItem("refreshToken");
          })
          .finally(() => setLoadingInitial(false));
      } else {
        setLoadingInitial(false);
        setUser(undefined);
        localStorage.removeItem("userToken");
        localStorage.removeItem("refreshToken");
      }
    } else if (isRoutePublic && userToken) {
      axios
        .request({
          url: "http://localhost:3001/api/users/getUserInfo",
          method: "GET",
        })
        .then((resp) => {
          if (resp.headers["x-access-token"])
            window.localStorage.setItem(
              "userToken",
              resp.headers["x-access-token"]
            );
          setUser(resp.data);
        })
        .catch((err) => {
          setUser(undefined);
          window.localStorage.removeItem("userToken");
          localStorage.removeItem("refreshToken");
        })
        .finally(() => setLoadingInitial(false));
      setLoadingInitial(false);
    } else {
      setLoadingInitial(false);
    }
  }, [router.pathname, recallMyAccount, isRoutePublic]);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  const login = useCallback(
    (loginData: LoginData) => {
      setLoading(true);
      axios
        .request({
          url: "http://localhost:3001/api/sessions",
          method: "POST",
          data: loginData,
        })
        .then((resp) => {
          setUser(resp.data.user);
          window.localStorage.setItem("userToken", resp.data.accessToken);
          window.localStorage.setItem("refreshToken", resp.data.refreshToken);
          router.push("/");
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => setLoading(false));
    },
    [router]
  );

  // Sends sign up details to the server. On success we just apply
  // the created user to the state.
  const register = useCallback(
    (registerData: RegisterData) => {
      setLoading(true);
      axios
        .request({
          url: "http://localhost:3001/api/users/add",
          method: "POST",
          data: registerData,
        })
        .then((resp) => {
          router.push("/login");
        })
        .catch((err) => {
          setError(error);
        })
        .finally(() => setLoading(false));
    },
    [error, router]
  );

  // Remove the user from the state and the token from local storage
  const logout = useCallback(() => {
    window.localStorage.removeItem("userToken");
    setUser(undefined);
    router.push("/login");
  }, [router]);

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      recallMyAccount,
      setRecallMyAccount,
    }),
    [user, loading, error, login, register, logout, recallMyAccount]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.

  return (
    <AuthContext.Provider value={memoedValue}>
      {loadingInitial ? (
        <Grid
          justifyContent={"center"}
          alignItems={"flex-end"}
          width={"100%"}
          height={"50vh"}
        >
          <div>Loading...</div>
        </Grid>
      ) : user ? (
        (() => {
          if (isRoutePublic) {
            return <Redirect to={"/bikes"} />;
          }
          return (
            <>
              <NavBar />
              {children}
            </>
          );
        })()
      ) : (
        (() => {
          if (isRoutePublic) {
            return <>{children}</>;
          }
          return <Redirect to="/login" />;
        })()
      )}
    </AuthContext.Provider>
  );
}
