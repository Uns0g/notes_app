const messageSection = document.querySelector('.message');
const messageTitle = document.getElementById('message__title')
const messageTextCtn = document.querySelector('#message__text span');

const searchInput = document.querySelector('#header__search-input input');
searchInput.addEventListener('input', function(){
    const allNotes = document.querySelectorAll('.note');

    // if the input value is empty the notes come back to normal
    if(searchInput.value == ""){
        messageSection.classList.add('hidden');

        allNotes.forEach(note =>{
            note.classList.remove('hidden');
        });
    }
});
searchInput.addEventListener('keydown', ev =>{ 
    if(ev.key == 'Enter'){ hideNotesWithDifferentTitle()}
});

const searchIcon = document.getElementById('header__search-icon');
searchIcon.addEventListener('click', hideNotesWithDifferentTitle);
function hideNotesWithDifferentTitle(){
    let isNoteXHidden = [];

    const allNotes = document.querySelectorAll('.note');
    allNotes.forEach(note =>{
        note.classList.remove('hidden'); // refresh the notes display

        const title = note.querySelector('.note__title').value;
        if(title.toLowerCase().indexOf(searchInput.value.toLowerCase()) == -1){ 
            note.classList.add('hidden'); // the note receives .hidden if its title does not contain the searched word
        }

        note.getAttribute('style') || note.classList.contains('hidden') ? isNoteXHidden.push(true) : isNoteXHidden.push(false);
    });

    let allNoteTitles = [];
    document.querySelectorAll('.note__title').forEach(titleEl =>{
        allNoteTitles.push(titleEl.value.toLowerCase());
    });

    checkSearchedString(searchInput.value.toLowerCase(),allNoteTitles,isNoteXHidden);
}

function checkSearchedString(searchedString, titlesList, hiddenNotes){
    messageTextCtn.innerText = 'There is no note with the title containing';
    messageSection.classList.add('hidden');
    
    if(titlesList.every(title => title.indexOf(searchedString) == -1) && hiddenNotes.includes(false)){
        messageSection.classList.remove('hidden');
        messageTextCtn.innerText += ` "${searchInput.value}".`;
    } 
    else if(hiddenNotes.every(isNoteHidden => isNoteHidden)){
        if(selectedTags.length == 1){
            messageSection.classList.remove('hidden');
            messageTextCtn.innerText = `There is no note with tag "${selectedTags[0]}" which title contains "${searchedString}".`;
        }
        else if(selectedTags.length > 1){
            messageSection.classList.remove('hidden');
            messageTextCtn.innerText = `There is no note with tag ${'"'+selectedTags.join('" or "')+'"'} which title contains "${searchedString}".`;
        }
    }
}

// in page load the input value comes back to normal
window.onload = function(){ searchInput.value = "";}