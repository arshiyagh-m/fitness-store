import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, Search, Check } from 'lucide-react';
import useProductStore from '../../store/productStore';
import ProductCard from '../../components/product/ProductCard';
import { CATEGORY_TREE } from '../../utils/categories';

const Archive = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
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

    if (subcategoryParam) {
      result = result.filter(p => p.subcategory === subcategoryParam);
    }

    if (keywordParam) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(keywordParam.toLowerCase()) ||
        p.brand.toLowerCase().includes(keywordParam.toLowerCase()) ||
        p.description?.toLowerCase().includes(keywordParam.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, categoryParam, subcategoryParam, keywordParam]);

  const activeCategoryObj = CATEGORY_TREE.find(c => c.id === categoryParam);

  return (
    <div className="bg-gray-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* کادر فیلتر فعال */}
        {(categoryParam || subcategoryParam || keywordParam) && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <Search size={16} className="text-primary" />
              <span>فیلترهای فعال:</span>
              {activeCategoryObj && <span className="bg-dark text-primary px-3 py-1 rounded-lg">{activeCategoryObj.name}</span>}
              {subcategoryParam && <span className="bg-primary text-dark px-3 py-1 rounded-lg">زیردسته: {subcategoryParam}</span>}
              {keywordParam && <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg">جستجو: "{keywordParam}"</span>}
            </div>
            <Link to="/archive" className="text-xs text-rose-500 font-black hover:underline">پاک کردن همه فیلترها</Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* سایدبار فیلترهای ساختار درختی */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                <SlidersHorizontal size={20} className="text-primary" />
                <h2 className="font-black text-gray-900 text-base">دسته‌بندی‌های جامع</h2>
              </div>

              <div className="space-y-4 text-xs">
                <Link 
                  to="/archive" 
                  className={`block py-2 px-3 rounded-xl font-black transition-all ${!categoryParam ? 'bg-primary text-dark' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  همه محصولات فروشگاه
                </Link>

                {CATEGORY_TREE.map(cat => {
                  const isParentActive = categoryParam === cat.id;
                  return (
                    <div key={cat.id} className="space-y-2">
                      <Link 
                        to={`/archive?category=${cat.id}`}
                        className={`w-full text-right p-3 rounded-xl font-black flex items-center justify-between transition-all ${
                          isParentActive ? 'bg-dark text-primary shadow-sm' : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <ChevronDown size={14} className={isParentActive ? 'rotate-180 transition-transform' : ''} />
                      </Link>

                      {/* نمایش زیردسته‌ها اگر دسته مادر فعال بود */}
                      {isParentActive && (
                        <div className="pr-4 space-y-1 pt-1 border-r-2 border-primary/40 mr-2">
                          {cat.subcategories.map((sub, i) => {
                            const isSubActive = subcategoryParam === sub;
                            return (
                              <Link
                                key={i}
                                to={`/archive?category=${cat.id}&subcategory=${encodeURIComponent(sub)}`}
                                className={`block py-1.5 px-2 rounded-lg font-bold transition-all text-[11px] ${
                                  isSubActive ? 'text-primary font-black bg-dark/10' : 'text-gray-500 hover:text-dark'
                                }`}
                              >
                                • {sub}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* شبکه محصولات */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Filter size={16} /> نمایش {filteredProducts.length} مکمل ورزشی و دارویی
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-bold bg-white rounded-3xl border border-gray-100">
                مکصلی در این دسته‌بندی با این مشخصات یافت نشد.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
