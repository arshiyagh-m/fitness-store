import axios from 'axios';
import Setting from '../models/Setting.js';
export const getDigipayToken = async (setting) => {
  const credentials = Buffer.from(setting.digipayClientId + ':' + setting.digipayClientSecret).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', setting.digipayUsername);
  params.append('password', setting.digipayPassword);
  const res = await axios.post('https://api.mydigipay.com/digipay/api/oauth/token', params, {
    headers: { 'Authorization': 'Basic ' + credentials, 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data.access_token;
};
export const createDigipayTicket = async ({ order, amountInRials, callbackUrl }) => {
  const setting = await Setting.findOne();
  const token = await getDigipayToken(setting);
  const res = await axios.post('https://api.mydigipay.com/digipay/api/tickets/business?type=0', {
    amount: amountInRials, callbackUrl, cellNumber: order.shippingAddress.phone, providerId: order._id.toString(),
  }, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } });
  return { redirectUrl: res.data.redirectUrl || ('https://api.mydigipay.com/digipay/api/purchases/ipg/pay?ticketToken=' + res.data.ticketToken) };
};
export const verifyDigipayPayment = async (trackingCode) => {
  const setting = await Setting.findOne();
  const token = await getDigipayToken(setting);
  const res = await axios.post('https://api.mydigipay.com/digipay/api/purchases/verify?trackingCode=' + trackingCode, {}, {
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  return res.data;
};
