import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Search, ArrowRight, Eye, Activity, Download, Printer } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchAdminOrders();
  }, []);

  // تابع خروجی استاندارد اکسل (CSV) با پشتیبانی ۱۰۰٪ از کاراکترهای فارسی
  const exportToExcelCSV = () => {
    if (orders.length === 0) return alert('سفارشی برای خروجی وجود ندارد.');

    // \uFEFF برای جلوگیری از به هم ریختگی حروف فارسی در اکسل ضروری است
    let csvContent = "\uFEFFشماره سفارش,نام مشتری,شماره تماس,مبلغ کل (تومان),وضعیت پرداخت,وضعیت ارسال,تاریخ ثبت,شهر مقصد\n";

    orders.forEach(o => {
      csvContent += `"${o._id.substring(18)}","${o.user?.name || o.shippingAddress?.fullName || 'ناشناس'}","${o.shippingAddress?.phone || ''}","${o.totalPrice}","${o.isPaid ? 'پرداخت شده' : 'پرداخت نشده'}","${o.orderStatus}","${new Date(o.createdAt).toLocaleDateString('fa-IR')}","${o.shippingAddress?.city || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Team9-Orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowRight size={20} className="text-gray-600" /></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Package size={24} className="text-primary"/> مدیریت و انبارداری سفارشات</h1>
            <p className="text-xs text-gray-400 mt-1">تعداد کل سفارشات: {orders.length}</p>
          </div>
        </div>

        {/* دکمه‌های خروجی اکسل و پرینت بارنامه */}
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToExcelCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md"
          >
            <Download size={16} /> خروجی اکسل (Excel CSV)
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black px-4 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            <Printer size={16} /> چاپ برچسب‌ها
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-xs font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-5">سفارش</th>
              <th className="px-6 py-5">مشتری</th>
              <th className="px-6 py-5">مبلغ کل</th>
              <th className="px-6 py-5">وضعیت پرداخت</th>
              <th className="px-6 py-5">وضعیت ارسال</th>
              <th className="px-6 py-5 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-12"><Activity className="animate-spin text-primary mx-auto" size={32}/></td></tr>
            ) : orders.map((o) => (
              <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-gray-900">#{o._id.substring(18)}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{o.user?.name || o.shippingAddress?.fullName || 'ناشناس'}</td>
                <td className="px-6 py-4 font-black text-gray-900">{formatPrice(o.totalPrice)} تومان</td>
                <td className="px-6 py-4">
                  {o.isPaid ? (
                    <span className="bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-xl text-xs border border-emerald-100">پرداخت شده</span>
                  ) : (
                    <span className="bg-rose-50 text-rose-600 font-bold px-2.5 py-1 rounded-xl text-xs border border-rose-100">پرداخت نشده</span>
                  )}
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                    o.orderStatus === 'ارسال شده' ? 'bg-blue-50 text-blue-600' :
                    o.orderStatus === 'بسته بندی شده' ? 'bg-amber-50 text-amber-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {o.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => navigate(`/admin/orders/${o._id}`)} 
                    className="bg-dark text-primary hover:bg-gray-800 px-4 py-2 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye size={14}/> جزئیات و تغییر وضعیت
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
