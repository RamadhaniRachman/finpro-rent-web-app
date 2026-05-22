import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

// ============================================================
// TIPE DATA
// ============================================================
interface ProtectedRouteProps {
  children: ReactNode;          // Halaman/komponen yang ingin dilindungi
  requiredRole?: 'USER' | 'TENANT'; // Opsional: batasi berdasarkan role tertentu
}

// ============================================================
// KOMPONEN PROTECTEDROUTE
// ============================================================
// Komponen ini adalah "satpam" untuk rute-rute yang membutuhkan login.
// Cara kerjanya:
//   1. Cek apakah user sudah login (ada di AuthContext)
//   2. Jika BELUM login -> redirect ke homepage (/)
//   3. Jika sudah login TAPI role salah (misal: User masuk ke halaman Tenant) -> redirect ke /
//   4. Jika semua OK -> tampilkan halaman yang diminta (children)
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Saat aplikasi masih mengecek localStorage (loading awal),
  // jangan redirect dulu — tampilkan layar kosong agar tidak "kedip"
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--color-bg-primary, #f9f6f0)',
        color: 'var(--color-text-secondary, #6b7280)',
        fontFamily: 'var(--font-body, sans-serif)',
        fontSize: '1rem'
      }}>
        Memuat sesi...
      </div>
    );
  }

  // Jika tidak ada user yang login -> redirect ke homepage
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Jika halaman ini membutuhkan role tertentu dan role user tidak cocok
  // -> redirect ke homepage
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Semua pengecekan lolos -> tampilkan konten halaman
  return <>{children}</>;
};

export default ProtectedRoute;
