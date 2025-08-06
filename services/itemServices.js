const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/items`;
// const API_BASE_URL = 'https://ayini-backend.onrender.com/items';


export const fetchItems = async () => {
    try {
      console.log('url-----', API_URL);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  export const fetchItemById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch item");
    const data = await response.json();
    return data.item;
  };

  export const fetchCategory = async () => {
    try {
      console.log('url-----', API_URL);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };

  export const searchItems = async (query) => {
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch search results");
      return await res.json();
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };

