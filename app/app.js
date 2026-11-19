// Leonida Legend — GTA VI trophy guide & tracker.
// Loads app/data/trophies.json, renders the checklist, the roadmap and the guide pane,
// and keeps earned trophies in localStorage with export/import. No network at run time:
// the only fetch is the trophy data file, served from this same app folder.
const STORAGE_KEY = 'gta6-trophy-guide-v1';
const KIND_LABELS = {
  story: 'Story',
  side: 'Side story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  crime: 'Crime & one-offs',
  platinum: 'Platinum',
};

const searchInput = document.getElementById('search');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const earnedOnlyBox = document.getElementById('earnedOnly');
const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detail');
const listCountEl = document.getElementById('listCount');
const emptyEl = document.getElementById('emptyList');
const onlineNoteEl = document.getElementById('onlineNote');
const progressFill = document.getElementById('progressFill');
const progressCount = document.getElementById('progressCount');

let trophyData = null;
let earned = new Set(loadProgress());
let selectedId = 28; // Positive Mental Attitude: the one missable trophy, open by default.

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

function isEarned(trophy) {
  return earned.has(trophy.name);
}

function isSpoilerHidden(trophy) {
  return spoilerToggle.checked && trophy.hidden && !isEarned(trophy);
}

function trophyMatches(trophy) {
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    const haystack = [trophy.name, trophy.description, trophy.guide, KIND_LABELS[trophy.kind] ?? '']
      .join(' ').toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  const kind = kindFilter.value;
  if (kind === 'missable' && !trophy.missable) return false;
  if (kind === 'online') return false;
  if (kind !== 'all' && kind !== 'missable' && trophy.kind !== kind) return false;
  if (gradeFilter.value !== 'all' && trophy.grade !== gradeFilter.value) return false;
  if (earnedOnlyBox.checked && !isEarned(trophy)) return false;
  return true;
}

function updateProgress() {
  const total = trophyData.trophies.length;
  const done = trophyData.trophies.filter(isEarned).length;
  progressCount.textContent = `${done} of ${total} earned`;
  progressFill.style.width = `${(done / total) * 100}%`;
}

function renderRoadmap() {
  const stages = document.getElementById('roadmapStages');
  stages.replaceChildren();
  for (const [index, stage] of trophyData.roadmap.entries()) {
    const li = document.createElement('li');
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${index + 1}`;
    const title = document.createElement('h3');
    title.textContent = stage.title;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const chips = document.createElement('div');
    chips.className = 'chips';
    for (const name of stage.trophies) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = name;
      chips.append(chip);
    }
    li.append(num, title, text, chips);
    stages.append(li);
  }
}

function renderSourceList() {
  const list = document.getElementById('sourceList');
  list.replaceChildren();
  for (const source of trophyData.sources) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.name;
    link.rel = 'noopener';
    li.append(link, document.createTextNode(` — ${source.note}`));
    list.append(li);
  }
}

function renderTrophyList() {
  const visible = trophyData.trophies.filter(trophyMatches);
  listEl.replaceChildren();
  for (const trophy of visible) {
    const hidden = isSpoilerHidden(trophy);
    const li = document.createElement('li');
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'trophy-card' + (isEarned(trophy) ? ' earned' : '') + (trophy.id === selectedId ? ' selected' : '');
    card.addEventListener('click', () => {
      selectedId = trophy.id;
      renderTrophyList();
      renderTrophyDetail();
    });

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned(trophy);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleEarned(trophy);
    });

    const body = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'name' + (hidden ? ' spoiler-name' : '');
    name.textContent = hidden ? 'Hidden story trophy — earn it to reveal' : trophy.name;
    const desc = document.createElement('span');
    desc.className = 'desc';
    desc.textContent = hidden ? 'Its name and description stay hidden while spoilers are on.' : trophy.description;
    const tags = document.createElement('span');
    tags.className = 'tags';
    const gradeTag = document.createElement('span');
    gradeTag.className = `tag ${trophy.grade}`;
    gradeTag.textContent = trophy.grade;
    tags.append(gradeTag);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
    tags.append(kindTag);
    if (trophy.missable) {
      const miss = document.createElement('span');
      miss.className = 'tag missable';
      miss.textContent = 'Missable';
      tags.append(miss);
    }
    if (trophy.hidden) {
      const hid = document.createElement('span');
      hid.className = 'tag hidden';
      hid.textContent = 'Hidden on PSN';
      tags.append(hid);
    }
    if (trophy.unconfirmed) {
      const unc = document.createElement('span');
      unc.className = 'tag unconfirmed';
      unc.textContent = 'Unconfirmed';
      tags.append(unc);
    }
    body.append(name, document.createElement('br'), desc, tags);

    const grade = document.createElement('span');
    grade.className = 'grade-dot';
    grade.textContent = trophy.target ? `Target: ${trophy.target}` : '';

    card.append(box, body, grade);
    li.append(card);
    listEl.append(li);
  }
  const shown = visible.length;
  const total = trophyData.trophies.length;
  listCountEl.textContent = `Showing ${shown} of ${total} trophies` +
    (kindFilter.value === 'missable' ? ' — only the missable one is flagged, but read the roadmap: chapter saves matter for everything.' : '');
  emptyEl.hidden = shown > 0;
  onlineNoteEl.hidden = kindFilter.value !== 'online';
  updateProgress();
}

function renderTrophyDetail() {
  const trophy = trophyData.trophies.find((t) => t.id === selectedId) ?? trophyData.trophies[0];
  const hidden = isSpoilerHidden(trophy);
  detailEl.replaceChildren();

  const title = document.createElement('h3');
  title.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden
    ? 'Spoilers are on and this trophy is still hidden on PlayStation. Earn it in the game, tick it off here, and its guide appears.'
    : `“${trophy.description}” — official PlayStation description · ${trophy.grade} · ${KIND_LABELS[trophy.kind] ?? trophy.kind}`;
  detailEl.append(title, official);

  if (!hidden) {
    if (trophy.missable) {
      const warn = document.createElement('p');
      warn.className = 'warn';
      warn.textContent = '⚠ Missable — read the warning in the guide below before you play past Chapter 1.';
      detailEl.append(warn);
    }
    const guide = document.createElement('div');
    guide.className = 'guide';
    for (const paragraph of trophy.guide.split('\n\n')) {
      const p = document.createElement('p');
      p.textContent = paragraph;
      guide.append(p);
    }
    detailEl.append(guide);

    const sources = document.createElement('div');
    sources.className = 'sources';
    const heading = document.createElement('h4');
    heading.textContent = 'Sources for this guide';
    const list = document.createElement('ul');
    for (const key of trophy.sources) {
      const source = trophyData.sources.find((s) => s.key === key);
      const li = document.createElement('li');
      if (source) {
        const link = document.createElement('a');
        link.href = source.url;
        link.textContent = source.name;
        link.rel = 'noopener';
        li.append(link);
      } else {
        li.textContent = key;
      }
      list.append(li);
    }
    sources.append(heading, list);
    detailEl.append(sources);
  }

  const mark = document.createElement('button');
  mark.type = 'button';
  mark.className = 'mark-btn' + (isEarned(trophy) ? ' earned' : '');
  mark.textContent = isEarned(trophy) ? '✓ Earned — click to untick' : 'Mark as earned';
  mark.addEventListener('click', () => toggleEarned(trophy));
  detailEl.append(mark);
}

function toggleEarned(trophy) {
  if (earned.has(trophy.name)) earned.delete(trophy.name);
  else earned.add(trophy.name);
  saveProgress();
  renderTrophyList();
  renderTrophyDetail();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importProgress(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophyData.trophies.map((t) => t.name));
    earned = new Set(names.filter((name) => known.has(name)));
    saveProgress();
    renderTrophyList();
    renderTrophyDetail();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
}

async function loadTrophyData() {
  const response = await fetch('data/trophies.json');
  trophyData = await response.json();
}

function applyTrophyFilters() {
  renderTrophyList();
  renderTrophyDetail();
}

searchInput.addEventListener('input', applyTrophyFilters);
kindFilter.addEventListener('change', applyTrophyFilters);
gradeFilter.addEventListener('change', applyTrophyFilters);
spoilerToggle.addEventListener('change', applyTrophyFilters);
earnedOnlyBox.addEventListener('change', applyTrophyFilters);
document.getElementById('exportBtn').addEventListener('click', exportProgress);
document.getElementById('importFile').addEventListener('change', (event) => {
  importProgress(event.target.files[0]);
  event.target.value = '';
});

await loadTrophyData();
renderRoadmap();
renderSourceList();
renderTrophyList();
renderTrophyDetail();
window.__shotReady = true;
