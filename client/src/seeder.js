// filepath: server/src/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const sampleProducts = [
  {
    title: 'پروتئین وی گلد استاندارد ۱۰۰٪ اپتیموم نوتریشن',
    slug: 'optimum-nutrition-gold-standard-100-whey',
    brand: 'Optimum Nutrition',
    category: 'whey',
    description: 'یکی از پرفروش‌ترین پروتئین‌های وی در جهان، حاوی ۲۴ گرم پروتئین خالص، ۵.۵ گرم BCAA و ۴ گرم گلوتامین در هر سروینگ. ایده‌آل برای عضله‌سازی خشک و ریکاوری سریع.',
    images: ['whey-placeholder'], // در فرانت‌اند با SVG جایگزین می‌شود
    attributes: {
      form: 'powder',
      servingSize: '1 Scoop (30.4g)',
      servingsPerContainer: 74,
    },
    nutritionFacts: [
      { ingredient: 'Calories', amount: '120', dailyValue: '-' },
      { ingredient: 'Protein', amount: '24g', dailyValue: '48%' },
      { ingredient: 'BCAAs', amount: '5.5g', dailyValue: '-' },
      { ingredient: 'Total Fat', amount: '1.5g', dailyValue: '2%' },
      { ingredient: 'Total Carbohydrate', amount: '3g', dailyValue: '1%' },
    ],
    variants: [
      {
        sku: 'ON-WHEY-CHOC-5LBS',
        flavor: 'دابل چاکلت',
        weight: '2.27 kg (5 lbs)',
        price: 4850000,
        discountPrice: 4500000, // دارای تخفیف
        stock: 50,
        authenticity: { batchNumber: 'ON-2023-CH-01', expiryDate: new Date('2026-05-01'), sibSalamat: '1234567890123456' }
      },
      {
        sku: 'ON-WHEY-VAN-5LBS',
        flavor: 'بستنی وانیلی',
        weight: '2.27 kg (5 lbs)',
        price: 4850000,
        stock: 12,
        authenticity: { batchNumber: 'ON-2023-VA-02', expiryDate: new Date('2026-06-15'), sibSalamat: '1234567890123457' }
      }
    ],
    isActive: true,
  },
  {
    title: 'پودر کراتین مونوهیدرات میکرونایزد الیمپ',
    slug: 'olimp-creatine-monohydrate-powder',
    brand: 'Olimp Sport Nutrition',
    category: 'creatine',
    description: 'کراتین ۱۰۰٪ خالص و میکرونایز شده برای جذب حداکثری. افزایش قدرت، استقامت و حجم سلولی عضلات.',
    images: ['creatine-placeholder'],
    attributes: { form: 'powder', servingSize: '1 Scoop (3g)', servingsPerContainer: 83 },
    nutritionFacts: [{ ingredient: 'Creatine Monohydrate', amount: '3g', dailyValue: '-' }],
    variants: [
      { sku: 'OLIMP-CREA-250G', flavor: 'بدون طعم', weight: '250g', price: 950000, discountPrice: null, stock: 100 }
    ],
    isActive: true,
  },
  {
    title: 'پودر گینر سریوس مس اپتیموم نوتریشن',
    slug: 'optimum-nutrition-serious-mass',
    brand: 'Optimum Nutrition',
    category: 'gainer',
    description: 'گینر فوق‌العاده برای افزایش وزن و حجم، حاوی ۱۲۵۰ کالری و ۵۰ گرم پروتئین در هر سروینگ به همراه ویتامین‌ها و مواد معدنی.',
    images: ['gainer-placeholder'],
    attributes: { form: 'powder', servingSize: '2 Scoops (334g)', servingsPerContainer: 16 },
    nutritionFacts: [
      { ingredient: 'Calories', amount: '1250', dailyValue: '-' },
      { ingredient: 'Protein', amount: '50g', dailyValue: '100%' },
      { ingredient: 'Carbohydrate', amount: '252g', dailyValue: '92%' }
    ],
    variants: [
      { sku: 'ON-SM-CHOC-12LBS', flavor: 'شکلات', weight: '5.44 kg (12 lbs)', price: 5600000, discountPrice: 5200000, stock: 25 },
      { sku: 'ON-SM-STRAW-12LBS', flavor: 'توت فرنگی', weight: '5.44 kg (12 lbs)', price: 5600000, stock: 0 } // ناموجود
    ],
    isActive: true,
  },
  {
    title: 'آمینو انرژی اپتیموم نوتریشن (BCAA + Energy)',
    slug: 'optimum-nutrition-amino-energy',
    brand: 'Optimum Nutrition',
    category: 'amino',
    description: 'ترکیبی از آمینواسیدهای ضروری و کافئین طبیعی برای انرژی قبل تمرین و ریکاوری بعد از آن.',
    images: ['amino-placeholder'],
    attributes: { form: 'powder', servingSize: '2 Scoops (9g)', servingsPerContainer: 30 },
    nutritionFacts: [
      { ingredient: 'Amino Blend', amount: '5g', dailyValue: '-' },
      { ingredient: 'Caffeine', amount: '100mg', dailyValue: '-' }
    ],
    variants: [
      { sku: 'ON-AE-WM-270G', flavor: 'هندوانه', weight: '270g', price: 1450000, discountPrice: 1250000, stock: 40 }
    ],
    isActive: true,
  }
];

const importData = async () => {
  try {
    // پاک کردن داده‌های قبلی برای جلوگیری از تکرار
    await Product.deleteMany();
    console.log('Previous products deleted.');

    // تزریق محصولات جدید
    await Product.insertMany(sampleProducts);
    console.log('Mock Products Imported Successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
