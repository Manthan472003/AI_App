const Questions = require('../../Database/questions.json');

const getAllTheQuestions = async(req,res) => {
    try {
        return res.status(200).json(Questions);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching questions', error });
    }
};

module.exports = {
    getAllTheQuestions
}