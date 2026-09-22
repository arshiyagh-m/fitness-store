import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, Send, Trash2, CheckCircle2, Clock, UserCheck, Activity, Search } from 'lucide-react';
import api from '../../services/api';

const AdminQA = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [expertTitle, setExpertTitle] = useState('کارشناس ارشد تغذیه Team 9');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterMode, setFilterMode] = useState('pending'); // pending | answered | all

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/questions');
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenAnswerModal = (q) => {
    setActiveQuestion(q);
    setAnswerText(q.answer || '');
    if (q.answeredBy) setExpertTitle(q.answeredBy);
  };

  const handleSendAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    setIsSubmitting(true);

    try {
      await api.put(`/questions/${activeQuestion._id}/answer`, {
        answer: answerText,
        answeredBy: expertTitle,
      });

      setQuestions(questions.map(q => 
        q._id === activeQuestion._id ? { ...q, answer: answerText, answeredBy: expertTitle, isAnswered: true } : q
      ));

      alert('پاسخ رسمی شما در صفحه محصول منتشر شد!');
      setActiveQuestion(null);
    } catch (err) {
      alert('خطا در ثبت پاسخ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این پرسش اطمینان دارید؟')) {
      try {
        await api.delete(`/questions/${id}`);
        setQuestions(questions.filter(q => q._id !== id));
      } catch (err) {
        alert('خطا در حذف');
      }
    }
  };

  const filtered = questions.filter(q => {
    if (filterMode === 'pending') return !q.isAnswered;
    if (filterMode === 'answered') return q.isAnswered;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto pb-16 font-sans">
      
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-dark text-primary rounded-2xl">
            <HelpCircle size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">میز پاسخگویی به پرسش‌ها و مشاوره مکمل</h1>
            <p className="text-xs text-gray-400 mt-1">پاسخ رسمی مربیان و کارشناسان تغذیه به سوالات ورزشکاران</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setFilterMode('pending')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterMode === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
            در انتظار پاسخ ({questions.filter(q => !q.isAnswered).length})
          </button>
          <button onClick={() => setFilterMode('answered')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterMode === 'answered' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
            پاسخ داده شده ({questions.filter(q => q.isAnswered).length})
          </button>
          <button onClick={() => setFilterMode('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterMode === 'all' ? 'bg-dark text-primary shadow-md' : 'bg-gray-100 text-gray-600'}`}>
            همه ({questions.length})
          </button>
        </div>
      </div>

      {/* لیست سوالات */}
      {loading ? (
        <div className="text-center py-20"><Activity className="animate-spin text-primary mx-auto" size={36} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 font-bold text-gray-400">
          پرسشی در این بخش وجود ندارد.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => (
            <div key={q._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-sm">{q.authorName}</span>
                    <span className="text-xs text-gray-400">در مورد مکمل:</span>
                    <span className="text-xs font-black text-primary bg-dark px-2.5 py-0.5 rounded-lg">{q.productTitle}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{new Date(q.createdAt).toLocaleDateString('fa-IR')}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleOpenAnswerModal(q)} className="bg-primary hover:bg-primary-hover text-dark font-black px-4 py-2 rounded-xl text-xs transition-all shadow-sm">
                    {q.isAnswered ? 'ویرایش پاسخ' : 'پاسخ به سوال'}
                  </button>
                  <button onClick={() => handleDelete(q._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* متن سوال */}
              <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-700 leading-relaxed font-medium">
                « {q.question} »
              </div>

              {/* پاسخ ادمین اگر وجود داشته باشد */}
              {q.isAnswered && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-emerald-800">
                    <UserCheck size={16} /> پاسخ رسمی: {q.answeredBy}
                  </div>
                  <p className="leading-relaxed pr-5">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* مودال پاسخگویی */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6 border border-gray-100">
            <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
              <MessageSquare className="text-primary" /> پاسخ تخصصی به پرسش ورزشکار
            </h3>
            
            <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-700 font-medium">
              <strong>سوال {activeQuestion.authorName}:</strong>
              <p className="mt-1">« {activeQuestion.question} »</p>
            </div>

            <form onSubmit={handleSendAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">سمت و عنوان پاسخ‌دهنده</label>
                <input 
                  type="text" 
                  value={expertTitle} 
                  onChange={(e) => setExpertTitle(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">متن پاسخ رسمی کارشناسی</label>
                <textarea 
                  required
                  rows="5" 
                  value={answerText} 
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="توضیحات دوز مصرفی، تداخل و راهنمایی دوره..."
                  className="w-full p-4 bg-gray-50 border rounded-2xl text-xs outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setActiveQuestion(null)} className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl">انصراف</button>
                <button type="submit" disabled={isSubmitting} className="bg-primary text-dark font-black px-6 py-2.5 rounded-xl text-xs hover:bg-primary-hover shadow-md flex items-center gap-1.5">
                  <Send size={14}/> {isSubmitting ? 'در حال انتشار...' : 'انتشار در صفحه محصول'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminQA;
