const filterButton = document.querySelector('#header__filter-button i');
const filterMenu = filterButton.nextElementSibling;

filterButton.addEventListener('click', () =>{
    if(filterMenu.classList.contains('hidden')){
        filterMenu.classList.remove('hidden');

        getTagsFromLocalStorage();
        let tagsKeys = Object.keys(tagsObj);
        for(let i = 0; i < tagsKeys.length; i++){
            filterMenu.innerHTML += 
            `<li class="header__filter-tag-item">
                <span><i class="ri-price-tag-3-fill header__filter-tag-icon" style="color: ${tags[tagsKeys[i]]}"></i>${tagsKeys[i]}</span>
                <i class="ri-check-line header__filter-tag-item--checked" style="visibility: hidden"></i>
             </li>`;
        }

        let filterMenuItems = filterMenu.querySelectorAll('.header__filter-tag-item');
        setClickInEachItem(filterMenuItems);
    } else{
        filterMenu.classList.add('hidden');
        filterMenu.innerHTML = '';
    }
});

function setClickInEachItem(list){
    let selectedTags = [];
    list.forEach(item =>{
        item.addEventListener('click', () =>{
            if(item.lastElementChild.getAttribute('style').includes('hidden')){
                selectedTags.push(item.firstElementChild.textContent);
                item.lastElementChild.setAttribute('style', 'visibility: visible;');
                hideNotesWithTags(selectedTags);
            } else{
                selectedTags.splice(selectedTags.indexOf(item.firstElementChild.textContent), 1);
                item.lastElementChild.setAttribute('style', 'visibility: hidden;');
                hideNotesWithTags(selectedTags);
            }
        });
    });
}

function hideNotesWithTags(tagsList){
    const allNotes = document.querySelectorAll('.note');
    allNotes.forEach(note =>{
        if(tagsList.length == 0){
            note.removeAttribute('style');
        } else{
            let tagIcon = note.querySelector('.note__tag-icon')
            if(tagsList.every(tag => tag != tagIcon.getAttribute('data-tag'))){
                note.setAttribute('style', 'display: none;');
            } else{
                note.removeAttribute('style');
            }
        }
        
    });
}