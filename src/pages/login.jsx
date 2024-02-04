import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth, provider } from "../config/firebase";
import { selectUserName } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        navigate("/home");
      }
    });
  }, [userName]);

  const handleAuth = async () => {
    try {
      await signInWithPopup(auth, provider).then((result) => {
        result.user;
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Content>
        <CTA>
          <CTALogoOne src="/images/virtuotext.svg" alt="" />
          <Description>
            {" "}
            Track films you’ve watched. Save those you want to see. Keep a diary
            of your film watching.
          </Description>
          <SignUp onClick={handleAuth}>GET STARTED</SignUp>
          <CTALogoTwo src="/images/movieprovider.png" alt="" />
        </CTA>
        <BgImage />
      </Content>
    </Container>
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
const BgImage = styled.div`
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
const CTA = styled.div`
  max-width: 750px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  transition-timing-function: ease-out;
  transition: opacity 0.2s;
  width: 100%;
`;
const CTALogoOne = styled.img`
  margin: 0 0 12px;
  max-width: 660px;
  width: 100%;
`;
const CTALogoTwo = styled.img`
  margin: 0;
  max-width: 650px;
  width: 100%;
`;
const SignUp = styled.a`
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
  max-width: 650px;
  color: hsla(0, 0%, 95.3%, 1);
  font-size: 14px;
  margin: 0 0 12px;
  line-height: 1.5;
`;

export default LoginPage;
