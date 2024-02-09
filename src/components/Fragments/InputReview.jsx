import "./index.css";
import { useEffect, useState } from "react";
import {
  selectGuestSessionId,
  selectUserUID,
} from "../../features/user/userSlice";
import { useSelector } from "react-redux";
import app from "../../config/firebase";
import { get, getDatabase, ref, set } from "firebase/database";
import { deleteRating, getDetailMovie, getRating, postRating } from "../../api";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";
const database = getDatabase(app);

const InputReview = () => {
  const { id } = useParams();
  const user = useSelector(selectUserUID);
  const session = useSelector(selectGuestSessionId);
  const [detail, setDetail] = useState({});
  const [note, setNote] = useState("");
  const [existNote, setExistNote] = useState([]);
  const [editing, setEditing] = useState(false);
  const [review, setReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState({});
  const [ratingUpdated, setRatingUpdated] = useState(false);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    getDetailMovie(id, (data) => {
      setDetail(data);
    });
  }, [id]);

  useEffect(() => {
    if (user && detail.id) {
      const path = ref(database, `users/${user}/notes`);
      get(path)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const object = snapshot.val();
            const child = Object.values(object);
            const archive = child.find((data) => data.id === detail.id);
            if (archive) {
              setExistNote([archive]);
              console.log(archive);
            } else {
              setExistNote([]);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
        });
    }
  }, [user, detail.id]);

  const submitTracked = () => {
    if (user) {
      const objectData = {
        id: detail.id,
        poster: detail.poster_path,
        title: detail.title,
        note: note,
      };
      const index = existNote.findIndex((data) => data.id === detail.id);
      if (index !== -1) {
        const updatedNotes = [...existNote];
        updatedNotes[index] = objectData;
        setExistNote(updatedNotes);
      } else {
        setExistNote([...existNote, objectData]);
      }
      const path = ref(database, `users/${user}/notes/${detail.id}`);
      set(path, objectData)
        .then(() => {
          console.log("Success");
          setNote("");
          setEditing(false);
        })
        .catch((error) => {
          console.error("Error adding note:", error);
        });
    }
  };

  const handleInputChange = (event) => {
    setNote(event.target.value);
  };

  const handleEdit = (id) => {
    const toEdit = existNote.find((note) => note.id === id);
    if (toEdit) {
      setNote(toEdit.note);
      setEditing(true);
    }
    setReview(true);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = existNote.filter((note) => note.id !== id);
    setExistNote(updatedNotes);

    const path = ref(database, `users/${user}/notes/${id}`);
    set(path, null)
      .then(() => {
        console.log("Note deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  useEffect(() => {
    getRating(session, (data) => {
      const ratingWithId = data.find((item) => item.id == id);
      setRatingUpdated(false);
    });
  }, [ratingUpdated]);

  const handleAddRating = async () => {
    await postRating(id, rating, session);
    getRating(session, (data) => {
      const ratingWithId = data.find((item) => item.id === id);
      setShowRating(ratingWithId);
      setRatingUpdated(true);
    });
    setRating(0);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleDeleteRating = async () => {
    await deleteRating(id, session);
    getRating(session, (data) => {
      const ratingWithId = data.find((item) => item.id === id);
      setShowRating(ratingWithId);
      setRatingUpdated(true);
    });
  };

  const handleSave = () => {
    handleAddRating();
    submitTracked();
    setReview(false);
  };

  const handleDelete = (id) => {
    handleDeleteRating();
    handleDeleteNote(id);
    setReview(false);
  };

  const handleReview = () => {
    if (review) {
      setReview(false);
    } else {
      setReview(true);
    }
  };

  return (
    <Container>
      {review ? (
        <Wrap>
          <StarRatingDiv>
            {[...Array(10)].map((Star, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    onChange={handleRatingChange}
                  />
                  <div
                    id="star"
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                    className={
                      ratingValue <= (hover || rating) ? "activeStar" : "star"
                    }
                  ></div>
                </label>
              );
            })}
          </StarRatingDiv>
          {!editing && existNote.length === 0 && (
            <>
              <textarea
                rows={5}
                placeholder="Write your review"
                value={note}
                onChange={handleInputChange}
              />
              <Control>
                <Button onClick={handleSave}>Save</Button>
                <DeleteButton onClick={handleReview}>Close</DeleteButton>
              </Control>
            </>
          )}
          {editing && (
            <>
              <textarea
                rows={5}
                placeholder="Edit your review"
                value={note}
                onChange={handleInputChange}
              />
              <Control>
                <Button onClick={handleSave}>Update</Button>
                <DeleteButton onClick={handleReview}>Close</DeleteButton>
              </Control>
            </>
          )}
        </Wrap>
      ) : (
        <>
          {existNote.map((item) => (
            <Wrap key={item.id}>
              <Rating>
                <Note>Rating:</Note>
                {showRating && (
                  <StarRatingDiv>
                    {[...Array(showRating.rating)].map((_, i) => {
                      return (
                        <label key={i}>
                          <div id="star" className="activeStar"></div>
                        </label>
                      );
                    })}
                  </StarRatingDiv>
                )}
                {!showRating && (
                  <NoStarRatingDiv>
                    {[...Array(10)].map((_, i) => {
                      return (
                        <label key={i}>
                          <div id="star" className="star"></div>
                        </label>
                      );
                    })}
                  </NoStarRatingDiv>
                )}
              </Rating>
              <Note>Review:</Note>
              <Note>{item.note ? item.note : "No note "}</Note>
              <Control>
                <Button onClick={() => handleEdit(item.id)}>Edit</Button>
                <DeleteButton onClick={() => handleDelete(item.id)}>
                  Delete
                </DeleteButton>
              </Control>
            </Wrap>
          ))}
          {existNote.length === 0 && (
            <ReviewButton onClick={handleReview}>Add Review</ReviewButton>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin: 16px 0px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;
const Wrap = styled.div`
  background-color: rgba(0, 99, 229, 0.7);
  padding: 8px 12px;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;
const Control = styled.div`
  gap: 12px;
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px;
`;
const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Note = styled.p`
  font-size: 20px;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
const Button = styled.button`
  padding: 12px 20px;
  background-color: rgba(0, 0, 0);
  border-radius: 2em;
  outline: none;
  border: none;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
const DeleteButton = styled(Button)`
  background-color: maroon;
`;
const ReviewButton = styled(Button)`
  background-color: rgba(0, 99, 229);
`;
const StarRatingDiv = styled.div`
  .star,
  .activeStar {
    cursor: pointer;
    float: left;
    height: 35px;
    width: 35px;
    background: url("/images/original-icon.svg");
    background-repeat: no-repeat;
    background-size: 100%;
    filter: invert(100%) sepia(3%) saturate(123%) hue-rotate(60deg)
      brightness(115%) contrast(84%);
    @media (max-width: 768px) {
      height: 24px;
      width: 24px;
    }
    @media (max-width: 480px) {
      height: 18px;
      width: 18px;
    }
  }
  .activeStar {
    filter: invert(0%) sepia(0%) saturate(5000%) hue-rotate(354deg)
      brightness(104%) contrast(150%);
  }
  input[type="radio"] {
    display: none;
  }
`;
const NoStarRatingDiv = styled(StarRatingDiv)`
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

export default InputReview;
