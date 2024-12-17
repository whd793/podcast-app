import axios from 'axios';
import jwt_decode from 'jwt-decode';
//https://.com/api
// const API = axios.create({ baseURL: `https://podcastaudio.com/api` });
const API = axios.create({
  // baseURL: `https://podcastweb-0e7227c429c0.herokuapp.com/api`,
  baseURL: `podcast-app-eight-inky.vercel.app/api`,
  // baseURL: `https://podcast-app-sgmt.onrender.com/api`,
  // baseURL: `http://localhost:8700/api`,
});

export const kakaoSignIn = async ({ name, email, img }) =>
  await API.post('/auth/kakao', {
    name,
    email,
    img,
  });

//auth
export const signIn = async ({ email, password }) =>
  await API.post('/auth/signin', { email, password });
export const signUp = async ({ name, email, password }) =>
  await API.post('/auth/signup', {
    name,
    email,
    password,
  });
// export const googleSignIn = async ({ name, email, img }) =>
//   await API.post('/auth/google', {
//     name,
//     email,
//     img,
//   });
export const findUserByEmail = async (email) =>
  await API.get(`/auth/findbyemail?email=${email}`);
export const generateOtp = async (email, name, reason) =>
  await API.get(
    `/auth/generateotp?email=${email}&name=${name}&reason=${reason}`
  );
export const verifyOtp = async (otp) =>
  await API.get(`/auth/verifyotp?code=${otp}`);
export const resetPassword = async (email, password) =>
  await API.put(`/auth/forgetpassword`, { email, password });

//user api
export const getUsers = async (token) =>
  await API.get(
    '/user',
    { headers: { Authorization: `Bearer ${token}` } },
    {
      withCredentials: true,
    }
  );
export const searchUsers = async (search, token) =>
  await API.get(
    `users/search/${search}`,
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );

//podcast api
export const createPodcast = async (podcast, token) =>
  await API.post(
    '/podcasts',
    podcast,
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );
export const getPodcasts = async () => await API.get('/podcasts');
export const addEpisodes = async (podcast, token) =>
  await API.post(
    '/podcasts/episode',
    podcast,
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );
export const favoritePodcast = async (id, token) =>
  await API.post(
    `/podcasts/favorit`,
    { id: id },
    { headers: { Authorization: `Bearer ${token}` } },
    { withCredentials: true }
  );
export const getRandomPodcast = async () => await API.get('/podcasts/random');
export const getPodcastByTags = async (tags) =>
  await API.get(`/podcasts/tags?tags=${tags}`);
export const getPodcastByCategory = async (category) =>
  await API.get(`/podcasts/category?q=${category}`);
export const getMostPopularPodcast = async () =>
  await API.get('/podcasts/mostpopular');
export const getPodcastById = async (id) =>
  await API.get(`/podcasts/get/${id}`);
export const addView = async (id) => await API.post(`/podcasts/addview/${id}`);
export const searchPodcast = async (search) =>
  await API.get(`/podcasts/search?q=${search}`);
