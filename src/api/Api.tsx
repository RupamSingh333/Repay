// ✅ src/api/api.js (या Data.js)
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.repaykaro.com/api/v1/';

export const apiPost = async (endpoint, body) => {
  const token = await AsyncStorage.getItem('liveCustomerToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (json.jwtToken) {
      await AsyncStorage.setItem('liveCustomerToken', json.jwtToken);
      console.log('Saved new jwtToken:', json.jwtToken);
    }

    return json;
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
};

export const apiGet = async (endpoint) => {
  const token = await AsyncStorage.getItem('liveCustomerToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: 'GET',
      headers,
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
};
