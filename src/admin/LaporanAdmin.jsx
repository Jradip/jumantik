// src/admin/LaporanAdmin.jsx
import { useMemo, useState } from 'react';
import { FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import Modal from '../shared/Modal';

/* dummy laporan */
const initial = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  date: '01/Okt/2025',
  rt: (i % 6 + 1).toString().padStart(2, '0'),
  rw: (i % 4 + 1).toString().padStart(2, '0'),
  alamat: 'Jl. MH. Thamrin No. 50, Sibolga',
  kategori: i % 3 === 0 ? 'Berpotensi' : 'Tidak Berpotensi',
  pelapor: 'Sindy',
  image: i % 3 === 0 ? '' : '', // taruh url kalau mau demo gambar
}));

export default function LaporanAdmin() {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== 'all' && r.kategori !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        r.alamat.toLowerCase().includes(q) ||
        r.pelapor.toLowerCase().includes(q) ||
        r.date.toLowerCase().includes(q)
      );
    });
  }, [rows, query, filter]);

  function openForEdit(row) {
    setEditing({ ...row });
    setOpenEdit(true);
  }

  function saveEdit() {
    setRows((rs) => rs.map((r) => (r.id === editing.id ? editing : r)));
    setOpenEdit(false);
  }

  function exportCSV() {
    const header = [
      'No',
      'Tanggal',
      'RT',
      'RW',
      'Detail Alamat',
      'Kategori',
      'Pelapor',
      'Gambar',
    ];
    const csv = [header.join(',')]
      .concat(
        rows.map((r) =>
          [
            r.id,
            r.date,
            r.rt,
            r.rw,
            `"${r.alamat}"`,
            r.kategori,
            r.pelapor,
            r.image || '',
          ].join(','),
        ),
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen">
      {/* Header sticky + controls */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Laporan</h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full sm:w-64 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-sky-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All</option>
              <option>Berpotensi</option>
              <option>Tidak Berpotensi</option>
            </select>
            <button
              onClick={exportCSV}
              className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-4 py-2"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="rounded-2xl overflow-hidden shadow border border-slate-200">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>No</Th>
                <Th>Tanggal</Th>
                <Th>RT</Th>
                <Th>RW</Th>
                <Th>Detail Alamat</Th>
                <Th>Kategori</Th>
                <Th>Pelapor</Th>
                <Th>Gambar</Th>
                <Th className="text-center">Action</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <Td>{r.id}</Td>
                  <Td>{r.date}</Td>
                  <Td>{r.rt}</Td>
                  <Td>{r.rw}</Td>
                  <Td>{r.alamat}</Td>
                  <Td>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        r.kategori === 'Berpotensi'
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {r.kategori}
                    </span>
                  </Td>
                  <Td>{r.pelapor}</Td>
                  <Td>
                    {r.image ? (
                      <img
                        src={r.image}
                        alt="bukti"
                        className="h-10 w-10 object-cover rounded-md border"
                      />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </Td>
                  <Td className="text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        title="Lihat lokasi"
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <FaMapMarkerAlt />
                      </button>
                      <button
                        onClick={() => openForEdit(r)}
                        title="Edit"
                        className="p-2 text-sky-600 hover:bg-sky-50 rounded"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit */}
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Edit Laporan"
      >
        {editing && (
          <div className="space-y-3">
            <label className="block text-sm">Tanggal</label>
            <input
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
              className="w-full rounded-xl border px-3 py-2"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">RT</label>
                <input
                  value={editing.rt}
                  onChange={(e) =>
                    setEditing({ ...editing, rt: e.target.value })
                  }
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm">RW</label>
                <input
                  value={editing.rw}
                  onChange={(e) =>
                    setEditing({ ...editing, rw: e.target.value })
                  }
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>
            </div>

            <label className="block text-sm">Detail Alamat</label>
            <textarea
              rows={3}
              value={editing.alamat}
              onChange={(e) =>
                setEditing({ ...editing, alamat: e.target.value })
              }
              className="w-full rounded-xl border px-3 py-2"
            />

            <label className="block text-sm">Kategori</label>
            <select
              value={editing.kategori}
              onChange={(e) =>
                setEditing({ ...editing, kategori: e.target.value })
              }
              className="w-full rounded-xl border px-3 py-2"
            >
              <option>Berpotensi</option>
              <option>Tidak Berpotensi</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpenEdit(false)}
                className="px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* Small helpers for cleaner table markup */
function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-sm font-semibold ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 border-t ${className}`}>{children}</td>;
}
