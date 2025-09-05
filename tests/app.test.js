const fs = require('fs');
const path = require('path');

function extractBetween(html, startTag, endTag) {
  const re = new RegExp(`${startTag}([\s\S]*?)${endTag}`, 'i');
  const m = re.exec(html);
  return m ? m[1] : '';
}

function loadApp() {
  const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
  const lower = html.toLowerCase();
  const bodyOpenIdx = lower.indexOf('<body');
  const bodyCloseIdx = lower.indexOf('</body>');
  if (bodyOpenIdx === -1 || bodyCloseIdx === -1) {
    throw new Error('Failed to locate <body> in index.html');
  }
  const bodyTagEnd = html.indexOf('>', bodyOpenIdx);
  const bodyInner = html.slice(bodyTagEnd + 1, bodyCloseIdx);
  document.body.innerHTML = bodyInner;

  const lower2 = html.toLowerCase();
  const scriptOpenIdx = lower2.lastIndexOf('<script');
  const scriptCloseIdx = lower2.lastIndexOf('</script>');
  if (scriptOpenIdx === -1 || scriptCloseIdx === -1) {
    throw new Error('Failed to locate <script> in index.html');
  }
  const scriptTagEnd = html.indexOf('>', scriptOpenIdx);
  const script = html.slice(scriptTagEnd + 1, scriptCloseIdx);
  // Execute the inline app script (IIFE) in the jsdom environment
  const runner = new Function(`${script}\n;window.__APP_INIT=true;`);
  runner();
}

function getEl(sel) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Element not found: ${sel}`);
  return el;
}

function fireInput(el, value) {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function submitForm() {
  const form = getEl('#todo-form');
  const evt = new Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(evt);
}

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  try { localStorage.clear(); } catch (_) {}

  let uuidCounter = 0;
  Object.defineProperty(global, 'crypto', {
    value: { randomUUID: jest.fn(() => `test-uuid-${++uuidCounter}`) },
    configurable: true
  });

  jest.restoreAllMocks();
  loadApp();
});

describe('Todo App', () => {
  test('adds a todo on submit (trim), clears input, updates count', () => {
    const input = getEl('#todo-input');
    const addBtn = getEl('#add-btn');
    const list = getEl('#todo-list');
    const countNum = getEl('#items-left');
    const countLabel = getEl('#items-left-label');

    expect(addBtn.disabled).toBe(true);

    fireInput(input, '   First task   ');
    expect(addBtn.disabled).toBe(false);

    submitForm();

    const items = list.querySelectorAll('li.item');
    expect(items.length).toBe(1);
    expect(input.value).toBe('');
    expect(countNum.textContent).toBe('1');
    expect(countLabel.textContent).toBe('item left');
  });

  test('ignores empty/whitespace-only submissions', () => {
    const input = getEl('#todo-input');
    const list = getEl('#todo-list');
    const countNum = getEl('#items-left');

    fireInput(input, '    ');
    submitForm();

    expect(list.querySelectorAll('li.item').length).toBe(0);
    expect(countNum.textContent).toBe('0');
  });

  test('toggles completion via checkbox and updates count/class', () => {
    const input = getEl('#todo-input');
    const list = getEl('#todo-list');
    const countNum = getEl('#items-left');

    fireInput(input, 'Task to complete');
    submitForm();

    let item = list.querySelector('li.item');
    let chk = item.querySelector('input.chk');

    expect(item.classList.contains('completed')).toBe(false);
    expect(countNum.textContent).toBe('1');

    chk.checked = true;
    chk.dispatchEvent(new Event('change', { bubbles: true }));

    // Re-query after render() replaced nodes
    item = list.querySelector('li.item');
    expect(item.classList.contains('completed')).toBe(true);
    expect(countNum.textContent).toBe('0');

    chk = item.querySelector('input.chk');
    chk.checked = false;
    chk.dispatchEvent(new Event('change', { bubbles: true }));

    item = list.querySelector('li.item');
    expect(item.classList.contains('completed')).toBe(false);
    expect(countNum.textContent).toBe('1');
  });

  test('clears completed items', () => {
    const input = getEl('#todo-input');
    const list = getEl('#todo-list');
    const clearBtn = getEl('#clear-completed');

    fireInput(input, 'A');
    submitForm();
    fireInput(input, 'B');
    submitForm();

    let items = list.querySelectorAll('li.item');
    expect(items.length).toBe(2);

    const firstChk = items[0].querySelector('input.chk');
    firstChk.checked = true;
    firstChk.dispatchEvent(new Event('change', { bubbles: true }));

    clearBtn.click();

    items = list.querySelectorAll('li.item');
    expect(items.length).toBe(1);
    expect(items[0].querySelector('.text').textContent).toBe('A');
  });

  test('filters items and updates aria-pressed', () => {
    const input = getEl('#todo-input');
    const list = getEl('#todo-list');

    fireInput(input, 'A');
    submitForm();
    fireInput(input, 'B');
    submitForm();
    fireInput(input, 'C');
    submitForm();

    // Mark B as completed using text match
    let items = list.querySelectorAll('li.item');
    let bItem = Array.from(items).find(li => li.querySelector('.text').textContent === 'B');
    let chkB = bItem.querySelector('.chk');
    chkB.checked = true;
    chkB.dispatchEvent(new Event('change', { bubbles: true }));

    // After render, re-query list and B reference
    items = list.querySelectorAll('li.item');
    bItem = Array.from(items).find(li => li.querySelector('.text').textContent === 'B');

    const filterAll = getEl('.filter[data-filter="all"]');
    const filterActive = getEl('.filter[data-filter="active"]');
    const filterCompleted = getEl('.filter[data-filter="completed"]');

    filterActive.click();
    items = list.querySelectorAll('li.item');
    const activeTexts = Array.from(items).map(li => li.querySelector('.text').textContent).sort();
    expect(activeTexts).toEqual(['A', 'C']);
    expect(filterActive.getAttribute('aria-pressed')).toBe('true');

    filterCompleted.click();
    items = list.querySelectorAll('li.item');
    const completedTexts = Array.from(items).map(li => li.querySelector('.text').textContent);
    expect(completedTexts).toEqual(['B']);
    expect(filterCompleted.getAttribute('aria-pressed')).toBe('true');

    filterAll.click();
    items = list.querySelectorAll('li.item');
    const allTexts = Array.from(items).map(li => li.querySelector('.text').textContent);
    expect(allTexts).toEqual(['C', 'B', 'A']);
    expect(filterAll.getAttribute('aria-pressed')).toBe('true');
  });

  test('edit -> save updates item text', () => {
    const input = getEl('#todo-input');
    const list = getEl('#todo-list');

    fireInput(input, 'Original');
    submitForm();

    let item = list.querySelector('li.item');
    const editBtn = item.querySelector('button.icon-btn[data-action="edit"]');
    editBtn.click();

    const editInput = item.querySelector('input.edit-input');
    expect(editInput).toBeTruthy();

    editInput.value = 'Updated';
    editInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    item = list.querySelector('li.item');
    const label = item.querySelector('label.text');
    expect(label.textContent).toBe('Updated');
  });

  test('edit -> cancel reverts without changes', () => {
    const input = getEl('#todo-input');
    const list = getEl('#todo-list');

    fireInput(input, 'KeepMe');
    submitForm();

    let item = list.querySelector('li.item');
    const editBtn = item.querySelector('button.icon-btn[data-action="edit"]');
    editBtn.click();

    let editInput = item.querySelector('input.edit-input');
    editInput.value = 'ShouldNotSave';
    const actions = item.querySelector('.row');
    const cancelBtn = actions.querySelectorAll('button')[1];
    cancelBtn.click();

    item = list.querySelector('li.item');
    const label = item.querySelector('label.text');
    expect(label.textContent).toBe('KeepMe');
  });

  test('logs warning when localStorage persist fails', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const input = getEl('#todo-input');

    const setSpy = jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    fireInput(input, 'X');
    submitForm();

    expect(warnSpy).toHaveBeenCalled();
    setSpy.mockRestore();
  });
});
