const filters = document.querySelectorAll('[data-filter]');
const memories = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  memories.forEach(memory => {
    memory.hidden = button.dataset.filter !== 'all' && memory.dataset.category !== button.dataset.filter;
  });
}));
const viewer = document.querySelector('#photo-dialog');
let previousFocus;
document.querySelectorAll('.photo-open').forEach(button => button.addEventListener('click', () => {
  previousFocus = button;
  const image = button.querySelector('img');
  viewer.querySelector('img').src = image.src;
  viewer.querySelector('img').alt = image.alt;
  viewer.querySelector('p').textContent = button.closest('figure').querySelector('figcaption').firstChild.textContent;
  viewer.showModal();
  document.body.classList.add('photo-viewing');
}));
viewer.querySelector('.close-photo').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) {
  const rect = viewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
}});
viewer.addEventListener('close', () => {
  document.body.classList.remove('photo-viewing');
  previousFocus?.focus();
});

const littleJoys = {
  explore: 'Take a different turn. Your next favourite place might be around the corner.',
  music: 'Pick the song that feels like sunshine. Let the rest of the day find its rhythm.',
  food: 'Something warm, something sweet, or something new. Make room for a delicious little reset.'
};
document.querySelectorAll('[data-joy]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-joy]').forEach(option => {
      const selected = option === button;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('#joy-message').textContent = littleJoys[button.dataset.joy];
  });
});

document.querySelector('#surprise-joy').addEventListener('click', () => {
  const otherJoys = [...document.querySelectorAll('[data-joy]')]
    .filter(button => button.getAttribute('aria-pressed') !== 'true');
  otherJoys[Math.floor(Math.random() * otherJoys.length)].click();
});

const kindThoughts = [
  'You don’t need to have the whole path figured out. One thoughtful step is a beautiful place to start.',
  'A small beginning still counts. Open the notebook, ask the question, give the idea a chance.',
  'Your pace is allowed to look different. You’re building a life, not racing a clock.',
  'You can be ambitious and gentle with yourself at the same time.',
  'A difficult day is a chapter, not the whole story. Leave a little room for tomorrow.',
  'You don’t have to be the loudest person in the room to bring something valuable to it.',
  'Rest belongs in the plan too. You’re a person, not a list of things to finish.',
  'Being new at something means you gave yourself a chance to grow. That takes courage.',
  'Celebrate the quiet progress: the clearer question, the second try, the thing you understand a little better.',
  'Your curiosity is worth following. Sometimes a simple “what if?” opens a lovely door.',
  'Make room for the little joys along the way. Your life is happening between the milestones too.',
  'You are allowed to change direction. Learning more about yourself is progress, too.'
];
let thoughtIndex = 0;
const thoughtText = document.querySelector('#kind-thought');
const copyStatus = document.querySelector('#copy-status');
document.querySelector('#next-thought').addEventListener('click', () => {
  thoughtIndex = (thoughtIndex + 1) % kindThoughts.length;
  thoughtText.textContent = kindThoughts[thoughtIndex];
  document.querySelector('#thought-count').textContent = `${String(thoughtIndex + 1).padStart(2, '0')} / ${kindThoughts.length} little reminders`;
  copyStatus.textContent = '';
});
document.querySelector('#copy-thought').addEventListener('click', async () => {
  const message = `${thoughtText.textContent}\n— A little kind thought from Akshita Shah`;
  let copied = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      copied = true;
    }
  } catch { /* Local files and browser permissions may require the fallback. */ }
  if (!copied) {
    const field = document.createElement('textarea');
    field.value = message;
    field.style.cssText = 'position:fixed;top:0;left:-9999px';
    document.body.append(field);
    field.select();
    try { copied = document.execCommand('copy'); } catch { copied = false; }
    field.remove();
    document.querySelector('#copy-thought').focus();
  }
  copyStatus.textContent = copied ? 'Copied. A little kindness, ready to pass on.' : 'Select the thought above and copy it to share a little kindness.';
});

// Small enhancements that leave the page usable without motion or JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets = document.querySelectorAll('.section-heading, .about-copy, .about-photo, .future-title, .work-entry, .education, .project-card, .notes-intro, .contact > div');
let revealObserver;
if ('IntersectionObserver' in window && !motionPreference.matches) {
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealTargets.forEach(target => {
    target.classList.add('reveal-ready');
    revealObserver.observe(target);
  });
}
let noteTurn;
document.querySelector('#next-thought').addEventListener('click', () => {
  if (motionPreference.matches || !thoughtText.animate) return;
  noteTurn?.cancel();
  noteTurn = thoughtText.animate([
    { opacity: 0.45, transform: 'perspective(700px) rotateY(-8deg) translateX(-5px)' },
    { opacity: 1, transform: 'perspective(700px) rotateY(0deg) translateX(0)' }
  ], { duration: 320, easing: 'ease-out' });
});
const joyFeedback = document.createElement('span');
joyFeedback.className = 'joy-feedback';
joyFeedback.setAttribute('role', 'status');
document.querySelector('.joy-picker-content').append(joyFeedback);
let joyFeedbackTimer;
document.querySelectorAll('[data-joy]').forEach(button => {
  button.addEventListener('click', () => {
    clearTimeout(joyFeedbackTimer);
    joyFeedback.textContent = 'Nice choice! A little joy goes a long way.';
    joyFeedbackTimer = setTimeout(() => { joyFeedback.textContent = ''; }, 2400);
  });
});
motionPreference.addEventListener('change', () => {
  if (!motionPreference.matches) return;
  revealObserver?.disconnect();
  revealTargets.forEach(target => target.classList.add('is-revealed'));
  noteTurn?.cancel();
});
