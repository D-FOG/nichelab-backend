import axios from "axios";

const PAYSTACK_BASE = "https://api.paystack.co";

const paystackInit = async ({ amountKobo, email, reference, callbackUrl, metadata = {} }) => {
  const url = `${PAYSTACK_BASE}/transaction/initialize`;
  const payload = {
    amount: amountKobo,
    email,
    reference,
    callback_url: callbackUrl,
    metadata,
  };
  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  return res.data; // caller should check res.data.status and res.data.data
};

const paystackVerify = async (reference) => {
  const url = `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  return res.data; // caller should inspect res.data.status / res.data.data
};

export default {
  paystackInit,
  paystackVerify,
};
