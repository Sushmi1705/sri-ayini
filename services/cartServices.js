const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`;
// const API_URL = 'https://ayini-backend.onrender.com/cart';


export const getGuestId = () => {
    let guestId = sessionStorage.getItem("guestId");
    if (!guestId) {
        guestId = `guest_${crypto.randomUUID()}`;
        sessionStorage.setItem("guestId", guestId);
    }
    return guestId;
};

export const getSessionUserId = () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("uid");
};

export const getCartOwnerId = () => {
    return getSessionUserId() || getGuestId();
};

export const fetchCartItems = async (guestId) => {
    const response = await fetch(`${API_URL}/${guestId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
};

export const updateCartItems = async (userId, { productId, sizeId, cartQty }) => {
  const res = await fetch(`${API_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, sizeId, cartQty }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update cart: ${res.status}`);
  }
  return res.json();
};

export const addToCart = async (guestId, payload) => {
    // Use a local variable instead of reassigning guestId
    const finalGuestId = guestId || getCartOwnerId();

    const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalGuestId, ...payload }),
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add to cart');
    }
    return res.json();
};

export const removeFromCart = async (userId, itemId) => {
    const guestId = userId || getCartOwnerId();
    const res = await fetch(`${API_URL}/${guestId}/${itemId}`, { method: "DELETE" });
    if (!res.ok) {
        throw new Error(`Failed to remove item: ${res.status}`);
    }
    return res.json();
};

export const clearCart = async () => {
    const guestId = getCartOwnerId();
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

export const mergeCart = async (guestId, uid) => {
    if (!guestId || !uid || guestId === uid) return;
    try {
        const res = await fetch(`${API_URL}/merge`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guestId, uid }),
        });
        return res.json();
    } catch (error) {
        console.error("mergeCart error:", error);
    }
};
