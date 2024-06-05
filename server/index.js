import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

//routes
import authRoutes from './routes/auth.js';
import podcastsRoutes from './routes/podcast.js';
import userRoutes from './routes/user.js';

const app = express();
dotenv.config();

/** Middlewares */
app.use(express.json());
// const corsConfig = {
//   credentials: true,
//   origin: true,
// };

const corsConfig = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsConfig));
// app.use(morgan('tiny'));
// app.disable('x-powered-by');
// app.use(function (request, response, next) {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

const port = process.env.PORT || 8700;

const connect = () => {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.log(err);
    });
};

app.use(express.json());
// app.enable('trust proxy'); // optional, not needed for secure cookies
// app.use(express.session({
//     secret : '123456',
//     key : 'sid',
//     proxy : true, // add this when behind a reverse proxy, if you need secure cookies
//     cookie : {
//         secure : true,
//         maxAge: 5184000000 // 2 months
//     }
// }));

app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastsRoutes);
app.use('/api/user', userRoutes);
// app.use("/api/project", projectRoutes)
// app.use("/api/team", teamRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(__dirname, 'client', 'build', 'index.html');
  });
}

app.listen(port, () => {
  console.log('Connected');
  connect();
});
