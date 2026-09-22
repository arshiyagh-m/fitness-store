import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowLeft } from 'lucide-react';
import useCompareStore from '../../store/compareStore';

const CompareFloatingBar = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompareStore();
  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-dark/95 backdrop-blur-md text-white rounded-3xl p-4 shadow-2xl z-50 flex items-center justify-between border border-gray-800">
      <div className="flex items-center gap-4">
        <div className="bg-primary text-dark p-2.5 rounded-2xl flex items-center justify-center shrink-0">
          <Scale size={22} />
        </div>
        <div>
          <span className="text-sm font-black block">مقایسه مکمل‌ها</span>
          <span className="text-xs text-gray-400">{compareItems.length} از ۳ کالا انتخاب شده</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {compareItems.map(item => (
          <div key={item._id} className="relative bg-gray-800/80 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-700">
            <span className="text-xs font-bold max-w-[120px] truncate">{item.title}</span>
            <button onClick={() => removeFromCompare(item._id)} className="text-gray-400 hover:text-rose-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={clearCompare} className="text-xs text-gray-400 hover:text-white px-2">پاک کردن</button>
        <Link to="/compare" className="bg-primary text-dark font-black px-5 py-2.5 rounded-xl text-xs hover:bg-primary-hover transition-colors flex items-center gap-1">
          مقایسه کن <ArrowLeft size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CompareFloatingBar;
