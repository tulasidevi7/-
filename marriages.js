/**
 * ════════════════════════════════════════════════════════
 *  MARRIAGES.JS — बहु-विवाह डेटा लेयर
 *
 *  Architecture:
 *  localStorage keys:
 *    "wms_marriages"          → array of marriage profile headers
 *    "wms_marriage_<id>"      → full data for one marriage
 *    "wms_guests_<id>"        → guest list for one marriage
 *    "wms_accounts"           → sub-accounts array
 *    "wms_active_marriage"    → currently selected marriageId (for invitation pages)
 *
 *  marriageId: UUID string, never reused
 * ════════════════════════════════════════════════════════
 */

/* ── Helpers ── */
function _uuid() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
}
function _load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function _save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch { return false; }
}

/* ════════════════════════════════════════════════════════
   DEFAULT MARRIAGE DATA TEMPLATE
════════════════════════════════════════════════════════ */
function defaultMarriageData(overrides = {}) {
  return Object.assign({
    // Identity
    marriageId:   overrides.marriageId || _uuid(),
    label:        overrides.label      || 'नयाँ विवाह',
    createdAt:    overrides.createdAt  || new Date().toISOString(),
    archived:     false,

    // Couple
    groomName:        'प्रजेम्स श्रेष्ठ',
    brideName:        'पुजा श्रेष्ठ',

    // वर पक्ष
    groomFatherName:  'प्रेम कुमार श्रेष्ठ',
    groomMotherName:  'आशमाया श्रेष्ठ',
    groomGrandpaDesc: 'रत्ननगर नगरपालिका वडा नं. १२, चितवन निवासी स्व. श्री धन बहादुर श्रेष्ठ तथा श्रीमती श्री तुलसी देवी श्रेष्ठको नाति,',

    // वधू पक्ष
    brideFatherName:  'मेष नारायण श्रेष्ठ',
    brideMotherName:  'शोभा श्रेष्ठ',
    brideGrandpaDesc: 'कालिका नगरपालिका वडा नं. ५, चितवन निवासी श्री दिल बहादुर श्रेष्ठ तथा श्रीमती श्री क्षेत्र माया श्रेष्ठको नातिनि,',

    // मिति
    weddingDateNepali:   'मंसिर १९, २०८३',
    weddingDateEN:       '2026-12-05',
    weddingTime:         'बिहान ९:०० बजे',
    weddingTimeEN:       '09:00:00',
    receptionDateNepali: 'मंसिर २०, २०८३',
    receptionTime:       'दिउँसो २:०० बजे',

    // स्थान
    venueName:    'आफ्नै निवास',
    venueAddress: 'रामलाल चोक, रत्ननगर–१२, चितवन',
    mapsURL:      'https://maps.app.goo.gl/MxxMJZ7Dusjinwjh6',

    // सम्पर्क
    phone:    '९८६५–२०९०४९',
    phoneRaw: '9865209049',

    // Content
    quote:           'प्रेम, संस्कार र साथले जीवनको नयाँ यात्रा शुभ बनोस्।',
    heroTagline:     'हामी दुईको जीवनको नयाँ यात्राको शुभारम्भमा यहाँहरूको गरिमामय उपस्थितिका लागि हार्दिक निमन्त्रणा।',
    invitationPara:  'श्री प्रेम कुमार श्रेष्ठ तथा श्रीमती आशमाया श्रेष्ठका आयुष्मान सुपुत्र प्रजेम्स श्रेष्ठको शुभ विवाह श्री मेष नारायण श्रेष्ठ तथा श्रीमती शोभा श्रेष्ठकी आयुष्मती सुपुत्री पुजा श्रेष्ठसँग हुन गइरहेको हुँदा यस शुभ अवसरमा यहाँको गरिमामय उपस्थितिका साथै वर–वधूलाई शुभाशीर्वाद प्रदान गरिदिनुहुन सादर निमन्त्रणा गर्दछौँ।',

    // Theme
    themeStyle:    'newari',
    primaryColor:  '#5a0f1e',
    accentColor:   '#d4a017',
    bgColor:       '#fdf6e9',

    // Sub-account linked
    subAccountId:  null,
  }, overrides);
}

/* ════════════════════════════════════════════════════════
   MarriageDB — Marriage Profiles
════════════════════════════════════════════════════════ */
const MarriageDB = {

  /* ── List all marriage headers ── */
  getAll() {
    return _load('wms_marriages', []);
  },

  /* ── Get full data for one marriage ── */
  get(marriageId) {
    const data = _load('wms_marriage_' + marriageId, null);
    if (!data) return null;
    // merge with defaults to handle missing fields from older records
    return Object.assign(defaultMarriageData({ marriageId }), data);
  },

  /* ── Create new marriage profile ── */
  create(overrides = {}) {
    const id   = _uuid();
    const data = defaultMarriageData({ ...overrides, marriageId: id });
    _save('wms_marriage_' + id, data);

    // add to index
    const list = this.getAll();
    list.push({ marriageId: id, label: data.label, createdAt: data.createdAt, archived: false });
    _save('wms_marriages', list);
    return data;
  },

  /* ── Update marriage profile ── */
  update(marriageId, updates) {
    const existing = this.get(marriageId);
    if (!existing) return false;
    const merged = Object.assign({}, existing, updates, { marriageId });
    _save('wms_marriage_' + marriageId, merged);

    // update label in index if changed
    const list = this.getAll().map(m =>
      m.marriageId === marriageId
        ? { ...m, label: merged.label, archived: merged.archived }
        : m
    );
    _save('wms_marriages', list);
    return merged;
  },

  /* ── Delete marriage profile and its guests ── */
  delete(marriageId) {
    localStorage.removeItem('wms_marriage_' + marriageId);
    localStorage.removeItem('wms_guests_'   + marriageId);
    const list = this.getAll().filter(m => m.marriageId !== marriageId);
    _save('wms_marriages', list);
    return true;
  },

  /* ── Archive/unarchive ── */
  setArchived(marriageId, archived) {
    return this.update(marriageId, { archived });
  },

  /* ── Active marriage (shown on invitation pages) ── */
  getActive() {
    const id = localStorage.getItem('wms_active_marriage');
    if (!id) return null;
    return this.get(id);
  },
  setActive(marriageId) {
    localStorage.setItem('wms_active_marriage', marriageId);
  },
  clearActive() {
    localStorage.removeItem('wms_active_marriage');
  },

  /* ── Seed default marriage if none exists ── */
  seedIfEmpty() {
    const list = this.getAll();
    if (list.length === 0) {
      return this.create({ label: 'प्रजेम्स ❤ पुजा' });
    }
    return this.get(list[0].marriageId);
  },
};

/* ════════════════════════════════════════════════════════
   GuestDBMulti — Per-Marriage Guest Storage
════════════════════════════════════════════════════════ */
const GuestDBMulti = {

  _key(marriageId) { return 'wms_guests_' + marriageId; },

  async getAll(marriageId) {
    return _load(this._key(marriageId), []);
  },

  async addGuest(marriageId, rawName, extras = {}) {
    const name         = rawName.trim().replace(/\s+/g, ' ');
    if (!name) throw new Error('नाम खाली हुन सक्दैन।');

    const withFamily     = extras.withFamily     ?? false;
    const showWedding    = extras.showWedding    ?? true;   // visibility flag only
    const showReception  = extras.showReception  ?? false;  // visibility flag only
    const invitationURL  = extras.invitationURL  ?? '';

    const guests = await this.getAll(marriageId);

    // Duplicate: same name + same visibility + same family
    const dup = guests.find(g =>
      g.name.toLowerCase()              === name.toLowerCase() &&
      (g.withFamily    || false)        === withFamily         &&
      (g.showWedding   ?? true)         === showWedding        &&
      (g.showReception ?? false)        === showReception
    );
    if (dup) {
      dup.generatedAt  = new Date().toISOString();
      dup.count        = (dup.count || 1) + 1;
      if (invitationURL) dup.invitationURL = invitationURL;
      _save(this._key(marriageId), guests);
      return dup;
    }

    const entry = {
      id:             _uuid(),
      marriageId,
      name,
      withFamily,
      showWedding,
      showReception,
      invitationURL,
      generatedAt:    new Date().toISOString(),
      viewedAt:       null,
      count:          1,
    };
    guests.push(entry);
    _save(this._key(marriageId), guests);
    return entry;
  },

  async markViewed(marriageId, name, extras = {}) {
    const normName      = name.trim().replace(/\s+/g, ' ');
    const withFamily    = extras.withFamily    ?? false;
    const showWedding   = extras.showWedding   ?? true;
    const showReception = extras.showReception ?? false;

    const guests = await this.getAll(marriageId);
    // Try exact match first (name + flags)
    let g = guests.find(x =>
      x.name.toLowerCase()           === normName.toLowerCase() &&
      (x.withFamily    || false)     === withFamily             &&
      (x.showWedding   ?? true)      === showWedding            &&
      (x.showReception ?? false)     === showReception
    );
    // Fallback: name only
    if (!g) g = guests.find(x => x.name.toLowerCase() === normName.toLowerCase());
    if (g && !g.viewedAt) {
      g.viewedAt = new Date().toISOString();
      _save(this._key(marriageId), guests);
    }
  },

  async deleteGuest(marriageId, id) {
    const guests = (await this.getAll(marriageId)).filter(g => g.id !== id);
    _save(this._key(marriageId), guests);
  },

  async clearAll(marriageId) {
    _save(this._key(marriageId), []);
  },
};

/* ════════════════════════════════════════════════════════
   AccountDB — Sub-accounts
════════════════════════════════════════════════════════ */
const AccountDB = {

  getAll() { return _load('wms_accounts', []); },

  getMainPass() {
    const cfg = _load('wedding_site_config', {});
    return cfg.adminPass || '12345';
  },

  create(label, password, marriageId) {
    const accounts = this.getAll();
    const id = _uuid();
    accounts.push({ id, label, password, marriageId, createdAt: new Date().toISOString() });
    _save('wms_accounts', accounts);
    return id;
  },

  update(id, updates) {
    const accounts = this.getAll().map(a => a.id === id ? { ...a, ...updates } : a);
    _save('wms_accounts', accounts);
  },

  delete(id) {
    _save('wms_accounts', this.getAll().filter(a => a.id !== id));
  },

  /* verify — returns {role:'main'|'sub', marriageId} or null */
  verify(password) {
    if (password === this.getMainPass()) return { role: 'main', marriageId: null };
    const sub = this.getAll().find(a => a.password === password);
    if (sub) return { role: 'sub', marriageId: sub.marriageId, accountId: sub.id, label: sub.label };
    return null;
  },
};

/* ════════════════════════════════════════════════════════
   Backward-compat shim — WeddingGuestDB
   (replaces the old GuestDB from db.js on pages that
    load marriages.js; db.js's GuestDB is overridden
    below by reassigning the global variable)
════════════════════════════════════════════════════════ */
const _GuestDBShim = {
  _mid() {
    const active = localStorage.getItem('wms_active_marriage');
    if (active) return active;
    const list = MarriageDB.getAll();
    if (list.length) return list[0].marriageId;
    return MarriageDB.seedIfEmpty().marriageId;
  },

  async addGuest(rawName, extras = {}) {
    // Use explicitly passed marriageId if available, else fall back to active
    const mid = extras.marriageId || this._mid();
    return GuestDBMulti.addGuest(mid, rawName, {
      withFamily:    extras.withFamily    ?? false,
      showWedding:   extras.showWedding   ?? true,
      showReception: extras.showReception ?? false,
      invitationURL: extras.invitationURL ?? '',
    });
  },

  async markViewed(name, extras = {}) {
    return GuestDBMulti.markViewed(this._mid(), name, {
      withFamily:    extras.withFamily    ?? false,
      showWedding:   extras.showWedding   ?? true,
      showReception: extras.showReception ?? false,
    });
  },

  async getAll()         { return GuestDBMulti.getAll(this._mid()); },
  async deleteGuest(id)  { return GuestDBMulti.deleteGuest(this._mid(), id); },
  async clearAll()       { return GuestDBMulti.clearAll(this._mid()); },
  async findByName(name) {
    const g = await this.getAll();
    return g.find(x => x.name.toLowerCase() === name.trim().toLowerCase()) || null;
  },
  setAdapter() {},
};

/* Override any previously-declared GuestDB (from db.js) with the
   marriages.js shim so all pages use the multi-marriage system. */
// eslint-disable-next-line no-global-assign
try { GuestDB = _GuestDBShim; } catch(e) { /* already const — use window */ }
if (typeof window !== 'undefined') { window.GuestDB = _GuestDBShim; }

/* ── Auto-seed on load ── */
MarriageDB.seedIfEmpty();
