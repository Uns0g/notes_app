let tags = { default: 'var(--primary)' } // initial value of the tags obj
let oldTagKey = undefined;

const tagsGrid = document.getElementById('tags__grid');
const addTagBtn = document.getElementById('tag__add');
const firstTagBox = document.querySelector('.tag__box:first-of-type');
firstTagBox.firstElementChild.setAttribute('style', `color: ${tags.default}`);
setCRUDToTagBox(firstTagBox);
const seeMoreBtn = document.getElementById('tag__see-more');

const tagForm = document.getElementById('form-tag');
const formNameInput = tagForm.querySelector('#form-tag__name-input');
const formColorInput = tagForm.querySelector('#form-tag__color-input');

const largeTags = document.querySelector('.large-tags');

// gathering data from localStorage
if (localStorage.getItem('tags')) {
    fillTagsObject();
    for (let key in tags) {
        createTagInGrid(key, tags[key]);
    }

    firstTagBox.remove(); // to avoid duplicated default tag box
} else {
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
        updateTagInGrid(tags);
    } else {
        createTagInGrid(formNameInput.value.toLowerCase(), formColorInput.value.toLowerCase());
    }

    tagForm.parentElement.classList.add('hidden');

    // cleaning the form to further use
    formNameInput.value = '';
    formColorInput.value = '';
    formNameInput.previousElementSibling.removeAttribute('style');
    formColorInput.previousElementSibling.removeAttribute('style');

    oldTagKey = undefined;
});

// filling the elements with the typed color in order to see a preview the colours applied  
formColorInput.addEventListener('input', paintSquareAndIcon);
function paintSquareAndIcon() {
    formColorInput.previousElementSibling.setAttribute('style', `background: ${formColorInput.value}`);
    formNameInput.previousElementSibling.setAttribute('style', `color: ${formColorInput.value}`);
}

function createTagInGrid(key, value) {
    tags[key] = value;
    saveTagsInLS();

    tagsGrid.insertAdjacentElement("beforeend", firstTagBox.cloneNode(true));
    let lastTagBox = document.querySelector('.tag__box:last-of-type');
    lastTagBox.firstElementChild.setAttribute('style', `color: ${value}`);
    setCRUDToTagBox(lastTagBox);

    createTagInLargeTagsCtn(key, value)
}

function updateTagInGrid() {
    let oldColorValue = tags[oldTagKey];

    let newTagKey = formNameInput.value.toLowerCase();
    let newColorValue = formColorInput.value.toLowerCase();
    editTag(newTagKey, newColorValue);

    document.querySelectorAll('.tag__box').forEach(tagBox => {
        if (tagBox.firstElementChild.getAttribute('style').replace('color: ', '') == oldColorValue) {
            tagBox.firstElementChild.setAttribute('style', `color: ${newColorValue}`);
        }
    });

    document.querySelectorAll('.large-tag__box').forEach(largeTagBox => {
        let largeTagBoxIcon = largeTagBox.querySelector('i:last-of-type');
        if (largeTagBoxIcon.getAttribute('style').replace('color: ', '') == oldColorValue) {
            largeTagBoxIcon.setAttribute('style', `color: ${newColorValue}`);
            largeTagBox.querySelector('input').value = newTagKey;
            largeTagBox.querySelector('.large-tag__info-row:last-of-type input').value = newColorValue;
        }
    });
}

function setCRUDToTagBox(tagBoxEl) {
    tagBoxEl.addEventListener('click', () => {
        // hiding the filter menu
        filterMenu.classList.add('hidden');
        filterMenu.innerHTML = '';

        tagBoxEl.lastElementChild.classList.toggle('hidden');

        const editTagBoxBtn = tagBoxEl.querySelector('.tag__item:first-of-type');
        const deleteTagBoxBtn = tagBoxEl.querySelector('.tag__item:last-of-type');

        let tagBoxColorValue = tagBoxEl.firstElementChild.getAttribute('style').replace('color: ', '');
        editTagBoxBtn.addEventListener('click', () => {
            tagBoxEl.lastElementChild.classList.remove('hidden'); // hiding the menu 

            tagForm.parentElement.classList.remove('hidden'); // showing the form

            formNameInput.value = Object.keys(tags).find(key => tags[key] === tagBoxColorValue);
            formColorInput.value = Object.values(tags).find(value => value === tags[formNameInput.value]);
            oldTagKey = formNameInput.value;

            paintSquareAndIcon();
        });
        deleteTagBoxBtn.addEventListener('click', () => {
            let keyToBeDeleted = Object.keys(tags).find(key => tags[key] === tagBoxColorValue);
            // deleting the large tag box too
            document.querySelectorAll('.large-tag__box').forEach(largeTagBox => {
                if (largeTagBox.querySelector('input').value == keyToBeDeleted) {
                    largeTagBox.remove();
                }
            });

            deleteTag(keyToBeDeleted, tagBoxEl);
        });
    });
}

// large tags section
seeMoreBtn.addEventListener('click', () => {
    seeMoreBtn.firstElementChild.classList.toggle('hidden');
    seeMoreBtn.lastElementChild.classList.toggle('hidden');
    largeTags.classList.toggle('hidden');
});

function createTagInLargeTagsCtn(tagName, tagColor) {
    const largeTagsCtn = largeTags.lastElementChild;
    const largeTagBox = largeTagsCtn.firstElementChild;

    largeTagsCtn.appendChild(largeTagBox.cloneNode(true));
    const newBox = largeTagsCtn.querySelector('.large-tag__box:last-of-type')

    newBox.querySelector('i:last-of-type').setAttribute('style', 'color: ' + tagColor);
    newBox.querySelector('.large-tag__info-row input').value = tagName;
    newBox.querySelector('.large-tag__info-row:last-of-type input').value = tagColor;

    // to avoid duplicated elements of default tag (happens in reload)
    if (newBox.querySelector('.large-tag__info-row input').value == 'default') {
        largeTagBox.remove();
    }

    setCRUDToLargeTag(newBox);
}

function setCRUDToLargeTag(largeTagEl) {
    let largeTagName = largeTagEl.querySelector('.large-tag__info-row input');
    let largeTagColor = largeTagEl.querySelector('.large-tag__info-row:last-of-type input');
    // edit buttons
    applyEditionToRowEls(largeTagName, largeTagName.nextElementSibling);
    applyEditionToRowEls(largeTagColor, largeTagColor.nextElementSibling);

    let largeTagDeleteBtn = largeTagEl.querySelector('i:first-of-type');
    largeTagDeleteBtn.addEventListener('click', () => {
        document.querySelectorAll('.tag__icon').forEach(tagIcon => {
            if (tagIcon.getAttribute('style').replace('color: ', '') == largeTagColor.value) {
                tagIcon.parentElement.remove()
            }
        });

        deleteTag(largeTagName.value, largeTagEl);
    });

    function applyEditionToRowEls(input, button) {
        button.addEventListener('click', () => {
            oldTagKey = largeTagName.value;
    
            input.disabled = false;
            input.focus();
    
            button.classList.add('hidden');
            button.nextElementSibling.classList.remove('hidden');
        });
        button.nextElementSibling.addEventListener('click', () => {
            input.disabled = true;
    
            button.nextElementSibling.classList.add('hidden');
            button.classList.remove('hidden');
    
            // Here I can delete before editing
            document.querySelectorAll('.tag__box').forEach(tagBox => {
                if (tagBox.firstElementChild.getAttribute('style').replace('color: ', '') == tags[oldTagKey]) {
                    tagBox.firstElementChild.setAttribute('style', 'color: ' + largeTagColor.value);
                }
            });
    
            let newTagKey = largeTagName.value.toLowerCase();
            let newColorValue = largeTagColor.value.toLowerCase();
            editTag(newTagKey, newColorValue);
    
            largeTagEl.querySelector('i:last-of-type').setAttribute('style', 'color: ' + newColorValue);
    
            oldTagKey = undefined;
        });
    
        input.addEventListener('input', () => {
            input.addEventListener('keydown', (e) => {
                if(e.code == 'Enter') {
                    input.disabled = true;
    
                    button.nextElementSibling.classList.add('hidden');
                    button.classList.remove('hidden');
    
                    // Here I can delete before editing
                    document.querySelectorAll('.tag__box').forEach(tagBox => {
                        if (tagBox.firstElementChild.getAttribute('style').replace('color: ', '') == tags[oldTagKey]) {
                            tagBox.firstElementChild.setAttribute('style', 'color: ' + largeTagColor.value);
                        }
                    });
    
                    let newTagKey = largeTagName.value.toLowerCase();
                    let newColorValue = largeTagColor.value.toLowerCase();
                    editTag(newTagKey, newColorValue);
    
                    largeTagEl.querySelector('i:last-of-type').setAttribute('style', 'color: ' + newColorValue);
    
                    oldTagKey = undefined;
                }
            });
        });
    }
}

/***** CRUD functions to the tags *****/

// will always replace the old tag key with a new one, 
// even if the current key name is equal to the past version of the name
function editTag(newName, newColor) {
    delete tags[oldTagKey];
    tags[newName] = newColor;
    saveTagsInLS();

    changeTagInNotes(newName, newColor);
}
function deleteTag(keyToBeDeleted, elementToDisappear) {
    delete tags[keyToBeDeleted];
    saveTagsInLS();

    elementToDisappear.remove();
}

// updating the notes with the edited tag
function changeTagInNotes(newName, newColor) {
    const allNotes = document.querySelectorAll('.note');
    allNotes.forEach(note => {
        let noteTagIcon = note.querySelector('.note__tag-icon');
        if (noteTagIcon.getAttribute('data-tag') == oldTagKey) {
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

// general function to hide the 'popup' elements
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
    tags = JSON.parse(localStorage.getItem('tags')) ? JSON.parse(localStorage.getItem('tags')) : { default: 'var(--primary)' };
    return tags;
}