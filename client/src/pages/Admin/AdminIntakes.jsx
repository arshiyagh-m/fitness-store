import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Search, Eye, Trash2, Activity, User, Phone, CheckCircle2, Clock, Printer } from 'lucide-react';
import api from '../../services/api';

const AdminIntakes = () => {
  const [intakes, setIntakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchIntakes();
  }, []);

  const fetchIntakes = async () => {
    try {
      const { data } = await api.get('/athlete-intake');
      setIntakes(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`آیا از حذف پرونده "${name}" اطمینان دارید؟`)) {
      try {
        await api.delete(`/athlete-intake/${id}`);
        setIntakes(intakes.filter(i => i._id !== id));
      } catch (err) {
        alert('خطا در حذف');
      }
    }
  };

  const filtered = intakes.filter(i => 
    i.fullName.toLowerCase().includes(search.toLowerCase()) || 
    i.phone.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto pb-16 font-sans" dir="rtl">
      
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-dark text-primary rounded-2xl">
            <Dumbbell size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">پرونده‌های ارزیابی آنلاین ورزشکاران (پذیرش مربی)</h1>
            <p className="text-xs text-gray-400 mt-1">مدیریت فرم‌های ارزیابی، آسیب‌دیدگی‌ها و طراحی برنامه‌های تمرینی</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="جستجوی نام یا تلفن ورزشکار..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* جدول پرونده‌ها */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/70 text-gray-400 uppercase text-xs font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ورزشکار</th>
              <th className="px-6 py-4">شماره تماس</th>
              <th className="px-6 py-4">تاریخ ارسال</th>
              <th className="px-6 py-4">وضعیت پرونده</th>
              <th className="px-6 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-16"><Activity className="animate-spin text-primary mx-auto" size={32}/></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-gray-400 font-bold">هیچ پرونده‌ای یافت نشد.</td></tr>
            ) : (
              filtered.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-dark text-primary rounded-xl flex items-center justify-center font-black">
                      {item.fullName.charAt(0)}
                    </div>
                    {item.fullName}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-600" dir="ltr">{item.phone}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('fa-IR')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black inline-block ${
                      item.status === 'برنامه تحویل داده شد' ? 'bg-emerald-50 text-emerald-600' :
                      item.status === 'در حال طراحی برنامه' ? 'bg-blue-50 text-blue-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/intakes/${item._id}`)} 
                        className="bg-dark text-primary px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye size={14} /> مشاهده پرونده کامل
                      </button>
                      <button onClick={() => handleDelete(item._id, item.fullName)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminIntakes;
