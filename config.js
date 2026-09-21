/**
 * ════════════════════════════════════════════════════════
 *  WEDDING CONFIGURATION — केन्द्रीय विवाह डेटा
 *  Admin panel ले localStorage मा 'wedding_site_config'
 *  key मा save गर्छ र यही defaults लाई override गर्छ।
 * ════════════════════════════════════════════════════════
 */

const WEDDING_CONFIG_DEFAULTS = {

  // ── वर ──────────────────────────────────────────────
  groomName:        "प्रजेम्स श्रेष्ठ",
  groomFatherName:  "प्रेम कुमार श्रेष्ठ",
  groomMotherName:  "आशमाया श्रेष्ठ",

  // ── वधू ─────────────────────────────────────────────
  brideName:        "पुजा श्रेष्ठ",
  brideFatherName:  "मेष नारायण श्रेष्ठ",
  brideMotherName:  "शोभा श्रेष्ठ",

  // ── विवाह मिति/समय ──────────────────────────────────
  weddingDateNepali:   "मंसिर १९, २०८३",
  weddingDateEN:       "2026-12-05",
  weddingTime:         "बिहान ९:०० बजे",
  weddingTimeEN:       "09:00:00",

  // ── रिसेप्शन मिति/समय ───────────────────────────────
  receptionDateNepali: "मंसिर २०, २०८३",
  receptionTime:       "दिउँसो २:०० बजे",

  // ── स्थान ────────────────────────────────────────────
  venueName:    "आफ्नै निवास",
  venueAddress: "रामलाल चोक, रत्ननगर–१२, चितवन",
  mapsURL:      "https://maps.app.goo.gl/MxxMJZ7Dusjinwjh6",

  // ── सम्पर्क ──────────────────────────────────────────
  phone:        "९८६५–२०९०४९",
  phoneRaw:     "9865209049",

  // ── Quote ────────────────────────────────────────────
  quote: "प्रेम, संस्कार र साथले जीवनको नयाँ यात्रा शुभ बनोस्।",

  // ── Page texts ───────────────────────────────────────
  pageTitle:       "शुभ विवाह — प्रजेम्स ❤ पुजा",
  heroTagline:     "हामी दुईको जीवनको नयाँ यात्राको शुभारम्भमा यहाँहरूको गरिमामय उपस्थितिका लागि हार्दिक निमन्त्रणा।",
  invitationPara:  "श्री प्रेम कुमार श्रेष्ठ तथा श्रीमती आशमाया श्रेष्ठका आयुष्मान सुपुत्र प्रजेम्स श्रेष्ठको शुभ विवाह श्री मेष नारायण श्रेष्ठ तथा श्रीमती शोभा श्रेष्ठकी आयुष्मती सुपुत्री पुजा श्रेष्ठसँग हुन गइरहेको हुँदा यस शुभ अवसरमा यहाँको गरिमामय उपस्थितिका साथै वर–वधूलाई शुभाशीर्वाद प्रदान गरिदिनुहुन सादर निमन्त्रणा गर्दछौँ।",
  ceremonyInfo:    "मंसिर १९, २०८३ — बिहान ९:०० बजे — आफ्नै निवास, रामलाल चोक, रत्ननगर–१२, चितवन",

  // ── Theme ────────────────────────────────────────────
  themeStyle:      "newari",   // newari | modern | classic
  primaryColor:    "#5a0f1e",  // maroon
  accentColor:     "#d4a017",  // gold
  bgColor:         "#fdf6e9",  // cream

  // ── Admin ────────────────────────────────────────────
  adminPass: "12345",
};

/**
 * getConfig() — admin ले save गरेको config फर्काउँछ,
 * नभए defaults फर्काउँछ।
 */
function getConfig(){
  try{
    const saved = localStorage.getItem('wedding_site_config');
    if(saved){
      return Object.assign({}, WEDDING_CONFIG_DEFAULTS, JSON.parse(saved));
    }
  }catch(e){}
  return Object.assign({}, WEDDING_CONFIG_DEFAULTS);
}

/**
 * saveConfig(obj) — localStorage मा merge गरेर save गर्छ।
 */
function saveConfig(updates){
  try{
    const current = getConfig();
    const merged  = Object.assign({}, current, updates);
    localStorage.setItem('wedding_site_config', JSON.stringify(merged));
    return true;
  }catch(e){ return false; }
}

// Legacy compatibility
const WEDDING_CONFIG = WEDDING_CONFIG_DEFAULTS;
Object.freeze(WEDDING_CONFIG);
