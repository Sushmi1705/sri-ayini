// const API_BASE_URL = "http://localhost:5000/items";
const API_BASE_URL = 'https://ayini-backend.onrender.com/items';


export const fetchItems = async () => {
    try {
      console.log('7---------', 'https://ayini-backend.onrender.com/items');
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };