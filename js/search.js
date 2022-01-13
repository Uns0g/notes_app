const searchInput = document.querySelector('#header__search-input input');
const searchIcon = document.getElementById('header__search-icon');

searchInput.addEventListener('input', function(){
    const allNotes = document.querySelectorAll('.note');

    // if the input value is empty the notes come back to normal
    allNotes.forEach(note =>{
        if(searchInput.value == ""){
            note.classList.remove('hidden');
        }
    });
});
searchInput.addEventListener('keydown', ev =>{ 
    if(ev.key == 'Enter'){ hideNotesWithDifferentTitle()}
});

searchIcon.addEventListener('click', hideNotesWithDifferentTitle);

function hideNotesWithDifferentTitle(){
    const allNotes = document.querySelectorAll('.note');
    
    allNotes.forEach(note =>{
        note.classList.remove('hidden'); // refresh the notes display

        const title = note.querySelector('.note__title').value;
        if(title.toLowerCase().indexOf(searchInput.value.toLowerCase()) == -1){ 
            note.classList.add('hidden'); // the note receives .hidden if its title does not contain the searched word
        }
    });
}

// in page load the input value comes back to normal
window.onload = function(){ searchInput.value = "";}