let tagsObj = JSON.parse(localStorage.getItem('tags'));

const addBtn = document.querySelector('.header__add-button');

let storedNotes = localStorage.getItem('notes');
if(storedNotes){
    let notesObject = JSON.parse(storedNotes);
    for(let i = 0; i < notesObject.titles.length; i++){
        createNewNote(notesObject.titles[i], notesObject.texts[i], notesObject.tags[i])
    }
}

addBtn.addEventListener('click', createNewNote);
function createNewNote(title="", text="", tag="default") {
    const note = document.createElement('div');
    note.classList.add('note');
    note.innerHTML = 
    `<div class="note__header">
        <input placeholder="Add A Title" class="note__title">
        <div class="note__buttons">
            <i class="ri-edit-box-line note__edit-button"></i>
            <i class="ri-check-fill note__check-button hidden"></i>
            <i class="ri-delete-bin-fill note__delete-button"></i>
        </div>
    </div>
    <div class="note__body">
        <div class="note__text"></div>
        <div class="note__edit-tag hidden">
            <select class="note__tag-select">
                <option disabled selected hidden="true">Select A Tag</option>
            </select>
            <i class="ri-check-fill note__tag-save"></i>
        </div>
        <i class="ri-price-tag-3-fill note__tag-icon" data-tag=""></i>
    </div>
    <textarea class="note__body hidden"></textarea>`;

    const noteTitle = note.querySelector('.note__title');
    const editBtn = note.querySelector('.note__edit-button');
    const checkBtn = note.querySelector('.note__check-button');
    const deleteBtn = note.querySelector('.note__delete-button');
    
    const noteBody = note.querySelector('.note__body');
    const noteText = note.querySelector('.note__text');
    const textareaEl = note.querySelector('textarea');

    noteTitle.addEventListener('input', saveNotesInLS);

    editBtn.addEventListener('click', () => {
        checkBtn.classList.remove('hidden');
        editBtn.classList.add('hidden');
        textareaEl.classList.remove('hidden');
        textareaEl.focus();
        noteBody.classList.add('hidden');
    });

    checkBtn.addEventListener('click', () => {
        checkBtn.classList.add('hidden');
        editBtn.classList.remove('hidden');
        textareaEl.classList.add('hidden');
        noteBody.classList.remove('hidden');

        noteText.innerHTML = marked.parse(textareaEl.value);
        saveNotesInLS();
    });

    deleteBtn.addEventListener('click', () =>{ 
        note.remove();
        saveNotesInLS();
    });

    const noteTag = note.querySelector('.note__tag-icon');
    const saveTagBtn = note.querySelector('.note__tag-save');
    const noteTagSelect = note.querySelector('.note__tag-select');

    noteTag.addEventListener('click', () =>{
        noteTag.previousElementSibling.classList.remove('hidden');

        getTagsFromLocalStorage();
        for(let key in tagsObj){
            noteTagSelect.innerHTML += 
            `<option>${key}</option>`;
        }
        noteTagSelect.addEventListener('change', (e) =>{
            updateNoteColor(tagsObj[e.target.value]);
            noteTag.setAttribute('data-tag', e.target.value);
        });
    });

    saveTagBtn.addEventListener('click', () =>{
        getTagsFromLocalStorage();

        let currentTagColorValue = noteTag.getAttribute('style').replace('color: ', '');
        let currentTagKey = Object.keys(tagsObj).find(key => tagsObj[key] === currentTagColorValue);
        
        if(currentTagKey == 'default'){
            noteTagSelect.innerHTML = 
            `<select class="note__tag-select">
                <option disabled selected hidden="true">Select A Tag</option>
            </select>`;
        } else{
            noteTagSelect.innerHTML = 
            `<select class="note__tag-select">
                <option disabled selected hidden="true">${currentTagKey} is selected</option>
            </select>`;
        }
        note.querySelector('.note__edit-tag').classList.add('hidden');

        saveNotesInLS();
    });

    textareaEl.addEventListener('keydown', (ev) =>{
        // some key to finish the edit instantly
    });
    
    getTagsFromLocalStorage();
    updateNoteColor(tagsObj[tag]);

    function updateNoteColor(color){
        getTagsFromLocalStorage();
        let colorValue = Object.values(tagsObj).find(value => value === color);
        note.querySelector('.note__header').setAttribute('style', `background: ${colorValue};`);
        note.querySelector('.note__title').setAttribute('style', `background: ${colorValue};`);
        noteTag.setAttribute('style', `color: ${colorValue}`);
        saveTagBtn.setAttribute('style', `color: ${colorValue};`);
    }

    // using the function parameters
    noteTitle.value = title;
    noteTitle.value.includes('[object') ? noteTitle.value = '' : noteTitle.value = title
    textareaEl.value = text;
    noteText.innerHTML = marked.parse(textareaEl.value);
    noteTag.setAttribute('data-tag', tag);

    // giving a first title to the note
    document.querySelector('main').appendChild(note); // apending to the document
    saveNotesInLS();
}

function saveNotesInLS(){
    const notes = document.querySelectorAll('.note');

    let noteTitles = [], noteTexts = [], noteTags = []
    notes.forEach(note =>{
        noteTitles.push(note.querySelector('.note__title').value);
        noteTexts.push(note.querySelector('textarea').value);
        noteTags.push(note.querySelector('.note__tag-icon').getAttribute('data-tag'));
    });

    let notesObj = {
        titles: noteTitles,
        texts: noteTexts,
        tags: noteTags
    }

    localStorage.setItem('notes', JSON.stringify(notesObj));
}

function getTagsFromLocalStorage(){
    tagsObj = JSON.parse(localStorage.getItem('tags'));
}