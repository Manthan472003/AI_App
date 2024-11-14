import axios from 'axios';

export const getAllQuestions = async () => {
    try {
        return await axios.get('http://192.168.1.52:8082/questions');
    } catch (error) {
        console.error("Error Parsing Questions:", error);
        throw error;
    }
};
