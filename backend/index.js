import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import adminRouter from './routes/adminRoute.js';
import connectCloudinary from './config/cloudinary.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoutes.js';


const app = express();
const port = process.env.PORT || 5000;
import express from 'express';
import cors from 'cors';

const app = express();

// 1. Force explicit CORS & Preflight handling for all incoming requests
app.use(cors({
    origin: true, // Dynamically allows the requesting frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'dtoken', 'atoken']
}));

// 2. Guarantee preflight options requests pass instantly
app.options('*', cors());

app.use(express.json());
app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter );


app.get('/', (req, res) => {
    res.send('Api is ready');
    });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
