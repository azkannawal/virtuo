import { Link } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useLogin from "../hooks/useLogin";

const ResultPage = () => {
  const [movie, setMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(true);
  const searchResult = useSelector((state) => state.search.searchResult) || {
    results: [],
  };
  useLogin();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setWait(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const filteredMovies = searchResult.results.filter(
      (item) => item.poster_path && item.backdrop_path && item.overview
    );
    if (!arraysAreEqual(filteredMovies, movie)) {
      setMovie(filteredMovies);
    }
  }, [searchResult, movie]);

  function arraysAreEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  return (
    <Container>
      <h3>Results</h3>
      {loading && (
        <Content>
          {Array.from({ length: 12 }).map((_, index) => (
            <LoadingWrap key={index}>
              <img src="/images/loading.png" alt="" />
            </LoadingWrap>
          ))}
        </Content>
      )}
      <Content
        style={{
          display: `${wait ? "none" : ""}`,
        }}
      >
        {movie.length === 0 ? (
          <p>No matching results found.</p>
        ) : (
          <>
            {movie.slice(0, 12).map((item) => (
              <Wrap key={item.id}>
                <Link to={`/detail/${item.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                    alt={item.title}
                  />
                </Link>
              </Wrap>
            ))}
          </>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  overflow-x: hidden;
  display: block;
  position: relative;
  padding: 60px calc(3.5vw + 5px) 10px;
  min-height: 100vh;
  height: 100%;

  &:after {
    background: url("/images/home-background.png") center center / cover
      no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;
const Content = styled.div`
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
const Wrap = styled.div`
  border-radius: 8px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  cursor: pointer;
  overflow: hidden;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border: 3px solid rgba(249, 249, 249, 0.1);
  img {
    height: 100%;
    width: 100%;
    opacity: 1;
    transition: opacity 500ms ease-in-out 0s;
    z-index: 1;
  }
  &:hover {
    box-shadow: rgb(0 0 0 / 80%) 0px 40px 58px -16px,
      rgb(0 0 0 / 72%) 0px 30px 22px -10px;
    transform: scale(1.05);
    border-color: rgba(249, 249, 249, 0.8);
  }
`;
const LoadingWrap = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  overflow: hidden;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border: 3px solid rgba(249, 249, 249, 0.1);
  img {
    width: 100%;
    opacity: 0.2;
    height: 100%;
    transition: opacity 500ms ease-in-out 0s;
    border-radius: 6px;
  }
  animation: loading 1.5s infinite;
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

export default ResultPage;
