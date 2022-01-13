# Notes App

A web application for writing notes that remain saved in your browser. 

## Using It

**With git**
1. Open your git shell application. 
2. Change to the directory you want.
3. Paste the following command: ```$ git clone https://github.com/Uns0g/notes_app```
4. Execute the index.html file.

**Without git**
1. Click on the green "Code" button
2. Click in the "Download ZIP" option.
3. It will probably save in your default directory for downloads, so go there, right click the zip file and select the option "Extract here". 
4. Go to the created folder and click twice over the index.html file.

## Features

- Notes can be created, edited and deleted.
- A specific note can be searched in the search bar at the top of the screen.
- While writing the note you can use the markdown notation and what you have annotated will appear in the formatted version when you confirm the edit.
- A note can be tagged with any tag, if no tag is assigned to the note, it will receive the default tag, since every note must have at least and at most one tag.
- Tags can be created, edited an deleted.
- The filter options in the filter menu can be clicked to select only the notes with one of the selected tags.
- If some tag is selected in the filter menu and the user searches for a note in the search bar, the notes that will appear are the ones with that tag and with a title that contains the string that was searched.

## To Do

- [ ] A "No note found" message in case there are no notes with the searched title.
- [ ] Fix the issue of the selected tags in filter menu.
- [ ] A better modal form for the tags.
- [ ] The other tags' menus fade when the user clicks in another tag.
- [ ] Improve this own README.
- [ ] Responsiveness.
- [ ] Host it in Github pages?