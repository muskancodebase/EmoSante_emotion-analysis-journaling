import axios from 'axios';

// For Android emulator use 10.0.2.2, for web use localhost
const BASE_URL = "http://10.0.2.2:5000"; 
// const BASE_URL = "http://localhost:5000"; 

export async function analyzeEmotion(entry) {
  try {
    const response = await axios.post(`${BASE_URL}/analyze/`, { entry });
    return response.data.emotion;
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return null;
  }
}
