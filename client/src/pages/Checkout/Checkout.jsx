import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, User, CheckCircle2, Loader2, ArrowRight, Truck, Zap, PackageCheck } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartFinalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState('پست پیشتاز');

  // خواندن نرخ‌های واقعی از دیتابیس تنظیمات
  const [shippingRates, setShippingRates] = useState({
    post: 55000,
    tipax: 85000,
    mahex: 95000
  });

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    city: '',
    postalCode: '',
    address: ''
  });

  useEffect(() => {
    if (!user) navigate('/login');
    else if (cartItems.length === 0) navigate('/cart');

    // دریافت تعرفه‌های به‌روز پستی از دیتابیس
    const loadSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          setShippingRates({
            post: data.shippingPostPrice || 55000,
            tipax: data.shippingTipaxPrice || 85000,
            mahex: data.shippingMahexPrice || 95000
          });
        }
      } catch (e) {}
    };
    loadSettings();
  }, [user, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // دقیقاً ۳ شرکت حمل‌ونقل رسمی (پیک موتوری و ارسال رایگان کلاً حذف شد)
  const courierOptions = [
    { id: 'پست پیشتاز', title: 'شرکت ملی پست (پیشتاز)', time: 'تحویل سراسری ۳ الی ۵ روز کاری', price: shippingRates.post, icon: <Truck size={20} className="text-emerald-600"/> },
    { id: 'تیپاکس', title: 'تیپاکس اکسپرس (سریع)', time: 'تحویل ۲۴ الی ۴۸ ساعته درب منزل', price: shippingRates.tipax, icon: <Zap size={20} className="text-amber-500"/> },
    { id: 'ماهکس', title: 'کالارسان هوایی و ویژه ماهکس', time: 'سریع‌ترین حمل بین‌شهری کشور', price: shippingRates.mahex, icon: <PackageCheck size={20} className="text-blue-600"/> },
  ];

  const subTotal = cartFinalPrice();
  const currentCourier = courierOptions.find(c => c.id === selectedCourier) || courierOptions[0];
  const shippingFee = currentCourier.price;
  const totalPayable = subTotal + shippingFee; // همیشه هزینه ارسال اضافه می‌شود

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.product.title,
          qty: item.qty,
          price: item.variant.discountPrice || item.variant.price,
          variant: item.variant,
          product: item.product._id
        })),
        shippingAddress: formData,
        paymentMethod: 'درگاه بانکی شاپرک',
        courierCompany: selectedCourier,
        shippingPrice: shippingFee,
        totalPrice: totalPayable
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      navigate(`/payment/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ثبت سفارش');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-8 font-sans" dir="rtl">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100"><ArrowRight size={20} className="text-gray-600" /></Link>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <CheckCircle2 size={28} className="text-primary" /> تکمیل اطلاعات ارسال مرسوله و شیوه باربری
          </h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100">{error}</div>}

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-2/3 space-y-6">
            
            {/* مشخصات آدرس */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-base font-black text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={20} className="text-primary"/> آدرس و مشخصات تحویل‌گیرنده
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">نام و نام خانوادگی تحویل‌گیرنده</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">شماره همراه گیرنده</label>
                  <input required type="tel" dir="ltr" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs font-bold font-mono text-left" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">استان و شهر مقصد</label>
                  <input required type="text" name="city" placeholder="مثال: تهران یا شیراز" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">کد پستی ۱۰ رقمی</label>
                  <input required type="text" dir="ltr" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs font-mono font-bold text-left" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">نشانی دقیق پستی</label>
                  <textarea required name="address" rows="3" value={formData.address} onChange={handleChange} placeholder="خیابان، کوچه، پلاک، زنگ یا واحد..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* ماژول اختصاصی انتخاب ۳ حامل پستی رسمی */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                <Truck size={20} className="text-primary"/> انتخاب شیوه حمل‌ونقل بار
              </h2>
              <p className="text-xs text-gray-400 mb-6">هزینه ارسال براساس تعرفه رسمی مصوب شرکت‌ها به فاکتور نهایی افزوده می‌شود:</p>

              <div className="space-y-3">
                {courierOptions.map((courier) => {
                  const isSelected = selectedCourier === courier.id;
                  return (
                    <div 
                      key={courier.id}
                      onClick={() => setSelectedCourier(courier.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-white shadow-sm ${isSelected ? 'border border-primary/30' : ''}`}>
                          {courier.icon}
                        </div>
                        <div>
                          <span className="font-black text-sm text-gray-900 block">{courier.title}</span>
                          <span className="text-xs text-gray-400 mt-0.5 block">{courier.time}</span>
                        </div>
                      </div>

                      <div className="text-left font-black text-sm text-gray-900">
                        {formatPrice(courier.price)} تومان
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* فاکتور مالی */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-4">
              <h3 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100">فاکتور نهایی سفارش</h3>

              <div className="space-y-3 text-xs font-bold text-gray-600">
                <div className="flex justify-between">
                  <span>مجموع ارزش مکمل‌ها:</span>
                  <span>{formatPrice(subTotal)} تومان</span>
                </div>
                <div className="flex justify-between items-center text-dark">
                  <span>کرایه حمل ({selectedCourier}):</span>
                  <span className="font-black">{formatPrice(shippingFee)} تومان</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-black text-gray-900 text-sm">مبلغ نهایی قابل پرداخت:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">{formatPrice(totalPayable)}</span>
                  <span className="text-xs font-bold text-gray-500">تومان</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'انتقال به درگاه بانکی شاپرک'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
