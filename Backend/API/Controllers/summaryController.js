const fs = require('fs');
const path = require('path');
const summaryPath = path.join(__dirname, '../../Database/summary.json');

let Summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

const saveSummary = async (req, res) => {
    const { date, patientId, summary } = req.body;

    if (!patientId || !summary) {
        return res.status(400).json({ message: 'Patient ID and Summary are required.' });
    }

    try {
        const patientIdInt = parseInt(patientId, 10);
        const newEntry = { date, patientId: patientIdInt, summary };

        Summary.push(newEntry);

        fs.writeFileSync(summaryPath, JSON.stringify(Summary, null, 2));

        return res.status(200).json({ message: 'Summary saved successfully.' });

    } catch (error) {
        console.error('Error saving summary:', error);
        res.status(500).json({ message: 'An error occurred.' });
    }
};

const getAllTheSummary = async(req,res) => {
    try {
        return res.status(200).json(Summary);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching questions', error });
    }
};

module.exports = {
    saveSummary,
    getAllTheSummary
};
