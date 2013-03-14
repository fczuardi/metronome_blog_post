Building a Metronome for FFOS
=============================

Prelude
-------

If you want to go straight to the coding tips, skip this section.

### The web as the platform dream ###

The idea of developing mobile apps using only web technologies is a very
charming one. Since last year's announcement I've been following in my free
time the evolution of Firefox OS on IRC, the mailing lists, on the code
repositories and on the issue trackers thanks to the open nature of how
Mozilla build products.

A platform where web apps are first-class citzens is an ambitious
dream and it is very exciting to think, now that we have reached a first
milestone, that it might be actually becoming true…

### Firefox OS Hackathons ###

Recently I was fortunate enough to participate and help with the
organization of some Firefox OS related events in the country that I leave in,
two of them in São Paulo: the Apps Day and the Firefox OS hackathon at Campus
Party, where we had the opportunity of spending time with other web developers
trying out the platform and experiencing it's problems on the simulator and on
real devices.

At the Apps Day I chose to build a simple app just to get my feets wet, a
metronome sounded like something simple enough to build in one day and useful
at the same time. I forced myself to use some tools that I've read about on
this blog that I wanted to try for myself, such as mortar and gaia building
blocks. It was a very painful experience, and although a very simple, ugly and
incomplete app was demo'ed at the end I was frustrated with the experience and
wanted to try again to build that same app from scratch.

And so we did it, me and my brother deicided to build a precise, elegant and
simple to use metronome as our first Firefox OS web app, it is available at
the Firefox Marketplace[TBD LINK HERE] and this blog post is a description of the problems we
faced during the development and the solutions we used, I hope this
notes / testimonial can be useful for other web developers.


App Requirements
----------------

### Keeping the beat ###

The number one must-have feature for a good metronome app is the ability to make
a simple tick sound at reliable time intervals. In other words, if the beats
of the metronome goes out of sync then it is useless.

#### First attempt ####

For the first version, my plan was to use a web page containing an audio
element with a short audio file and then play it at fixed intervals using
the setInterval javascript timer. Something along the lines of:

##### app.html #####

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Metronome (example 1)</title>
</head>
<body>
    <div id="main">
      <!-- CC0 sound from: http://www.freesound.org/people/fins/sounds/146721/ -->
      <audio id="beat_sound" src="../sound/my_sound.wav" preload></audio>
      <input id="bpm_input" type="text" value="120" />
      <label for="bpm_display">bpm</label>
      <button id="start_btn">Start Metronome</button>
    </div>
    <script src="js/app.js" type="text/javascript"></script>
</body>
</html>
```

##### app.js #####

```javascript
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

```