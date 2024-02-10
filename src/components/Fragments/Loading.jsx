import styled from "styled-components";

const Loading = () => {
  return (
    <Container>
      <img src="/images/virtuo.svg" alt="" />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  img {
    max-width: 150px;
  }
  animation: loading 1.3s infinite;

  @keyframes loading {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

export default Loading;
