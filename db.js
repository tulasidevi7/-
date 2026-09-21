/**
 * ════════════════════════════════════════════════════════
 *  GUEST DATABASE ABSTRACTION — अतिथि डेटा व्यवस्थापन
 *
 *  अहिले: localStorage प्रयोग गर्छ
 *  पछि:  Firebase / Supabase जोड्न सजिलो हुने structure
 *
 *  Firebase जोड्न: GuestDB.adapter लाई replace गर्नुहोस्
 * ════════════════════════════════════════════════════════
 *
 *  Guest entry schema:
 *  {
 *    id:           string  (UUID)
 *    name:         string  (अतिथिको नाम)
 *    withFamily:   boolean (परिवार सहित)
 *    selectedDate: string  "मंसिर १९, २०८३|बिहान ९:०० बजे"
 *    generatedAt:  ISO string
 *    viewedAt:     ISO string | null
 *    count:        number  (कति पटक generate गरियो)
 *  }
 */

const GuestDB = (() => {
  const STORAGE_KEY = "wedding_guests_v1";

  // ── LocalStorage Adapter (default) ───────────────────
  const localAdapter = {
    async getAll() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch { return []; }
    },
    async save(guests) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    },
  };

  // ── Firebase Adapter (plug in when ready) ────────────
  // const firebaseAdapter = {
  //   async getAll() {
  //     const snap = await getDocs(collection(db, "guests"));
  //     return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  //   },
  //   async save(guests) {
  //     // Firebase: use setDoc / updateDoc per guest
  //   },
  // };

  // ── Active Adapter ────────────────────────────────────
  let adapter = localAdapter;

  // ── Helper ────────────────────────────────────────────
  function normaliseName(name) {
    return name.trim().replace(/\s+/g, " ");
  }

  // ── Public API ────────────────────────────────────────
  return {

    /**
     * अतिथिको नाम थप्नुहोस्
     *
     * @param {string} rawName        — अतिथिको नाम
     * @param {object} [extras]       — { withFamily: bool, selectedDate: string }
     *
     * Duplicate logic:
     *   Same name + same date + same family → update timestamp, increment count
     *   Same name but different date/family  → NEW separate entry (different invitation)
     *
     * @returns {object} guest entry
     */
    async addGuest(rawName, extras = {}) {
      const name       = normaliseName(rawName);
      if (!name) throw new Error("नाम खाली हुन सक्दैन।");

      const withFamily   = extras.withFamily   ?? false;
      const selectedDate = extras.selectedDate ?? '';

      const guests = await adapter.getAll();

      // Duplicate: same name + same date + same family setting
      const existing = guests.find(g =>
        g.name.toLowerCase()  === name.toLowerCase() &&
        (g.selectedDate || '') === selectedDate &&
        (g.withFamily   || false) === withFamily
      );

      if (existing) {
        existing.generatedAt = new Date().toISOString();
        existing.count       = (existing.count || 1) + 1;
        await adapter.save(guests);
        return existing;
      }

      const entry = {
        id:           crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        name,
        withFamily,
        selectedDate,
        generatedAt:  new Date().toISOString(),
        viewedAt:     null,
        count:        1,
      };
      guests.push(entry);
      await adapter.save(guests);
      return entry;
    },

    /**
     * अतिथिले निमन्त्रणा हेरेको record गर्नुहोस्
     * URL params: name + date + family ले unique entry identify गर्छ
     */
    async markViewed(name, extras = {}) {
      const normName   = normaliseName(name);
      const selDate    = extras.selectedDate ?? '';
      const withFamily = extras.withFamily   ?? false;

      const guests = await adapter.getAll();

      // Try exact match first (name + date + family)
      let g = guests.find(x =>
        x.name.toLowerCase()    === normName.toLowerCase() &&
        (x.selectedDate || '')  === selDate &&
        (x.withFamily   || false) === withFamily
      );

      // Fallback: name only (older entries without date/family)
      if (!g) {
        g = guests.find(x => x.name.toLowerCase() === normName.toLowerCase());
      }

      if (g && !g.viewedAt) {
        g.viewedAt = new Date().toISOString();
        await adapter.save(guests);
      }
    },

    /** सबै अतिथिहरूको list */
    async getAll() {
      return adapter.getAll();
    },

    /** अतिथि खोज्नुहोस् (name only) */
    async findByName(name) {
      const guests = await adapter.getAll();
      return guests.find(
        g => g.name.toLowerCase() === normaliseName(name).toLowerCase()
      ) || null;
    },

    /** एउटा अतिथि मेट्नुहोस् */
    async deleteGuest(id) {
      let guests = await adapter.getAll();
      guests = guests.filter(g => g.id !== id);
      await adapter.save(guests);
    },

    /** सबै मेट्नुहोस् */
    async clearAll() {
      await adapter.save([]);
    },

    /** adapter switch गर्नुहोस् (Firebase जोड्दा) */
    setAdapter(newAdapter) {
      adapter = newAdapter;
    },
  };
})();
