//constants
var START_METRONOME_LABEL = 'Start Metronome',
    STOP_METRONOME_LABEL = 'Stop Metronome';

//global variables
var beatAudioElement,
    bpmInputElement,
    startButtonElement,
    beatInterval,
    beatIntervalTime; //miliseconds

function playSound() {
  beatAudioElement.cloneNode(true).play();
}

function startMetronome() {
  beatInterval = setInterval(playSound, beatIntervalTime);
}

function stopMetronome() {
  clearInterval(beatInterval);
  beatInterval = null;
}

function bpmToMiliseconds(bpm_value) {
  return (60 / Number(bpm_value)) * 1000;
}

function bpmValueUpdated(event) {
  beatIntervalTime = bpmToMiliseconds(bpmInputElement.value);
}

function startButtonClicked(event) {
  event.preventDefault();
  if (!beatInterval) {
    startMetronome();
    startButtonElement.textContent = STOP_METRONOME_LABEL;
  }else {
    stopMetronome();
    startButtonElement.textContent = START_METRONOME_LABEL;
  }
}

function domReady() {
  //assign DOM elements
  beatAudioElement = document.getElementById('beat_sound'),
  bpmInputElement = document.getElementById('bpm_input'),
  startButtonElement = document.getElementById('start_btn');

  //set up event listeners
  bpmInputElement.addEventListener('input', bpmValueUpdated, false);
  startButtonElement.addEventListener('touchstart', startButtonClicked, false);
  startButtonElement.addEventListener('click', startButtonClicked, false);

  //initial parameters
  bpmValueUpdated();
}

document.addEventListener('readystatechange', function() {
  if (document.readyState == 'interactive') {
    domReady();
  }
}, false);
