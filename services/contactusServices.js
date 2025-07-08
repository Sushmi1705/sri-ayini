// const API_URL = "http://localhost:5000/contactUs";
const API_URL = "https://ayini-backend.onrender.com/contactUs";


export const contactUs = async (guestId, formData) => {

    await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({guestId, formData}),
    });
};