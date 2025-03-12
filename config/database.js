const mongoose = require('mongoose');
const cors  = require('cors'); 
const express = require('express'); 
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const corsOptions = {
    origin: "http://localhost:3000", // Allow Next.js frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(
    process.env.MONGO_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(() =>{
        console.log('Database connected');
    }).catch((err) => {
        console.log('Database connection error: ', err);
    });