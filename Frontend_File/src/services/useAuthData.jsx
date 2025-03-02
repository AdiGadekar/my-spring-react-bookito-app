import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const useAuthData = () => {
  const { userData } = useContext(AuthContext);

  return { loading: false, loginResult: userData };
};

export default useAuthData;
