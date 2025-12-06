const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');




const userRoutes = require('./routers/userRoutes');
const boardRoutes = require('./routers/boardRoutes');
const listRoutes = require('./routers/listRoutes');
const cardRoutes = require('./routers/cardRoutes');

connectDB();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://taskflow-chja.onrender.com',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Trello Backend is running');
});


app.use('/api/users' ,userRoutes );
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards' , cardRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});