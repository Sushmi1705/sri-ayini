// const API_URL = "http://localhost:5000/cart";
const API_URL = "https://ayini-backend.onrender.com/cart";

export const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
        guestId = `guest_${crypto.randomUUID()}`;
        localStorage.setItem("guestId", guestId);
    }
    return guestId;
};

export const fetchCartItems = async (guestId) => {
    const response = await fetch(`${API_URL}/${guestId}`);
    const data = await response.json();
    return data.items;
};

export const updateCartItems = async (guestId, productId, quantity) => {
    await fetch(`${API_URL}/update/${guestId}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
    });
}

export const addToCart = async (guestId, productId, quantity) => {

    // Use a local variable instead of reassigning guestId
    const finalGuestId = guestId || getGuestId();

    await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalGuestId, productId, quantity }),
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

