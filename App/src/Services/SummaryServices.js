import axios from 'axios';

export const saveSummary = async (data) => {
  try {
    return await axios.post('http://192.168.1.52:8082/summary', data);
  } catch (error) {
    console.error("Error Saving Summary:", error);
    throw error;
  }
};

export const getAllSummaries = async () => {
  try {
      return await axios.get('http://192.168.1.52:8082/summary/getSummary');
  } catch (error) {
      console.error("Error Parsing Summaries:", error);
      throw error;
  }
};