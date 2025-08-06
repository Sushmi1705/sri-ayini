const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist`;

  // Add to Wishlist
  export async function addToWishlist(userId, productId) {
    console.log('userOd-------', userId);
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId }),
    });
    if (!res.ok) throw new Error('Failed to add to wishlist');
    return res.json();
  }
  
  // Get Wishlist
  export async function getWishlist(userId) {
    const res = await fetch(`${API_URL}/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch wishlist');
    return res.json();
  }
  
  // Remove from Wishlist
  export async function removeFromWishlist(userId, productId) {
    const res = await fetch(`${API_URL}/${userId}/${productId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove from wishlist');
    return res.json();
  }
