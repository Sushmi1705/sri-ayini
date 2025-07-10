// const API_URL = "http://localhost:5000";
// const API_URL = process.env.API_BASE_URL;
const API_URL = 'https://ayini-backend.onrender.com';


export const createRazorpayOrder = async (amount) => {
    const response = await fetch(`${API_URL}/payment/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
    });
    return response.json();
};

export const savePaymentDetails = async (paymentData, totalPrice, shipping, vat, billingDetails) => {
    console.log('paymentData------', paymentData);
    const fullData = {
        ...paymentData,
        billingDetails,
        vat,
        shipping,
        total: totalPrice
      };
    const response = await fetch(`${API_URL}/payment/paymentData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({paymentData: fullData }),
    });
    return response.json();
  };

export const checkout = async (guestId, orderData) => {

    const response = await fetch(`${API_URL}/checkout/${guestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData }),
    });
    return response.json();
};

export const getTax = async () => {
    const response = await fetch(`${API_URL}/product/tax`);
    if (!response.ok) throw new Error('Failed to fetch tax');
    return response.json(); // returns: { value: ... }
};