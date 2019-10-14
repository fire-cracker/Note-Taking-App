const createdNotes = document.querySelector('#listed');
const titleField = document.querySelector('#title-field');
const bodyField = document.querySelector('#body-field');
const editMode = document.querySelector('#edit-mode');
const colorBoxes = document.querySelectorAll('.color-box')
const notepad = document.querySelector('#notepad')

let notes = [];
let activeNoteId = null;

window.onload = function () {
    if (localStorage.getItem('notes') == undefined) {
        localStorage.setItem('notes', JSON.stringify(notes))
    } else {
        notes = JSON.parse(localStorage.getItem('notes'));
        notes.map((note) => {
            if (note != null) {
                let title = createElement("div", { "class": "list-title" }, note.title),
                    date = createElement("div", { "class": "list-date" }, note.date),
                    body = createElement("div", { "class": "list-text" }, note.body),
                    newNoteDiv = createElement("div", { "id": note.noteId, "style": `background:${note.color};` }, [title, date, body]);

                createdNotes.appendChild(newNoteDiv);
            }
        })
        return notes
    }
}

colorBoxes.forEach(function (colorBox) {
    colorBox.addEventListener('click', function addColor(e) {
        let target = e.target;
        let color = getComputedStyle(target).backgroundColor;
        notepad.style.backgroundColor = color;
        titleField.style.backgroundColor = color;
        bodyField.style.backgroundColor = color;
    })
})

function createElement(element, attribute, inner) {
    if (typeof (element) === "undefined") {
        return false;
    }
    if (typeof (inner) === "undefined") {
        inner = "";
    }
    let el = document.createElement(element);
    if (typeof (attribute) === 'object') {
        for (let key in attribute) {
            el.setAttribute(key, attribute[key]);
        }
    }
    if (!Array.isArray(inner)) {
        inner = [inner];
    }
    for (let k = 0; k < inner.length; k++) {
        if (inner[k].tagName) {
            el.appendChild(inner[k]);
        } else {
            el.appendChild(document.createTextNode(inner[k]));
        }
    }
    return el;
}

function addNote(noteId, newTitle, date, newBody, color) {
    const newNote = {
        noteId,
        title: newTitle,
        date,
        body: newBody,
        color
    };

    // Push the new data (whether it be an object or anything else) onto the array
    notes.push(newNote);

    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNote(noteId, newTitle, date, newBody, color) {
    notes = notes.map((note) => {
        if (note.noteId === noteId) {
            const modifiedNote = {
                ...note,
                title: newTitle,
                date,
                body: newBody,
                color
            };
            return modifiedNote;
        }
        else {
            // Push the new data (whether it be an object or anything else) onto the array
            return note;
        }
    });

    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNote() {
    let noteId = "note" + notes.length;
    let newTitle = titleField.value;
    let newBody = bodyField.value;
    if (newTitle === '' && newBody === '') {
        alert('Please add a title or body to your note.');
        return;
    }
    let date = new Date().toLocaleString("en-US");
    let selectedElement = document.querySelector(`#${activeNoteId}`)
    let color = notepad.style.backgroundColor;

    if (activeNoteId) {
        selectedElement.children[0].innerHTML = newTitle;
        selectedElement.children[1].innerHTML = date;
        selectedElement.children[2].innerHTML = newBody;
        selectedElement.style.backgroundColor = color;
        editMode.classList.remove('no-display')
        editMode.classList.add('display');
        updateNote(activeNoteId, newTitle, date, newBody, color)
        activeNoteId = null;
        editMode.classList.remove('display')
        editMode.classList.add('no-display');
    }
    else {
        let titleElement = createElement("div", { "class": "list-title" }, newTitle),
            dateElement = createElement("div", { "class": "list-date" }, date),
            bodyElement = createElement("div", { "class": "list-text" }, newBody),
            newNoteDiv = createElement("div", { "id": noteId, "style": `background:${color};` }, [titleElement, dateElement, bodyElement]);

        createdNotes.appendChild(newNoteDiv);
        addNote(noteId, newTitle, date, newBody, color)
    }

    titleField.value = '';
    bodyField.value = '';
    notepad.style.backgroundColor = 'white';
    titleField.style.backgroundColor = 'white';
    bodyField.style.backgroundColor = 'white';

}

function chooseNote(event) {
    const target = event.target;
    let id = target.parentElement.id;
    let color = target.parentElement.style.backgroundColor;
    activeNoteId = id;
    editMode.classList.remove('no-display')
    editMode.classList.add('display');
    let titleSel = document.querySelector(`#${activeNoteId}`).children[0].innerHTML;
    let bodySel = document.querySelector(`#${activeNoteId}`).children[2].innerHTML;
    titleField.value = titleSel;
    bodyField.value = bodySel;
    notepad.style.backgroundColor = color;
    titleField.style.backgroundColor = color;
    bodyField.style.backgroundColor = color;
}

function deleteNote() {
    if (activeNoteId) {
        document.querySelector(`#${activeNoteId}`).remove();
        notes = notes.filter((note) => note.noteId !== activeNoteId);
        // Re-serialize the array back into a string and store it in localStorage
        localStorage.setItem('notes', JSON.stringify(notes));

        activeNoteId = null;
        editMode.classList.remove('display')
        editMode.classList.add('no-display');
    }
    titleField.value = '';
    bodyField.value = '';
    notepad.style.backgroundColor = 'white';
    titleField.style.backgroundColor = 'white';
    bodyField.style.backgroundColor = 'white';
}