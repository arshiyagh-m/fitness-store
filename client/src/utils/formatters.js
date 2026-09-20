// filepath: client/src/utils/formatters.js

/**
 * فرمت کردن عدد به قالب پولی ایران (تومان)
 * خروجی مثال: 4,500,000
 */
export const formatPrice = (price) => {
  if (!price) return '۰';
  return new Intl.NumberFormat('fa-IR').format(price);
};

/**
 * محاسبه درصد تخفیف
 */
export const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};
