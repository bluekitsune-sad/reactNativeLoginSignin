/**
 * English string catalog for MallMate (i18n, PRD section 10 — English and
 * Urdu at launch). Keys are grouped by feature area. Values may contain
 * `{placeholders}` filled by `t(key, params)`. This catalog is the English
 * source of truth that translations (`ur.js`) mirror key-for-key.
 */
export const en = {
  common: {
    goBack: "Go back",
    retry: "Retry",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    loading: "Loading…",
    mockDataNote: "Preview build — mock data. Not connected to live services yet.",
    noLivePositioning: "No live positioning or turn-by-turn navigation.",
  },
  mall: {
    switchMall: "Switch mall",
    selectedMall: "Selected mall",
    mapsUnavailable: "Maps unavailable",
  },
  search: {
    placeholder: "Search {mall}",
    noResults: "No results",
    searchFailed: "Search failed",
  },
  orders: {
    title: "Your orders",
    empty: "No orders yet",
    timeline: "Status timeline",
  },
  rewards: {
    title: "Rewards",
    emptyLedger: "No activity yet",
    basedOnAppOrders: "Based on completed app orders only. Not total mall sales.",
  },
  auth: {
    signIn: "Sign In",
    welcome: "Welcome",
    welcomeSubtitle: "Enter your username and password, and enjoy ordering food",
    signUp: "Sign Up",
    createAccount: "Create account",
    signupSubtitle: "Join us and start ordering your favorite food",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password",
    noAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    forgotPasswordTitle: "Reset your password",
    forgotPasswordSubtitle:
      "Enter the email associated with your account and we will send you reset instructions",
    sendInstructions: "Send Instructions",
    backToSignIn: "Back to Sign In",
    fillAllFields: "Please fill up all fields",
    validEmail: "Please enter a valid email address",
    enterEmail: "Please enter your email address",
    passwordsNoMatch: "Passwords do not match",
    resetSentIfAccount:
      "If an account exists for this email, password reset instructions will be sent to it.",
    noAccountWithEmail: "No account found with this email",
    registrationSuccess: "Registration successful",
    registrationSuccessBody: "Your account has been created. Please sign in.",
    ok: "OK",
  },
};

export default en;
