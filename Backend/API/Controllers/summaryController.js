const fs = require('fs');
const path = require('path');
const summaryPath = path.join(__dirname, '../../Database/summary.json');

let Summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

const saveSummary = async (req, res) => {
    const { patientId, summary } = req.body;

    if (!patientId || !summary) {
        return res.status(400).json({ message: 'Patient ID and Summary are required.' });
    }

    try {
        const patientIdInt = parseInt(patientId, 10);
        const newEntry = { patientId: patientIdInt, summary };

        Summary.push(newEntry);

        fs.writeFileSync(summaryPath, JSON.stringify(Summary, null, 2));

        return res.status(200).json({ message: 'Summary saved successfully.' });

    } catch (error) {
        console.error('Error saving summary:', error);
        res.status(500).json({ message: 'An error occurred.' });
    }
};

module.exports = {
    saveSummary
};
