import styled from "styled-components";
import ImgSlider from "./../components/Fragments/ImgSlider";
import MovieList from "../components/Layouts/AddListMovie";
import { getNewRelease, getPopular, getTopRated} from "../api";

const HomePage = () => {
  return (
    <Container>
      <ImgSlider />
      <Wrap>
        <MovieList title="New Releases" getMovies={getNewRelease} />
        <MovieList title="Popular" getMovies={getPopular} />
        <MovieList title="Top Rated" getMovies={getTopRated} />
      </Wrap>
    </Container>
  );
};

const Container = styled.main`
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  position: relative;

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

const Wrap = styled.main`
  padding: 0 calc(3.5vw + 5px);
`;
export default HomePage;
