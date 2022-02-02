let tags = { default: 'var(--primary)' } // initial value of the tags obj
let oldTagKey = '';

const tagsGrid = document.getElementById('tags__grid');
const addTagBtn = document.getElementById('tag__add');
const firstTagBox = document.querySelector('.tag__box:first-of-type');
firstTagBox.firstElementChild.setAttribute('style', `color: ${tags.default}`);
setClickListenerInTagBox(firstTagBox);
const seeMoreBtn = document.getElementById('tag__see-more');

const tagForm = document.getElementById('form-tag');
const formNameInput = tagForm.querySelector('#form-tag__name-input');
const formColorInput = tagForm.querySelector('#form-tag__color-input');

const largeTags = document.querySelector('.large-tags');

// gathering data from localStorage
if (localStorage.getItem('tags')) {
    fillTagsObject();
    for(let key in tags) {
        addTag(key, tags[key]);
    }

    firstTagBox.remove();
} else{
    localStorage.setItem('tags', JSON.stringify(tags));
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

    fillTagsObject();
    if (Object.keys(tags).find(key => key == oldTagKey)) {
        editTag(tags);
    } else {
        addTag(formNameInput.value.toLowerCase(), formColorInput.value.toLowerCase());
    }

    tagForm.parentElement.classList.add('hidden');

    removeColorValuesInForm();

    oldTagKey = '';
});

seeMoreBtn.addEventListener('click', () =>{
    seeMoreBtn.firstElementChild.classList.toggle('hidden');
    seeMoreBtn.lastElementChild.classList.toggle('hidden');
    largeTags.classList.toggle('hidden');
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
    setClickListenerInTagBox(lastTagBox);

    addTagInLargeTagsCtn(key, value)
}

function editTag() {
    let newTagKey = formNameInput.value.toLowerCase();

    let allTagBoxes = document.querySelectorAll('.tag__box');
    allTagBoxes.forEach(tagBox => {
        if (tagBox.firstElementChild.getAttribute('style').replace('color: ', '') == tags[oldTagKey]) { // tags[oldTagKey] is the old value
            delete tags[oldTagKey];
            tags[newTagKey] = formColorInput.value.toLowerCase();
            changeTagInNote(newTagKey, formColorInput.value.toLowerCase());

            tagBox.firstElementChild.setAttribute('style', `color: ${tags[newTagKey]}`);
        }
    });

    saveTagsInLS();
}

function setClickListenerInTagBox(tagBox) {
    tagBox.addEventListener('click', () => {
        // hiding the filter menu
        filterMenu.classList.add('hidden');
        filterMenu.innerHTML = '';

        tagBox.lastElementChild.classList.toggle('hidden');

        const editTagBoxBtn = tagBox.querySelector('.tag__item:first-of-type');
        const deleteTagBoxBtn = tagBox.querySelector('.tag__item:last-of-type');

        let tagBoxColorValue = tagBox.firstElementChild.getAttribute('style').replace('color: ', '');
        editTagBoxBtn.addEventListener('click', () => {
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

function addTagInLargeTagsCtn(tagName, tagColor){
    const largeTagsCtn = largeTags.lastElementChild;
    const largeTagBox = largeTagsCtn.firstElementChild;

    largeTagsCtn.appendChild(largeTagBox.cloneNode(true));
    const newBox = largeTagsCtn.querySelector('.large-tag__box:last-of-type') 

    newBox.querySelector('i:last-of-type').setAttribute('style', 'color: '+tagColor);
    newBox.querySelector('.large-tag__info-row input').value = tagName;
    newBox.querySelector('.large-tag__info-row:last-of-type input').value = tagColor;

    if(newBox.querySelector('.large-tag__info-row input').value == 'default'){
        largeTagBox.remove();
    }
    
    addCRUDToTagElement(newBox);
}

function addCRUDToTagElement(tagEl){
    let largeTagDeleteBtn = tagEl.querySelector('i:first-of-type');

    let largeTagName = tagEl.querySelector('.large-tag__info-row input');
    let largeTagEditName = largeTagName.nextElementSibling;
    let largeTagColor = tagEl.querySelector('.large-tag__info-row:last-of-type input');
    let largeTagEditColor = largeTagColor.nextElementSibling;

    // create a function to both inputs 
    largeTagEditName.addEventListener('click', () =>{
        largeTagName.disabled = false;
        largeTagName.focus();

        largeTagEditName.classList.add('hidden');
        largeTagEditName.nextElementSibling.classList.remove('hidden'); 
    });

    largeTagEditName.nextElementSibling.addEventListener('click', () =>{
        largeTagName.disabled = true;

        largeTagEditName.nextElementSibling.classList.add('hidden');
        largeTagEditName.classList.remove('hidden');
    });

    // largeTagEditColor.addEventListener('click', () =>{
    //     largeTagColor.disabled = false;
    //     largeTagColor.focus();

    //     largeTagEditColor.classList.add('hidden');
    //     largeTagEditColor.nextElementSibling.classList.remove('hidden');
    // });
}

// updating the notes with the edited tag
function changeTagInNote(newName, newColor) {
    const allNotes = document.querySelectorAll('.note');
    allNotes.forEach(note =>{
        let noteTagIcon = note.querySelector('.note__tag-icon');
        let noteTag = noteTagIcon.getAttribute('data-tag');
        if(noteTag == oldTagKey){

            note.querySelector('.note__header').setAttribute('style', `background: ${newColor}`);
            note.querySelector('.note__title').setAttribute('style', `background: ${newColor}`);
            noteTagIcon.setAttribute('style', `color: ${newColor}`);
            noteTagIcon.setAttribute('data-tag', newName);
            note.querySelector('.note__tag-save').setAttribute('style', `color: ${newColor}`);

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
function fillTagsObject() {
    tags = JSON.parse(localStorage.getItem('tags')) ? JSON.parse(localStorage.getItem('tags')) : { default: 'var(--primary)'};
    return tags;
}