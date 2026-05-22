import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';

// ============================================================
// HALAMAN PLACEHOLDER
// ============================================================
// Halaman-halaman ini belum dibuat secara penuh, namun sudah
// didefinisikan di sini agar sistem routing & guard sudah siap.
// Nanti cukup ganti komponen placeholder ini dengan komponen aslinya.
const UserProfilePage = () => <div style={{padding:'2rem', textAlign:'center'}}>Halaman Profil User (Dalam Pengerjaan)</div>;
const TenantDashboardPage = () => <div style={{padding:'2rem', textAlign:'center'}}>Halaman Dashboard Tenant (Dalam Pengerjaan)</div>;

// ============================================================
// KOMPONEN APP (ROUTING UTAMA)
// ============================================================
function App() {
  return (
    // AuthProvider HARUS membungkus BrowserRouter dan seluruh rute
    // agar useAuth() bisa diakses dari semua halaman dan komponen
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ======== RUTE PUBLIK ======== */}
          {/* Halaman ini bisa diakses siapa saja, login atau tidak */}
          <Route path="/" element={<LandingPage />} />

          {/* ======== RUTE TERPROTEKSI: USER ======== */}
          {/* Hanya bisa diakses oleh user yang sudah login dengan role 'USER' */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ======== RUTE TERPROTEKSI: TENANT ======== */}
          {/* Hanya bisa diakses oleh user yang sudah login dengan role 'TENANT' */}
          <Route
            path="/tenant/dashboard"
            element={
              <ProtectedRoute requiredRole="TENANT">
                <TenantDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
