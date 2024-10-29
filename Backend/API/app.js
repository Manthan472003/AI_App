const express = require('express');
const cors = require('cors');
const questionRoutes = require('./Routes/questionRoutes');

const app = express();
const PORT = process.env.PORT || 8082;

app.use(cors());
app.use(express.json());
app.use('/questions',  questionRoutes);


try {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

} catch (error) {
    console.error('Unable to start node server:', error);

}