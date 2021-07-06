const range = document.querySelector('#range');
const audio = document.querySelector('#audio');
const duration = document.querySelector('#duration');
const button = document.querySelector('#button');

let isPlaying = false;

function sec2time(sec) {
  return `${Math.floor(sec / 60)} : ${('00' + Math.floor(sec % 60)).slice(-2)}`;
}

button.addEventListener('click', (e) => {
  e.preventDefault();
  isPlaying ? audio.pause() : audio.play();
  isPlaying = !isPlaying;
});

audio.addEventListener('timeupdate', (e) => {
  range.value = Math.floor((e.target.currentTime / e.target.duration) * 100);
  duration.innerText = sec2time(e.target.currentTime);
});

range.addEventListener('change', (e) => {
  audio.currentTime = (audio.duration * e.target.value) / 100;
});

audio.addEventListener('ended', (e) => {
  e.target.currentTime = 0;
});
