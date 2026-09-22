import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/product/ProductCard';

const Archive = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { products, fetchProducts, isLoading } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (categoryParam) {
      setFilteredProducts(products.filter(p => p.category === categoryParam));
    } else {
      setFilteredProducts(products);
    }
  }, [products, categoryParam]);

  const categories = [
    { id: 'whey', name: 'پروتئین وی' },
    { id: 'creatine', name: 'کراتین' },
    { id: 'gainer', name: 'گینر و کربوهیدرات' },
    { id: 'amino', name: 'آمینو و BCAA' },
    { id: 'pre-workout', name: 'پمپ و قبل تمرین' },
    { id: 'fat-burner', name: 'چربی‌سوز' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* سایدبار فیلترها */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <SlidersHorizontal size={20} className="text-primary" />
                <h2 className="font-black text-gray-900 text-lg">فیلتر محصولات</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                  دسته‌بندی‌ها <ChevronDown size={16} />
                </h3>
                <div className="space-y-3">
                  <a href="/archive" className={`block text-sm font-medium transition-colors ${!categoryParam ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>همه محصولات</a>
                  {categories.map(cat => (
                    <a key={cat.id} href={`/archive?category=${cat.id}`} className={`block text-sm font-medium transition-colors ${categoryParam === cat.id ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                  محدوده قیمت <ChevronDown size={16} />
                </h3>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="از" className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-primary" />
                  <span className="text-gray-400">-</span>
                  <input type="text" placeholder="تا" className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center outline-none focus:border-primary" />
                </div>
                <button className="w-full bg-dark text-primary font-bold py-2.5 rounded-xl mt-4 hover:bg-gray-800 transition-colors">اعمال فیلتر قیمت</button>
              </div>
            </div>
          </div>

          {/* لیست محصولات */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                <Filter size={18} /> مرتب‌سازی بر اساس:
              </div>
              <div className="flex gap-4 text-sm font-medium">
                <button className="text-primary border-b-2 border-primary pb-1">جدیدترین</button>
                <button className="text-gray-400 hover:text-gray-800 transition-colors">ارزان‌ترین</button>
                <button className="text-gray-400 hover:text-gray-800 transition-colors">گران‌ترین</button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-bold bg-white rounded-3xl border border-gray-100">محصولی در این دسته یافت نشد.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
export default Archive;
