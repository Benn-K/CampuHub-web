import React, { useState } from 'react';
import { parseGhanaMoMoDetails } from '../../utils/momoFormatter';
import { useAppStore } from '../../store';
import { supabase } from '../../supabaseClient';
import { useModal } from '../../components/modal/ModalContext';
import './auth.css';

const router = {
  replace: (route) => {
    if (route === '/(tabs)/home') {
      window.location.hash = '#home';
    } else {
      window.location.hash = `#${route.replace('/', '')}`;
    }
  },
  push: (route) => {
    if (typeof route === 'object' && route.pathname) {
      const params = new URLSearchParams(route.params || {}).toString();
      window.location.hash = `#${route.pathname.replace(/^\/+/, '')}?${params}`;
    } else {
      window.location.hash = `#${route.replace(/^\/+/, '')}`;
    }
  }
};

// ===== ICONS =====
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const CampuHubLogo = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.2" />
    <path d="M16 8c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" fill="white" />
    <circle cx="16" cy="12" r="1.5" fill="rgba(255,255,255,0.6)" />
  </svg>
);

const ALLOWED_DOMAINS = [
  '@st.ug.edu.gh', '@st.knust.edu.gh', '@idl.knust.edu.gh',
  '@st.ucc.edu.gh', '@st.uds.edu.gh', '@st.uew.edu.gh',
  '@st.uhas.edu.gh', '@st.umat.edu.gh', '@st.uenr.edu.gh',
  '@st.upsa.edu.gh', '@st.gctu.edu.gh', '@st.gimpa.edu.gh',
  '@st.uesd.edu.gh', '@st.ckt-utas.edu.gh', '@st.sdd-ubids.edu.gh',
  '@st.aam-usted.edu.gh',
  '@ashesi.edu.gh', '@acity.edu.gh', '@vvu.edu.gh',
  '@mucg.edu.gh', '@cug.edu.gh', '@presbyuniversity.edu.gh',
  '@wiuc.edu.gh', '@gbuc.edu.gh', '@csuc.edu.gh'
];

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const { showAlert } = useModal();

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      await showAlert({ title: 'Missing Info', message: 'Please fill out all fields to create your account.', type: 'warning' });
      return;
    }

    const phoneClean = phone.replace(/\D/g, '');
    const momoDetails = parseGhanaMoMoDetails(phoneClean);
    
    if (!momoDetails.isValid) {
      await showAlert({ title: 'Invalid MoMo', message: 'Please enter a valid 10-digit Ghanaian mobile money number (MTN, Telecel, or AirtelTigo).', type: 'warning' });
      return;
    }

    if (password !== confirmPassword) {
      await showAlert({ title: 'Password Mismatch', message: 'Your passwords do not match. Please try again.', type: 'warning' });
      return;
    }

    if (password.length < 8) {
      await showAlert({ title: 'Weak Password', message: 'Password must be at least 8 characters long.', type: 'warning' });
      return;
    }

    const trimmedEmail = email.toLowerCase().trim();
    const isDomainValid = ALLOWED_DOMAINS.some(domain => trimmedEmail.endsWith(domain));

    if (!isDomainValid) {
      await showAlert({ title: 'Verification Failed', message: 'CampuHub requires a recognized university student email. If your university is not supported, please contact support.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const generatedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&background=2563eb&color=fff`;

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: momoDetails.number,
            momo_number: momoDetails.number,
            momo_network: momoDetails.network,
            avatar: generatedAvatar,
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        // DO NOT set currentUser here, we are not verified yet.
        await showAlert({ title: 'Account Created!', message: 'Please check your university email for the verification code.', type: 'success' });
        router.push(`/auth/verify-code?email=${encodeURIComponent(trimmedEmail)}`);
      }
    } catch (error) {
      await showAlert({ title: 'Sign Up Failed', message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ===== LEFT PANEL ===== */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <CampuHubLogo />
            </div>
            <span className="auth-logo-text">CampuHub</span>
          </div>
          <h1 className="auth-title">Your campus,<br />your marketplace.</h1>
          <p className="auth-subtitle">
            Join thousands of students buying, selling, and trading safely within their university community.
          </p>
        </div>

        <div className="auth-trust-badges">
          <div className="auth-trust-badge">
            <div className="auth-trust-badge-icon"><ShieldIcon /></div>
            <div className="auth-trust-badge-text">
              <strong>Verified Students Only</strong>
              <span>Requires a valid .edu.gh email address</span>
            </div>
          </div>
          <div className="auth-trust-badge">
            <div className="auth-trust-badge-icon"><UsersIcon /></div>
            <div className="auth-trust-badge-text">
              <strong>Campus Community</strong>
              <span>Trade with people on your campus</span>
            </div>
          </div>
          <div className="auth-trust-badge">
            <div className="auth-trust-badge-icon"><ZapIcon /></div>
            <div className="auth-trust-badge-text">
              <strong>List in Seconds</strong>
              <span>Simple, fast, and free to get started</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="auth-right">
        <button className="auth-skip" onClick={() => router.replace('/(tabs)/home')}>
          Skip
          <ArrowRightIcon />
        </button>

        <div className="auth-card auth-card--scrollable">

          {/* Card header - always visible */}
          <div className="auth-card-header">
            <div className="auth-brand-logo">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.2" />
                <path d="M16 8c-2.2 0-4 1.8-4 4 0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" fill="white" />
                <circle cx="16" cy="12" r="1.5" fill="rgba(255,255,255,0.5)" />
              </svg>
            </div>
            <h2>Create your account</h2>
            <p>Student-only campus marketplace</p>
          </div>

          {/* Name row */}
          <div className="auth-row">
            <div className="auth-input-group">
              <label className="auth-label">First Name</label>
              <div className="auth-input-wrapper">
                <UserIcon className="auth-input-icon" />
                <input
                  className="auth-input"
                  placeholder="Kwame"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Last Name</label>
              <div className="auth-input-wrapper">
                <input
                  className="auth-input"
                  placeholder="Acheampong"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="auth-input-group">
            <label className="auth-label">Student Email</label>
            <div className="auth-input-wrapper">
              <MailIcon className="auth-input-icon" />
              <input
                className="auth-input"
                placeholder="name@st.knust.edu.gh"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="auth-input-group">
            <label className="auth-label">Phone Number (MoMo)</label>
            <div className="auth-input-wrapper">
              <PhoneIcon className="auth-input-icon" />
              <input
                className="auth-input"
                placeholder="0541234567"
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <LockIcon className="auth-input-icon" />
              <input
                className="auth-input"
                placeholder="Min. 8 characters"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="auth-btn-icon" onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-input-group">
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrapper">
              <LockIcon className="auth-input-icon" />
              <input
                className="auth-input"
                placeholder="Re-enter your password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="auth-btn-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button">
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            className="auth-submit"
            onClick={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'auth-spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Terms */}
          <p className="auth-terms">
            By signing up, you agree to our{' '}
            <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>.
          </p>

          {/* Footer */}
          <div className="auth-footer">
            <span>Already have an account?</span>
            <button className="auth-footer-link" onClick={() => router.push('/auth/login')}>
              Log In
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes auth-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}