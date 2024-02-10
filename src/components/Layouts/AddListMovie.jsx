import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const MovieList = ({ title, getMovies }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    getMovies((data) => {
      setMovies(data);
    });
  }, [getMovies]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setWait(false);
    }, 1500);
  }, []);

  let settings = {
    slidesToShow: 6,
    slidesToScroll: 6,
    infinite: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
    ],
  };

  return (
    <Container>
      <h3>{title}</h3>
      <Caraousel {...settings}>
        {loading &&
          Array.from({ length: 18 }).map((_, index) => (
            <LoadingWrap key={index}>
              <img src="/images/loading.png" alt="" />
            </LoadingWrap>
          ))}
        {movies.slice(0, 18).map((item) => (
          <Wrap
            style={{
              display: `${wait ? "none" : ""}`,
            }}
            key={item.id}
          >
            <Link to={`/detail/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                alt={item.title}
                onLoad={() => setLoading(false)}
              />
            </Link>
          </Wrap>
        ))}
      </Caraousel>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 0 25px;
`;
const Caraousel = styled(Slider)`
  .slick-list {
    overflow: initial;
  }
  .slick-prev {
    z-index: 1;
  }
  .slick-next {
    z-index: 1;
  }
`;
const Wrap = styled.div`
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border: 3px solid rgba(249, 249, 249, 0.1);
  @media (max-width: 768px) {
    max-width: 160px;
  }
  @media (max-width: 480px) {
    max-width: 115px;
    border: 2px solid rgba(249, 249, 249, 0.1);
  }
  img {
    width: 100%;
    transition: opacity 500ms ease-in-out 0s;
    border-radius: 6px;
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
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border: 3px solid rgba(249, 249, 249, 0.1);
  @media (max-width: 768px) {
    max-width: 160px;
  }
  @media (max-width: 480px) {
    max-width: 115px;
    border: 2px solid rgba(249, 249, 249, 0.1);
  }
  img {
    width: 100%;
    opacity: 0.2;
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

export default MovieList;
