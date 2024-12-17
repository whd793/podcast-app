// controllers/auth
import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { createError } from '../error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import otpGenerator from 'otp-generator';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  port: 465,
  host: 'smtp.gmail.com',
});

export const kakaoAuthSignIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      try {
        const user = new User({ ...req.body, kakaoSignIn: true });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT, {
          expiresIn: '9999 years',
        });
        res.status(200).json({ token, user: user });
      } catch (err) {
        next(err);
      }
    } else if (user.kakaoSignIn) {
      const token = jwt.sign({ id: user._id }, process.env.JWT, {
        expiresIn: '9999 years',
      });
      res.status(200).json({ token, user });
    } else if (user.kakaoSignIn === false) {
      return next(
        createError(
          201,
          "User already exists with this email can't do Kakao auth"
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

export const signup = async (req, res, next) => {
  const { email } = req.body;
  // Check we have an email
  if (!email) {
    return res.status(422).send({ message: 'Missing email.' });
  }
  try {
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).send({
        message: 'Email is already in use.',
      });
    }
    // Step 1 - Create and save the userconst salt = bcrypt.genSaltSync(10);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });

    newUser
      .save()
      .then((user) => {
        // create jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT, {
          expiresIn: '9999 years',
        });
        res.status(200).json({ token, user });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(201, 'User not found'));
    }
    if (user.googleSignIn) {
      return next(
        createError(
          201,
          'Entered email is Signed Up with google account. Please SignIn with google.'
        )
      );
    }
    const validPassword = await bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return next(createError(201, 'Wrong password'));
    }

    // create jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: '9999 years',
    });
    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

// export const googleAuthSignIn = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       try {
//         const user = new User({ ...req.body, googleSignIn: true });
//         await user.save();
//         const token = jwt.sign({ id: user._id }, process.env.JWT, {
//           expiresIn: '9999 years',
//         });
//         res.status(200).json({ token, user: user });
//       } catch (err) {
//         next(err);
//       }
//     } else if (user.googleSignIn) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT, {
//         expiresIn: '9999 years',
//       });
//       res.status(200).json({ token, user });
//     } else if (user.googleSignIn === false) {
//       return next(
//         createError(
//           201,
//           "User already exists with this email can't do google auth"
//         )
//       );
//     }
//   } catch (err) {
//     next(err);
//   }
// };

export const logout = (req, res) => {
  res.clearCookie('access_token').json({ message: 'Logged out' });
};

export const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
  const { email } = req.query;
  const { name } = req.query;
  const { reason } = req.query;
  const verifyOtp = {
    to: email,
    subject: 'Account Verification OTP',
    html: `
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Verify Your PODSTREAM Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a PODSTREAM account. To activate your account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the PODSTREAM app to activate your account.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a PODSTREAM account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The Podstream Team</p>
</div>
        `,
  };

  const resetPasswordOtp = {
    to: email,
    subject: 'PODSTREAM Reset Password Verification',
    html: `
            <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Reset Your PODSTREAM Account Password</h1>
                <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                        <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                        <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To reset your PODSTREAM account password, please enter the following verification code:</p>
                        <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the PODSTREAM app to reset your password.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request a password reset, please disregard this email.</p>
                    </div>
                </div>
                <br>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The PODSTREAM Team</p>
            </div>
        `,
  };
  if (reason === 'FORGOTPASSWORD') {
    transporter.sendMail(resetPasswordOtp, (err) => {
      if (err) {
        next(err);
      } else {
        return res.status(200).send({ message: 'OTP sent' });
      }
    });
  } else {
    transporter.sendMail(verifyOtp, (err) => {
      if (err) {
        next(err);
      } else {
        return res.status(200).send({ message: 'OTP sent' });
      }
    });
  }
};

export const verifyOTP = async (req, res, next) => {
  const { code } = req.query;
  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    res.status(200).send({ message: 'OTP verified' });
  }
  return next(createError(201, 'Wrong OTP'));
};

export const createResetSession = async (req, res, next) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(200).send({ message: 'Access granted' });
  }

  return res.status(400).send({ message: 'Session expired' });
};

export const findUserByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(200).send({
        message: 'User found',
      });
    } else {
      return res.status(202).send({
        message: 'User not found',
      });
    }
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  if (!req.app.locals.resetSession)
    return res.status(440).send({ message: 'Session expired' });

  const { email, password } = req.body;
  try {
    await User.findOne({ email }).then((user) => {
      if (user) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.updateOne({ email: email }, { $set: { password: hashedPassword } })
          .then(() => {
            req.app.locals.resetSession = false;
            return res.status(200).send({
              message: 'Password reset successful',
            });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        return res.status(202).send({
          message: 'User not found',
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

//controllers/podcasts
import mongoose from 'mongoose';
import { createError } from '../error.js';
import Podcasts from '../models/Podcasts.js';
import Episodes from '../models/Episodes.js';
import User from '../models/User.js';

export const createPodcast = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    let episodeList = [];
    await Promise.all(
      req.body.episodes.map(async (item) => {
        const episode = new Episodes({ creator: user.id, ...item });
        const savedEpisode = await episode.save();
        episodeList.push(savedEpisode._id);
      })
    );

    // Create a new podcast
    const podcast = new Podcasts({
      creator: user.id,
      episodes: episodeList,
      name: req.body.name,
      desc: req.body.desc,
      thumbnail: req.body.thumbnail,
      tags: req.body.tags,
      type: req.body.type,
      category: req.body.category,
    });
    const savedPodcast = await podcast.save();

    //save the podcast to the user
    await User.findByIdAndUpdate(
      user.id,
      {
        $push: { podcasts: savedPodcast.id },
      },
      { new: true }
    );

    res.status(201).json(savedPodcast);
  } catch (err) {
    next(err);
  }
};

export const addepisodes = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    await Promise.all(
      req.body.episodes.map(async (item) => {
        const episode = new Episodes({ creator: user.id, ...item });
        const savedEpisode = await episode.save();

        // update the podcast
        await Podcasts.findByIdAndUpdate(
          req.body.podid,
          {
            $push: { episodes: savedEpisode.id },
          },
          { new: true }
        );
      })
    );

    res.status(201).json({ message: 'Episode added successfully' });
  } catch (err) {
    next(err);
  }
};

export const getPodcasts = async (req, res, next) => {
  try {
    // Get all podcasts from the database
    const podcasts = await Podcasts.find()
      .populate('creator', 'name img')
      .populate('episodes');
    return res.status(200).json(podcasts);
  } catch (err) {
    next(err);
  }
};

export const getPodcastById = async (req, res, next) => {
  try {
    // Get the podcasts from the database
    const podcast = await Podcasts.findById(req.params.id)
      .populate('creator', 'name img')
      .populate('episodes');
    return res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

// export const favoritPodcast = async (req, res, next) => {
//   // Check if the user is the creator of the podcast
//   const user = await User.findById(req.user.id);
//   console.log(req.body.id);
//   const podcast = await Podcasts.findById(req.body.id);
//   let found = false;
//   if (user.id === podcast.creator) {
//     return next(createError(403, "You can't favorit your own podcast!"));
//   }

//   // Check if the podcast is already in the user's favorits
//   await Promise.all(
//     user.favorits.map(async (item) => {
//       if (req.body.id == item) {
//         //remove from favorite
//         found = true;
//         console.log('this');
//         await User.findByIdAndUpdate(
//           user.id,
//           {
//             $pull: { favorits: req.body.id },
//           },
//           { new: true }
//         );
//         res.status(200).json({ message: 'Removed from favorit' });
//       }
//     })
//   );

//   if (!found) {
//     await User.findByIdAndUpdate(
//       user.id,
//       {
//         $push: { favorits: req.body.id },
//       },
//       { new: true }
//     );
//     res.status(200).json({ message: 'Added to favorit' });
//   }
// };

// Improved controller
export const favoritPodcast = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const podcastId = req.params.id; // Get ID from params instead of body

    // Find user and podcast
    const [user, podcast] = await Promise.all([
      User.findById(userId),
      Podcasts.findById(podcastId),
    ]);

    // Error checking
    if (!podcast) {
      return next(createError(404, 'Podcast not found'));
    }

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    if (user.id === podcast.creator) {
      return next(createError(403, "You can't favorite your own podcast!"));
    }

    // Check if podcast is in favorites
    const podcastIndex = user.favorits.indexOf(podcastId);

    if (podcastIndex === -1) {
      // Add to favorites
      await User.findByIdAndUpdate(
        userId,
        {
          $push: { favorits: podcastId },
        },
        { new: true }
      );
      res.status(200).json({ message: 'Added to favorites' });
    } else {
      // Remove from favorites
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { favorits: podcastId },
        },
        { new: true }
      );
      res.status(200).json({ message: 'Removed from favorites' });
    }
  } catch (err) {
    next(err);
  }
};
//add view

export const addView = async (req, res, next) => {
  try {
    await Podcasts.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json('The view has been increased.');
  } catch (err) {
    next(err);
  }
};

//searches
export const random = async (req, res, next) => {
  try {
    const podcasts = await Podcasts.aggregate([{ $sample: { size: 40 } }])
      .populate('creator', 'name img')
      .populate('episodes');
    res.status(200).json(podcasts);
  } catch (err) {
    next(err);
  }
};

export const mostpopular = async (req, res, next) => {
  try {
    const podcast = await Podcasts.find()
      .sort({ views: -1 })
      .populate('creator', 'name img')
      .populate('episodes');
    res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(',');
  try {
    const podcast = await Podcasts.find({ tags: { $in: tags } })
      .populate('creator', 'name img')
      .populate('episodes');
    res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

export const getByCategory = async (req, res, next) => {
  const query = req.query.q;
  try {
    const podcast = await Podcasts.find({
      category: { $regex: query, $options: 'i' },
    })
      .populate('creator', 'name img')
      .populate('episodes');
    res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const podcast = await Podcasts.find({
      name: { $regex: query, $options: 'i' },
    })
      .populate('creator', 'name img')
      .populate('episodes')
      .limit(40);
    res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

// controllers/user
import { createError } from '../error.js';
import User from '../models/User.js';

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, 'You can update only your account!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'podcasts',
        populate: {
          path: 'creator',
          select: 'name img',
        },
      })
      .populate({
        path: 'favorits',
        populate: {
          path: 'creator',
          select: 'name img',
        },
      });
    res.status(200).json(user);
  } catch (err) {
    console.log(req.user);
    next(err);
  }
};


import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const EpisodesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      default: 'audio',
    },
    duration: {
      type: String,
      default: '',
    },
    file: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Episodes', EpisodesSchema);



import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const PodcastsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      default: 'audio',
    },
    category: {
      type: String,
      default: 'podcast',
    },
    views: {
      type: Number,
      default: 0,
    },
    episodes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Episodes',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Podcasts', PodcastsSchema);


import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: '',
    },
    googleSignIn: {
      type: Boolean,
      required: true,
      default: false,
    },
    podcasts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Podcasts',
      default: [],
    },
    favorits: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Podcasts',
      default: [],
    },
    kakaoSignIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);


import express from 'express';
import {
  signup,
  signin,
  logout,
  generateOTP,
  verifyOTP,
  createResetSession,
  findUserByEmail,
  resetPassword,
} from '../controllers/auth.js';
import { localVariables } from '../middleware/auth.js';
import { kakaoAuthSignIn } from '../controllers/auth.js';

const router = express.Router();

router.post('/kakao', kakaoAuthSignIn);

//create a user
router.post('/signup', signup);
//signin
router.post('/signin', signin);
//logout
router.post('/logout', logout);
//google signin
// router.post("/google", googleAuthSignIn);
//find user by email
router.get('/findbyemail', findUserByEmail);
//generate opt
router.get('/generateotp', localVariables, generateOTP);
//verify opt
router.get('/verifyotp', verifyOTP);
//create reset session
router.get('/createResetSession', createResetSession);
//forget password
router.put('/forgetpassword', resetPassword);

export default router;


import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addView, addepisodes, createPodcast, favoritPodcast, getByCategory, getByTag, getPodcastById, getPodcasts, random, search, mostpopular } from "../controllers/podcasts.js";


const router = express.Router();

//create a podcast
router.post("/",verifyToken, createPodcast);
//get all podcasts
router.get("/", getPodcasts);
//get podcast by id
router.get("/get/:id",getPodcastById)

//add episode to a 
router.post("/episode",verifyToken, addepisodes);

//favorit/unfavorit podcast
router.post("/favorit/:id",verifyToken,favoritPodcast); 

//add view
router.post("/addview/:id",addView); 


//searches
router.get("/mostpopular", mostpopular)
router.get("/random", random)
router.get("/tags", getByTag)
router.get("/category", getByCategory)
router.get("/search", search)





export default router;


import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUser } from "../controllers/user.js";


const router = express.Router();

//get  user
router.get("/",verifyToken, getUser);





export default router;