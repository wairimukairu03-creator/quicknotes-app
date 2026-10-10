const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all-btn");

let notes = JSON.parse(localStorage.getItem("quickNotes")) || [];

function saveNotesToLocalStorage() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function updateNoteCount(filteredCount) {
  if (filteredCount === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (filteredCount === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${filteredCount} notes.`;
  }
}

function render(searchTerm = "") {
  notesList.textContent = "";

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  filteredNotes.forEach((note) => {
    const li = document.createElement("li");

    li.classList.add("note-card", `category-${note.category}`);

    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("note-content-wrapper");

    const pText = document.createElement("p");
    pText.textContent = note.text;

    const pDate = document.createElement("span");
    pDate.classList.add("note-date");
    pDate.textContent = `Created: ${note.createdAt}`;

    contentWrapper.appendChild(pText);
    contentWrapper.appendChild(pDate);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
      deleteNote(note.id);
    });

    li.appendChild(contentWrapper);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });

  updateNoteCount(filteredNotes.length);
}

function addNote(text, category) {
  if (text.trim() === "") {
    errorMessage.textContent = "Please type a note first.";
    return false;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return false;
  }

  errorMessage.textContent = "";

  const newNote = {
    id: Date.now().toString(),
    text: text.trim(),
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);
  saveNotesToLocalStorage();
  render(searchInput.value);
  return true;
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotesToLocalStorage();
  render(searchInput.value);
}

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const success = addNote(noteInput.value, noteCategory.value);
  if (success) {
    noteInput.value = "";
  }
});

clearAllBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Delete all notes?");
  if (confirmDelete) {
    notes = [];
    saveNotesToLocalStorage();
    render(searchInput.value);
  }
});

searchInput.addEventListener("input", (e) => {
  render(e.target.value);
});

render();
