// filepath: server/src/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // تولید توکن با اعتبار ۳۰ روز
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
