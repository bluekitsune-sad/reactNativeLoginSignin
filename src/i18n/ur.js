/**
 * Urdu string catalog for MallMate (PRD section 10 — English and Urdu at
 * launch, RTL-ready). Mirrors `en.js` key-for-key; the i18n test suite
 * enforces parity. `t()` falls back to English for any missing key.
 */
export const ur = {
  common: {
    goBack: "واپس جائیں",
    retry: "دوبارہ کوشش کریں",
    cancel: "منسوخ کریں",
    save: "محفوظ کریں",
    close: "بند کریں",
    loading: "لوڈ ہو رہا ہے…",
    mockDataNote: "پیشگی ورژن — ڈیٹا نمونوی (mock) ہے۔ ابھی لائیو سروسز سے منسلک نہیں۔",
    noLivePositioning: "کوئی لائیو مقام کی نشاندہی یا قدم‌بہ‌قدم رہنمائی نہیں۔",
  },
  mall: {
    switchMall: "مال تبدیل کریں",
    selectedMall: "منتخب مال",
    mapsUnavailable: "نقشے دستیاب نہیں",
  },
  search: {
    placeholder: "{mall} میں تلاش کریں",
    noResults: "کوئی نتیجہ نہیں",
    searchFailed: "تلاش ناکام ہوئی",
  },
  orders: {
    title: "آپ کے آرڈرز",
    empty: "ابھی کوئی آرڈر نہیں",
    timeline: "صورتحال کی سلسلہ‌وار",
  },
  rewards: {
    title: "انعامات",
    emptyLedger: "ابھی کوئی سرگرمی نہیں",
    basedOnAppOrders: "صرف مکمل شدہ ایپ آرڈرز پر مبنی۔ کل مال کی فروخت نہیں۔",
  },
  auth: {
    signIn: "سائن ان",
    welcome: "خوش آمدید",
    welcomeSubtitle: "اپنا صارف نام اور پاس ورڈ درج کریں اور کھانے کی آرڈرنگ کا لطف اٹھائیں",
    signUp: "سائن اپ",
    createAccount: "اکاؤنٹ بنائیں",
    signupSubtitle: "ہمارے ساتھ شامل ہیں اور اپنے پسندیدہ کھانے کی آرڈر شروع کریں",
    username: "صارف نام",
    email: "ای میل",
    password: "پاس ورڈ",
    confirmPassword: "پاس ورڈ کی تصدیق کریں",
    showPassword: "پاس ورڈ دکھائیں",
    hidePassword: "پاس ورڈ چھپائیں",
    rememberMe: "مجھے یاد رکھیں",
    forgotPassword: "پاس ورڈ بھول گئے",
    noAccount: "کوئی اکاؤنٹ نہیں ہے؟",
    alreadyHaveAccount: "پہلے سے اکاؤنٹ موجود ہے؟",
    forgotPasswordTitle: "اپنا پاس ورڈ دوبارہ سیٹ کریں",
    forgotPasswordSubtitle: "اپنے اکاؤنٹ سے منسلک ای میل درج کریں، ہم آپ کو ری سیٹ ہدایت بھیجیں گے",
    sendInstructions: "ہدایت بھیجیں",
    backToSignIn: "سائن ان پر واپس",
    fillAllFields: "تمام خانے پُر کریں",
    validEmail: "براہ کرم درست ای میل درج کریں",
    enterEmail: "براہ کرم اپنا ای میل درج کریں",
    passwordsNoMatch: "پاس ورڈ مطابقت نہیں رکھتے",
    resetSentIfAccount:
      "اگر اس ای میل کا کوئی اکاؤنٹ موجود ہے تو ری سیٹ ہدایت اسی پر بھیجی جائے گی",
    noAccountWithEmail: "اس ای میل پر کوئی اکاؤنٹ نہیں ملا",
    registrationSuccess: "رجسٹریشن کامیاب",
    registrationSuccessBody: "آپ کا اکاؤنٹ بنا دیا گیا ہے۔ براہ کرم سائن ان کریں۔",
    ok: "ٹھیک ہے",
  },
};

export default ur;
