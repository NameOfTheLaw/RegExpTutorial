function renderStage(stage, dictionary) {
  document.querySelector('.stage-name').innerHTML = stage.name;
  document.querySelector('.stage-description').innerHTML = stage.description;
  document.querySelector('.template-text').innerHTML = stage.text;
  document.querySelector('.task').innerHTML = stage.task;

  renderDictionary(dictionary, stage.dictionary_last_index);
}

function renderDictionary(dictionary, lastIndex) {
  notesList = document.querySelector('.notes-list');

  for (i = 0; i <= lastIndex; i++) {
    note = document.createElement('li');
    note.className = 'note';

    noteRegExp = document.createElement('code');
    noteRegExp.innerHTML = dictionary[i].regexp;

    noteExplanation = document.createElement('span');
    noteExplanation.className = 'note-explanation';
    noteExplanation.innerHTML = dictionary[i].explanation;

    note.appendChild(noteRegExp)
    note.appendChild(noteExplanation);

    document.querySelector('.notes-list').appendChild(note);
  }

}

function loadMaterials() {
  rawJSON = loadJSON('resources/course_materials.json');
  materials = JSON.parse(rawJSON);
  return materials;
}

function loadJSON(jsonURL) {
   var xobj = new XMLHttpRequest();

   xobj.overrideMimeType("application/json");
   xobj.open('GET', jsonURL, false);
   xobj.send(null);

   return xobj.responseText;
}
