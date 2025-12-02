const dropdowns = document.querySelectorAll('[data-dropdown]');

const keyMap = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESC: 'Escape',
  TAB: 'Tab',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
};

const getLabel = (option) => option?.dataset.label || option?.textContent?.trim() || '';

const createToken = (value, label, removeHandler) => {
  const token = document.createElement('span');
  token.className = 'dropdown__token';
  token.textContent = label;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', `Remove ${label}`);
  btn.textContent = '×';
  btn.addEventListener('click', () => removeHandler(value));

  token.appendChild(btn);
  return token;
};

const setupDropdown = (dropdown) => {
  const trigger = dropdown.querySelector('[data-dropdown-trigger]');
  const valueNode = dropdown.querySelector('[data-dropdown-value]');
  const menu = dropdown.querySelector('.dropdown__menu');
  const searchInput = dropdown.querySelector('[data-dropdown-search]');
  const tokensHost = dropdown.querySelector('[data-dropdown-tokens]');
  const placeholder = valueNode?.innerText?.trim() || 'Select option';
  let options = Array.from(dropdown.querySelectorAll('[data-dropdown-option]'));
  const isMulti = dropdown.hasAttribute('data-multiselect');
  const selected = new Set();
  let activeIndex = -1;

  const getVisibleOptions = () => options.filter((opt) => !opt.hidden);

  const close = () => {
    dropdown.dataset.open = 'false';
    trigger.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-hidden', 'true');
    activeIndex = -1;
  };

  const focusOption = (visibleIndex, direction = 1) => {
    const visibleOptions = getVisibleOptions();
    if (!visibleOptions.length) return;

    if (visibleIndex < 0 || visibleIndex >= visibleOptions.length) {
      visibleIndex = direction > 0 ? 0 : visibleOptions.length - 1;
    }

    const option = visibleOptions[visibleIndex];
    option.focus();
    activeIndex = options.indexOf(option);
  };

  const open = () => {
    if (trigger.getAttribute('aria-disabled') === 'true') return;
    dropdown.dataset.open = 'true';
    trigger.setAttribute('aria-expanded', 'true');
    menu?.removeAttribute('aria-hidden');
    focusOption(0);
  };

  const toggle = () => {
    if (dropdown.dataset.open === 'true') {
      close();
    } else {
      open();
    }
  };

  const updateValueText = () => {
    if (!valueNode) return;
    if (isMulti) {
      valueNode.textContent = selected.size ? `${selected.size} selected` : placeholder;
    } else {
      const value = selected.values().next().value;
      const option = options.find((opt) => opt.dataset.value === value);
      valueNode.textContent = option ? getLabel(option) : placeholder;
    }
  };

  const updateOptionStates = () => {
    options.forEach((option) => {
      const isChosen = selected.has(option.dataset.value);
      option.setAttribute('aria-selected', String(isChosen));
    });
  };

  const renderTokens = () => {
    if (!tokensHost) return;
    tokensHost.innerHTML = '';
    selected.forEach((value) => {
      const option = options.find((opt) => opt.dataset.value === value);
      const label = getLabel(option) || value;
      const token = createToken(value, label, (val) => {
        selected.delete(val);
        updateOptionStates();
        updateValueText();
        renderTokens();
      });
      tokensHost.appendChild(token);
    });
  };

  const selectOption = (option) => {
    if (!option || option.getAttribute('aria-disabled') === 'true') return;
    const value = option.dataset.value;

    if (isMulti) {
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }
      renderTokens();
    } else {
      selected.clear();
      selected.add(value);
      close();
    }

    updateOptionStates();
    updateValueText();
  };

  trigger?.addEventListener('click', toggle);

  trigger?.addEventListener('keydown', (event) => {
    switch (event.key) {
      case keyMap.SPACE:
      case keyMap.ENTER:
        event.preventDefault();
        toggle();
        break;
      case keyMap.ARROW_DOWN:
        event.preventDefault();
        open();
        break;
      case keyMap.ESC:
        close();
        break;
      default:
        break;
    }
  });

  options.forEach((option) => {
    option.tabIndex = -1;
    option.addEventListener('click', () => selectOption(option));
    option.addEventListener('keydown', (event) => {
      if (event.key === keyMap.ENTER || event.key === keyMap.SPACE) {
        event.preventDefault();
        selectOption(option);
      } else if (event.key === keyMap.ARROW_DOWN) {
        event.preventDefault();
        const visibleIndex = getVisibleOptions().indexOf(option);
        focusOption(visibleIndex + 1);
      } else if (event.key === keyMap.ARROW_UP) {
        event.preventDefault();
        const visibleIndex = getVisibleOptions().indexOf(option);
        focusOption(visibleIndex - 1, -1);
      } else if (event.key === keyMap.ESC) {
        close();
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && dropdown.dataset.open === 'true') {
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === keyMap.ESC && dropdown.dataset.open === 'true') {
      close();
      trigger.focus();
    }
  });

  searchInput?.addEventListener('input', (event) => {
    const term = event.target.value.toLowerCase().trim();
    options.forEach((option) => {
      const label = getLabel(option).toLowerCase();
      option.hidden = term && !label.includes(term);
    });
  });

  dropdown.dataset.open = dropdown.dataset.open || 'false';
  updateValueText();
  renderTokens();
};

dropdowns.forEach(setupDropdown);
