import React, { useState, useEffect } from 'react';
import { Users, Trash2, ShieldCheck, ShieldAlert, ArrowRight, Activity, Search } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (window.confirm(`آیا از تغییر نقش ${user.name} به ${newRole === 'admin' ? 'مدیر' : 'کاربر عادی'} اطمینان دارید؟`)) {
      try {
        await api.put(`/users/${user._id}`, { role: newRole });
        setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
      } catch (err) {
        alert(err.response?.data?.message || 'خطا در تغییر سطح دسترسی');
      }
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`آیا از حذف کامل کاربر "${name}" اطمینان دارید؟`)) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'خطا در حذف کاربر');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.phone?.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Users size={24} className="text-primary" /> مدیریت کاربران و مشتریان
          </h1>
          <p className="text-sm text-gray-500 mt-1">مشاهده مشخصات، تغییر سطوح دسترسی ادمین و حذف حساب</p>
        </div>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="جستجوی نام یا تلفن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-xs font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-5">کاربر</th>
              <th className="px-6 py-5">شماره موبایل</th>
              <th className="px-6 py-5">تاریخ عضویت</th>
              <th className="px-6 py-5">نقش کاربری</th>
              <th className="px-6 py-5 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-12"><Activity className="animate-spin text-primary mx-auto" size={32}/></td></tr>
            ) : filteredUsers.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark text-primary rounded-xl flex items-center justify-center font-black">
                    {u.name?.charAt(0) || 'U'}
                  </div>
                  {u.name}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-gray-600" dir="ltr">{u.phone}</td>
                <td className="px-6 py-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('fa-IR')}</td>
                <td className="px-6 py-4">
                  {u.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl text-xs font-bold border border-amber-200">
                      <ShieldCheck size={14}/> مدیر سیستم (Admin)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-bold">
                      مشتری عادی
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleToggleRole(u)} 
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl font-bold transition-colors"
                      title="تغییر نقش"
                    >
                      {u.role === 'admin' ? 'عزل به کاربر عادی' : 'ارتقا به ادمین'}
                    </button>
                    {u.phone !== '09000000000' && (
                      <button 
                        onClick={() => handleDeleteUser(u._id, u.name)} 
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" 
                        title="حذف کاربر"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
