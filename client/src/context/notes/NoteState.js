import noteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // get a note
  const getNotes = async () => {
     // API call
     const response = await fetch(
      `${host}/api/notes/fetchallnotes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        }
      }
    );
    const json = await response.json();
    console.log(json)
    setNotes(json)
  };
  // Add a note
  const addNote = async (title, description, tag) => {
     // API call
     const response = await fetch(
      `${host}/api/notes/addnote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":  localStorage.getItem('token'),
        },
        body: JSON.stringify({title, description, tag}),
      }
    );
    const note = await response.json();
    setNotes(notes.concat(note));
  };
  // delete a note
  const deleteNote = async (id) => {
    // API call
    const response = await fetch(
      `${host}/api/notes/deletenote/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token":  localStorage.getItem('token'),
        }
      }
    );
    const json = response.json();
    console.log(json)
    // Deleting note
    console.log("Deleting the note with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };
  // edit a note
  const editNote = async (id, title, description, tag) => {
    // API call
    const response = await fetch(
      `${host}/api/notes/updatenote/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token":  localStorage.getItem('token'),
        },
        body: JSON.stringify({title, description, tag}),
      }
    );
    const json = await response.json();
    console.log(json)

    let newNotes = JSON.parse(JSON.stringify(notes))
    // logic to edit a note
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes)
  };

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes}}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
