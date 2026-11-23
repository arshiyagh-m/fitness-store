import React, { useEffect, useState } from 'react';
import { Eye, Trash2, Copy, CheckCircle, Phone, Search, X, FileText } from 'lucide-react';
import api from '../../services/api';

const STATUS_MAP = {
  pending: { label: 'در انتظار بررسی', cls: 'bg-amber-100 text-amber-800' },
  reviewed: { label: 'بررسی شده', cls: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'تماس گرفته شد', cls: 'bg-emerald-100 text-emerald-800' },
};

const AdminCoaching = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/coaching');
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/coaching/${id}`, { status });
      setRequests((prev) => prev.map((r) => (r._id === id ? data : r)));
      if (selected?._id === id) setSelected(data);
    } catch (err) {
      alert('خطا در تغییر وضعیت');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این فرم اطمینان دارید؟')) return;
    try {
      await api.delete(`/coaching/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      alert('خطا در حذف');
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert('متن کامل فرم کپی شد!');
  };

  const filtered = requests.filter(
    (r) =>
      r.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.goal?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-800">درخواست‌های مربی‌گری و برنامه اختصاصی</h1>
          <p className="text-xs text-gray-500 mt-1">تعداد کل فرم‌های ثبت‌شده: {requests.length} مورد</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute right-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام، شماره یا هدف..."
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-bold">در حال بارگذاری فرم‌ها...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400 font-bold">
          هنوز درخواست مربی‌گری ثبت نشده است.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600 font-black border-b border-gray-100">
              <tr>
                <th className="p-4">نام ورزشکار</th>
                <th className="p-4">شماره تماس</th>
                <th className="p-4">هدف اصلی</th>
                <th className="p-4">تاریخ ثبت</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-black text-gray-800">{item.fullName}</td>
                  <td className="p-4 font-mono text-gray-700" dir="ltr">{item.phone}</td>
                  <td className="p-4 text-xs text-gray-600 max-w-xs truncate">{item.goal || '—'}</td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="p-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className={`text-xs font-black px-3 py-1.5 rounded-lg outline-none cursor-pointer ${STATUS_MAP[item.status]?.cls}`}
                    >
                      <option value="pending">در انتظار بررسی</option>
                      <option value="reviewed">بررسی شده</option>
                      <option value="contacted">تماس گرفته شد</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelected(item)}
                        className="p-2 bg-primary/15 text-dark hover:bg-primary rounded-xl transition-colors"
                        title="مشاهده جزئیات کامل فرم"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        onClick={() => copyText(item.formattedText)}
                        className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
                        title="کپی کل پاسخ‌ها"
                      >
                        <Copy size={17} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* مودال نمایش کامل پاسخ‌های فرم */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 bg-dark text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-primary" size={22} />
                <div>
                  <h3 className="font-black text-base">{selected.fullName}</h3>
                  <p className="text-xs text-gray-300 font-mono">{selected.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyText(selected.formattedText)}
                  className="flex items-center gap-1.5 bg-primary text-dark text-xs font-black px-3.5 py-2 rounded-xl hover:bg-primary-hover"
                >
                  <Copy size={15} /> کپی کل فرم
                </button>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-800 rounded-xl">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(selected.formData || {}).map(([key, val]) => {
                  const displayVal = Array.isArray(val) ? val.join('، ') : val;
                  if (!displayVal) return null;
                  return (
                    <div key={key} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <span className="block text-[11px] font-bold text-gray-400 mb-1">{key}</span>
                      <span className="text-xs font-bold text-gray-800 whitespace-pre-line leading-6">{displayVal}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoaching;
