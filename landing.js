import { STARTERS } from './src/presets.js';
import { focusWords } from './word-focus.js';

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

const starterVideo = document.querySelector('#starter-video');
const starterPlay = document.querySelector('#starter-play');
const starterPoster = document.querySelector('#starter-poster');
const starterStatus = document.querySelector('#starter-status');
const starterChoices = document.querySelectorAll('[data-starter]');
function showStarterPlayer(visible) {
  starterVideo.hidden = !visible;
  starterPlay.hidden = visible;
}
showStarterPlayer(false);
starterPlay.addEventListener('click', () => {
  showStarterPlayer(true);
  starterVideo.focus({ preventScroll: true });
  starterVideo.play().catch(error => {
    if (error?.name === 'AbortError') return;
    starterStatus.hidden = false;
    starterStatus.textContent = 'The preview could not play. Open this cut in the editor to try it.';
  });
});
function selectStarter(starter) {
  starterVideo.pause();
  showStarterPlayer(false);
  starterStatus.hidden = true;
  starterVideo.poster = starter.poster;
  starterPoster.src = starter.poster;
  starterVideo.src = starter.video;
  document.querySelector('#starter-name').textContent = starter.title;
  const description = document.querySelector('#starter-description');
  description.textContent = starter.description;
  focusWords(description);
  const { ratio, duration, cps, sound } = starter.settings;
  const soundLabel = sound.charAt(0).toUpperCase() + sound.slice(1);
  const settings = document.querySelector('#starter-settings');
  settings.textContent = `${ratio} · ${duration} seconds · ${cps} cuts/s · ${soundLabel} sound`;
  focusWords(settings);
  document.querySelector('#starter-use').href = starter.href;
  for (const choice of starterChoices) choice.setAttribute('aria-pressed', String(choice.dataset.starter === starter.id));
}
for (const choice of starterChoices) {
  choice.disabled = false;
  choice.addEventListener('click', () => {
    if (choice.getAttribute('aria-pressed') === 'true') return;
    const starter = STARTERS.find(({ id }) => id === choice.dataset.starter);
    if (starter) selectStarter(starter);
  });
}

const inspector = document.querySelector('.cut-inspector');
const cutRange = document.querySelector('#cut-inspect');
const cutOutput = document.querySelector('#cut-inspect-out');
const cutTrack = document.querySelector('.contact-track');
const cuts = [...document.querySelectorAll('.contact-sheet li')];
if (inspector && cutRange && cutTrack) {
  inspector.hidden = false;
  cuts[0].setAttribute('aria-current', 'true');
  cutRange.addEventListener('input', () => {
    const selected = cuts[Number(cutRange.value) - 1];
    for (const cut of cuts) cut.removeAttribute('aria-current');
    selected.setAttribute('aria-current', 'true');
    cutOutput.textContent = selected.querySelector('figcaption').textContent;
    cutRange.setAttribute('aria-valuetext', cutOutput.textContent);
    const frame = selected.getBoundingClientRect();
    const track = cutTrack.getBoundingClientRect();
    cutTrack.scrollLeft += frame.left - track.left - (track.width - frame.width) / 2;
  });
}

const siteMeta = document.querySelector('meta[property="og:url"]');
const publicUrl = new URL('./', location.href);
if (siteMeta) {
  const canonical = new URL(siteMeta.content, location.href);
  if (canonical.hostname !== 'pressflick.example' && /^https?:$/.test(canonical.protocol)) {
    publicUrl.href = canonical.href;
  }
}
publicUrl.hash = '';
publicUrl.search = '';
const siteLink = publicUrl.href;
const shareStatus = document.querySelector('#share-status');
const linkFallback = document.querySelector('.site-link-fallback');
const linkInput = document.querySelector('#site-link');
const copyButton = document.querySelector('#copy-site');
const shareButton = document.querySelector('#share-site');

function showSiteLink(message) {
  linkFallback.hidden = false;
  linkInput.value = siteLink;
  linkInput.focus();
  linkInput.select();
  shareStatus.textContent = message;
}
async function copySiteLink() {
  try {
    await navigator.clipboard.writeText(siteLink);
    linkFallback.hidden = true;
    shareStatus.textContent = 'Site link copied. Ready to send.';
  } catch {
    showSiteLink('Copying is unavailable. Select and copy the site link shown here.');
  }
}
if (copyButton) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', copySiteLink);
}
if (shareButton && typeof navigator.share === 'function') {
  shareButton.hidden = false;
  shareButton.addEventListener('click', async () => {
    try {
      await navigator.share({ title: 'Pressflick', text: 'Make a word hold the room.', url: siteLink });
      shareStatus.textContent = 'Thanks for passing Pressflick along.';
    } catch (error) {
      if (error?.name === 'AbortError') {
        shareStatus.textContent = 'Sharing cancelled. You can still copy the site link.';
      } else {
        showSiteLink('Sharing is unavailable. Select and copy the site link shown here.');
      }
    }
  });
}
