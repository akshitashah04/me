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
