import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, LogOut, ChevronLeft, Package, Activity, Truck, ExternalLink, Award, Coins, Sparkles, Gift, Heart, Copy, Check, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // orders | loyalty
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // تبدیل امتیاز به کوپن واقعی
  const [redeeming, setRedeeming] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return navigate('/login');
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) { setLoading(false); }
    };
    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };
  if (!user) return null;

  // 🎯 فرمول دقیق درخواست کارفرما: به ازای هر ۱۰۰ هزار تومان خرید موفق = ۱ امتیاز
  const totalSpent = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
  const loyaltyPoints = Math.floor(totalSpent / 100000); // ۱ میلیون = ۱۰ امتیاز
  const walletCredit = loyaltyPoints * 1000; // هر ۱ امتیاز = ۱۰۰۰ تومان ارزش

  const tier = totalSpent > 10000000 ? { name: 'ورزشکار طلایی (VIP)', color: 'text-amber-500 bg-amber-50 border-amber-200' }
             : totalSpent > 3000000 ? { name: 'ورزشکار نقره‌ای', color: 'text-blue-500 bg-blue-50 border-blue-200' }
             : { name: 'ورزشکار برنزی', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' };

  // تابع هوشمند انتخاب لینک شرکت پستی (پست پیشتاز، تیپاکس، ماهکس)
  const getSmartCourierDetails = (courier, code) => {
    if (!code) return null;

    if (courier === 'تیپاکس') {
      return {
        name: 'تیپاکس (Tipax)',
        url: `https://tipaxco.com/tracking?id=${code}`,
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        btnText: 'پیگیری آنلاین در سامانه تیپاکس'
      };
    }

    if (courier === 'ماهکس') {
      return {
        name: 'کالارسان ماهکس (Mahex)',
        url: `https://mahex.com/tracking/?tracking_number=${code}`,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        btnText: 'پیگیری آنلاین در سامانه ماهکس'
      };
    }

    // پیش‌فرض: شرکت ملی پست
    return {
      name: 'پست پیشتاز',
      url: `https://tracking.post.ir/?id=${code}`,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      btnText: 'پیگیری آنلاین در سامانه شرکت پست'
    };
  };

  // تبدیل امتیازات به کوپن تخفیف واقعی در دیتابیس
  const handleRedeemPoints = async () => {
    if (loyaltyPoints <= 0) return alert('شما هنوز امتیازی برای تبدیل به کد تخفیف ندارید.');
    setRedeeming(true);

    try {
      const { data } = await api.post('/coupons/redeem', { points: loyaltyPoints });
      setGeneratedCoupon(data);
      alert(`تبریک! کد تخفیف با ارزش ${formatPrice(walletCredit)} تومان ساخته شد.`);
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در تبدیل امتیاز');
    } finally {
      setRedeeming(false);
    }
  };

  const copyCouponCode = () => {
    if (!generatedCoupon) return;
    navigator.clipboard.writeText(generatedCoupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
              <div className="bg-dark p-6 text-center border-b-4 border-primary">
                <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center text-primary text-3xl font-black">{user.name.charAt(0)}</div>
                <h2 className="text-white font-black text-lg">{user.name}</h2>
                <div className={`mt-2 inline-block px-3 py-1 rounded-xl text-xs font-black border ${tier.color}`}>
                  {tier.name}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <button onClick={() => setActiveTab('orders')} className={`w-full flex justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-primary text-dark shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}><div className="flex gap-3"><ShoppingBag size={20}/>سفارشات من</div><ChevronLeft size={16}/></button>
                <button onClick={() => setActiveTab('loyalty')} className={`w-full flex justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'loyalty' ? 'bg-primary text-dark shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}><div className="flex gap-3"><Coins size={20}/>باشگاه مشتریان و امتیازات</div><ChevronLeft size={16}/></button>
                <Link to="/wishlist" className="w-full flex justify-between p-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-50"><div className="flex gap-3"><Heart size={20} className="text-rose-500"/>نشان‌شده‌ها (علاقه‌مندی)</div><ChevronLeft size={16}/></Link>
                <button onClick={handleLogout} className="w-full flex gap-3 p-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50"><LogOut size={20}/>خروج</button>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            
            {/* تب ۱: سفارشات و رهگیری هوشمند مرسولات */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100"><Package className="text-primary"/>تاریخچه و رهگیری مرسولات من</h3>
                {loading ? <Activity className="animate-spin text-primary mx-auto my-10"/> : orders.length === 0 ? <div className="text-center text-gray-500 my-10 font-bold">تاکنون سفارشی ثبت نکرده‌اید.</div> : (
                  <div className="space-y-6">
                    {orders.map((o) => {
                      const courierInfo = getSmartCourierDetails(o.courierCompany, o.postalTrackingCode);
                      return (
                        <div key={o._id} className="border border-gray-100 rounded-3xl p-6 hover:shadow-md transition-shadow bg-white">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <div>
                              <p className="font-black text-gray-900 text-base">سفارش #{o._id.substring(18)}</p>
                              <p className="text-xs text-gray-400 mt-1">تاریخ ثبت: {new Date(o.createdAt).toLocaleDateString('fa-IR')}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-xl text-xs font-black w-max ${
                              o.orderStatus === 'ارسال شده' ? 'bg-blue-50 text-blue-600' :
                              o.orderStatus === 'تحویل داده شده' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-amber-50 text-amber-600'
                            }`}>
                              {o.orderStatus}
                            </span>
                          </div>

                          {/* کادر هوشمند رهگیری بر اساس شرکت منتخب ادمین (پست، تیپاکس یا ماهکس) */}
                          {courierInfo && (
                            <div className="my-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                              <div className="flex items-center gap-2 text-xs text-gray-700">
                                <Truck size={18} className="text-primary shrink-0" />
                                <span>حمل توسط <strong>{courierInfo.name}</strong> | کد رهگیری: <strong className="font-mono text-dark text-sm mr-1">{o.postalTrackingCode}</strong></span>
                              </div>
                              <a 
                                href={courierInfo.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs font-black text-primary bg-dark px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                {courierInfo.btnText} <ExternalLink size={14} />
                              </a>
                            </div>
                          )}

                          <div className="divide-y divide-gray-50 my-4 text-xs">
                            {o.orderItems.map((it, i) => (
                              <div key={i} className="py-2 flex justify-between text-gray-600">
                                <span>{it.name} ({it.variant?.flavor} - {it.variant?.weight}) × {it.qty}</span>
                                <span className="font-bold text-gray-900">{formatPrice(it.price * it.qty)} تومان</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-sm">
                            <span className="text-gray-500 font-bold">مبلغ کل پرداختی:</span>
                            <span className="font-black text-gray-900 text-base">{formatPrice(o.totalPrice)} تومان</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* تب ۲: باشگاه مشتریان و کیف پول تبدیل امتیاز به کد تخفیف واقعی */}
            {activeTab === 'loyalty' && (
              <div className="space-y-6">
                <div className="bg-dark rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-800">
                  <div>
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black inline-block mb-2 border border-primary/30">
                      باشگاه ورزشکاران Team 9
                    </span>
                    <h2 className="text-2xl font-black">کیف پول و امتیازات طلایی شما</h2>
                    <p className="text-xs text-gray-400 mt-2">به ازای هر ۱۰۰ هزار تومان خرید موفق = ۱ امتیاز (هر امتیاز = ۱,۰۰۰ تومان اعتبار تخفیف)</p>
                  </div>
                  <div className="bg-gray-800/90 border border-gray-700 p-6 rounded-2xl text-center shrink-0 min-w-[220px]">
                    <span className="text-xs text-gray-400 block mb-1">موجودی امتیاز ورزشی</span>
                    <span className="text-4xl font-black text-primary block font-mono">{loyaltyPoints}</span>
                    <span className="text-xs text-emerald-400 font-bold mt-1 block">معادل {formatPrice(walletCredit)} تومان تخفیف نقدی</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center gap-3">
                    <div className="p-3 bg-white text-primary rounded-xl shadow-sm"><Gift size={22}/></div>
                    <div><span className="text-xs text-gray-400 block">نرخ محاسبه امتیاز</span><span className="font-bold text-sm text-gray-800">هر ۱۰۰ هزار تومن = ۱ امتیاز</span></div>
                  </div>
                  <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center gap-3">
                    <div className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm"><Award size={22}/></div>
                    <div><span className="text-xs text-gray-400 block">سطح فعلی شما</span><span className="font-bold text-sm text-gray-800">{tier.name}</span></div>
                  </div>
                  <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center gap-3">
                    <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm"><Sparkles size={22}/></div>
                    <div><span className="text-xs text-gray-400 block">ارزش ریالی هر امتیاز</span><span className="font-bold text-sm text-gray-800">۱,۰۰۰ تومان تخفیف قطعی</span></div>
                  </div>
                </div>

                {/* باکس دریافت کد تخفیف واقعی */}
                <div className="p-6 bg-amber-50/60 border border-amber-200 rounded-3xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h4 className="font-black text-amber-900 text-sm">تبدیل امتیازات به کد تخفیف یکبار مصرف سبد خرید</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        با زدن دکمه زیر، امتیازات شما سوزانده شده و یک کد تخفیف واقعی با اعتبار {formatPrice(walletCredit)} تومان در سیستم ثبت می‌شود.
                      </p>
                    </div>
                    <button 
                      onClick={handleRedeemPoints}
                      disabled={redeeming || loyaltyPoints <= 0}
                      className="bg-dark text-primary px-6 py-3 rounded-2xl font-black text-xs hover:bg-gray-800 transition-all shadow-md shrink-0 disabled:opacity-50 flex items-center gap-2"
                    >
                      {redeeming ? <Loader2 className="animate-spin" size={16}/> : <Coins size={16}/>}
                      تبدیل به کد تخفیف
                    </button>
                  </div>

                  {/* نمایش کوپن تولید شده با دکمه کپی */}
                  {generatedCoupon && (
                    <div className="p-4 bg-white rounded-2xl border border-emerald-300 flex items-center justify-between shadow-sm animate-pulse">
                      <div>
                        <span className="text-xs text-gray-400 block mb-0.5">کد تخفیف اختصاصی شما ساخته شد (مهلت ۱۴ روز):</span>
                        <span className="text-base font-black text-emerald-600 font-mono tracking-widest">{generatedCoupon.code}</span>
                      </div>
                      <button 
                        onClick={copyCouponCode}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        {copied ? <Check size={14}/> : <Copy size={14}/>}
                        {copied ? 'کپی شد!' : 'کپی کردن کد'}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
