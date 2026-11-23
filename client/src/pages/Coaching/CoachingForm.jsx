import React, { useState } from 'react';
import { Send, Copy, Printer, CheckCircle2, AlertCircle, Dumbbell } from 'lucide-react';
import api from '../../services/api';

const SECTIONS = [
  {
    num: '۱',
    title: 'اطلاعات فردی و راه‌های ارتباطی',
    fields: [
      { type: 'grid2', items: [
        { name: 'نام و نام خانوادگی', label: 'نام و نام خانوادگی *', required: true },
        { name: 'تاریخ تولد / سن', label: 'تاریخ تولد / سن' },
        { name: 'قد (سانتی‌متر)', label: 'قد (سانتی‌متر)' },
        { name: 'وزن فعلی (کیلوگرم)', label: 'وزن فعلی (کیلوگرم)' },
        { name: 'بیشترین و کمترین وزن', label: 'بیشترین و کمترین وزنی که داشتید' },
        { name: 'شهر / کشور محل سکونت', label: 'شهر / کشور محل سکونت' },
        { name: 'شغل', label: 'شغل' },
        { name: 'ساعات کاری در روز', label: 'ساعات کاری در روز' },
        { name: 'شماره تماس', label: 'شماره تماس / واتس‌اپ و تلگرام *', inputType: 'tel', required: true },
        { name: 'آیدی تلگرام / اینستاگرام', label: 'آیدی تلگرام / اینستاگرام' },
        { name: 'نام باشگاه', label: 'نام باشگاه' },
        { name: 'نحوه آشنایی', label: 'نحوه آشنایی با من' },
      ]},
      { type: 'radio', name: 'ماهیت شغل', label: 'ماهیت شغل:', options: ['پشت‌میزی و کم‌تحرک', 'نیمه‌فعال (سرپایی)', 'فیزیکی و سنگین', 'شیفتی / نامنظم'] }
    ]
  },
  {
    num: '۲',
    title: 'اهداف و انتظارات',
    fields: [
      { type: 'checkbox', name: 'هدف اصلی', label: 'هدف اصلی از مراجعه به من؟', hint: '(می‌توانی بیش از یک مورد انتخاب کنی)', options: ['کاهش چربی و سلامت عمومی', 'افزایش عضله (حجم)', 'ریکامپ (چربی‌سوزی + عضله‌سازی)', 'افزایش قدرت', 'آمادگی مسابقه'] },
      { type: 'textarea', name: 'توضیح تکمیلی هدف', label: 'لطفا اگه نیاز به توضیح تکمیلی در این باره هست داخل کادر زیر موارد را بنویسید:' },
      { type: 'radio', name: 'قصد مسابقه', label: 'آیا قصد شرکت در مسابقه داری؟', options: ['بله', 'خیر', 'شاید در آینده'] },
      { type: 'textarea', name: 'رشته، دسته و تاریخ مسابقه', label: 'در صورت بله — رشته، دسته و تاریخ مسابقه:', rows: 2 }
    ]
  },
  {
    num: '۳',
    title: 'سابقه و وضعیت تمرینی',
    fields: [
      { type: 'radio', name: 'سابقه تمرین', label: 'سابقه تمرین با وزنه:', options: ['کمتر از ۶ ماه', '۶ ماه تا ۲ سال', '۲ تا ۵ سال', 'بیش از ۵ سال'] },
      { type: 'radio', name: 'جلسات ۳ ماه اخیر', label: 'در ۳ ماه گذشته چند جلسه در هفته تمرین کرده‌ای؟', options: ['اصلاً', '۱ تا ۲ جلسه', '۳ تا ۴ جلسه', '۵ جلسه یا بیشتر'] },
      { type: 'textarea', name: 'آخرین برنامه تمرینی', label: 'آخرین برنامه تمرینی‌ات چه بود؟', hint: '(نوع تقسیم‌بندی، تعداد جلسات، مدت اجرا)' },
      { type: 'textarea', name: 'رکورد حرکات اصلی', label: 'رکورد یا وزنه تقریبی در حرکات اصلی را بنویس (Squat / Deadlift / Bench Press / Overhead Press)', hint: '— اگر می‌دانی؛ اگر مبتدی هستید نیازی نیست' },
      { type: 'radio', name: 'تسلط تکنیک', label: 'تسلط بر تکنیک حرکات پایه (اسکوات، ددلیفت، پرس‌ها):', options: ['مبتدی — نیاز به آموزش', 'متوسط — اجرای قابل قبول'] },
      { type: 'textarea', name: 'حرکات محبوب و نامحبوب', label: 'چه حرکاتی را دوست داری و چه حرکاتی را اصلاً دوست نداری یا اذیتت می‌کند؟' },
      { type: 'textarea', name: 'سابقه ورزشی دیگر', label: 'سابقه ورزشی دیگر (رزمی، فوتبال، دو، شنا و...):', rows: 2 }
    ]
  },
  {
    num: '۴',
    title: 'امکانات و شرایط تمرین',
    fields: [
      { type: 'radio', name: 'محل تمرین', label: 'محل تمرین:', options: ['باشگاه کاملاً مجهز', 'باشگاه با تجهیزات محدود', 'خانه با دمبل و کش', 'خانه بدون تجهیزات'] },
      { type: 'textarea', name: 'تجهیزات در دسترس', label: 'اگر تجهیزات محدود است، دقیقاً چه وسایلی در دسترس داری؟', rows: 2 },
      { type: 'radio', name: 'روزهای تمرین', label: 'چند روز در هفته می‌توانی تمرین کنی؟', hint: '(واقع‌بینانه)', options: ['۳ روز', '۴ روز', '۵ روز', '۶ روز'] },
      { type: 'grid2', items: [
        { name: 'مدت هر جلسه', label: 'مدت زمان هر جلسه (دقیقه):' },
        { name: 'ساعت معمول تمرین', label: 'ساعت معمول تمرین در روز:' },
      ]},
      { type: 'radio', name: 'امکان کاردیو', label: 'امکان انجام هوازی (کاردیو):', options: ['تردمیل / دوچرخه در باشگاه', 'پیاده‌روی بیرون', 'هر دو', 'محدودیت دارم'] }
    ]
  },
  {
    num: '۵',
    title: 'سلامت، آسیب‌دیدگی و سوابق پزشکی',
    fields: [
      { type: 'radio', name: 'آسیب‌دیدگی', label: 'آیا آسیب‌دیدگی فعلی یا قدیمی داری؟', hint: '(در صورت بله، بخش زیر را کامل کن)', options: ['خیر', 'بله'] },
      { type: 'textarea', name: 'جزئیات آسیب', label: 'محل آسیب، زمان وقوع و وضعیت فعلی آن را دقیق بنویس (کمر، زانو، شانه، مچ و...):' },
      { type: 'textarea', name: 'حرکات دردناک', label: 'آیا حرکتی هست که هنگام اجرا درد ایجاد کند؟ کدام حرکت و کجای بدن؟' },
      { type: 'radio', name: 'سابقه جراحی', label: 'سابقه جراحی:', options: ['ندارم', 'دارم'] },
      { type: 'textarea', name: 'نوع و تاریخ جراحی', label: 'در صورت داشتن جراحی — نوع و تاریخ:', rows: 2 },
      { type: 'checkbox', name: 'بیماری زمینه‌ای', label: 'بیماری زمینه‌ای:', hint: '(می‌توانی بیش از یک مورد انتخاب کنی)', options: ['ندارم', 'دیابت', 'فشار خون', 'قلبی-عروقی', 'تیروئید', 'آسم', 'سایر'] },
      { type: 'textarea', name: 'توضیح بیماری', label: 'در صورت وجود بیماری یا مورد دیگر، توضیح بده:', rows: 2 },
      { type: 'textarea', name: 'داروهای مصرفی', label: 'داروهای مصرفی فعلی (نام دارو و دوز — شامل داروهای اعصاب، هورمونی و...):' },
      { type: 'textarea', name: 'آخرین آزمایش خون', label: 'آخرین آزمایش خون چه زمانی بوده؟ اگر برگه آزمایش داری، توضیح بده:', rows: 2 },
      { type: 'notice', text: 'نکته مهم: انجام آزمایش خون برای همه واجب است و اگه خارج از ایران هستید و هزینه انجام آزمایش بالاست فقط موارد فوق ضروری را انجام دهید' }
    ]
  },
  {
    num: '۶',
    title: 'تغذیه و عادات غذایی',
    fields: [
      { type: 'textarea', name: 'یک روز کامل غذایی', label: 'یک روز کامل غذایی خودت را دقیق بنویس — از صبح تا شب، با مقدار تقریبی', hint: '(این مهم‌ترین سؤال بخش تغذیه است)', rows: 5 },
      { type: 'radio', name: 'تعداد وعده‌ها', label: 'تعداد وعده‌های غذایی در روز:', options: ['۲ وعده', '۳ وعده', '۴ وعده', '۵ وعده یا بیشتر', 'نامنظم'] },
      { type: 'radio', name: 'اشتها', label: 'اشتها:', options: ['کم — غذا خوردن برایم سخت است', 'معمولی', 'زیاد — کنترل کردنش سخت است'] },
      { type: 'textarea', name: 'حساسیت غذایی', label: 'حساسیت یا عدم تحمل غذایی (لاکتوز، گلوتن، آجیل، میگو و...):', rows: 2 },
      { type: 'textarea', name: 'غذاهای نامحبوب', label: 'غذاهایی که اصلاً نمی‌خوری یا دوست نداری:', rows: 2 },
      { type: 'textarea', name: 'غذاهای محبوب', label: 'غذاهای مورد علاقه که دوست داری در برنامه باشند:', rows: 2 },
      { type: 'radio', name: 'رژیم خاص', label: 'رژیم خاص:', options: ['ندارم', 'گیاه‌خواری', 'روزه‌داری متناوب', 'کیتو', 'سایر'] },
      { type: 'grid2', items: [
        { name: 'مصرف آب روزانه', label: 'مصرف آب روزانه (لیوان/لیتر):' },
        { name: 'چای و قهوه', label: 'چای و قهوه (فنجان در روز):' },
        { name: 'نوشابه و نوشیدنی شیرین', label: 'نوشابه و نوشیدنی شیرین:' },
        { name: 'فست‌فود در هفته', label: 'فست‌فود (دفعات در هفته):' },
      ]},
      { type: 'radio', name: 'بودجه غذایی', label: 'بودجه غذایی:', options: ['محدود — مواد ساده و اقتصادی', 'متوسط', 'بدون محدودیت'] },
      { type: 'radio', name: 'آماده‌کننده غذا', label: 'چه کسی غذا را آماده می‌کند؟', options: ['خودم', 'خانواده', 'بیرون / آماده', 'ترکیبی'] },
      { type: 'textarea', name: 'سابقه رژیم‌های قبلی', label: 'سابقه رژیم‌های قبلی — چه رژیم‌هایی گرفتی و نتیجه چه شد؟' }
    ]
  },
  {
    num: '۷',
    title: 'مکمل‌ها و موارد مصرفی',
    fields: [
      { type: 'textarea', name: 'مکمل‌های فعلی', label: 'مکمل‌های فعلی که مصرف می‌کنی (نام، دوز و زمان مصرف — مثل کراتین، پروتئین وی، کافئین، امگا۳ و...):' },
      { type: 'radio', name: 'تمایل به مکمل', label: 'تمایل به استفاده از مکمل:', options: ['بله — بدون محدودیت', 'بله — فقط موارد ضروری', 'خیر — فقط غذا'] },
      { type: 'textarea', name: 'سابقه مصرف استروئید', label: 'سابقه مصرف استروئید؟ اگه جواب بله است کامل و با دوزبندی دقیق بنویسید:' }
    ]
  },
  {
    num: '۸',
    title: 'سبک زندگی، خواب و ریکاوری',
    fields: [
      { type: 'grid2', items: [
        { name: 'ساعت خواب شب', label: 'ساعت خواب شب:' },
        { name: 'ساعت بیداری صبح', label: 'ساعت بیداری صبح:' },
        { name: 'میانگین ساعات خواب', label: 'میانگین ساعات خواب:' },
        { name: 'میانگین قدم روزانه', label: 'میانگین قدم روزانه (اگر می‌دانی):' },
      ]},
      { type: 'radio', name: 'کیفیت خواب', label: 'کیفیت خواب:', options: ['عالی — یکسره و عمیق', 'متوسط — گاهی بیدار می‌شوم', 'ضعیف — بی‌خوابی دارم'] },
      { type: 'radio', name: 'سطح استرس', label: 'سطح استرس روزانه:', options: ['کم', 'متوسط', 'زیاد', 'خیلی زیاد'] },
      { type: 'radio', name: 'سیگار / قلیان', label: 'سیگار / قلیان:', options: ['نمی‌کشم', 'گاهی', 'روزانه'] },
      { type: 'radio', name: 'مصرف الکل', label: 'مصرف الکل:', options: ['ندارم', 'گاهی', 'منظم'] },
      { type: 'textarea', name: 'عامل اصلی استرس', label: 'عامل اصلی استرس زندگی‌ات چیست؟', hint: '(کار، درس، خانواده و...)', rows: 2 }
    ]
  },
  {
    num: '۹',
    title: 'اندازه‌گیری‌ها و عکس‌های شروع',
    fields: [
      { type: 'note', text: 'اندازه‌گیری‌ها را صبح ناشتا، قبل از صبحانه و بعد از دستشویی انجام بده. متر را نه شل بگیر و نه سفت.' },
      { type: 'measureTable', rows: [
        ['وزن (کیلوگرم)', 'دور گردن'],
        ['دور سینه', 'دور بازو (راست / چپ)'],
        ['دور کمر (ناف)', 'دور ساعد'],
        ['دور شکم (پهن‌ترین نقطه)', 'دور ران (راست / چپ)'],
        ['دور باسن', 'دور ساق (راست / چپ)']
      ]},
      { type: 'notice', text: 'عکس‌های شروع: سه عکس از روبه‌رو، پهلو و پشت — با نور کافی، لباس مناسب (شورت ورزشی / تاپ)، بدون فیلتر و در حالت عادی بدن. این عکس‌ها مهم‌ترین ابزار سنجش پیشرفت تو هستند و کاملاً محرمانه می‌مانند.' }
    ]
  },
  {
    num: '۱۰',
    title: 'بخش ویژه بانوان',
    fields: [
      { type: 'note', text: 'پاسخ به این بخش برای تنظیم دقیق‌تر برنامه تمرین و تغذیه اهمیت دارد. (اگر آقا هستی، این بخش را رد کن)' },
      { type: 'radio', name: 'نظم چرخه قاعدگی', label: 'نظم چرخه قاعدگی:', options: ['منظم', 'نامنظم', 'قطع شده'] },
      { type: 'radio', name: 'بارداری / شیردهی', label: 'بارداری / شیردهی:', options: ['خیر', 'باردار هستم', 'شیرده هستم', 'قصد بارداری دارم'] },
      { type: 'textarea', name: 'شرایط خاص بانوان', label: 'در صورت وجود شرایط خاص (PCOS، کم‌خونی، مشکلات هورمونی و...) توضیح بده:', rows: 2 }
    ]
  },
  {
    num: '۱۱',
    title: 'ارتباط، چک‌این و تعهد',
    fields: [
      { type: 'radio', name: 'راه ارتباطی ترجیحی', label: 'راه ارتباطی ترجیحی:', options: ['واتساپ', 'تلگرام'] },
      { type: 'radio', name: 'بهترین زمان پاسخ‌گویی', label: 'بهترین زمان پاسخ‌گویی:', options: ['صبح', 'ظهر', 'عصر', 'شب'] },
      { type: 'textarea', name: 'انتظار از مربی', label: 'از یک مربی آنلاین دقیقاً چه انتظاری داری؟', hint: '(پیگیری، آموزش تکنیک، انگیزه، پاسخ‌گویی سریع و...)' },
      { type: 'textarea', name: 'بزرگ‌ترین مانع', label: 'بزرگ‌ترین مانعی که تا امروز نگذاشته به هدفت برسی چه بوده؟' },
      { type: 'radio', name: 'میزان تعهد', label: 'میزان تعهد خودت را از ۱ تا ۱۰ چقدر می‌دانی؟', options: ['۹-۱۰', '۷-۸', '۵-۶', 'کمتر از ۵'] },
      { type: 'pledge' },
      { type: 'grid2', items: [
        { name: 'نام و نام خانوادگی (تأیید)', label: 'نام و نام خانوادگی (مجدد ثبت شود):' },
        { name: 'تاریخ تکمیل فرم', label: 'تاریخ:' },
      ]}
    ]
  }
];

const CoachingForm = () => {
  const [values, setValues] = useState({});
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState({ msg: '', isErr: false });

  const handleChange = (name, val) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleCheckbox = (name, option) => {
    setValues((prev) => {
      const current = Array.isArray(prev[name]) ? prev[name] : [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [name]: updated };
    });
  };

  const buildFormattedText = () => {
    const lines = [
      'فرم ثبت‌نام و ارزیابی اولیه ورزشکار — دانیال سلیمانی',
      'تاریخ ارسال: ' + new Date().toLocaleDateString('fa-IR'),
      '══════════════════════════',
    ];

    SECTIONS.forEach((sec) => {
      lines.push('', `▌ ${sec.num}. ${sec.title}`, '──────────────────');
      sec.fields.forEach((f) => {
        if (f.type === 'grid2') {
          f.items.forEach((item) => {
            lines.push(`• ${item.name}: ${values[item.name] || '—'}`);
          });
        } else if (f.type === 'measureTable') {
          f.rows.flat().forEach((m) => {
            const key = `اندازه: ${m}`;
            lines.push(`• ${key}: ${values[key] || '—'}`);
          });
        } else if (f.name) {
          const val = Array.isArray(values[f.name]) ? values[f.name].join('، ') : values[f.name];
          lines.push(`• ${f.name}: ${val || '—'}`);
        }
      });
    });

    lines.push('', '══════════════════════════', 'پایان فرم ارزیابی');
    return lines.join('\n');
  };

  const validate = () => {
    if (!values['نام و نام خانوادگی']?.trim()) {
      setStatus({ msg: '⚠ لطفا نام و نام خانوادگی را وارد کن.', isErr: true });
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return false;
    }
    if (!values['شماره تماس']?.trim()) {
      setStatus({ msg: '⚠ لطفا شماره تماس یا واتس‌اپ را وارد کن تا مربی بتواند با شما ارتباط بگیرد.', isErr: true });
      window.scrollTo({ top: 450, behavior: 'smooth' });
      return false;
    }
    if (!pledgeAccepted) {
      setStatus({ msg: '⚠ لطفا تعهدنامه انتهای فرم را مطالعه و تأیید کن.', isErr: true });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus({ msg: '', isErr: false });
    try {
      const formattedText = buildFormattedText();
      const goals = Array.isArray(values['هدف اصلی']) ? values['هدف اصلی'].join('، ') : '';
      await api.post('/coaching', {
        fullName: values['نام و نام خانوادگی'].trim(),
        phone: values['شماره تماس'].trim(),
        goal: goals,
        formData: values,
        formattedText,
      });
      setSubmitted(true);
      setStatus({ msg: '✓ درخواست مربی‌گری شما با موفقیت ثبت شد! مربی پس از بررسی با شما تماس خواهد گرفت.', isErr: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setStatus({
        msg: error.response?.data?.message || 'خطا در ارسال فرم. لطفا اتصال اینترنت را بررسی کنید.',
        isErr: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!validate()) return;
    const text = buildFormattedText();
    try {
      await navigator.clipboard.writeText(text);
      setStatus({ msg: '✓ پاسخ‌ها کپی شد! می‌توانید در تلگرام یا واتساپ برای مربی Paste کنید.', isErr: false });
    } catch {
      setStatus({ msg: 'مرورگر اجازه کپی خودکار نداد؛ از دکمه ثبت مستقیم استفاده کنید.', isErr: true });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 py-16 px-4 font-sans" dir="rtl">
        <div className="max-w-xl mx-auto bg-[#121214] border border-yellow-500/40 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-2xl font-black text-yellow-400 mb-3">ثبت‌نام شما با موفقیت انجام شد!</h2>
          <p className="text-zinc-300 text-sm leading-8 mb-8">
            فرم ارزیابی اولیه شما مستقیماً در پنل مربی (<strong className="text-white">دانیال سلیمانی</strong>) ثبت گردید. پس از بررسی اطلاعات، از طریق شماره تماس یا پیام‌رسان ثبت‌شده با شما ارتباط گرفته خواهد شد.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold transition-all"
            >
              بازگشت و ویرایش فرم
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-6 md:py-10 px-3 md:px-6 font-sans pb-24" dir="rtl">
      <div className="max-w-4xl mx-auto bg-[#121214] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* نوار برند بالا */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 md:px-10 py-5 border-b border-zinc-800 bg-white/[0.01]">
          <div className="flex items-center gap-2.5">
            <div className="bg-yellow-500/10 text-yellow-400 p-2 rounded-xl border border-yellow-500/20">
              <Dumbbell size={20} />
            </div>
            <span className="font-black text-base md:text-lg text-white">دوره آموزشی و مربی‌گری دانیال سلیمانی</span>
          </div>
          <span className="text-xs tracking-[0.25em] text-yellow-400 font-extrabold uppercase">TRAINING ARCHITECT</span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-10 space-y-8">
          {/* تیتر اصلی */}
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-[#09090b] border border-zinc-800 rounded-2xl p-7 text-center">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            <h1 className="text-xl md:text-2xl font-black text-yellow-400 mb-2">فرم ثبت‌نام و ارزیابی اولیه ورزشکار</h1>
            <p className="text-xs md:text-sm text-zinc-400 font-medium">( پذیرش آنلاین برنامه تمرین و تغذیه اختصاصی )</p>
          </div>

          {/* باکس راهنما */}
          <div className="bg-yellow-500/10 border-r-4 border-yellow-500 rounded-xl p-4 text-xs md:text-sm font-semibold text-yellow-200 leading-7">
            ورزشکار عزیز؛ هرچه این فرم را دقیق‌تر و کامل‌تر پر کنی، برنامه‌ای که برایت طراحی می‌شود شخصی‌سازی‌شده‌تر و کاراتر خواهد بود. پس لطفا با حوصله و دقت کافی تمامی موارد را تکمیل کنید.
          </div>

          {/* رندر ۱۱ بخش فرم */}
          {SECTIONS.map((sec) => (
            <div key={sec.num} className="bg-[#09090b] border border-zinc-800/90 rounded-2xl p-5 md:p-7 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <span className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-black text-sm shrink-0">
                  {sec.num}
                </span>
                <h2 className="font-black text-base md:text-lg text-white">{sec.title}</h2>
              </div>

              {sec.fields.map((field, idx) => {
                if (field.type === 'grid2') {
                  return (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {field.items.map((item) => (
                        <div key={item.name} className="flex flex-col gap-1.5">
                          <label className="text-xs md:text-sm font-semibold text-zinc-400">{item.label}</label>
                          <input
                            type={item.inputType || 'text'}
                            value={values[item.name] || ''}
                            onChange={(e) => handleChange(item.name, e.target.value)}
                            className="w-full bg-[#1c1c1f] border border-zinc-700/80 focus:border-yellow-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  );
                }

                if (field.type === 'radio') {
                  return (
                    <div key={idx} className="space-y-2 pt-2">
                      <div className="text-xs md:text-sm font-bold text-zinc-200">
                        {field.label} {field.hint && <span className="text-zinc-400 font-normal text-xs">{field.hint}</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((opt) => {
                          const checked = values[field.name] === opt;
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => handleChange(field.name, opt)}
                              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all ${
                                checked
                                  ? 'bg-yellow-500/15 border-yellow-500 text-yellow-400 shadow-sm'
                                  : 'bg-[#1c1c1f] border-zinc-700/80 text-zinc-400 hover:text-white hover:border-zinc-500'
                              }`}
                            >
                              {checked && '✔ '}{opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (field.type === 'checkbox') {
                  return (
                    <div key={idx} className="space-y-2 pt-2">
                      <div className="text-xs md:text-sm font-bold text-zinc-200">
                        {field.label} {field.hint && <span className="text-zinc-400 font-normal text-xs">{field.hint}</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((opt) => {
                          const checked = Array.isArray(values[field.name]) && values[field.name].includes(opt);
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => handleCheckbox(field.name, opt)}
                              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all ${
                                checked
                                  ? 'bg-yellow-500/15 border-yellow-500 text-yellow-400 shadow-sm'
                                  : 'bg-[#1c1c1f] border-zinc-700/80 text-zinc-400 hover:text-white hover:border-zinc-500'
                              }`}
                            >
                              {checked && '✔ '}{opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (field.type === 'textarea') {
                  return (
                    <div key={idx} className="space-y-1.5 pt-2">
                      <label className="block text-xs md:text-sm font-bold text-zinc-200">
                        {field.label} {field.hint && <span className="text-zinc-400 font-normal text-xs">{field.hint}</span>}
                      </label>
                      <textarea
                        rows={field.rows || 3}
                        value={values[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full bg-[#1c1c1f] border border-zinc-700/80 focus:border-yellow-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all leading-7"
                      />
                    </div>
                  );
                }

                if (field.type === 'notice') {
                  return (
                    <div key={idx} className="bg-yellow-500/10 border-r-4 border-yellow-500 rounded-xl p-3.5 text-xs md:text-sm font-semibold text-yellow-200 leading-7">
                      {field.text}
                    </div>
                  );
                }

                if (field.type === 'note') {
                  return (
                    <div key={idx} className="bg-yellow-500/10 text-yellow-400 rounded-xl px-4 py-2.5 text-xs font-bold">
                      {field.text}
                    </div>
                  );
                }

                if (field.type === 'measureTable') {
                  return (
                    <div key={idx} className="overflow-x-auto rounded-xl border border-zinc-800">
                      <table className="w-full text-xs md:text-sm">
                        <thead>
                          <tr className="bg-zinc-900 text-yellow-400 border-b border-zinc-800">
                            <th className="p-3 text-right font-extrabold">اندازه‌گیری</th>
                            <th className="p-3 text-center font-extrabold">مقدار (cm)</th>
                            <th className="p-3 text-right font-extrabold">اندازه‌گیری</th>
                            <th className="p-3 text-center font-extrabold">مقدار (cm)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {field.rows.map(([left, right], rIdx) => (
                            <tr key={rIdx} className="bg-[#1c1c1f]">
                              <td className="p-2.5 text-zinc-300 font-semibold border-l border-zinc-800">{left}</td>
                              <td className="p-0 border-l border-zinc-800 bg-[#121214]">
                                <input
                                  type="text"
                                  value={values[`اندازه: ${left}`] || ''}
                                  onChange={(e) => handleChange(`اندازه: ${left}`, e.target.value)}
                                  className="w-full p-2.5 text-center text-white font-bold bg-transparent outline-none focus:bg-yellow-500/10"
                                />
                              </td>
                              <td className="p-2.5 text-zinc-300 font-semibold border-l border-zinc-800">{right}</td>
                              <td className="p-0 bg-[#121214]">
                                <input
                                  type="text"
                                  value={values[`اندازه: ${right}`] || ''}
                                  onChange={(e) => handleChange(`اندازه: ${right}`, e.target.value)}
                                  className="w-full p-2.5 text-center text-white font-bold bg-transparent outline-none focus:bg-yellow-500/10"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                if (field.type === 'pledge') {
                  return (
                    <div key={idx} className="bg-red-500/5 border border-dashed border-red-400/70 rounded-2xl p-5 text-xs md:text-sm text-red-200 leading-7 space-y-3">
                      <p>
                        <strong>تعهدنامه:</strong> اینجانب تأیید می‌کنم که تمام اطلاعات این فرم را صادقانه و کامل وارد کرده‌ام، هرگونه تغییر در وضعیت سلامتی خود را فوراً اطلاع می‌دهم و متعهد می‌شوم گزارش هفتگی (وزن، عکس و بازخورد تمرین) را طبق برنامه چک‌این ارسال کنم.
                      </p>
                      <label className="flex items-center gap-3 font-black text-white cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={pledgeAccepted}
                          onChange={(e) => setPledgeAccepted(e.target.checked)}
                          className="w-5 h-5 accent-red-500 cursor-pointer"
                        />
                        <span>تعهدنامه بالا را خواندم و تأیید می‌کنم</span>
                      </label>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ))}

          {/* پیام وضعیت */}
          {status.msg && (
            <div className={`flex items-center justify-center gap-2 p-4 rounded-xl text-sm font-bold ${
              status.isErr ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              <AlertCircle size={18} />
              <span>{status.msg}</span>
            </div>
          )}

          {/* دکمه‌های ارسال */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-black text-sm md:text-base px-8 py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 transition-all disabled:opacity-50"
            >
              <Send size={18} />
              <span>{loading ? 'در حال ارسال فرم...' : 'ثبت نهایی و ارسال مستقیم به مربی'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs md:text-sm px-5 py-3.5 rounded-xl transition-all"
            >
              <Copy size={16} />
              <span>کپی متن برای تلگرام/واتساپ</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-xs md:text-sm px-5 py-3.5 rounded-xl transition-all"
            >
              <Printer size={16} />
              <span>چاپ / PDF</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachingForm;
