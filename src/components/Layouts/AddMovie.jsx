import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { selectUserUID } from "./../../features/user/userSlice";
import app from "./../../config/firebase";

const AddMovie = ({ path, title }) => {
  const [movies, setMovies] = useState([]);
  const user = useSelector(selectUserUID);
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setWait(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const db = getDatabase(app);
    const movieRef = ref(db, `users/${user}/${path}`);

    const fetchMovies = onValue(movieRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const movieList = Object.values(data);
        setMovies(movieList);
      } else {
        setMovies([]);
      }
    });

    return () => {
      fetchMovies();
    };
  }, [path]);

  return (
    <Container>
      <h3>{movies.length === 0 ? `${title}: Not Found` : `${title}`}</h3>
      {loading && (
        <Content>
          {Array.from({ length: movies.length || 1 }).map((_, index) => (
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
        {movies.length === 0 ? (
          <Notfound>
            <img src="/images/loading.png" alt="" />
          </Notfound>
        ) : (
          movies
            .slice()
            .reverse()
            .map((item) => (
              <Wrap key={item.id}>
                <Link to={`/detail/${item.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${item.poster}`}
                    alt={item.title}
                  />
                </Link>
              </Wrap>
            ))
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 75px calc(3.5vw + 5px);
  min-height: 100vh;
  height: 100%;
  overflow-x: hidden;
  display: block;
  position: relative;

  &:after {
    background: url("/images/home-background.png") center center / cover repeat
      fixed;
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
const Notfound = styled(LoadingWrap)``

export default AddMovie;
