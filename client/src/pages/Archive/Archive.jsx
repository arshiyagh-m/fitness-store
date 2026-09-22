import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/product/ProductCard';

const Archive = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const keywordParam = searchParams.get('keyword');
  
  const { products, fetchProducts, isLoading } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let result = products;

    if (categoryParam) {
      result = result.filter(p => p.category === categoryParam);
    }

    if (keywordParam) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(keywordParam.toLowerCase()) ||
        p.brand.toLowerCase().includes(keywordParam.toLowerCase()) ||
        p.description.toLowerCase().includes(keywordParam.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, categoryParam, keywordParam]);

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
        
        {keywordParam && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Search size={18} className="text-primary" />
              <span>نتایج جستجو برای:</span>
              <strong className="text-dark font-black">"{keywordParam}"</strong>
            </div>
            <a href="/archive" className="text-xs text-primary font-bold hover:underline">پاک کردن جستجو</a>
          </div>
        )}

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
                  <a href="/archive" className={`block text-sm font-medium transition-colors ${!categoryParam ? 'text-primary font-bold' : 'text-gray-500 hover:text-gray-900'}`}>
                    همه محصولات
                  </a>
                  {categories.map(cat => (
                    <a 
                      key={cat.id} 
                      href={`/archive?category=${cat.id}`} 
                      className={`block text-sm font-medium transition-colors ${categoryParam === cat.id ? 'text-primary font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* لیست محصولات */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                <Filter size={18} /> نمایش {filteredProducts.length} محصول
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-bold bg-white rounded-3xl border border-gray-100">
                محصولی مطابق با جستجوی شما یافت نشد.
              </div>
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
