# शुभ विवाह — पुजा माया र प्रजेम्स
## Wedding Invitation Website — Setup Guide

---

## 📁 File Structure

```
d:\Kiro\
├── index.html          ← मुख्य पृष्ठ (Guest Name Input)
├── invitation.html     ← व्यक्तिगत निमन्त्रणा कार्ड
├── admin-panel.html    ← व्यवस्थापक पृष्ठ
├── config.js           ← केन्द्रीय विवाह डेटा (यहाँ परिवर्तन गर्नुहोस्)
├── db.js               ← अतिथि डेटा व्यवस्थापन
└── photos/
    ├── bride.jpg       ← दुलहीको फोटो (यहाँ राख्नुहोस्)
    └── groom.jpg       ← दुलाहाको फोटो (यहाँ राख्नुहोस्)
```

---

## 📸 फोटो राख्ने तरिका

1. दुलहीको फोटो → `photos/bride.jpg` नाम दिएर save गर्नुहोस्
2. दुलाहाको फोटो → `photos/groom.jpg` नाम दिएर save गर्नुहोस्
3. फोटो **portrait orientation** (tall) भए राम्रो देखिन्छ
4. सिफारिस size: 600×800 px वा सो भन्दा ठूलो

---

## ⚙️ विवरण परिवर्तन गर्ने (config.js)

`config.js` फाइल खोलेर तलका मान परिवर्तन गर्न सकिन्छ:

| के परिवर्तन गर्ने | कहाँ |
|---|---|
| विवाहको मिति/समय | `weddingDate` section |
| दुलही/दुलाहाको नाम | `bride.name` / `groom.name` |
| बुवाको नाम | `bride.fatherName` / `groom.fatherName` |
| स्थान | `venue` section |
| Google Maps link | `venue.mapsURL` |
| Admin password | `site.adminPass` |

---

## 🔐 Admin Panel

- URL: `admin-panel.html`
- Default password: `admin123`
- **महत्वपूर्ण:** `config.js` मा `site.adminPass` बदल्नुहोस्!

Admin panel मा:
- कुल अतिथि संख्या
- हेरिसकेका / नहेरेका count
- अतिथिको नाम, मिति, अवस्था
- CSV निर्यात
- खोज्ने सुविधा

---

## 🚀 Website चलाउने तरिका

**Local:**
`index.html` browser मा double-click गर्नुहोस्

**Online deploy गर्न:**
- [Vercel](https://vercel.com) — Free, सबैभन्दा सजिलो
- [Netlify](https://netlify.app) — Free drag & drop
- [GitHub Pages](https://pages.github.com) — Free

---

## 🔗 Website Flow

```
index.html
  ↓ (नाम लेखेर बटन थिच्नुहोस्)
invitation.html?guest=नाम
  ├── Section 1: Hero (फोटो + नाम + मिति)
  ├── Section 2: व्यक्तिगत निमन्त्रणा
  ├── Section 3: समारोह + परिवार + स्थान
  └── Section 4: Countdown Timer

admin-panel.html
  └── अतिथि list + stats + CSV export
```

---

## 🔥 Firebase जोड्न (Optional — पछि)

`db.js` फाइलमा `firebaseAdapter` already defined छ (commented out)।
Firebase project बनाएपछि:
1. `firebaseAdapter` को comment हटाउनुहोस्
2. `GuestDB.setAdapter(firebaseAdapter)` call गर्नुहोस्
