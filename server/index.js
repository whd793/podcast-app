// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import morgan from 'morgan';

// //routes
// import authRoutes from './routes/auth.js';
// import podcastsRoutes from './routes/podcast.js';
// import userRoutes from './routes/user.js';

// const app = express();
// dotenv.config();

// /** Middlewares */
// app.use(express.json());
// const corsConfig = {
//   credentials: true,
//   origin: true,
// };
// app.use(cors(corsConfig));
// // app.use(morgan('tiny'));
// // app.disable('x-powered-by');
// // app.use(function (request, response, next) {
// //     response.header("Access-Control-Allow-Origin", "*");
// //     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// //     next();
// //   });

// const port = process.env.PORT || 8700;

// const connect = () => {
//   mongoose.set('strictQuery', true);
//   mongoose
//     .connect(process.env.MONGO_URL)
//     .then(() => {
//       console.log('MongoDB connected');
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// app.use(express.json());
// // app.enable('trust proxy'); // optional, not needed for secure cookies
// // app.use(express.session({
// //     secret : '123456',
// //     key : 'sid',
// //     proxy : true, // add this when behind a reverse proxy, if you need secure cookies
// //     cookie : {
// //         secure : true,
// //         maxAge: 5184000000 // 2 months
// //     }
// // }));

// app.use('/api/auth', authRoutes);
// app.use('/api/podcasts', podcastsRoutes);
// app.use('/api/user', userRoutes);
// // app.use("/api/project", projectRoutes)
// // app.use("/api/team", teamRoutes)

// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || 'Something went wrong';
//   return res.status(status).json({
//     success: false,
//     status,
//     message,
//   });
// });

// app.listen(port, () => {
//   console.log('Connected');
//   connect();
// });

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.js';
import podcastsRoutes from './routes/podcast.js';
import userRoutes from './routes/user.js';

// Initialize app
dotenv.config();
const app = express();

/** Middlewares */
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

// MongoDB Connection
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(
  cors({
    // origin: 'https://podcastaudio.netlify.app', // Your frontend domain
    origin: ['https://podcastaudio.netlify.app', 'http://localhost:3000'],

    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastsRoutes);
app.use('/api/user', userRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  return res.status(status).json({ success: false, status, message });
});

// Export app for serverless function
export default app;
