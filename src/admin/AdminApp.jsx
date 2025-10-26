// src/admin/AdminApp.jsx
import { Routes, Route, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import HomeAdmin from './HomeAdmin';
import LaporanAdmin from './LaporanAdmin';
import AccountsAdmin from './AccountsAdmin';

export default function AdminApp() {
  const navigate = useNavigate();
  const logout = () => {
    // TODO: hapus token/session beneran di sini
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="bg-slate-900 text-slate-100 px-4 py-6 flex flex-col">
        <div className="font-semibold text-lg mb-6">Jumantik • Admin</div>

        <nav className="space-y-2">
          <Item to="/admin">Home</Item>
          <Item to="/admin/laporan">Laporan</Item>
          <Item to="/admin/akun">Data Akun</Item>
        </nav>

        <button
          onClick={logout}
          className="mt-auto w-full rounded-lg bg-slate-700 hover:bg-slate-600 transition px-3 py-2 text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Konten */}
      <main className="bg-white">
        <Routes>
          <Route index element={<HomeAdmin />} />
          <Route path="laporan" element={<LaporanAdmin />} />
          <Route path="akun" element={<AccountsAdmin />} />
          <Route path="*" element={<Navigate to="." />} />
        </Routes>

        {/* Jika nanti pakai nested routes */}
        <Outlet />
      </main>
    </div>
  );
}

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-md px-3 py-2 ${
          isActive ? 'bg-white text-slate-800 shadow' : 'hover:bg-white/10'
        }`
      }
    >
      {children}
    </NavLink>
  );
}
