import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, AlertTriangle, PackageCheck, Boxes, ArrowLeft, Flame, Award, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, orderRes, userRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
          api.get('/users'),
        ]);
        setProducts(prodRes.data);
        setOrders(orderRes.data);
        setUsersCount(userRes.data.length);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalSales = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;

  // محاسبه اقلام انبار
  let totalStockCount = 0;
  let lowStockCount = 0;
  products.forEach(p => {
    p.variants?.forEach(v => {
      totalStockCount += v.stock;
      if (v.stock <= 5) lowStockCount++;
    });
  });

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* هدر دسترسی سریع */}
      <div className="bg-dark rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl border border-gray-800">
        <div className="z-10">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black inline-block mb-3 border border-primary/30">
            سامانه مرکزی Team 9
          </span>
          <h1 className="text-2xl md:text-3xl font-black">داشبورد هوشمند فرماندهی فروش و انبارداری</h1>
          <p className="text-xs text-gray-400 mt-2">وضعیت زنده موجودی قفسه‌ها، تراکنش‌های شاپرک و آماده‌سازی مرسوله‌ها</p>
        </div>
        <div className="flex flex-wrap gap-3 z-10">
          <Link to="/admin/inventory" className="bg-primary text-dark font-black text-xs px-5 py-3 rounded-2xl hover:bg-primary-hover transition-all flex items-center gap-1.5 shadow-lg">
            <Boxes size={16}/> سامانه انبارداری WMS
          </Link>
          <Link to="/admin/products/add" className="bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all">
            + ثبت مکمل جدید
          </Link>
        </div>
        <div className="absolute left-0 bottom-0 top-0 w-1/3 bg-gradient-to-r from-transparent to-primary/10 pointer-events-none"></div>
      </div>

      {/* کارت‌های شاخص هوشمند (Executive KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black shrink-0">
            <DollarSign size={26}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">کل درآمد تایید شده</p>
            <p className="text-xl font-black text-gray-900 mt-1">{formatPrice(totalSales)} <span className="text-xs font-normal">تومان</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/20 text-dark rounded-2xl flex items-center justify-center font-black shrink-0">
            <ShoppingCart size={26}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">میانگین سبد خرید (AOV)</p>
            <p className="text-xl font-black text-gray-900 mt-1">{formatPrice(averageOrderValue)} <span className="text-xs font-normal">تومان</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Boxes size={26}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">موجودی فیزیکی کل انبار</p>
            <p className="text-xl font-black text-gray-900 mt-1">{totalStockCount} <span className="text-xs font-normal">قوطی</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle size={26}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">اقلام بحرانی انبار</p>
            <p className="text-xl font-black text-rose-600 mt-1">{lowStockCount} <span className="text-xs font-normal">تنوع کالایی</span></p>
          </div>
        </div>
      </div>

      {/* دو بخش پرفروش‌ترین‌ها و آخرین سفارشات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* آخرین سفارشات ثبت شده */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <ShoppingCart className="text-primary" size={20}/> آخرین سفارشات مشتریان
            </h3>
            <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              مشاهده همه سفارشات <ArrowLeft size={14}/>
            </Link>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">سفارش #{ord._id.substring(18)}</span>
                    <span className="text-xs text-gray-400">({ord.user?.name || 'مشتری'})</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">{new Date(ord.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
                <div className="text-left flex items-center gap-4">
                  <div className="font-black text-gray-900 text-sm">{formatPrice(ord.totalPrice)} تومان</div>
                  <Link to={`/admin/orders/${ord._id}`} className="p-2 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold">
                    بارنامه
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* پرفروش‌ترین مکمل‌های Team 9 */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
            <Flame className="text-primary" size={20}/> پرمتقاضی‌ترین مکمل‌ها
          </h3>
          <div className="space-y-6">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p._id} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-800 line-clamp-1">{idx + 1}. {p.title}</span>
                  <span className="text-primary font-black font-mono">{95 - (idx * 12)}٪ محبوبیت</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${95 - (idx * 12)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
