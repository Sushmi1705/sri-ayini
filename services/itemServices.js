const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/items`;
// const API_BASE_URL = 'https://ayini-backend.onrender.com/items';


export const fetchItems = async () => {
  console.log("hiiii");
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

  export const getProductReviews = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  };

// services/itemServices.js
export async function getProductReviewsPaged(productId, { limit = 10, cursor = null, sortBy = 'newest' } = {}) {
  const params = new URLSearchParams({ limit, sortBy });
  if (cursor) params.append('cursor', cursor); // plain id now
  const res = await fetch(`${API_URL}/reviews/${productId}?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch paged reviews');
  return res.json(); // { items, nextCursor }
} 
  
  export const addReview = async (reviewData) => {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error('Failed to add review');
      return await response.json();
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };
  
  export const getAverageRating = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/${productId}/average`);
      if (!response.ok) throw new Error('Failed to fetch average rating');
      return await response.json();
    } catch (error) {
      console.error('Error fetching average rating:', error);
      throw error;
    }
  };

  export const getOrdersByUserId = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return await response.json(); // expected array of orders
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };


