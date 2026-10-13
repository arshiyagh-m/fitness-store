import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Dumbbell, ArrowRight, Printer, Save, CheckCircle2, User, Phone, MapPin, Activity } from 'lucide-react';
import api from '../../services/api';

const AdminIntakeDetail = () => {
  const { id } = useParams();
  const [intake, setIntake] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchIntake = async () => {
      try {
        const { data } = await api.get(`/athlete-intake/${id}`);
        setIntake(data);
        setStatus(data.status);
        setNotes(data.coachNotes || '');
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchIntake();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/athlete-intake/${id}`, { status, coachNotes: notes });
      alert('وضعیت پرونده و یادداشت‌های مربی ذخیره شد.');
    } catch (err) {
      alert('خطا در ذخیره‌سازی');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold"><Activity className="animate-spin text-primary mx-auto" size={36}/></div>;
  if (!intake) return <div className="text-center py-20 font-bold">پرونده‌ای یافت نشد!</div>;

  return (
    <div className="max-w-5xl mx-auto pb-16 font-sans" dir="rtl">
      
      {/* هدر پرونده */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 print:hidden">
        <div className="flex items-center gap-4">
          <Link to="/admin/intakes" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowRight size={20}/></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Dumbbell className="text-primary" size={24} /> پرونده جامع ورزشی: {intake.fullName}
            </h1>
            <p className="text-xs text-gray-400 mt-1">ارسال شده در {new Date(intake.createdAt).toLocaleDateString('fa-IR')}</p>
          </div>
        </div>

        <button onClick={() => window.print()} className="bg-dark text-white px-5 py-3 rounded-2xl text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
          <Printer size={16} /> چاپ رسمی پرونده (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* محتوای پرونده ورزشکار */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-base font-black text-gray-900 border-b pb-3">اطلاعات پرونده و ارزیابی مربی دانیال سلیمانی</h2>
            
            <div className="space-y-4 text-xs">
              {Object.entries(intake.formData || {}).map(([key, value]) => {
                const valText = Array.isArray(value) ? value.join('، ') : String(value || '—');
                return (
                  <div key={key} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between gap-1">
                    <strong className="text-gray-500">{key}:</strong>
                    <span className="text-gray-900 font-bold">{valText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* سایدبار مدیریت مربی */}
        <div className="space-y-6 print:hidden">
          <div className="bg-dark text-white p-6 rounded-3xl shadow-sm border border-gray-800 space-y-4">
            <h3 className="font-black text-base text-primary pb-3 border-b border-gray-700">اقدامات مربی</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">وضعیت پرونده ورزشکار</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-white outline-none focus:border-primary">
                <option value="در انتظار بررسی">در انتظار بررسی</option>
                <option value="در حال طراحی برنامه">در حال طراحی برنامه</option>
                <option value="برنامه تحویل داده شد">برنامه تحویل داده شد</option>
                <option value="بایگانی">بایگانی</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">یادداشت‌های محرمانه مربی</label>
              <textarea rows="5" value={notes} onChange={e => setNotes(e.target.value)} placeholder="نکات مربوط به دوره‌ها، وزن هدف و..." className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white outline-none focus:border-primary resize-none"></textarea>
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full bg-primary text-dark font-black py-3.5 rounded-xl hover:bg-primary-hover transition-colors text-xs flex items-center justify-center gap-2">
              <Save size={16}/> {saving ? 'در حال ذخیره...' : 'ذخیره پرونده'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminIntakeDetail;
