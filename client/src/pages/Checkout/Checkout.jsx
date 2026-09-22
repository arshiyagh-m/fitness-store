import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, User, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    city: '',
    postalCode: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        totalPrice: cartFinalPrice() // قیمت نهایی با کسر قطعی کوپن
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      navigate(`/payment/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در برقراری ارتباط با سرور');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100"><ArrowRight size={20} className="text-gray-600" /></Link>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <CheckCircle2 size={28} className="text-primary" /> تکمیل اطلاعات ارسال مرسوله
          </h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100">{error}</div>}

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">آدرس گیرنده</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><User size={16}/> نام و نام خانوادگی گیرنده</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Phone size={16}/> شماره موبایل</label>
                <input required type="tel" dir="ltr" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm text-left" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16}/> استان و شهر</label>
                <input required type="text" name="city" placeholder="مثال: تهران" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">کد پستی ۱۰ رقمی</label>
                <input required type="text" dir="ltr" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm text-left font-mono" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">آدرس دقیق پستی</label>
                <textarea required name="address" rows="3" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-4">
              <h3 className="text-base font-black text-gray-900 pb-3 border-b border-gray-100">فاکتور نهایی با تخفیف</h3>
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-gray-500 text-sm">مبلغ فاکتور:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">{formatPrice(cartFinalPrice())}</span>
                  <span className="text-xs text-gray-400 font-bold">تومان</span>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary text-dark hover:bg-primary-hover font-black py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
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
