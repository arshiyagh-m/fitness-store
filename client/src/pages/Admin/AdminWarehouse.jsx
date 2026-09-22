import React, { useState, useEffect } from 'react';
import { Boxes, Search, AlertTriangle, CheckCircle2, XCircle, Save, Loader2, DollarSign, Package, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const AdminWarehouse = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all | low | out | healthy
  const [stockEdits, setStockEdits] = useState({});
  const [savingSku, setSavingSku] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // استخراج تمام متغیرها به صورت ردیف‌های مجزای انبارداری
  const inventoryRows = [];
  products.forEach(p => {
    p.variants?.forEach(v => {
      inventoryRows.push({
        productId: p._id,
        productTitle: p.title,
        brand: p.brand,
        image: p.images?.[0],
        category: p.category,
        sku: v.sku,
        flavor: v.flavor,
        weight: v.weight,
        price: v.price,
        stock: v.stock,
      });
    });
  });

  // محاسبات هوشمند ارزش ریالی انبار
  const totalItemsCount = inventoryRows.reduce((acc, row) => acc + row.stock, 0);
  const totalValuation = inventoryRows.reduce((acc, row) => acc + (row.stock * row.price), 0);
  const lowStockCount = inventoryRows.filter(r => r.stock > 0 && r.stock <= 5).length;
  const outOfStockCount = inventoryRows.filter(r => r.stock === 0).length;

  // فیلتر کردن ردیف‌ها
  const filteredRows = inventoryRows.filter(row => {
    const matchesSearch = row.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.flavor.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterMode === 'low') return row.stock > 0 && row.stock <= 5;
    if (filterMode === 'out') return row.stock === 0;
    if (filterMode === 'healthy') return row.stock > 5;
    return true;
  });

  const handleStockInputChange = (sku, val) => {
    setStockEdits({ ...stockEdits, [sku]: val });
  };

  const handleSaveStock = async (row) => {
    const newStock = stockEdits[row.sku];
    if (newStock === undefined || newStock === '') return;
    setSavingSku(row.sku);

    try {
      await api.put('/products/stock/quick-update', {
        productId: row.productId,
        sku: row.sku,
        newStock: Number(newStock)
      });
      // آپدیت استیت محلی بدون رفرش
      setProducts(prev => prev.map(p => {
        if (p._id === row.productId) {
          return {
            ...p,
            variants: p.variants.map(v => v.sku === row.sku ? { ...v, stock: Number(newStock) } : v)
          };
        }
        return p;
      }));
      alert(`موجودی SKU: ${row.sku} در لحظه به روز شد.`);
    } catch (err) {
      alert('خطا در بروزرسانی انبار');
    } finally {
      setSavingSku(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 font-sans">
      
      {/* هدر صفحه انبار */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-dark text-primary rounded-2xl">
            <Boxes size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">سامانه جامع انبارداری و مدیریت قفسه‌ها (WMS)</h1>
            <p className="text-xs text-gray-400 mt-1">کنترل لحظه‌ای موجودی، ارزش ریالی انبار و ویرایش سریع قوطی‌ها</p>
          </div>
        </div>
        <button onClick={fetchInventory} className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-colors">
          <RefreshCw size={16} /> بروزرسانی انبار
        </button>
      </div>

      {/* کارت‌های شاخص هوشمند انبار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/20 text-dark rounded-2xl flex items-center justify-center font-black">
            <DollarSign size={26}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">ارزش کل موجودی انبار</p>
            <p className="text-xl font-black text-gray-900 mt-1">{formatPrice(totalValuation)} <span className="text-xs font-normal">تومان</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package size={26}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">کل قوطی‌های موجود</p>
            <p className="text-xl font-black text-gray-900 mt-1">{totalItemsCount} <span className="text-xs font-normal">عدد</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={26}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">اقلام رو به اتمام (زیر ۵ عدد)</p>
            <p className="text-xl font-black text-amber-600 mt-1">{lowStockCount} <span className="text-xs font-normal">قلم</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
            <XCircle size={26}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">اقلام کاملاً ناموجود</p>
            <p className="text-xl font-black text-rose-600 mt-1">{outOfStockCount} <span className="text-xs font-normal">قلم</span></p>
          </div>
        </div>
      </div>

      {/* فیلترها و جستجوی سریع در قفسه‌ها */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button onClick={() => setFilterMode('all')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterMode === 'all' ? 'bg-dark text-primary shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            همه اقلام ({inventoryRows.length})
          </button>
          <button onClick={() => setFilterMode('low')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterMode === 'low' ? 'bg-amber-500 text-white shadow-md' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>
            کسری انبار ({lowStockCount})
          </button>
          <button onClick={() => setFilterMode('out')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterMode === 'out' ? 'bg-rose-600 text-white shadow-md' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
            ناموجودها ({outOfStockCount})
          </button>
          <button onClick={() => setFilterMode('healthy')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterMode === 'healthy' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
            موجودی مطلوب
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="جستجوی نام مکمل، طعم یا SKU..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* جدول مدرن انبارداری با ویرایش در لحظه موجودی (Inline Fast Editor) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50/70 text-gray-400 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">کالا</th>
                <th className="px-6 py-4">کد انبار (SKU)</th>
                <th className="px-6 py-4">طعم و وزن</th>
                <th className="px-6 py-4">قیمت واحد</th>
                <th className="px-6 py-4 text-center">وضعیت</th>
                <th className="px-6 py-4 text-center">ویرایش سریع موجودی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-16"><Loader2 className="animate-spin text-primary mx-auto" size={32}/></td></tr>
              ) : filteredRows.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-gray-400 font-bold">هیچ مکملی در این فیلتر یافت نشد.</td></tr>
              ) : (
                filteredRows.map((row) => {
                  const isModified = stockEdits[row.sku] !== undefined && Number(stockEdits[row.sku]) !== row.stock;
                  return (
                    <tr key={row.sku} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 p-1 shrink-0 overflow-hidden">
                            <img src={row.image || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600'} alt={row.productTitle} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block line-clamp-1">{row.productTitle}</span>
                            <span className="text-xs text-gray-400 uppercase font-mono">{row.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-xs text-gray-500">{row.sku}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-700">{row.flavor} ({row.weight})</td>
                      <td className="px-6 py-4 font-black text-gray-900">{formatPrice(row.price)} تومان</td>
                      <td className="px-6 py-4 text-center">
                        {row.stock === 0 ? (
                          <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-xl">ناموجود</span>
                        ) : row.stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[11px] font-black px-2.5 py-1 rounded-xl">کسری انبار ({row.stock})</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-black px-2.5 py-1 rounded-xl">موجود ({row.stock})</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number" 
                            dir="ltr"
                            defaultValue={row.stock}
                            onChange={(e) => handleStockInputChange(row.sku, e.target.value)}
                            className="w-20 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-center font-black text-sm outline-none focus:border-primary focus:bg-white transition-all"
                          />
                          <button
                            onClick={() => handleSaveStock(row)}
                            disabled={!isModified || savingSku === row.sku}
                            className={`p-2 rounded-xl transition-all ${
                              isModified 
                                ? 'bg-primary text-dark font-bold shadow-md hover:bg-primary-hover animate-pulse' 
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                            title="ثبت تغییر موجودی در انبار"
                          >
                            {savingSku === row.sku ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminWarehouse;
