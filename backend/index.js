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

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const corsOptions ={
  origin:(origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
connectDB()
connectCloudinary()

app.use(cors(corsOptions));
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