import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import app from "./../config/firebase";
import { getDetailMovie, getTrailer } from "../api";
import { selectUserUID } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { getDatabase, ref, push, child, remove, get } from "firebase/database";
import useLogin from "../hooks/useLogin";
import InputReview from "../components/Fragments/InputReview";
import Loading from "../components/Fragments/Loading";
const database = getDatabase(app);

const DetailPage = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const [trailer, setTrailer] = useState({});
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(true);
  const user = useSelector(selectUserUID);
  const year = new Date(detail.release_date).getFullYear().toString();
  const duration = Math.floor(detail.runtime / 60);
  const remaining = detail.runtime % 60;
  useLogin();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setWait(false);
    }, 1500);
  }, []);

  useEffect(() => {
    getDetailMovie(id, (data) => {
      setDetail(data);
    });
  }, [id]);

  useEffect(() => {
    if (user !== null) {
      const moviesRef = ref(database, `users/${user}/movies`);
      get(moviesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const movies = snapshot.val();
            const onList = Object.values(movies).some(
              (movie) => movie.id === detail.id
            );
            setInList(onList);
          }
        })
        .catch((error) => {
          console.error("Error getting movies from Firebase", error);
        });
    }
  }, [detail.id, user]);

  const handleAddToList = () => {
    if (user !== null) {
      const dataToAdd = {
        id: detail.id,
        poster: detail.poster_path,
        title: detail.title,
      };
      push(ref(database, `users/${user}/movies`), dataToAdd)
        .then(() => {
          console.log("Data added successfully");
          setInList(true);
        })
        .catch((error) => {
          console.error("Error adding data");
        });
    } else {
      console.log("User not authenticated");
    }
  };

  const handleDeleteFromList = () => {
    const moviesRef = ref(database, `users/${user}/movies`);
    if (user !== null) {
      get(moviesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const movies = snapshot.val();
            for (const movieId in movies) {
              if (movies[movieId].id === detail.id) {
                remove(child(moviesRef, movieId))
                  .then(() => {
                    console.log("Movie removed successfully from Firebase");
                    setInList(false);
                  })
                  .catch((error) => {
                    console.error("Error removing from Firebase");
                  });
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error getting movies from Firebase: ");
        });
    }
  };

  useEffect(() => {
    getTrailer(id, (data) => {
      const official = data.results.find(
        (trailer) => trailer.name === "Official Trailer"
      );
      if (official) {
        setTrailer(official);
      } else {
        const otherTrailer = data.results.find((trailer) =>
          trailer.name.toLowerCase().includes("trailer")
        );
        if (otherTrailer) {
          setTrailer(otherTrailer);
        } else {
          setTrailer(null);
        }
      }
    });
  }, [id]);

  const watchTrailer = () => {
    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
  };
  const watchMovie = () => {
    window.open(`${detail.homepage}`, "_blank");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading && <Loading />}
      <Container
        style={{
          display: `${wait ? "none" : "block"}`,
        }}
      >
        <Backdrop>
          <img
            src={`https://image.tmdb.org/t/p/w1280/${detail.backdrop_path}`}
            alt={detail.title}
          />
        </Backdrop>
        <Content>
          <Poster>
            <img
              src={`https://image.tmdb.org/t/p/w500/${detail.poster_path}`}
              alt={detail.title}
            />
          </Poster>
          <Wrap>
            <Title>{detail.title}</Title>
            <Info>
              <span>{`${year}`}</span>
              <span>•</span>
              <span>{`${duration}h ${remaining}m`}</span>
              <span>•</span>
              <span>
                {detail.genres && detail.genres.length > 0 && (
                  <>
                    {detail.genres[0].name}
                    {detail.genres.length > 1 && `, ${detail.genres[1].name}`}
                  </>
                )}
              </span>
            </Info>
            <Controls>
              <Player
                onClick={watchMovie}
                style={{ display: detail.homepage ? "flex" : "none" }}
              >
                <img src="/images/play-icon-black.png" alt="" />
                <span>Watch</span>
              </Player>
              {trailer !== null && (
                <Trailer onClick={watchTrailer}>
                  <img src="/images/play-icon-white.png" alt="" />
                  <span>Trailer</span>
                </Trailer>
              )}
              {inList ? (
                <AddList
                  onClick={handleDeleteFromList}
                  style={{ backgroundColor: "#0063e5" }}
                >
                  <img src="/images/watchlist.png" alt="watchlist" />
                </AddList>
              ) : (
                <AddList onClick={handleAddToList}>
                  <img src="/images/watchlist.png" alt="watchlist" />
                </AddList>
              )}
            </Controls>
            <Description>{detail.overview}</Description>
            <InputReview />
          </Wrap>
        </Content>
      </Container>
    </div>
  );
};

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 84px calc(4.5vw + 5px) 0;
  margin: 0px 0px;
`;
const Backdrop = styled.div`
  left: 0px;
  opacity: 0.2;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;

  img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    @media (max-width: 768px) {
      width: initial;
    }
  }
`;
const Content = styled.div`
  display: flex;
  gap: 3em;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;
const Poster = styled.div`
  min-height: 170px;
  img {
    max-width: 350px;
    min-width: 200px;
    border-radius: 8px;
    box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
      rgb(0 0 0 / 73%) 0px 16px 10px -10px;
    border: 3px solid rgba(249, 249, 249, 0.1);
  }
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    padding-bottom: 24px;
    img {
      max-width: 220px;
    }
  }
`;
const Wrap = styled.div`
  position: relative;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  font-weight: bold;
  color: rgb(249, 249, 249);
  font-size: 44px;
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;
const Info = styled.p`
  display: flex;
  margin: 8px 0 16px;
  span {
    font-size: 20px;
    margin: 0 8px 0 0;
    color: rgb(249, 249, 249);
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;
const Controls = styled.div`
  display: flex;
  flex-flow: row wrap;
  min-height: 56px;
  align-items: center;
  gap: 1em;
`;
const Player = styled.button`
  display: flex;
  height: 48px;
  font-size: 16px;
  padding: 0px 12px;
  border: none;
  outline: none;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgb(249, 249, 249);
  color: rgb(0, 0, 0);
  cursor: pointer;
  transition: all 250ms;

  img {
    width: 32px;
    margin: 0 8px 0 0;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }

  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;

    img {
      width: 25px;
    }
  }
`;
const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;
const AddList = styled.button`
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  border: 1px solid white;
  cursor: pointer;
  transform: scale(1.1);
  transition: all 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;

  img {
    width: 70%;
  }
`;
const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  margin: 16px 0px 0px 0px;
  color: rgb(249, 249, 249);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export default DetailPage;
