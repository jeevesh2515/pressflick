// Keeps the poster clean: one printed play button over the sample until the visitor starts it.
const video = document.querySelector('.demo-video');
const play = document.querySelector('.play');
if (video && play) {
  play.hidden = false;
  const reveal = () => { play.hidden = true; };
  play.addEventListener('click', () => {
    reveal();
    video.focus();
    video.play().catch(() => {});
  });
  video.addEventListener('play', reveal);
}

const motion = document.querySelector('.motion-toggle');
if (motion) {
  motion.hidden = false;
  motion.addEventListener('click', () => {
    const paused = document.body.classList.toggle('motion-paused');
    motion.textContent = paused ? 'Resume page motion' : 'Pause page motion';
  });
}
