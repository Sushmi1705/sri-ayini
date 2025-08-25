const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`;
// const API_URL = 'https://ayini-backend.onrender.com/cart';


export const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
        guestId = `guest_${crypto.randomUUID()}`;
        localStorage.setItem("guestId", guestId);
    }
    return guestId;
};

export const fetchCartItems = async (guestId) => {
    console.log('guestId-----', guestId);
    const response = await fetch(`${API_URL}/${guestId}`);
    const data = await response.json();
    console.log('data-------', data);
    return data.items;
};

// services/cartServices.js
// services/cartServices.js
export const updateCartItems = async (userId, { productId, sizeId, cartQty}) => {
  const res = await fetch(`${API_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      productId,
      sizeId,
      cartQty
    }),
  });
};

export const addToCart = async (guestId, payload) => {

    // Use a local variable instead of reassigning guestId
    const finalGuestId = guestId || getGuestId();

    await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalGuestId, ...payload }),
    });
};

export const removeFromCart = async (itemId) => {
    const guestId = getGuestId();
    await fetch(`${API_URL}/${guestId}/${itemId}`, { method: "DELETE" });
};

export const clearCart = async () => {
    const guestId = getGuestId();
    await fetch(`${API_URL}/clear/${guestId}`, { method: "DELETE" });
};

export const checkout = async (guestId, userInfo, cartItems) => {
    const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, userInfo, cartItems }),
    });

    return res.json();
};

export const getCartItemCount = async (guestId) => {
    const response = await fetch(`${API_URL}/count/${guestId}`); // <--- THIS is your backend API call
    const data = await response.json();
    return data.count;
};



