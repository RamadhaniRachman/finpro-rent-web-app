import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/search', label: 'Find Stays', public: true },
  { to: '/sustainability', label: 'Sustainability', public: true },
  { to: '/about', label: 'About Us', public: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tampilkan toast notifikasi sementara (2.5 detik)
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Anda telah berhasil keluar.');
  };

  // Tombol "Host Your Eco-Stay" — hanya untuk USER (bukan TENANT)
  const handleHostClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      showToast('Anda harus login terlebih dahulu untuk mendaftar sebagai Host.');
    } else if (user.role === 'TENANT') {
      e.preventDefault();
      showToast('Akun Tenant tidak dapat mendaftar sebagai Host baru.');
    }
    // Jika role USER -> biarkan navigasi berjalan normal
  };

  const isLoggedIn = !!user;
  const isUser = user?.role === 'USER';
  const isTenant = user?.role === 'TENANT';

  return (
    <>
      {/* ====== TOAST NOTIFICATION ====== */}
      {toast && (
        <div className="toast-notification" role="alert" aria-live="polite">
          <span className="material-symbols-outlined" style={{ fontSize: 18, flexShrink: 0 }}>info</span>
          {toast}
        </div>
      )}

      <header className="navbar">
        <div className="navbar__inner container-page">

          {/* Logo */}
          <Link to="/" className="navbar__logo" style={{ textDecoration: 'none', color: 'var(--on-surface)' }}>
            Evergreen Escapes
          </Link>

          {/* Desktop Nav Links */}
          <nav className="navbar__links">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="navbar__link">
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="navbar__actions">

            {/* Tombol "Host Your Eco-Stay" — disabled style jika TENANT */}
            <Link
              to="/tenant/register"
              className={`navbar__cta ${isTenant ? 'navbar__cta--disabled' : ''}`}
              onClick={handleHostClick}
              title={isTenant ? 'Akun Tenant tidak dapat mendaftar sebagai Host baru' : ''}
            >
              Host Your Eco-Stay
            </Link>

            {/* Kondisi tampilan berdasarkan status login */}
            {!isLoggedIn ? (
              // Belum login → tampilkan icon person yang mengarah ke login
              <Link to="/login" aria-label="Login" className="btn-icon" title="Login atau Daftar">
                <span className="material-symbols-outlined" style={{ fontSize: 37 }}>person</span>
              </Link>
            ) : (
              // Sudah login → tampilkan dropdown profil
              <div className="navbar__profile-menu">
                <button
                  className="btn-icon navbar__profile-btn"
                  aria-label="Menu profil"
                  onClick={() => setOpen(o => !o)}
                  title={`Login sebagai ${user.name} (${user.role})`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--primary)' }}>
                    account_circle
                  </span>
                </button>

                {/* Dropdown menu */}
                {open && (
                  <div className="navbar__dropdown" onClick={() => setOpen(false)}>
                    {/* Info user */}
                    <div className="navbar__dropdown-header">
                      <p className="navbar__dropdown-name">{user.name}</p>
                      <span className={`role-badge role-badge--${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="navbar__dropdown-divider" />

                    {/* Menu khusus USER */}
                    {isUser && (
                      <>
                        <Link to="/profile" className="navbar__dropdown-item">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
                          Profil Saya
                        </Link>
                        <Link to="/bookings" className="navbar__dropdown-item">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>
                          Pemesanan Saya
                        </Link>
                      </>
                    )}

                    {/* Menu khusus TENANT */}
                    {isTenant && (
                      <>
                        <Link to="/tenant/dashboard" className="navbar__dropdown-item">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dashboard</span>
                          Dashboard
                        </Link>
                        <Link to="/tenant/properties" className="navbar__dropdown-item">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home_work</span>
                          Properti Saya
                        </Link>
                        <Link to="/tenant/bookings" className="navbar__dropdown-item">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>receipt_long</span>
                          Kelola Pemesanan
                        </Link>
                      </>
                    )}

                    {/* Item yang di-disable untuk role yang salah */}
                    {isTenant && (
                      <div
                        className="navbar__dropdown-item navbar__dropdown-item--disabled"
                        title="Fitur ini hanya untuk akun User biasa"
                        onClick={() => showToast('Fitur ini hanya tersedia untuk akun User biasa, bukan Tenant.')}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>hotel</span>
                        Pesan Penginapan
                        <span className="disabled-label">User only</span>
                      </div>
                    )}

                    {isUser && (
                      <div
                        className="navbar__dropdown-item navbar__dropdown-item--disabled"
                        title="Fitur ini hanya untuk akun Tenant"
                        onClick={() => showToast('Fitur ini hanya tersedia untuk akun Tenant. Daftarkan properti Anda melalui tombol "Host Your Eco-Stay".')}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dashboard</span>
                        Dashboard Tenant
                        <span className="disabled-label">Tenant only</span>
                      </div>
                    )}

                    <div className="navbar__dropdown-divider" />

                    {/* Logout */}
                    <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--logout">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="navbar__hamburger btn-icon"
              aria-label="Toggle menu"
              onClick={() => setOpen(o => !o)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{open ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <nav className="navbar__mobile-menu">
            <div className="container-page" style={{ display: 'flex', flexDirection: 'column' }}>
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className="navbar__mobile-link">
                  {label}
                </Link>
              ))}
              {isUser && (
                <Link to="/profile" onClick={() => setOpen(false)} className="navbar__mobile-link">
                  Profil Saya
                </Link>
              )}
              {isTenant && (
                <Link to="/tenant/dashboard" onClick={() => setOpen(false)} className="navbar__mobile-link">
                  Dashboard Tenant
                </Link>
              )}
              {!isLoggedIn && (
                <Link to="/login" onClick={() => setOpen(false)} className="navbar__mobile-link" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Login / Daftar
                </Link>
              )}
              {isLoggedIn && (
                <button onClick={handleLogout} className="navbar__mobile-link" style={{ background: 'none', border: 'none', textAlign: 'left', color: '#c0392b', cursor: 'pointer', fontWeight: 700 }}>
                  Keluar
                </button>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
