const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`;

// apiService.js
export async function sendOtpBackend(phoneNumber) {
    const res = await fetch(`${API_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });
    return res.json();
  }
  
  export async function verifyOtpBackend(phoneNumber, otp) {
    const res = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp }),
    });
    return res.json();
  }

  export async function createUserProfile(userData) {
    const res = await fetch(`${API_URL}/create-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  }

  // addressService.js

export async function fetchAddresses(uId) {
    const res = await fetch(`${API_URL}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'uId': uId, // custom header
      },
    });
    if (!res.ok) throw new Error('Failed to fetch addresses');
    return res.json();
  }
  
  export async function addAddress(addressData) {
    console.log("45-----", addressData);
    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });
    if (!res.ok) throw new Error('Failed to add address');
    return res.json();
  }

  export async function updateAddress(uId, addressId, addressData) {
    const res = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'uId': uId, // custom user ID header
      },
      body: JSON.stringify(addressData),
    });
  
    if (!res.ok) throw new Error('Failed to update address');
    return res.json();
  }
  
  
  export async function deleteAddress(uId, addressId) {
    const res = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'uId': uId, // send user ID in headers
      },
    });
  
    if (!res.ok) throw new Error('Failed to delete address');
    return res.json();
  }
  