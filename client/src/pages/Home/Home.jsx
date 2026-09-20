// filepath: client/src/pages/Home/Home.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Zap, Flame, Target, HeartPulse } from 'lucide-react';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/product/ProductCard';

const Home = () => {
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // جدا کردن محصولات تخفیف‌دار برای بخش شگفت‌انگیز
  const discountedProducts = products.filter(p => 
    p.variants.some(v => v.discountPrice != null && v.stock > 0)
  );

  const categories = [
    { name: 'پروتئین وی', icon: <Target size={32} />, id: 'whey', color: 'from-blue-500 to-cyan-400' },
    { name: 'کراتین', icon: <Zap size={32} />, id: 'creatine', color: 'from-purple-500 to-indigo-500' },
    { name: 'چربی‌سوز', icon: <Flame size={32} />, id: 'fat-burner', color: 'from-rose-500 to-orange-400' },
    { name: 'آمینو', icon: <HeartPulse size={32} />, id: 'amino', color: 'from-emerald-500 to-teal-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      
      {/* 1. Hero Section (بنر اصلی) */}
      <section className="container mx-auto px-4 py-6">
        <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl relative min-h-[300px] md:min-h-[400px] flex items-center border border-gray-800">
          {/* پترن پس‌زمینه */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
          
          <div className="relative z-10 px-8 md:px-16 lg:w-1/2">
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-bold mb-4">
              کالکشن جدید ۲۰۲۴
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              سوختِ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">عضلات</span> خود را تامین کنید.
            </h1>
            <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed max-w-md">
              بزرگترین مرجع تخصصی مکمل‌های ورزشی اورجینال با ضمانت بازگشت وجه و ارسال فوری به سراسر کشور.
            </p>
            <Link to="/archive" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-rose-500 text-white font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(239,64,86,0.4)] transition-all">
              مشاهده محصولات
              <ChevronLeft size={20} />
            </Link>
          </div>
          
          {/* بخش گرافیکی راست بنر */}
          <div className="hidden lg:flex absolute left-10 top-0 bottom-0 items-center justify-center w-1/3">
            <div className="w-64 h-64 bg-gradient-to-tr from-primary/40 to-rose-500/10 rounded-full blur-3xl"></div>
            <Dumbbell size={180} strokeWidth={0.5} className="text-white/10 absolute rotate-45 transform hover:rotate-12 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* 2. Categories (دسته‌بندی‌ها) */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <Link key={index} to={`/archive?category=${cat.id}`} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-transform group">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="font-bold text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Flash Sale (پیشنهاد شگفت‌انگیز) */}
      {discountedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-rose-500 to-primary rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-center shadow-lg">
            <div className="lg:w-1/5 flex flex-col items-center text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Flame size={40} className="text-yellow-300" />
              </div>
              <h2 className="text-3xl font-black mb-2">پیشنهاد ویژه</h2>
              <p className="text-white/80 text-sm">تخفیف‌های تکرار نشدنی</p>
              <Link to="/archive?discount=true" className="mt-6 flex items-center gap-1 text-sm font-bold bg-white text-primary px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                مشاهده همه <ChevronLeft size={16} />
              </Link>
            </div>
            
            <div className="w-full lg:w-4/5">
              {/* برای اسکرول افقی در موبایل */}
              <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 -mb-4">
                {discountedProducts.map(product => (
                  <div key={product._id} className="w-[260px] flex-none">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Latest / All Products Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Zap className="text-yellow-500" size={24} />
            جدیدترین مکمل‌ها
          </h2>
          <Link to="/archive" className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1">
            آرشیو کامل <ChevronLeft size={18} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
