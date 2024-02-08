import React, { useEffect, useState } from "react";
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

const InputTracked = () => {
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

  const handleReview = () => {
    if (review) {
      setReview(false);
    } else {
      setReview(true);
    }
  };

  useEffect(() => {
    getRating(session, (data) => {
      const ratingWithId = data.find((item) => item.id == id);
      setShowRating(ratingWithId);
      setRatingUpdated(false);
      console.log(ratingWithId);
    });
  }, [ratingUpdated]);

  const handleAddRating = async () => {
    await postRating(id, rating, session);
    getRating(session, (data) => {
      setRatingUpdated(true);
      const ratingWithId = data.find((item) => item.id === id);
      setShowRating(ratingWithId);
    });
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

  return (
    <div>
      {review ? (
        <Wrap>
          <button onClick={handleReview}>Close</button>
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
                    size={50}
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
              <input
                type="text"
                placeholder="Write your note"
                value={note}
                onChange={handleInputChange}
              />
              <button onClick={handleSave}>Save</button>
            </>
          )}
          {editing && (
            <>
              <input
                type="text"
                placeholder="Edit your note"
                value={note}
                onChange={handleInputChange}
              />
              <button onClick={handleSave}>Update</button>
            </>
          )}
        </Wrap>
      ) : (
        <>
          {showRating && <div>{showRating.rating}</div>}
          {existNote.map((item) => (
            <div key={item.id}>
              <p>{item.note}</p>
              <button onClick={() => handleEdit(item.id)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          ))}
          {existNote.length === 0 && (
            <button onClick={handleReview}>Add Review</button>
          )}
        </>
      )}
    </div>
  );
};

const Wrap = styled.div`
  background: black;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const StarRatingDiv = styled.div`
  .star,
  .activeStar {
    cursor: pointer;
    float: left;
    height: 50px;
    width: 50px;
    background: url("/images/original-icon.svg");
    background-repeat: no-repeat;
    background-size: 100%;
    filter: invert(100%) sepia(3%) saturate(123%) hue-rotate(60deg)
      brightness(115%) contrast(84%);
  }
  .activeStar {
    filter: invert(80%) sepia(59%) saturate(2087%) hue-rotate(352deg)
      brightness(107%) contrast(109%);
  }
  input[type="radio"] {
    display: none;
  }
`;

export default InputTracked;
