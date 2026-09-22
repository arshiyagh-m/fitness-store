import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Zap, Flame, Target, HeartPulse, Dumbbell } from 'lucide-react';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/product/ProductCard';

const Home = () => {
  const { products, fetchProducts, isLoading } = useProductStore();
  const [bannerConfig, setBannerConfig] = useState({
    title: 'سوختِ عضلات خود را تامین کنید.', subtitle: 'کالکشن جدید ۲۰۲۴', isActive: true, theme: 'default'
  });

  useEffect(() => {
    fetchProducts();
    const savedBanner = localStorage.getItem('site_banner');
    if (savedBanner) setBannerConfig(JSON.parse(savedBanner));
  }, [fetchProducts]);

  const discountedProducts = products.filter(p => p.variants.some(v => v.discountPrice != null && v.stock > 0));

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      
      {/* بنر دینامیک و هوشمند (رنگ‌ها از متغیرهای سراسری CSS خوانده می‌شوند) */}
      {bannerConfig.isActive && (
        <section className="container mx-auto px-4 py-6">
          <div className="w-full bg-dark rounded-3xl overflow-hidden shadow-2xl relative min-h-[300px] md:min-h-[400px] flex items-center border border-gray-800 transition-colors duration-500">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
            <div className="relative z-10 px-8 md:px-16 lg:w-1/2">
              <span className="inline-block px-3 py-1 bg-primary text-dark rounded-full text-sm font-black mb-4">{bannerConfig.subtitle}</span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                {bannerConfig.title.split(' ').map((word, i) => i === 1 ? <span key={i} className="mx-2 text-primary">{word}</span> : word + ' ')}
              </h1>
              <Link to="/archive" className="inline-flex items-center gap-2 bg-primary text-dark font-black px-8 py-3.5 rounded-xl hover:opacity-80 transition-all mt-4">مشاهده محصولات <ChevronLeft size={20} /></Link>
            </div>
            <div className="hidden lg:flex absolute left-10 top-0 bottom-0 items-center justify-center w-1/3">
              <Dumbbell size={180} strokeWidth={0.5} className="text-primary/20 absolute rotate-45 transform hover:rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </section>
      )}

      {/* بقیه قسمت‌های صفحه اصلی ثابت است */}
      {discountedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="bg-dark rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-center shadow-lg border border-gray-800 transition-colors duration-500">
            <div className="lg:w-1/5 flex flex-col items-center text-center text-white">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4"><Flame size={40} className="text-primary" /></div>
              <h2 className="text-3xl font-black mb-2 text-primary">پیشنهاد ویژه</h2>
              <Link to="/archive?discount=true" className="mt-4 flex items-center gap-1 text-sm font-bold bg-primary text-dark px-4 py-2 rounded-full hover:opacity-80">مشاهده همه <ChevronLeft size={16}/></Link>
            </div>
            <div className="w-full lg:w-4/5"><div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 -mb-4">{discountedProducts.map(product => (<div key={product._id} className="w-[260px] flex-none"><ProductCard product={product} /></div>))}</div></div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black text-gray-800 flex items-center gap-2"><Zap className="text-primary" size={24} /> جدیدترین مکمل‌ها</h2></div>
        {isLoading ? <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </section>
    </div>
  );
};
export default Home;
