import { Link } from "react-router-dom";
import styled from "styled-components";

const NotFoundPage = () => {
  return (
    <Container>
      <h1>Lost your way?</h1>
      <p>Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
      <Link to="/"><Home>Home</Home></Link>
    </Container>
  );
};

const Container = styled.main`
  height: 100vh;
  overflow-x: hidden;
  display: block;
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

  h1{
    margin: 0;
  }

  p{
    margin: 22px 36px;
    text-align: center;
    font-size: 16px;
    line-height: 20px;
  }
`;
const Home = styled.div`
  padding: 6px 12px;
  border-radius: 4px;
  background-color: rgba(4, 7, 20, 0.97);
  font-size: 16px;
`

export default NotFoundPage;
