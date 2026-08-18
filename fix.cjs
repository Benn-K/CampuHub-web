const fs = require('fs');
let css = fs.readFileSync('src/index.css');
// Convert the buffer to string, handling the potential mix
let cssStr = css.toString('utf8');
const searchStr = 'margin: 0;\n}';
let idx = cssStr.lastIndexOf('margin: 0;\n}');
if (idx === -1) {
  idx = cssStr.lastIndexOf('margin: 0;\r\n}');
  if (idx !== -1) {
    idx += 'margin: 0;\r\n}'.length;
  }
} else {
  idx += searchStr.length;
}

if (idx !== -1) {
  cssStr = cssStr.substring(0, idx);
  
  const mobileCss = `\n\n/* ===== MOBILE BOTTOM NAV ===== */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--white);
  border-top: 1px solid var(--border);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 4px;
  transition: color var(--transition);
}

.bottom-nav__item span {
  font-size: 11px;
  font-weight: 500;
}

.bottom-nav__item.active {
  color: var(--blue);
}

@media (max-width: 768px) {
  .bottom-nav {
    display: flex;
  }
  
  body {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }

  .header__search,
  .header__nav,
  #nav-categories,
  #nav-list,
  #nav-messages,
  #user-avatar {
    display: none !important;
  }
  
  .header__actions {
    margin-left: auto;
  }

  .container {
    padding: 0 16px;
  }

  /* Make modals full width on mobile */
  .modal__window {
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 20px 20px 0 0 !important;
    margin-top: auto;
    max-height: 90vh;
  }
  
  .modal__overlay {
    align-items: flex-end;
  }
}`;
  
  fs.writeFileSync('src/index.css', cssStr + mobileCss, 'utf8');
  console.log('Fixed encoding in index.css');
} else {
  console.log('Could not find split point');
}
