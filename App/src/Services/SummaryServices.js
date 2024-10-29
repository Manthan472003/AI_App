import axios from 'axios';

export const saveSummary = async (data) => {
  try {
    return await axios.post('http://192.168.0.116:8082/summary', data);
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
