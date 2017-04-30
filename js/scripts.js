let stages, stageIndex, stageResult, dictionary, stageIsComplete, finishPopup;

initExersize();

function initExersize() {
  materials = loadMaterials();
  stages = materials.stages;
  finishPopup = materials.finishPopup;
  dictionary = materials.dictionary;

  stageIndex = getStageIndexFromUrl();
  if (isNaN(stageIndex) || stageIndex <= 0 || stageIndex > stages.length) {
    stageIndex = 0;
  } else {
    stageIndex -= 1;
  }
  stage = stages[stageIndex];

  initStage(stage, stageIndex, stages.length, dictionary);
  initEditorListener();
  initShowAnswerListener();
}

function getStageIndexFromUrl() {
  index = window.location.hash;
  return parseInt(index.replace('#',''));
}

function initStage(stage, stageIndex, stagesCount, dictionary) {
  stageIsComplete = false;
  stage = stages[stageIndex];
  stageResult = getResultFromText(stage.regexp, stage.text);

  initNavButtons(stageIndex, stagesCount);

  renderStageNumeration(stageIndex, stages.length);
  renderStage(stage, dictionary);

  updatePageAddress(stageIndex+1);
}

function initNavButtons(stageIndex, stagesCount) {
  prevBtn = document.querySelector('.nav-btn-prev');
  nextBtn = document.querySelector('.nav-btn-next');

  if (stageIndex == 0) {
    prevBtn.classList.add('nav-btn-disabled');
    nextBtn.classList.remove('nav-btn-disabled');

    prevBtn.removeEventListener('click', moveToPrevStage);
    nextBtn.addEventListener('click', moveToNextStage);
  } else if (stageIndex == stagesCount - 1) {
    prevBtn.classList.remove('nav-btn-disabled');
    nextBtn.classList.add('nav-btn-disabled');

    prevBtn.addEventListener('click', moveToPrevStage);
    nextBtn.removeEventListener('click', moveToNextStage);
  } else {
    prevBtn.classList.remove('nav-btn-disabled');
    nextBtn.classList.remove('nav-btn-disabled');

    prevBtn.addEventListener('click', moveToPrevStage);
    nextBtn.addEventListener('click', moveToNextStage);
  }
}

function updatePageAddress(index) {
  window.location.hash = index;
}

function initShowAnswerListener() {
  showAnswerButton = document.querySelector('.show-decision');
  showAnswerButton.addEventListener('click', onShowAnswerClick);
}

function onShowAnswerClick(event) {
  event.preventDefault();
  editor = document.querySelector('.code-input');
  editor.value = stages[stageIndex].regexp;

  onEditorInput();
}

function initEditorListener() {
  editor = document.querySelector('.code-input');
  editor.addEventListener('input', onEditorInput);
}

function renderStageNumeration(stageIndex, stagesCount) {
  courseProgressStr = "{" + (stageIndex + 1) + ", " + stagesCount + "}";
  document.querySelector('.course-part-number').innerHTML = courseProgressStr;
}

function renderStage(stage, dictionary) {
  document.querySelector('.stage-name').innerHTML = stage.name;
  document.querySelector('.stage-description').innerHTML = stage.description;
  document.querySelector('.template-text').innerHTML = stage.text;
  document.querySelector('.task').innerHTML = stage.task;

  renderDictionary(dictionary, stage.dictionary_last_index);

  updateUserProgress(0)
}

function renderDictionary(dictionary, lastIndex) {
  notesList = document.querySelector('.notes-list');

  while (notesList.firstChild) {
    notesList.removeChild(notesList.firstChild);
  }

  for (i = 0; i <= lastIndex; i++) {
    note = document.createElement('li');
    note.className = 'note';

    noteRegExp = document.createElement('code');
    noteRegExp.innerHTML = dictionary[i].regexp;

    noteExplanation = document.createElement('span');
    noteExplanation.className = 'note-explanation';
    noteExplanation.innerHTML = dictionary[i].explanation;

    note.appendChild(noteRegExp);
    note.appendChild(noteExplanation);

    notesList.appendChild(note);
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

function onEditorInput() {
  editor = document.querySelector('.code-input');
  textField = document.querySelector('.template-text');
  stage = stages[stageIndex];

  if (editor.value) {
    userResult = getResultFromText(editor.value, stage.text);

    textField.innerHTML = userResult.editedText;
    updateUserProgress(userResult.count);

    if (isIndexesEquals(userResult.indexesList, stageResult.indexesList)) {
      stageComplete();
    }
  } else {
    textField.innerHTML = stage.text;

    updateUserProgress(0);
  }
}

function stageComplete() {
  if (!stageIsComplete) {
    initNextStageButton();
    appendProgressCommentary('Задание успешно выполнено!');
    stageIsComplete = true;
  }
}

function appendProgressCommentary(comment) {
  document.querySelector('.progress-commentary').innerHTML = comment;
}

function clearProgressCommentary() {
  document.querySelector('.progress-commentary').innerHTML = '';
}

function moveToNextStage() {
  if (stageIndex + 1 == stages.length) {
    finishExercise();
  } else {
    stageIndex++;
    initStage(stages[stageIndex], stageIndex, stages.length, dictionary);

    destroyNextStageButton();
    clearProgressCommentary();
    clearEditor();
  }
}

function moveToPrevStage() {
  stageIndex--;

  initStage(stages[stageIndex], stageIndex, stages.length, dictionary);

  destroyNextStageButton();
  clearProgressCommentary();
  clearEditor();
}

function finishExercise() {
  popup = document.createElement('section');
  popup.classList.add('finish-popup');

  popupBack = document.createElement('div');
  popupBack.classList.add('popup-back');
  popupBack.addEventListener('click', removeFinishPopup);
  popup.appendChild(popupBack);

  popupContent = document.createElement('section');
  popupContent.classList.add('popup-content');

  title = document.createElement('h3');
  title.innerHTML = finishPopup.title;
  popupContent.appendChild(title);

  for (i = 0; i < finishPopup.content.length; i++) {
    paragraph = document.createElement('p');
    paragraph.innerHTML = finishPopup.content[i];
    popupContent.appendChild(paragraph);
  }

  popup.appendChild(popupContent);

  document.body.appendChild(popup);
}

function removeFinishPopup() {
  popup = document.querySelector('.finish-popup');
  document.body.removeChild(popup);
}

function clearEditor() {
  document.querySelector('.code-input').value = '';
}

function initNextStageButton() {
  nextStageButton = document.createElement('a');
  nextStageButton.classList.add('btn-next-exercise');
  document.querySelector('.progress').appendChild(nextStageButton);
  window.setTimeout(function() {
    nextStageButton.classList.add('btn-next-exercise-scaled');
  }, 100);

  nextStageButton.addEventListener('click', moveToNextStage);
}

function destroyNextStageButton() {
  progressSection = document.querySelector('.progress');
  nextStageButton = document.querySelector('.btn-next-exercise');
  if (nextStageButton) {
    nextStageButton.classList.remove('btn-next-exercise-scaled');

    window.setTimeout(function() {
      progressSection.removeChild(nextStageButton);
    }, 300);

    nextStageButton.addEventListener('click', moveToNextStage);
  }
}

function isIndexesEquals(indexes1, indexes2) {
  if (indexes1.length != indexes2.length) return false;

  for (i = 0; i < indexes1.length && i < indexes2.length; i++) {
    if (indexes1[i].start != indexes2[i].start) return false;
    if (indexes1[i].length != indexes2[i].length) return false;
  }
  return true;
}

function getResultFromText(regexp, text) {
  indexesList = []
  regexp = new RegExp(regexp, 'g');

  lastIndex = 0;
  editedText = '';
  while ((match = regexp.exec(text)) !== null) {
    indexes = getIndexesOfTheMatch(match);
    indexesList.push(indexes);

    editedText += text.substr(lastIndex, indexes.start - lastIndex);
    editedText += '<span class="template-match-correct" data-match-number="' +
      indexesList.length + '">' + text.substr(indexes.start, indexes.length) + '</span>';
    lastIndex = indexes.start + indexes.length;
  }

  editedText += text.substr(lastIndex, text.length - lastIndex);

  count = -1;
  if (stageResult != null) {
    count = correlatesIndexesCount(indexesList, stageResult.indexesList);
  }

  return {
    indexesList: indexesList,
    editedText: editedText,
    count: count
  };
}

function correlatesIndexesCount(indexes1, indexes2) {
  count = 0;
  for (i = 0; i < indexes1.length; i++)
    for (j = 0; j < indexes2.length; j++)
      if (indexes1[i].start == indexes2[j].start && indexes1[i].length == indexes2[j].length) {
        count++;
        break;
      }
  return count;
}

function updateUserProgress(matchesCount) {
  stageText = stages[stageIndex].text;
  stageRegexp = new RegExp(stages[stageIndex].regexp, 'g');
  purposeCount = stageText.match(stageRegexp).length;
  progressReport = matchesCount + '/' + purposeCount + ' совпадений.';

  progressField = document.querySelector('.progress-count');
  progressField.innerHTML = progressReport;
  if (matchesCount == purposeCount) {
    progressField.classList.add('progress-count-complete');
  } else {
    progressField.classList.remove('progress-count-complete');
  }
}

function getIndexesOfTheMatch(match) {
  indexes = {
    start: match["index"],
    length: match[0].length
  }
  return indexes;
}
