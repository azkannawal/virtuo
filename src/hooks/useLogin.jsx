import { useSelector } from "react-redux";
import { selectUserName } from "../features/user/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const username = useSelector(selectUserName);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate("/");
    }
  }, []);

  return username;
};

export default useLogin;
