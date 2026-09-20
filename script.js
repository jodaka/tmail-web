const copyButtons = document.querySelectorAll('[data-copy]');

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy.replace(/\\n/g, '\n');
    const previous = button.textContent;
    let feedback = '[ copied ]';
    let ok = true;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const code = button.closest('.transcript')?.querySelector('pre code');
      if (code && window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        feedback = '[ selected ]';
      } else {
        feedback = '[ failed ]';
        ok = false;
      }
    }

    button.textContent = feedback;
    button.classList.remove('is-ok', 'is-err');
    button.classList.add(ok ? 'is-ok' : 'is-err');

    window.setTimeout(() => {
      button.textContent = previous;
      button.classList.remove('is-ok', 'is-err');
    }, 1600);
  });
});

const switcher = document.querySelector('[data-switcher]');

if (switcher) {
  const tabs = Array.from(switcher.querySelectorAll('[role="tab"]'));
  const panels = Array.from(switcher.querySelectorAll('[role="tabpanel"]'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const selectTab = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', active ? 'true' : 'false');
      item.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.id === tab.getAttribute('aria-controls');
      panel.hidden = !active;
      panel.classList.remove('animate');
      if (active && !reduced.matches) {
        void panel.offsetWidth;
        panel.classList.add('animate');
      }
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));

    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next]);
    });
  });
}

const sections = Array.from(document.querySelectorAll('main section[id]'));
const navTabs = Array.from(document.querySelectorAll('.tabs a[href^="#"]'));
const chip = document.querySelector('.status .chip');
let pending = 0;

const updateActive = () => {
  pending = 0;
  if (!sections.length) return;

  const marker = Math.min(window.innerHeight * 0.4, 260);
  let current = sections[0];

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) current = section;
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1];
  }

  navTabs.forEach((tab) => {
    if (tab.hash === '#' + current.id) tab.setAttribute('aria-current', 'true');
    else tab.removeAttribute('aria-current');
  });

  if (chip) chip.textContent = current.dataset.label || current.id;
};

const requestUpdate = () => {
  if (!pending) pending = window.requestAnimationFrame(updateActive);
};

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
window.addEventListener('load', requestUpdate);
updateActive();

const jumpKeys = {
  '0': '#top',
  '1': '#screens',
  '2': '#features',
  '3': '#keys',
  '4': '#install',
  '5': '#files',
  '6': '#links',
};

window.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;

  const target = event.target;
  const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
  if (target && target.isContentEditable) return;

  const href = jumpKeys[event.key];
  if (!href) return;

  const link = document.querySelector('.tabs a[href="' + href + '"]');
  if (!link) return;

  event.preventDefault();
  link.click();
});
