import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, provider } from "../config/firebase";
import { selectUserName, setGuestSessionId } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getGuest } from "../api";
import Loading from "../components/Fragments/Loading";

const LoginPage = () => {
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        navigate("/home");
      }
    });
  }, [userName]);

  const handleAuth = async () => {
    if (!userName) {
      try {
        await signInWithPopup(auth, provider).then(() => {
          navigate("/home");
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSession = () => {
    const guestSessionId = localStorage.getItem("guestSessionId");
    if (!guestSessionId) {
      getGuest((data) => {
        dispatch(setGuestSessionId(data.guest_session_id));
        localStorage.setItem("guestSessionId", data.guest_session_id);
      });
    }
  };

  useEffect(() => {
    const storedGuestSessionId = localStorage.getItem("guestSessionId");
    if (storedGuestSessionId) {
      dispatch(setGuestSessionId(storedGuestSessionId));
    }
  }, []);

  const handleAll = () => {
    handleAuth();
    handleSession();
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setWait(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Container
        style={{
          display: `${wait ? "none" : "block"}`,
        }}
      >
        <Content>
          <Wrap>
            <Logo src="/images/virtuotext.svg" alt="" />
            <Description>
              {" "}
              Rate films you’ve watched. Save those you want to see. Keep a
              review of your film watching.
            </Description>
            <Button onClick={handleAll}>GET STARTED</Button>
            <Provider src="/images/movieprovider.png" alt="" />
          </Wrap>
          <Backdrop />
        </Content>
      </Container>
    </>
  );
};

const Container = styled.section`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100vh;
`;
const Content = styled.div`
  width: 100%;
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 80px 40px;
  height: 100%;
`;
const Backdrop = styled.div`
  height: 100%;
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("/images/login-background.jpg");
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
`;
const Wrap = styled.div`
  max-width: 750px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  transition-timing-function: ease-out;
  transition: opacity 0.2s;
  width: 100%;
`;
const Logo = styled.img`
  margin: 0 0 12px;
  max-width: 660px;
  width: 100%;
`;
const Provider = styled.img`
  margin: 0;
  max-width: 650px;
  width: 100%;
`;
const Button = styled.a`
  max-width: 650px;
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  margin-bottom: 12px;
  width: 100%;
  font-size: 16px;
  padding: 16.5px 0;
  border-radius: 40px;

  &:hover {
    background-color: #0483ee;
  }
`;
const Description = styled.p`
  max-width: 800px;
  color: hsla(0, 0%, 95.3%, 1);
  font-size: 18px;
  margin: 0 0 24px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 12px;
    max-width: 650px;
  }
`;

export default LoginPage;
