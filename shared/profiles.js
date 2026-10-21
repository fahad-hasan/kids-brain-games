// Kids Brain Games: player profiles and score tracking, shared by every game.
// Everything is kept in this browser's localStorage, separately for each player:
//   kbg-profiles            -> { players: [{ id, name, avatar }], current }
//   kbg:<playerId>:<game>   -> that game's saved progress for that player
//   kbg:<playerId>:scores   -> { <game>: { plays, best: {...}, total: {...}, last } }
(function () {
  const ROOT = 'kbg-profiles';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
    del(k) { try { localStorage.removeItem(k); } catch (_) {} },
    keys() { try { return Object.keys(localStorage); } catch (_) { return []; } }
  };
  const readJSON = (k, fallback) => { try { const v = JSON.parse(store.get(k)); return v == null ? fallback : v; } catch (_) { return fallback; } };

  // Avatars: small original pixel faces. Each is a palette applied to one face shape plus a hat.
  const AVATARS = [
    { name: 'Rocket', face: '#ff5d73', hat: '#3a86ff', eye: '#1e1a2e' },
    { name: 'Pip', face: '#7fd1ae', hat: '#ffd23f', eye: '#1e1a2e' },
    { name: 'Star', face: '#ffd23f', hat: '#ff9f43', eye: '#1e1a2e' },
    { name: 'Gem', face: '#f472d0', hat: '#c77dff', eye: '#1e1a2e' },
    { name: 'Sky', face: '#4cc9f0', hat: '#1b2a8f', eye: '#1e1a2e' },
    { name: 'Leaf', face: '#7ae582', hat: '#2f6b23', eye: '#1e1a2e' },
    { name: 'Moon', face: '#e8e2f4', hat: '#8f86a8', eye: '#1e1a2e' },
    { name: 'Lava', face: '#ff9f1c', hat: '#c0392b', eye: '#1e1a2e' }
  ];
  const FACE = ['..hhhh..', '.hhhhhh.', 'hhhhhhhh', '.ffffff.', '.fkffkf.', '.ffffff.', '.ffmmff.', '.ffffff.'];
  function avatarSvg(i, cls = '') {
    const a = AVATARS[((i | 0) % AVATARS.length + AVATARS.length) % AVATARS.length];
    const pal = { h: a.hat, f: a.face, k: a.eye, m: a.eye };
    let r = '';
    FACE.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) r += `<rect x="${x}" y="${y}" width="1.05" height="1.05" fill="${pal[ch]}"/>`; }));
    return `<svg class="${cls}" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
  }

  let state = readJSON(ROOT, null) || { players: [], current: null };
  const persist = () => store.set(ROOT, JSON.stringify(state));
  const newId = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const find = id => state.players.find(p => p.id === id);

  function addPlayer(name, avatar) {
    const p = { id: newId(), name: String(name || 'Player').trim().slice(0, 14) || 'Player', avatar: avatar | 0 };
    state.players.push(p);
    state.current = p.id;
    persist();
    return p;
  }
  // First run: make "Player 1", and give them anything saved before profiles existed.
  function ensure() {
    if (!state.players.length) {
      const p = addPlayer('Player 1', 1);
      const legacy = { rocket: 'rocket-gems', blockquest: 'block-quest-v1' };
      for (const [game, key] of Object.entries(legacy)) {
        const v = store.get(key);
        if (v != null) store.set(`kbg:${p.id}:${game}`, v);
      }
    }
    if (!find(state.current)) { state.current = state.players[0].id; persist(); }
  }
  ensure();

  const cur = () => find(state.current);
  const KBG = {
    AVATARS,
    avatarSvg,
    players: () => state.players.slice(),
    current: () => ({ ...cur() }),
    switchTo(id) { if (find(id)) { state.current = id; persist(); } },
    addPlayer,
    updatePlayer(id, changes) {
      const p = find(id); if (!p) return;
      if (changes.name != null) p.name = String(changes.name).trim().slice(0, 14) || p.name;
      if (changes.avatar != null) p.avatar = changes.avatar | 0;
      persist();
    },
    removePlayer(id) {
      store.keys().filter(k => k.startsWith(`kbg:${id}:`)).forEach(k => store.del(k));
      state.players = state.players.filter(p => p.id !== id);
      ensure(); persist();
    },
    // per-player saved progress for a game
    get(game, fallback, playerId) { return readJSON(`kbg:${playerId || state.current}:${game}`, fallback); },
    set(game, data) { store.set(`kbg:${state.current}:${game}`, JSON.stringify(data)); },
    // Score tracking. record('rocket', { stars: 12, level: 3 }) counts a play, keeps the best and the
    // running total of each number, and remembers the latest result.
    record(game, result, opts = {}) {
      const key = `kbg:${state.current}:scores`;
      const all = readJSON(key, {});
      const s = all[game] || { plays: 0, best: {}, total: {}, last: null };
      if (opts.countPlay !== false) s.plays++;
      for (const [k, v] of Object.entries(result)) {
        if (typeof v !== 'number') continue;
        s.best[k] = Math.max(s.best[k] ?? -Infinity, v);
        if (opts.total !== false) s.total[k] = (s.total[k] || 0) + v;
      }
      s.last = { ...result, at: Date.now() };
      all[game] = s;
      store.set(key, JSON.stringify(all));
      return s;
    },
    // set "best" values directly (for progress-style scores like total stars earned so far)
    setBest(game, values) {
      const key = `kbg:${state.current}:scores`;
      const all = readJSON(key, {});
      const s = all[game] || { plays: 0, best: {}, total: {}, last: null };
      Object.assign(s.best, values);
      all[game] = s;
      store.set(key, JSON.stringify(all));
    },
    scores(game, playerId) {
      const all = readJSON(`kbg:${playerId || state.current}:scores`, {});
      return all[game] || { plays: 0, best: {}, total: {}, last: null };
    }
  };
  window.KBG = KBG;
})();
