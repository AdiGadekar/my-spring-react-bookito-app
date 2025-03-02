/* eslint-disable react/prop-types */
import { createContext, useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import { loginUser, logoutUser } from "../services/api";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthin: true };
    case "LOGOUT":
      return { ...state, isAuthin: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { isAuthin: false });
  const [cookies, setCookies, removeCookies] = useCookies();
  const [userData, setUserData] = useState(() => {
    try {
      const userKey = Object.keys(cookies).find((key) =>
        key.startsWith("authToken")
      );
      if (userKey) {
        const storedUserData = cookies[userKey];
        dispatch({ type: "LOGIN" }); 
        return storedUserData;
      } else {
        dispatch({ type: "LOGOUT" });
        return null;
      }
    } catch (error) {
      console.log("Error "+error);
      return null;
    }
  });

  const login = async (email, password) => {
    const response = await loginUser(email, password);
    if (response.status === 200 && response.data.body) {
      setCookies("authToken", JSON.stringify(response.data.body), {
        path: "/",
        maxAge: 4800,
      });
      setUserData(response.data.body)
      dispatch({ type: "LOGIN" });
      return response.data.body;
    } else {
      return response.data.body;
    }
  };

  const logout = (email) => {
    Object.keys(cookies).forEach((key) => {
      if (key.startsWith("authToken")) {
        removeCookies(key, { path: "/" });
      }
    });
    logoutUser(email);
    dispatch({ type: "LOGOUT" });
    setUserData(null);
  };

  const isAuthin = Object.keys(cookies).some((key) =>
    key.startsWith("authToken")
  );

  return (
    <AuthContext.Provider value={{ state, login, logout, isAuthin, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
