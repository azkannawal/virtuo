import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  selectUserName,
  selectUserPhoto,
  setSignOutState,
} from "../features/user/userSlice";
import useLogin from "../hooks/useLogin";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  useLogin();
  const userName = useSelector(selectUserName);
  const userPhoto = useSelector(selectUserPhoto);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (userName) {
      try {
        await signOut(auth).then(() => {
          dispatch(setSignOutState());
          navigate("/");
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container>
      <img src={userPhoto} alt="" />
      <p>{userName}</p>
      <button onClick={handleAuth}>Logout</button>
    </Container>
  );
};

const Container = styled.main`
  height: 100vh;
  overflow-x: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &:after {
    background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
    filter: blur(5px);
  }

  p {
    margin: 22px 36px;
    text-align: center;
    font-size: 16px;
    line-height: 20px;
  }
  button {
    padding: 12px 20px;
    background-color: maroon;
    border-radius: 2em;
    outline: none;
    border: none;
  }
`;

export default ProfilePage;
