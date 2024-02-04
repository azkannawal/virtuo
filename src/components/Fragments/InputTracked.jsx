import React, { useEffect, useState } from "react";
import { selectUserUID } from "../../features/user/userSlice";
import { useSelector } from "react-redux";
import app from "../../config/firebase";
import { get, getDatabase, ref, set} from "firebase/database";
import { getDetailMovie } from "../../api";
import { useParams } from "react-router-dom";

const database = getDatabase(app);

const InputTracked = () => {
  const { id } = useParams();
  const user = useSelector(selectUserUID);
  const [detail, setDetail] = useState({});
  const [note, setNote] = useState(""); // State to hold the note input
  const [existNote, setExistNote] = useState([]); // State to hold existing notes
  const [editing, setEditing] = useState(false); // State to track editing mode

  useEffect(() => {
    getDetailMovie(id, (data) => {
      setDetail(data);
    });
  }, [id]);

  useEffect(() => {
    if (user && detail.id) {
      const notesRef = ref(database, `users/${user}/notes`);
      get(notesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const notesData = snapshot.val();
            const notesObject = Object.values(notesData);
            const specificNote = notesObject.find(
              (note) => note.id === detail.id
            );
            if (specificNote) {
              setExistNote([specificNote]);
              console.log(specificNote);
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
      if (note.trim() !== "") {
        const noteData = {
          id: detail.id,
          poster: detail.poster_path,
          title: detail.title,
          note: note,
        };
        const noteIndex = existNote.findIndex((n) => n.id === detail.id);
        if (noteIndex !== -1) {
          // Update existing note
          const updatedNotes = [...existNote];
          updatedNotes[noteIndex] = noteData;
          setExistNote(updatedNotes);
        } else {
          // Add new note
          setExistNote([...existNote, noteData]);
        }

        const noteRef = ref(database, `users/${user}/notes/${detail.id}`);
        set(noteRef, noteData)
          .then(() => {
            console.log("Note added successfully");
            setNote(""); // Clear the input field after submitting
            setEditing(false); // Exit editing mode after saving
          })
          .catch((error) => {
            console.error("Error adding note:", error);
          });
      }
    }
  };

  const handleInputChange = (event) => {
    setNote(event.target.value);
  };

  const handleEdit = (id) => {
    const noteToEdit = existNote.find((note) => note.id === id);
    if (noteToEdit) {
      setNote(noteToEdit.note);
      setEditing(true);
    }
  };

  const handleDelete = (id) => {
    const updatedNotes = existNote.filter((note) => note.id !== id);
    setExistNote(updatedNotes);

    const noteRef = ref(database, `users/${user}/notes/${id}`);
    set(noteRef, null) // Remove note from database
      .then(() => {
        console.log("Note deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  return (
    <div>
      {existNote.map((item) => (
        <div key={item.id}>
          <p>{item.note}</p>
          <button onClick={() => handleEdit(item.id)}>Edit</button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
      {!editing && existNote.length === 0 && (
        <>
          <input
            type="text"
            placeholder="Write your note"
            value={note}
            onChange={handleInputChange}
          />
          <button onClick={submitTracked}>Save</button>
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
          <button onClick={submitTracked}>Update</button>
        </>
      )}
    </div>
  );
};

export default InputTracked;
