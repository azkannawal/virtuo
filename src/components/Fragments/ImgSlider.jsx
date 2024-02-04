import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNewRelease } from "../../api";

const ImgSlider = (props) => {
  const [newMovie, setNewMovie] = useState([]);
  let settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    pauseOnHover: false,
    autoplaySpeed: 5000,
  };

  useEffect(() => {
    getNewRelease((data) => {
      setNewMovie(data);
    });
  }, []);

  return (
    <Caraousel {...settings}>
      {newMovie.slice(0, 6).map((item) => (
        <Wrap key={item.id}>
          <Link to={`/detail/${item.id}`} className="Link">
            <img
              src={`https://image.tmdb.org/t/p/w1280/${item.backdrop_path}`}
              alt=""
            />
            <h2>
              <span>{`"${item.overview}"`}</span>
            </h2>
          </Link>
        </Wrap>
      ))}
    </Caraousel>
  );
};

const Caraousel = styled(Slider)`
  li.slick-active button:before {
    color: white;
  }
  .slick-list {
    overflow: initial;
  }
  .slick-prev {
    left: -75px;
  }
  .slick-next {
    right: -75px;
  }
`;
const Wrap = styled.div`
  top: 0px;
  position: relative;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;

  .Link {
    cursor: pointer;
    position: relative;
    display: block;
  }

  img {
    width: 100%;
    height: 72vh;
    object-fit: cover;
    position: relative;
    filter: brightness(50%);

    @media (max-width: 768px) {
      height: 60vh;
    }
  }

  h2 {
    position: absolute;
    top: 50%;
    left: 52%;
    transform: translate(-50%, -50%);
    z-index: 1;
    line-height: 1.625;
    text-align: justify;
    color: black;
    width: 75%;
    span {
      padding: 2px;
      background-color: rgb(255, 251, 0, 0.61);
    }
    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }
`;

export default ImgSlider;
