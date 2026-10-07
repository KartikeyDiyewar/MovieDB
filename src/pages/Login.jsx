import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setAuthLoading } from "../features/auth/authSlice";
import { setToast } from "../features/baseUrl/basicDataSlice";
import AiSparkIcon from "../components/common/AiSparkIcon";
import "./Login.css";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 India (+91)" },
  { code: "+1", label: "🇺🇸 USA / Canada (+1)" },
  { code: "+44", label: "🇬🇧 UK (+44)" },
  { code: "+61", label: "🇦🇺 Australia (+61)" },
  { code: "+971", label: "🇦🇪 UAE (+971)" },
  { code: "+49", label: "🇩🇪 Germany (+49)" },
  { code: "+81", label: "🇯🇵 Japan (+81)" },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // Toggle between "signin" and "signup"
  const [authMode, setAuthMode] = useState("signin");
  // Toggle between "email" and "phone"
  const [method, setMethod] = useState("email");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP flow for Phone
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Validation & Error state
  const [formError, setFormError] = useState("");

  const fromPath = location.state?.from || "/";

  // Handle Demo Account 1-Click Login
  const handleDemoLogin = () => {
    dispatch(setAuthLoading(true));
    setTimeout(() => {
      const demoUser = {
        id: "usr_demo_vip",
        name: "Cinema Enthusiast",
        email: "critic@kdmoviez.com",
        method: "demo",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
        role: "VIP Member",
        joinedAt: new Date().toISOString(),
      };
      dispatch(loginUser(demoUser));
      dispatch(setToast("Welcome to KD Moviez VIP, Cinema Enthusiast! 🍿"));
      navigate(fromPath, { replace: true });
    }, 450);
  };

  // Google OAuth Placeholder
  const handleGoogleAuth = () => {
    dispatch(setAuthLoading(true));
    setTimeout(() => {
      const googleUser = {
        id: `usr_google_${Date.now()}`,
        name: "Google Cinephile",
        email: "user@gmail.com",
        method: "google",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
        role: "Member",
        joinedAt: new Date().toISOString(),
      };
      dispatch(loginUser(googleUser));
      dispatch(setToast("Successfully signed in with Google! 🚀"));
      navigate(fromPath, { replace: true });
    }, 600);
  };

  // Handle Send OTP
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.trim().length < 7) {
      setFormError("Please enter a valid phone number (at least 7 digits).");
      return;
    }
    setFormError("");
    setOtpSent(true);
    setCountdown(30);
    dispatch(setToast(`Verification code sent to ${countryCode} ${phone} 📲`));

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Main Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (method === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email.trim())) {
        setFormError("Please enter a valid email address.");
        return;
      }
      if (!password || password.length < 6) {
        setFormError("Password must be at least 6 characters.");
        return;
      }
      if (authMode === "signup") {
        if (!name.trim()) {
          setFormError("Please enter your full name.");
          return;
        }
        if (password !== confirmPassword) {
          setFormError("Passwords do not match.");
          return;
        }
      }
    } else {
      // Phone method
      if (!phone.trim() || phone.trim().length < 7) {
        setFormError("Please enter a valid phone number.");
        return;
      }
      if (authMode === "signin" && !otpSent && !password) {
        setFormError("Please enter your password or request an OTP.");
        return;
      }
      if (otpSent && (!otpCode || otpCode.trim().length < 4)) {
        setFormError("Please enter the 4-digit verification code sent to your phone.");
        return;
      }
    }

    // Process simulated login
    dispatch(setAuthLoading(true));
    setTimeout(() => {
      const displayName =
        name.trim() ||
        (method === "email"
          ? email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ")
          : `Member ${phone.slice(-4)}`);

      const authenticatedUser = {
        id: `usr_${Date.now()}`,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: method === "email" ? email.trim() : null,
        phone: method === "phone" ? `${countryCode} ${phone.trim()}` : null,
        method,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
        role: "Member",
        rememberMe,
        joinedAt: new Date().toISOString(),
      };

      dispatch(loginUser(authenticatedUser));
      dispatch(
        setToast(
          authMode === "signup"
            ? `Welcome to KD Moviez, ${authenticatedUser.name}! 🎉`
            : `Welcome back, ${authenticatedUser.name}! 🎬`
        )
      );
      navigate(fromPath, { replace: true });
    }, 600);
  };

  return (
    <div className="login-page-container">
      {/* Ambient Cinema Lighting Effects */}
      <div className="login-ambient-orb orb-primary" />
      <div className="login-ambient-orb orb-secondary" />

      {/* Top Navigation Bar */}
      <header className="login-top-bar">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="login-back-btn"
          aria-label="Back to Cinema Catalog"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Movies</span>
        </button>

        <Link to="/" className="login-brand-link">
          <div className="brand-logo-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="3"
                width="20"
                height="18"
                rx="4"
                stroke="url(#loginBrandGrad)"
                strokeWidth="2"
              />
              <path
                d="M7 3V21M17 3V21M2 8H7M2 16H7M17 8H22M17 16H22M7 12H17"
                stroke="url(#loginBrandGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="loginBrandGrad"
                  x1="2"
                  y1="3"
                  x2="22"
                  y2="21"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-title">
            KD<span className="brand-highlight">MOVIEZ</span>
          </span>
        </Link>
      </header>

      {/* Main Form Center Box */}
      <main className="login-card-wrapper">
        <div className="login-card">
          {/* Card Header */}
          <div className="login-card-header">
            <div className="login-ai-tag">
              <AiSparkIcon size={14} />
              <span>KD Cinema ID</span>
            </div>
            <h1 className="login-title">
              {authMode === "signin" ? "Welcome Back" : "Join KD Moviez"}
            </h1>
            <p className="login-subtitle">
              {authMode === "signin"
                ? "Sign in to sync your AI taste profile, watchlists, and streaming filters across all devices."
                : "Create an account to unlock personalized cinema intelligence, AI night planner, and reviews."}
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="login-demo-bar">
            <span>Testing the app?</span>
            <button
              type="button"
              className="demo-account-btn"
              onClick={handleDemoLogin}
              disabled={loading}
              title="1-Click Instant Access without registration"
            >
              ⚡ Instant Demo VIP Access
            </button>
          </div>

          {/* Auth Method Switcher Tabs (Email vs Phone) */}
          <div className="auth-method-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={method === "email"}
              className={`method-tab-btn ${method === "email" ? "active" : ""}`}
              onClick={() => {
                setMethod("email");
                setFormError("");
              }}
            >
              <span className="method-tab-icon">✉️</span>
              <span>Email Address</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={method === "phone"}
              className={`method-tab-btn ${method === "phone" ? "active" : ""}`}
              onClick={() => {
                setMethod("phone");
                setFormError("");
              }}
            >
              <span className="method-tab-icon">📱</span>
              <span>Phone Number</span>
            </button>
          </div>

          {/* Error Alert Banner */}
          {formError && (
            <div className="login-error-alert" role="alert">
              <span className="error-icon">⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          {/* Interactive Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Full Name field (only on Sign Up) */}
            {authMode === "signup" && (
              <div className="form-group">
                <label htmlFor="auth-name" className="form-label">
                  Full Name
                </label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input
                    id="auth-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Christopher Nolan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Method Inputs */}
            {method === "email" ? (
              <div className="form-group">
                <label htmlFor="auth-email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    id="auth-email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
            ) : (
              /* Phone Method Inputs */
              <div className="form-group">
                <label htmlFor="auth-phone" className="form-label">
                  Mobile Phone Number
                </label>
                <div className="phone-input-row">
                  <select
                    id="country-code"
                    name="countryCode"
                    className="country-code-select"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label="Country Dial Code"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <div className="input-wrap phone-wrap">
                    <input
                      id="auth-phone"
                      type="tel"
                      className="form-input"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Phone OTP Verification Sub-Flow */}
            {method === "phone" && otpSent && (
              <div className="form-group otp-group">
                <div className="otp-header-row">
                  <label htmlFor="auth-otp" className="form-label">
                    4-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    className="resend-otp-btn"
                    onClick={handleSendOtp}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                  </button>
                </div>
                <div className="input-wrap">
                  <span className="input-icon">🔑</span>
                  <input
                    id="auth-otp"
                    type="text"
                    maxLength={6}
                    className="form-input otp-input"
                    placeholder="1234"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Password Field (for Email, or Phone when OTP not yet sent) */}
            {(method === "email" || !otpSent) && (
              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="auth-password" className="form-label">
                    Password
                  </label>
                  {authMode === "signin" && method === "email" && (
                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() =>
                        dispatch(
                          setToast("Password reset instructions sent to your email 📬")
                        )
                      }
                    >
                      Forgot?
                    </button>
                  )}
                  {method === "phone" && !otpSent && (
                    <button
                      type="button"
                      className="use-otp-link"
                      onClick={handleSendOtp}
                    >
                      Send OTP via SMS 💬
                    </button>
                  )}
                </div>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={
                      authMode === "signup" ? "new-password" : "current-password"
                    }
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (Sign Up only) */}
            {authMode === "signup" && method === "email" && (
              <div className="form-group">
                <label htmlFor="auth-confirm-password" className="form-label">
                  Confirm Password
                </label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    id="auth-confirm-password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="form-meta-row">
              <label htmlFor="remember-me" className="remember-checkbox-label">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="submit-spinner-wrap">
                  <div className="login-spinner" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <span>
                  {authMode === "signin"
                    ? otpSent
                      ? "Verify & Continue ➔"
                      : "Sign In to KD Moviez ➔"
                    : "Create Account ➔"}
                </span>
              )}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="login-divider">
            <span className="divider-line" />
            <span className="divider-text">OR CONTINUE WITH</span>
            <span className="divider-line" />
          </div>

          {/* Google OAuth Button */}
          <div className="social-login-grid">
            <button
              type="button"
              className="social-auth-btn google-btn"
              onClick={handleGoogleAuth}
              disabled={loading}
              title="Continue with Google"
            >
              <svg
                className="google-svg-logo"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Toggle between Sign In and Sign Up */}
          <div className="login-footer-switch">
            {authMode === "signin" ? (
              <p>
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => {
                    setAuthMode("signup");
                    setFormError("");
                  }}
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => {
                    setAuthMode("signin");
                    setFormError("");
                  }}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Legal Footnote */}
          <p className="login-legal-terms">
            By continuing, you agree to KD Moviez&apos;s{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
