// src/admin/AccountsAdmin.jsx
import { useMemo, useState } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import Modal from '../shared/Modal';

// ------ dummy data awal ------
const initialUsers = [
  { id: 1, name: 'Sahroni', role: 'Warga', rt: '01', rw: '01' },
  { id: 2, name: 'Petugas A', role: 'Petugas', rt: '', rw: '' },
  { id: 3, name: 'Admin Pusat', role: 'Admin', rt: '', rw: '' },
];

const ROLES = ['All role', 'Warga', 'Petugas', 'Admin'];

// Helper header & cell biar konsisten
function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-slate-600 font-semibold ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 border-t align-middle ${className}`}>{children}</td>;
}

export default function AccountsAdmin() {
  const [rows, setRows] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All role');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // ------- filter + search -------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const okRole = role === 'All role' ? true : r.role === role;
      const okSearch = !q ? true : r.name.toLowerCase().includes(q);
      return okRole && okSearch;
    });
  }, [rows, query, role]);

  // ------- actions -------
  function openAdd() {
    setEditing({
      id: Date.now(),
      name: '',
      role: 'Warga',
      rt: '',
      rw: '',
      _isNew: true,
    });
    setOpen(true);
  }

  function openEdit(row) {
    setEditing({ ...row, _isNew: false });
    setOpen(true);
  }

  function save() {
    if (!editing?.name?.trim()) return;

    setRows((prev) => {
      const idx = prev.findIndex((p) => p.id === editing.id);
      const payload = {
        id: editing.id,
        name: editing.name.trim(),
        role: editing.role,
        rt: editing.role === 'Warga' ? (editing.rt || '') : '',
        rw: editing.role === 'Warga' ? (editing.rw || '') : '',
      };
      if (idx === -1) return [payload, ...prev];
      const next = [...prev];
      next[idx] = payload;
      return next;
    });

    setOpen(false);
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 justify-end">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-64 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Search user…"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-10 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-sky-500"
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-4 py-2"
          >
            <FaPlus /> Add user
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full table-auto">
            <thead className="bg-slate-50">
              <tr>
                <Th className="w-20">No</Th>
                <Th>Nama</Th>
                <Th className="w-28">RT</Th>
                <Th className="w-28">RW</Th>
                <Th className="w-40">Role</Th>
                {/* Kolom Action: fixed width + center */}
                <Th className="text-center w-24">Action</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <Td className="text-slate-500">{i + 1}</Td>
                  <Td className="font-medium">{r.name}</Td>
                  <Td>{r.rt || '-'}</Td>
                  <Td>{r.rw || '-'}</Td>
                  <Td>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${
                        r.role === 'Warga'
                          ? 'bg-sky-50 text-sky-700'
                          : r.role === 'Petugas'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.role}
                    </span>
                  </Td>

                  {/* SEL Action: tombol 36x36, center horizontal & vertikal */}
                  <Td className="text-center align-middle">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => openEdit(r)}
                        title="Edit"
                        aria-label={`Edit ${r.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50"
                      >
                        <FaEdit size={16} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <Td className="text-center text-slate-400" colSpan={6}>
                    Tidak ada data
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing?._isNew ? 'Add User' : 'Edit User'}
      >
        {!!editing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option>Warga</option>
                <option>Petugas</option>
                <option>Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Nama</label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Masukan nama…"
              />
            </div>

            {/* RT/RW hanya untuk Warga */}
            {editing.role === 'Warga' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">RT</label>
                  <input
                    value={editing.rt}
                    onChange={(e) => setEditing({ ...editing, rt: e.target.value })}
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="01"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">RW</label>
                  <input
                    value={editing.rw}
                    onChange={(e) => setEditing({ ...editing, rw: e.target.value })}
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="01"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2">
                Batal
              </button>
              <button
                onClick={save}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white"
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
