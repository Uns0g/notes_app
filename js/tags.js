let tags = { default: 'var(--primary)' } // initial value of the tags obj
let storedTags = JSON.parse(localStorage.getItem('tags')) ? JSON.parse(localStorage.getItem('tags')) : '';
let oldTagKey = '';

const tagsGrid = document.getElementById('tags__grid');
const addTagBtn = document.getElementById('tag__add');
const firstTagBox = document.querySelector('.tag__box:first-of-type');
firstTagBox.firstElementChild.setAttribute('style', `color: ${tags.default}`);
setClickListener(firstTagBox);

const tagForm = document.getElementById('form-tag');
const formNameInput = tagForm.querySelector('#form-tag__name-input');
const formColorInput = tagForm.querySelector('#form-tag__color-input');

// gathering data from localStorage
if (localStorage.getItem('tags')) {
    fillStoredTags();
    storedTags = JSON.parse(localStorage.getItem('tags'));
    for (let key in storedTags) {
        addTag(key, storedTags[key]);
    }
    firstTagBox.remove();
}

addTagBtn.addEventListener('click', () => {
    cleanScreen();
    tagForm.parentElement.classList.remove('hidden');

    formNameInput.value = '';
    formColorInput.value = '';
    formNameInput.focus();
});

tagForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fillStoredTags();
    if (Object.keys(storedTags).find(key => key == oldTagKey)) {
        editTag(storedTags);
    } else {
        addTag(formNameInput.value.toLowerCase(), formColorInput.value.toLowerCase());
    }

    tagForm.parentElement.classList.add('hidden');

    removeColorValuesInForm();

    oldTagKey = '';
});

function removeColorValuesInForm() {
    formNameInput.value = '';
    formColorInput.value = '';
    formNameInput.previousElementSibling.removeAttribute('style');
    formColorInput.previousElementSibling.removeAttribute('style');
}

formColorInput.addEventListener('input', paintBoxAndTagElements);

function paintBoxAndTagElements() {
    formNameInput.previousElementSibling.setAttribute('style', `color: ${formColorInput.value}`);
    formColorInput.previousElementSibling.setAttribute('style', `background: ${formColorInput.value}`);
}

function addTag(key, value) {
    tags[key] = value;
    saveTagsInLS();

    tagsGrid.insertAdjacentElement("beforeend", firstTagBox.cloneNode(true));
    let lastTagBox = document.querySelector('.tag__box:last-of-type');
    lastTagBox.firstElementChild.setAttribute('style', `color: ${value}`);
    setClickListener(lastTagBox);
}

function editTag(storedTagsObject) {
    storedTagsObject[oldTagKey] = formColorInput.value;

    let newTagKey = formNameInput.value.toLowerCase();

    let allTagBoxes = document.querySelectorAll('.tag__box');
    allTagBoxes.forEach(tagBox => {
        if (tagBox.firstElementChild.getAttribute('style').replace('color: ', '') == tags[oldTagKey]) { // tags[oldTagKey] is the old value
            delete tags[oldTagKey];
            tags[newTagKey] = formColorInput.value.toLowerCase();
            changeTagInNote();

            tagBox.firstElementChild.setAttribute('style', `color: ${tags[newTagKey]}`);
        }
    });

    saveTagsInLS();
}

function setClickListener(tagBox) {
    tagBox.addEventListener('click', () => {
        // hiding the filter menu
        filterMenu.classList.add('hidden');
        filterMenu.innerHTML = '';

        tagBox.lastElementChild.classList.toggle('hidden');

        const editTagBoxBtn = tagBox.querySelector('.tag__item:first-of-type');
        const deleteTagBoxBtn = tagBox.querySelector('.tag__item:last-of-type');

        let tagBoxColorValue = tagBox.firstElementChild.getAttribute('style').replace('color: ', '');
        editTagBoxBtn.addEventListener('click', () => { // not exactly an edit
            tagBox.lastElementChild.classList.remove('hidden'); // hiding the menu 

            tagForm.parentElement.classList.remove('hidden'); // showing the form

            formNameInput.value = Object.keys(tags).find(key => tags[key] === tagBoxColorValue);
            formColorInput.value = Object.values(tags).find(value => value === tags[formNameInput.value]);

            paintBoxAndTagElements();
            oldTagKey = formNameInput.value;
        });
        deleteTagBoxBtn.addEventListener('click', () => {
            let keyToBeDeleted = Object.keys(tags).find(key => tags[key] === tagBoxColorValue);
            delete tags[keyToBeDeleted];
            saveTagsInLS();
            tagBox.remove();
        });
    });
}

function changeTagInNote() {
    const allNotes = document.querySelectorAll('.note');
    allNotes.forEach(note =>{
        let noteTagIcon = note.querySelector('.note__tag-icon');
        let noteTag = noteTagIcon.getAttribute('data-tag');
        if(noteTag == oldTagKey){
            let tagName = formNameInput.value.toLowerCase();
            let tagColor = formColorInput.value.toLowerCase();

            note.querySelector('.note__header').setAttribute('style', `background: ${tagColor}`);
            note.querySelector('.note__title').setAttribute('style', `background: ${tagColor}`);
            noteTagIcon.setAttribute('style', `color: ${tagColor}`);
            noteTagIcon.setAttribute('data-tag', tagName);
            note.querySelector('.note__tag-save').setAttribute('style', `color: ${tagColor}`);

            // save the new tag name
            saveNotesInLS();
        }
    });
}

function cleanScreen() {
    filterMenu.classList.add('hidden');
    filterMenu.innerHTML = '';

    const allTagsMenu = document.querySelectorAll('.tag__menu');
    if (allTagsMenu.length > 0) {
        allTagsMenu.forEach(tagMenu => { tagMenu.classList.add('hidden'); });
    }
}

// localStorageFunctions
function saveTagsInLS() {
    localStorage.setItem('tags', JSON.stringify(tags));
}

function fillStoredTags() {
    storedTags = JSON.parse(localStorage.getItem('tags')) ? JSON.parse(localStorage.getItem('tags')) : tags;
}