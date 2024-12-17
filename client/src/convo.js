// src/api/index.js

import axios from 'axios';
import jwt_decode from 'jwt-decode';
//https://.com/api
// const API = axios.create({ baseURL: `https://podcastaudio.com/api` });
const API = axios.create({
  // baseURL: `https://podcastweb-0e7227c429c0.herokuapp.com/api`,
  baseURL: `https://podcast-app-eight-inky.vercel.app/api`,
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



import './CategoryItem.styles.scss';



const CategoryItem = ({ category }) => (
  <div className='category-section'>
    <div className='category-header'>
      <h2>{category.title}</h2>
      <button className='view-more-btn'>View More</button>
    </div>
    <div className='items-scroll-container'>
      {category.items.map((item) => (
        <div key={item.id} className='item-card'>
          <img src={item.imageUrl} alt={item.name} />
          <h3>{item.name}</h3>
          <p>${item.price.toFixed(2)}</p>
          <button className='add-to-cart-btn'>Add to Cart</button>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryItem;


import {
    Pause,
    PlayArrow,
    SkipNextRounded,
    SkipPreviousRounded,
    SouthRounded,
    VolumeUp,
  } from '@mui/icons-material';
  import { IconButton } from '@mui/material';
  import React, { useState, useRef } from 'react';
  import { useDispatch } from 'react-redux';
  import styled from 'styled-components';
  import {
    closePlayer,
    openPlayer,
    setCurrentTime,
  } from '../redux/audioplayerSlice';
  import { openSnackbar } from '../redux/snackbarSlice';
  
  const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    width: 100%;
    background-color: ${({ theme }) => theme.card};
    color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 10px 0px;
    transition: all 0.5s ease;
    @media (max-width: 768px) {
      height: 60px;
      gap: 6px;
      padding: 4px 0px;
    }
    z-index: 999;
  `;
  const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 20px;
    @media (max-width: 768px) {
      gap: 10px;
      margin-left: 10px;
    }
    flex: 0.2;
  `;
  
  const Image = styled.img`
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
    @media (max-width: 768px) {
      width: 34px;
      height: 34px;
    }
  `;
  const PodData = styled.div`
    display: flex;
    flex-direction: column;
  `;
  const Title = styled.span`
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (max-width: 768px) {
      font-size: 12px;
    }
  `;
  const Artist = styled.span`
    font-size: 12px;
    margin-top: 3px;
  `;
  const Player = styled.div`
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 0.6;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 768px) {
      flex: 0.8;
    }
  `;
  
  const Controls = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 30px;
    @media (max-width: 768px) {
      gap: 10px;
      margin-right: 10px;
    }
  `;
  
  const Audio = styled.audio`
    height: 46px;
    width: 100%;
    font-size: 12px;
    @media (max-width: 768px) {
      height: 40px;
      font-size: 10px;
    }
  `;
  
  const IcoButton = styled(IconButton)`
    background-color: ${({ theme }) => theme.text_primary} !important;
    color: ${({ theme }) => theme.bg} !important;
    font-size: 60px !important;
    padding: 10px !important;
    @media (max-width: 768px) {
      font-size: 20px !important;
      padding: 4px !important;
    }
  `;
  
  const Sound = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 50%;
    flex: 0.2;
    max-width: 150px;
    justify-content: space-between;
    margin-right: 20px;
    @media (max-width: 768px) {
      display: none;
      margin-right: 10px;
    }
  `;
  
  const VolumeBar = styled.input.attrs({
    type: 'range',
    min: 0,
    max: 1,
    step: 0.1,
  })`
    -webkit-appearance: none;
    width: 100%;
    height: 2px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.text_primary};
    outline: none;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.primary};
      cursor: pointer;
    }
    &::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.primary};
      cursor: pointer;
    }
  `;
  
  const AudioPlayer = ({ episode, podid, currenttime, index }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progressWidth, setProgressWidth] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);
    const dispatch = useDispatch();
  
    const handleTimeUpdate = () => {
      const duration = audioRef.current.duration;
      const currentTime = audioRef.current.currentTime;
      const progress = (currentTime / duration) * 100;
      setProgressWidth(progress);
      setDuration(duration);
      dispatch(
        setCurrentTime({
          currenttime: currentTime,
        })
      );
    };
  
    const handleVolumeChange = (event) => {
      const volume = event.target.value;
      setVolume(volume);
      audioRef.current.volume = volume;
    };
  
    const goToNextPodcast = () => {
      //from the podid and index, get the next podcast
      //dispatch the next podcast
      if (podid.episodes.length === index + 1) {
        dispatch(
          openSnackbar({
            message: 'This is the last episode',
            severity: 'info',
          })
        );
        return;
      }
      dispatch(closePlayer());
      setTimeout(() => {
        dispatch(
          openPlayer({
            type: 'audio',
            podid: podid,
            index: index + 1,
            currenttime: 0,
            episode: podid.episodes[index + 1],
          })
        );
      }, 10);
    };
  
    const goToPreviousPodcast = () => {
      //from the podid and index, get the next podcast
      //dispatch the next podcast
      if (index === 0) {
        dispatch(
          openSnackbar({
            message: 'This is the first episode',
            severity: 'info',
          })
        );
        return;
      }
      dispatch(closePlayer());
      setTimeout(() => {
        dispatch(
          openPlayer({
            type: 'audio',
            podid: podid,
            index: index - 1,
            currenttime: 0,
            episode: podid.episodes[index - 1],
          })
        );
      }, 10);
    };
  
    return (
      <Container>
        <Left>
          <Image src={podid?.thumbnail} />
          <PodData>
            <Title>{episode?.name}</Title>
            <Artist>{episode?.creator.name}</Artist>
          </PodData>
        </Left>
  
        <Player>
          <Controls>
            <IcoButton>
              <SkipPreviousRounded onClick={() => goToPreviousPodcast()} />
            </IcoButton>
            <Audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => goToNextPodcast()}
              autoPlay
              controls
              onPlay={() => {
                audioRef.current.currentTime = currenttime;
              }}
              src={episode?.file}
            />
            <IcoButton>
              <SkipNextRounded onClick={() => goToNextPodcast()} />
            </IcoButton>
          </Controls>
        </Player>
        <Sound>
          <VolumeUp />
          <VolumeBar value={volume} onChange={handleVolumeChange} />
        </Sound>
      </Container>
    );
  };
  
  export default AudioPlayer;

  
  import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
const Card = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 0.6rem;
  padding: 1rem;
  &:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  ${
    '' /* @media (max-width: 768px) {
    width: 250px;
  } */
  }
`;
const DefaultCardText = styled.div`
  color: #f2f3f4;
  font-size: 1.4rem;
  font-weight: 600;
`;
const DefaultCardImg = styled.img`
  height: 90px;
  width: 80px;
  object-fit: cover;
  clip-path: polygon(0 0, 100% 0, 100% 66%, 0 98%);
  transform: rotate(20deg);
`;
const FlexContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;
export const DefaultCard = ({ category }) => {
  const { t } = useTranslation();
  return (
    <Card style={{ 'background-color': `${category.color}` }}>
      <DefaultCardText>{t(category.name)}</DefaultCardText>
      <FlexContainer>
        <DefaultCardImg src={category.img} alt='podcast-image' />
      </FlexContainer>
    </Card>
  );
};


import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { closePlayer, openPlayer } from '../redux/audioplayerSlice';
import { addView } from '../api';
import { openSnackbar } from '../redux/snackbarSlice';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const Card = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  padding: 20px 30px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.card};
  cursor: pointer;
  &:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.text_secondary};
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;
const ImageContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const Episodecard = ({ episode, podid, user, type, index }) => {
  const dispatch = useDispatch();

  const addviewtToPodcast = async () => {
    await addView(podid._id).catch((err) => {
      dispatch(
        openSnackbar({
          message: err.message,
          type: 'error',
        })
      );
    });
  };

  return (
    <Card
      onClick={async () => {
        await addviewtToPodcast();
        if (type === 'audio') {
          //open audio player
          dispatch(
            openPlayer({
              type: 'audio',
              episode: episode,
              podid: podid,
              index: index,
              currenttime: 0,
            })
          );
        } else {
          //open video player
          dispatch(
            dispatch(
              openPlayer({
                type: 'video',
                episode: episode,
                podid: podid,
                index: index,
                currenttime: 0,
              })
            )
          );
        }
      }}
    >
      <ImageContainer>
        <Image src={podid?.thumbnail} />
        <PlayCircleOutlineIcon
          style={{
            position: 'absolute',
            top: '26px',
            left: '26px',
            color: 'white',
            width: '50px',
            height: '50px',
          }}
        />
      </ImageContainer>
      <Details>
        <Title>{episode.name}</Title>
        <Description>{episode.desc}</Description>
      </Details>
    </Card>
  );
};

export default Episodecard;


import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ReactImageFileToBase64 from 'react-file-image-to-base64';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Container = styled.div`
    height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    align-items: center;
    border: 2px dashed  ${({ theme }) => theme.text_primary + '80'}};
    border-radius: 12px;
    color: ${({ theme }) => theme.text_primary + '80'};
    margin: 30px 20px 0px 20px;
`;

const Typo = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const TextBtn = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
`;

const Img = styled.img`
  height: 120px !important;
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const ImageSelector = ({ podcast, setPodcast }) => {
  const handleOnCompleted = (files) => {
    setPodcast((prev) => {
      return { ...prev, thumbnail: files[0].base64_file };
    });
  };

  const CustomisedButton = ({ triggerInput }) => {
    return <TextBtn onClick={triggerInput}>Browse Image</TextBtn>;
  };
  return (
    <Container>
      {podcast.thumbnail !== '' ? (
        <Img src={podcast.thumbnail} />
      ) : (
        <>
          <CloudUploadIcon sx={{ fontSize: '40px' }} />
          <Typo>Click here to upload thumbnail</Typo>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Typo>or</Typo>
            <ReactImageFileToBase64
              onCompleted={handleOnCompleted}
              CustomisedButton={CustomisedButton}
              multiple={false}
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default ImageSelector;


import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { displayPodcastFailure, logout } from '../redux/userSlice';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import BackupRoundedIcon from '@mui/icons-material/BackupRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import LogoIcon from '../Images/Logo.png';
import { openSignin } from '../redux/setSigninSlice';
import { useTranslation } from 'react-i18next';

const MenuContainer = styled.div`
  flex: 0.5;
  flex-direction: column;
  height: 100vh;
  display: flex;
  box-sizing: border-box;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 1100px) {
    position: fixed;
    z-index: 1000;
    width: 100%;
    max-width: 250px;
    left: ${({ setMenuOpen }) => (setMenuOpen ? '0' : '-100%')};
    transition: 0.3s ease-in-out;
  }
`;
const Elements = styled.div`
  padding: 4px 16px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.text_secondary};
  width: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.text_secondary + 50};
  }
`;
const NavText = styled.div`
  padding: 12px 0px;
`;

const LangElement = styled.div`
  padding: 4px 16px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  ${'' /* cursor: pointer; */}
  color: ${({ theme }) => theme.text_secondary};
  width: 100%;
`;
const LangBtn = styled.a`
  cursor: pointer;
  text-decoration: None;
  &:hover {
    color: ${({ theme }) => theme.text_secondary};
    text-decoration: underline;
  }
`;
const HR = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.text_secondary + 50};
  margin: 10px 0px;
`;
const Flex = styled.div`
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  width: 86%;
`;
const Close = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: block;
  }
`;
const Logo = styled.div`
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: bold;
  font-size: 20px;
  margin: 16px 0px;
`;
const Image = styled.img`
  height: 40px;
`;
const Menu = ({ setMenuOpen, darkMode, setDarkMode, setUploadOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const logoutUser = () => {
    dispatch(logout());
    navigate(`/`);
  };
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <MenuContainer setMenuOpen={setMenuOpen}>
      <Flex>
        <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
          <Logo>
            {/* <Image src={LogoIcon} /> */}
            PODCAST
          </Logo>
        </Link>
        <Close>
          <CloseRounded
            onClick={() => setMenuOpen(false)}
            style={{ cursor: 'pointer' }}
          />
        </Close>
      </Flex>
      <Link
        to='/'
        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
      >
        <Elements>
          <HomeRoundedIcon />
          <NavText>{t('home')}</NavText>
        </Elements>
      </Link>
      <Link
        to='/search'
        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
      >
        <Elements>
          <SearchRoundedIcon />
          <NavText>{t('search')}</NavText>
        </Elements>
      </Link>
      {currentUser ? (
        <Link
          to='/favourites'
          style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
        >
          <Elements>
            <FavoriteRoundedIcon />
            <NavText>{t('favorites')}</NavText>
          </Elements>
        </Link>
      ) : (
        <Link
          onClick={() => dispatch(openSignin())}
          style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
        >
          <Elements>
            <FavoriteRoundedIcon />
            <NavText>{t('favorites')}</NavText>
          </Elements>
        </Link>
      )}
      <HR />
      <Link
        onClick={() => {
          if (currentUser) {
            setUploadOpen(true);
          } else {
            dispatch(openSignin());
          }
        }}
        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
      >
        <Elements>
          <BackupRoundedIcon />
          <NavText>{t('upload')}</NavText>
        </Elements>
      </Link>

      {darkMode ? (
        <>
          <Elements onClick={() => setDarkMode(false)}>
            <LightModeRoundedIcon />
            <NavText>Light Mode</NavText>
          </Elements>
        </>
      ) : (
        <>
          <Elements onClick={() => setDarkMode(true)}>
            <DarkModeRoundedIcon />
            <NavText>Dark Mode</NavText>
          </Elements>
        </>
      )}
      {currentUser ? (
        <Elements onClick={() => logoutUser()}>
          <ExitToAppRoundedIcon />
          <NavText>Log Out</NavText>
        </Elements>
      ) : (
        <Elements onClick={() => dispatch(openSignin())}>
          <ExitToAppRoundedIcon />
          <NavText>{t('login')}</NavText>
        </Elements>
      )}
      <HR />
      <LangElement>
        <NavText>{t('language')}</NavText>

        <NavText>
          <LangBtn onClick={() => changeLanguage('en')}>EN</LangBtn>
        </NavText>
        <NavText>
          <LangBtn onClick={() => changeLanguage('ko')}>KR</LangBtn>
        </NavText>
      </LangElement>
    </MenuContainer>
  );
};

export default Menu;


import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';

const Results = styled(Link)`
  background-color: ${({ theme }) => theme.bgLight};
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  gap: 20px;
  &:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
`;
const PodcastImage = styled.img`
  height: 80px;
  border-radius: 8px;
  width: 150px;
  object-fit: cover;
  @media (max-width: 768px) {
    height: 60px;
    width: 100px;
  }
`;
const PodcastInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const PodcastName = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text_primary};
`;
const Creator = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;
const Time = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;
const Desciption = styled.div`
  display: flex;
  gap: 8px;
`;

const MoreResult = ({ podcast }) => {
  return (
    <Results to={`/podcast/${podcast?._id}`} style={{ textDecoration: 'none' }}>
      <PodcastImage src={podcast?.thumbnail} />
      <PodcastInfo>
        <PodcastName>{podcast?.name}</PodcastName>
        <Desciption>
          <Creator style={{ marginRight: '12px' }}>
            {podcast?.creator.name}
          </Creator>
          <Time>• {podcast?.views} Views</Time>
          <Time>• {format(podcast?.createdAt)}</Time>
        </Desciption>
      </PodcastInfo>
    </Results>
  );
};

export default MoreResult;


import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import { openSignin } from '../redux/setSigninSlice';
import { useTranslation } from 'react-i18next';

const NavbarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 40px;
  align-items: center;
  box-sizing: border-box;
  color: ${({ theme }) => theme.text_primary};
  gap: 30px;
  background: ${({ theme }) => theme.bg}
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(5.7px);
-webkit-backdrop-filter: blur(5.7px);
@media (max-width: 768px) {
    padding: 16px;
  }

`;
const ButtonDiv = styled.div`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 12px;
  width: 100%;
  max-width: 70px;
  padding: 8px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const Welcome = styled.div`
  font-size: 26px;
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const IcoButton = styled(IconButton)`
  color: ${({ theme }) => theme.text_secondary} !important;
`;

const Navbar = ({ menuOpen, setMenuOpen, setSignInOpen, setSignUpOpen }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <NavbarDiv>
      <IcoButton onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </IcoButton>
      {currentUser ? (
        <Welcome>Welcome, {currentUser.name}</Welcome>
      ) : (
        <>&nbsp;</>
      )}
      {currentUser ? (
        <>
          <Link to='/profile' style={{ textDecoration: 'none' }}>
            <Avatar src={currentUser.img}>
              {currentUser.name.charAt(0).toUpperCase()}
            </Avatar>
          </Link>
        </>
      ) : (
        <ButtonDiv onClick={() => dispatch(openSignin())}>
          <PersonIcon style={{ fontSize: '18px' }} />
          {t('login')}
        </ButtonDiv>
      )}
    </NavbarDiv>
  );
};

export default Navbar;


import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import OtpInput from 'react-otp-input';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/snackbarSlice';
import { generateOtp, verifyOtp } from '../api';

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 16px 22px;
`;

const OutlinedBox = styled.div`
  height: 44px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.text_secondary};
  ${({ googleButton, theme }) =>
    googleButton &&
    `
    user-select: none; 
  gap: 16px;`}
  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
  border: none;
    background: ${theme.button};
    color: '${theme.text_secondary}';`}
    ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 20px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 14px;
`;

const LoginText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0px 26px 0px 26px;
`;
const Span = styled.span`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  margin: 0px 26px 0px 26px;
`;

const Error = styled.div`
  color: red;
  font-size: 12px;
  margin: 2px 26px 8px 26px;
  display: block;
  ${({ error, theme }) =>
    error === '' &&
    `    display: none;
    `}
`;

const Timer = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  margin: 2px 26px 8px 26px;
  display: block;
`;

const Resend = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  margin: 2px 26px 8px 26px;
  display: block;
  cursor: pointer;
`;

const OTP = ({ email, name, otpVerified, setOtpVerified, reason }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState('00:00');

  const Ref = useRef(null);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (minutes > 9 ? minutes : '0' + minutes) +
          ':' +
          (seconds > 9 ? seconds : '0' + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer('01:00');

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  };

  const resendOtp = () => {
    setShowTimer(true);
    clearTimer(getDeadTime());
    sendOtp();
  };

  const sendOtp = async () => {
    await generateOtp(email, name, reason)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            openSnackbar({
              message: 'OTP sent Successfully',
              severity: 'success',
            })
          );
          setDisabled(true);
          setOtp('');
          setOtpError('');
          setOtpLoading(false);
          setOtpSent(true);
          console.log(res.data);
        } else {
          dispatch(
            openSnackbar({
              message: res.status,
              severity: 'error',
            })
          );
          setOtp('');
          setOtpError('');
          setOtpLoading(false);
        }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
      });
  };

  const validateOtp = () => {
    setOtpLoading(true);
    setDisabled(true);
    verifyOtp(otp)
      .then((res) => {
        if (res.status === 200) {
          setOtpVerified(true);
          setOtp('');
          setOtpError('');
          setDisabled(false);
          setOtpLoading(false);
        } else {
          setOtpError(res.data.message);
          setDisabled(false);
          setOtpLoading(false);
        }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
        setOtpError(err.message);
        setDisabled(false);
        setOtpLoading(false);
      });
  };

  useEffect(() => {
    sendOtp();
    clearTimer(getDeadTime());
  }, []);

  useEffect(() => {
    if (timer === '00:00') {
      setShowTimer(false);
    } else {
      setShowTimer(true);
    }
  }, [timer]);

  useEffect(() => {
    if (otp.length === 6) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [otp]);

  return (
    <div>
      <Title>VERIFY OTP</Title>
      <LoginText>
        A verification <b>&nbsp;OTP &nbsp;</b> has been sent to:{' '}
      </LoginText>
      <Span>{email}</Span>
      {!otpSent ? (
        <div
          style={{
            padding: '12px 26px',
            marginBottom: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            justifyContent: 'center',
          }}
        >
          Sending OTP
          <CircularProgress color='inherit' size={20} />
        </div>
      ) : (
        <div>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus={true}
            inputStyle={{
              fontSize: '22px',
              width: '38px',
              height: '38px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              textAlign: 'center',
              margin: '6px 4px',
              backgroundColor: 'transparent',
              color: theme.text_primary,
            }}
            containerStyle={{ padding: '8px 2px', justifyContent: 'center' }}
            renderInput={(props) => <input {...props} />}
          />
          <Error error={otpError}>
            <b>{otpError}</b>
          </Error>

          <OutlinedBox
            button={true}
            activeButton={!disabled}
            style={{ marginTop: '12px', marginBottom: '12px' }}
            onClick={() => validateOtp()}
          >
            {otpLoading ? (
              <CircularProgress color='inherit' size={20} />
            ) : (
              'Submit'
            )}
          </OutlinedBox>

          {showTimer ? (
            <Timer>
              Resend in <b>{timer}</b>
            </Timer>
          ) : (
            <Resend onClick={() => resendOtp()}>
              <b>Resend</b>
            </Resend>
          )}
        </div>
      )}
    </div>
  );
};

export default OTP;


import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import styled from 'styled-components';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { favoritePodcast } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { openSignin } from '../redux/setSigninSlice';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const PlayIcon = styled.div`
  padding: 10px;
  border-radius: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  background: #9000ff !important;
  color: white !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  position: absolute !important;
  top: 45%;
  right: 10%;
  display: none;
  transition: all 0.4s ease-in-out;
  box-shadow: 0 0 16px 4px #9000ff50 !important;
`;

const Card = styled(Link)`
  position: relative;
  text-decoration: none;
  background-color: ${({ theme }) => theme.card};
  max-width: 220px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  &:hover ${PlayIcon} {
    display: flex;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  position: relative;
`;
const Title = styled.div`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_primary};
`;

const Description = styled.div`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;

const CardImage = styled.img`
  object-fit: cover;
  width: 220px;
  height: 140px;
  border-radius: 6px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  &:hover {
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  }
`;
const CardInformation = styled.div`
  display: flex;
  align-items: flex-end;
  font-weight: 450;
  padding: 14px 0px 0px 0px;
  width: 100%;
`;
const MainInfo = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
`;
const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
`;
const CreatorName = styled.div`
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_secondary};
`;
const TimePosted = styled.div`
  color: ${({ theme }) => theme.text_secondary};
`;

const Views = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.text_secondary};
  width: max-content;
`;
const Favorite = styled(IconButton)`
  color: white;
  top: 8px;
  right: 6px;
  padding: 6px !important;
  border-radius: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 95} !important;
  color: white !important;
  position: absolute !important;
  backdrop-filter: blur(4px);
  box-shadow: 0 0 16px 6px #222423 !important;
`;

export const PodcastCard = ({ podcast, user, setSignInOpen }) => {
  const [favourite, setFavourite] = useState(false);
  const dispatch = useDispatch();

  const token = localStorage.getItem('podstreamtoken');

  const favoritpodcast = async () => {
    await favoritePodcast(podcast._id, token)
      .then((res) => {
        if (res.status === 200) {
          setFavourite(!favourite);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    //favorits is an array of objects in which each object has a podcast id match it to the current podcast id
    if (user?.favorits?.find((fav) => fav._id === podcast._id)) {
      setFavourite(true);
    }
  }, [user]);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Card to={`/podcast/${podcast._id}`}>
      <div>
        <Top>
          <Link
            onClick={() => {
              if (!currentUser) {
                dispatch(openSignin());
              } else {
                favoritpodcast();
              }
            }}
          >
            <Favorite>
              {favourite ? (
                <FavoriteIcon
                  style={{ color: '#E30022', width: '16px', height: '16px' }}
                ></FavoriteIcon>
              ) : (
                <FavoriteIcon
                  style={{ width: '16px', height: '16px' }}
                ></FavoriteIcon>
              )}
            </Favorite>
          </Link>
          <CardImage src={podcast.thumbnail} />
        </Top>
        <CardInformation>
          <MainInfo>
            <Title>{podcast.name}</Title>
            <Description>{podcast.desc}</Description>
            <CreatorInfo>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Avatar
                  src={podcast.creator.img}
                  style={{ width: '26px', height: '26px' }}
                >
                  {podcast.creator.name?.charAt(0).toUpperCase()}
                </Avatar>
                <CreatorName>{podcast.creator.name}</CreatorName>
              </div>
              <Views>• {podcast.views} Views</Views>
            </CreatorInfo>
          </MainInfo>
        </CardInformation>
      </div>
      <PlayIcon>
        {podcast?.type === 'video' ? (
          <PlayArrowIcon style={{ width: '28px', height: '28px' }} />
        ) : (
          <HeadphonesIcon style={{ width: '28px', height: '28px' }} />
        )}
      </PlayIcon>
    </Card>
  );
};


import React from 'react';
import Avatar from '@mui/material/Avatar';
import styled from 'styled-components';
const Card = styled.div`
  height: 250px;
  width: 250px;
  background-color: #305506;
  padding: 1rem;
  border-radius: 0.6rem;
`;
const PodcastName = styled.div`
  color: ${({ theme }) => theme.text_primary};
  margin: 1.6rem;
  font-weight: 600;
  font-size: 1.5rem;
`;
const PodcastDescription = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  margin: 1.4rem;
`;
export const SearchCard = () => {
  return (
    <Card>
      <Avatar
        src='https://imgs.search.brave.com/ehz2Uo5e7s5vqThA4x8MHLLd-td3CpvouiLDGFQnVJg/rs:fit:500:500:1/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTAwMDE5/NzA4ODg4My11emcz/YWEtdDUwMHg1MDAu/anBn'
        alt='eminem picture'
        sx={{ width: '100px', height: '100px' }}
      />
      <PodcastName>Eminem</PodcastName>
      <PodcastDescription>Hello I am Eminem</PodcastDescription>
    </Card>
  );
};



import {
    Block,
    CloseRounded,
    EmailRounded,
    Visibility,
    VisibilityOff,
    PasswordRounded,
    TroubleshootRounded,
  } from '@mui/icons-material';
  import React, { useState, useEffect } from 'react';
  import styled from 'styled-components';
  import { IconButton, Modal } from '@mui/material';
  import CircularProgress from '@mui/material/CircularProgress';
  import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice';
  import { openSnackbar } from '../redux/snackbarSlice';
  import { useDispatch } from 'react-redux';
  import validator from 'validator';
  import {
    signIn,
    // googleSignIn,
    findUserByEmail,
    resetPassword,
  } from '../api/index';
  import OTP from './OTP';
  import { kakaoSignIn } from '../api/index';
  // import { useGoogleLogin } from '@react-oauth/google';
  import axios from 'axios';
  import { closeSignin } from '../redux/setSigninSlice';
  import KakaoLogin from 'react-kakao-login';
  import { useTranslation } from 'react-i18next';
  import LogoIcon from '../Images/kakao.png';
  
  const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const Wrapper = styled.div`
    width: 380px;
    border-radius: 16px;
    background-color: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
  `;
  
  const Title = styled.div`
    font-size: 22px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
    margin: 16px 28px;
  `;
  const OutlinedBox = styled.div`
    height: 44px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.text_secondary};
    color: ${({ theme }) => theme.text_secondary};
    ${({ googleButton, theme }) =>
      googleButton &&
      `
      user-select: none; 
    gap: 16px;`}
    ${({ button, theme }) =>
      button &&
      `
      user-select: none; 
    border: none;
      background: ${theme.button};
      color:'${theme.bg}';`}
      ${({ activeButton, theme }) =>
      activeButton &&
      `
      user-select: none; 
    border: none;
      background: ${theme.primary};
      color: white;`}
    margin: 3px 20px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    padding: 0px 14px;
  `;
  const GoogleIcon = styled.img`
    width: 22px;
  `;
  const Divider = styled.div`
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.text_secondary};
    font-size: 14px;
    font-weight: 600;
  `;
  const Line = styled.div`
    width: 80px;
    height: 1px;
    border-radius: 10px;
    margin: 0px 10px;
    background-color: ${({ theme }) => theme.text_secondary};
  `;
  
  const TextInput = styled.input`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const LoginText = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_secondary};
    margin: 20px 20px 30px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  const Span = styled.span`
    color: ${({ theme }) => theme.primary};
  `;
  
  const Error = styled.div`
    color: red;
    font-size: 10px;
    margin: 2px 26px 8px 26px;
    display: block;
    ${({ error, theme }) =>
      error === '' &&
      `    display: none;
      `}
  `;
  
  const ForgetPassword = styled.div`
    color: ${({ theme }) => theme.text_secondary};
    font-size: 13px;
    margin: 8px 26px;
    display: block;
    cursor: pointer;
    text-align: right;
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  `;
  
  const Image = styled.img`
    height: 30px;
  `;
  
  const SignIn = ({ setSignInOpen, setSignUpOpen }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [values, setValues] = useState({
      password: '',
      showPassword: false,
    });
  
    const { t } = useTranslation();
  
    //verify otp
    const [showOTP, setShowOTP] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    //reset password
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [samepassword, setSamepassword] = useState('');
    const [newpassword, setNewpassword] = useState('');
    const [confirmedpassword, setConfirmedpassword] = useState('');
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [resetDisabled, setResetDisabled] = useState(true);
    const [resettingPassword, setResettingPassword] = useState(false);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (email !== '') validateEmail();
      if (validator.isEmail(email) && password.length > 5) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }, [email, password]);
  
    const kakaoClientId = process.env.REACT_APP_KAKAO_KEY; // 카카오 개발자 콘솔에서 얻은 클라이언트 ID
  
    const handleKakaoSuccess = (data) => {
      kakaoSignIn({
        name: data.profile.properties.nickname,
        email: data.profile.kakao_account.email,
        img: data.profile.properties.profile_image,
      }).then((res) => {
        if (res.status === 200) {
          dispatch(loginSuccess(res.data));
          dispatch(closeSignin());
          dispatch(
            openSnackbar({
              message: 'Logged In Successfully with Kakao',
              severity: 'success',
            })
          );
        } else {
          dispatch(loginFailure(res.data));
          dispatch(
            openSnackbar({
              message: res.data.message,
              severity: 'error',
            })
          );
        }
      });
    };
  
    const handleKakaoFail = (err) => {
      dispatch(loginFailure());
      dispatch(
        openSnackbar({
          message: err.message,
          severity: 'error',
        })
      );
    };
  
    const handleLogin = async (e) => {
      e.preventDefault();
      if (!disabled) {
        dispatch(loginStart());
        setDisabled(true);
        setLoading(true);
        try {
          signIn({ email, password }).then((res) => {
            if (res.status === 200) {
              dispatch(loginSuccess(res.data));
              setLoading(false);
              setDisabled(false);
              dispatch(closeSignin());
              dispatch(
                openSnackbar({
                  message: 'Logged In Successfully',
                  severity: 'success',
                })
              );
            } else if (res.status === 203) {
              dispatch(loginFailure());
              setLoading(false);
              setDisabled(false);
              setcredentialError(res.data.message);
              dispatch(
                openSnackbar({
                  message: 'Account Not Verified',
                  severity: 'error',
                })
              );
            } else {
              dispatch(loginFailure());
              setLoading(false);
              setDisabled(false);
              setcredentialError(`Invalid Credentials : ${res.data.message}`);
            }
          });
        } catch (err) {
          dispatch(loginFailure());
          setLoading(false);
          setDisabled(false);
          dispatch(
            openSnackbar({
              message: err.message,
              severity: 'error',
            })
          );
        }
      }
      if (email === '' || password === '') {
        dispatch(
          openSnackbar({
            message: 'Please fill all the fields',
            severity: 'error',
          })
        );
      }
    };
  
    const [emailError, setEmailError] = useState('');
    const [credentialError, setcredentialError] = useState('');
  
    const validateEmail = () => {
      if (validator.isEmail(email)) {
        setEmailError('');
      } else {
        setEmailError('Enter a valid Email Id!');
      }
    };
  
    //validate password
    const validatePassword = () => {
      if (newpassword.length < 8) {
        setSamepassword('Password must be atleast 8 characters long!');
        setPasswordCorrect(false);
      } else if (newpassword.length > 16) {
        setSamepassword('Password must be less than 16 characters long!');
        setPasswordCorrect(false);
      } else if (
        !newpassword.match(/[a-z]/g) ||
        !newpassword.match(/[A-Z]/g) ||
        !newpassword.match(/[0-9]/g) ||
        !newpassword.match(/[^a-zA-Z\d]/g)
      ) {
        setPasswordCorrect(false);
        setSamepassword(
          'Password must contain atleast one lowercase, uppercase, number and special character!'
        );
      } else {
        setSamepassword('');
        setPasswordCorrect(true);
      }
    };
  
    useEffect(() => {
      if (newpassword !== '') validatePassword();
      if (passwordCorrect && newpassword === confirmedpassword) {
        setSamepassword('');
        setResetDisabled(false);
      } else if (confirmedpassword !== '' && passwordCorrect) {
        setSamepassword('Passwords do not match!');
        setResetDisabled(true);
      }
    }, [newpassword, confirmedpassword]);
  
    const sendOtp = () => {
      if (!resetDisabled) {
        setResetDisabled(true);
        setLoading(true);
        findUserByEmail(email)
          .then((res) => {
            if (res.status === 200) {
              setShowOTP(true);
              setResetDisabled(false);
              setLoading(false);
            } else if (res.status === 202) {
              setEmailError('User not found!');
              setResetDisabled(false);
              setLoading(false);
            }
          })
          .catch((err) => {
            setResetDisabled(false);
            setLoading(false);
            dispatch(
              openSnackbar({
                message: err.message,
                severity: 'error',
              })
            );
          });
      }
    };
  
    const performResetPassword = async () => {
      if (otpVerified) {
        setShowOTP(false);
        setResettingPassword(true);
        await resetPassword(email, confirmedpassword)
          .then((res) => {
            if (res.status === 200) {
              dispatch(
                openSnackbar({
                  message: 'Password Reset Successfully',
                  severity: 'success',
                })
              );
              setShowForgotPassword(false);
              setEmail('');
              setNewpassword('');
              setConfirmedpassword('');
              setOtpVerified(false);
              setResettingPassword(false);
            }
          })
          .catch((err) => {
            dispatch(
              openSnackbar({
                message: err.message,
                severity: 'error',
              })
            );
            setShowOTP(false);
            setOtpVerified(false);
            setResettingPassword(false);
          });
      }
    };
    const closeForgetPassword = () => {
      setShowForgotPassword(false);
      setShowOTP(false);
    };
    useEffect(() => {
      performResetPassword();
    }, [otpVerified]);
  
    //Google SignIn
    // const googleLogin = useGoogleLogin({
    //   onSuccess: async (tokenResponse) => {
    //     setLoading(true);
    //     const user = await axios
    //       .get('https://www.googleapis.com/oauth2/v3/userinfo', {
    //         headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    //       })
    //       .catch((err) => {
    //         dispatch(loginFailure());
    //         dispatch(
    //           openSnackbar({
    //             message: err.message,
    //             severity: 'error',
    //           })
    //         );
    //       });
  
    //     googleSignIn({
    //       name: user.data.name,
    //       email: user.data.email,
    //       img: user.data.picture,
    //     }).then((res) => {
    //       console.log(res);
    //       if (res.status === 200) {
    //         dispatch(loginSuccess(res.data));
    //         dispatch(closeSignin());
    //         dispatch(
    //           openSnackbar({
    //             message: 'Logged In Successfully',
    //             severity: 'success',
    //           })
    //         );
    //         setLoading(false);
    //       } else {
    //         dispatch(loginFailure(res.data));
    //         dispatch(
    //           openSnackbar({
    //             message: res.data.message,
    //             severity: 'error',
    //           })
    //         );
    //         setLoading(false);
    //       }
    //     });
    //   },
    //   onError: (errorResponse) => {
    //     dispatch(loginFailure());
    //     setLoading(false);
    //     dispatch(
    //       openSnackbar({
    //         message: errorResponse.error,
    //         severity: 'error',
    //       })
    //     );
    //   },
    // });
  
    return (
      <Modal open={true} onClose={() => dispatch(closeSignin())}>
        <Container>
          {!showForgotPassword ? (
            <Wrapper>
              <CloseRounded
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '30px',
                  cursor: 'pointer',
                }}
                onClick={() => dispatch(closeSignin())}
              />
              <>
                <Title>{t('signin')}</Title>
                <KakaoLogin
                  token={kakaoClientId}
                  onSuccess={handleKakaoSuccess}
                  onFail={handleKakaoFail}
                  render={({ onClick }) => (
                    <OutlinedBox
                      googleButton={true}
                      onClick={onClick}
                      style={{
                        margin: '24px',
                        cursor: 'pointer',
                        background: '#FEE500',
                        color: '#000000',
                      }}
                    >
                      <Image src={LogoIcon} />
                      {t('signinwithkakao')}
                    </OutlinedBox>
                  )}
                />
                {/* <OutlinedBox
                  googleButton={TroubleshootRounded}
                  style={{ margin: '24px' }}
                  onClick={() => googleLogin()}
                >
                  {Loading ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : (
                    <>
                      <GoogleIcon src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png?20210618182606' />
                      Sign In with Google
                    </>
                  )}
                </OutlinedBox> */}
                <Divider>
                  <Line />
                  or
                  <Line />
                </Divider>
                <OutlinedBox style={{ marginTop: '24px' }}>
                  <EmailRounded
                    sx={{ fontSize: '20px' }}
                    style={{ paddingRight: '12px' }}
                  />
                  <TextInput
                    placeholder={t('emailid')}
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </OutlinedBox>
                <Error error={emailError}>{emailError}</Error>
                <OutlinedBox>
                  <PasswordRounded
                    sx={{ fontSize: '20px' }}
                    style={{ paddingRight: '12px' }}
                  />
                  <TextInput
                    placeholder={t('password')}
                    type={values.showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    color='inherit'
                    onClick={() =>
                      setValues({ ...values, showPassword: !values.showPassword })
                    }
                  >
                    {values.showPassword ? (
                      <Visibility sx={{ fontSize: '20px' }} />
                    ) : (
                      <VisibilityOff sx={{ fontSize: '20px' }} />
                    )}
                  </IconButton>
                </OutlinedBox>
                <Error error={credentialError}>{credentialError}</Error>
                <ForgetPassword
                  onClick={() => {
                    setShowForgotPassword(true);
                  }}
                >
                  <b>{t('forgotpassword')} </b>
                </ForgetPassword>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: '6px', cursor: 'pointer' }}
                  onClick={handleLogin}
                >
                  {Loading ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : (
                    t('signin')
                  )}
                </OutlinedBox>
              </>
              <LoginText>
                {t('donthaveanaccount')}
                <Span
                  onClick={() => {
                    setSignUpOpen(true);
                    dispatch(closeSignin({}));
                  }}
                  style={{
                    fontWeight: '500',
                    marginLeft: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {t('createaccount')}
                </Span>
              </LoginText>
            </Wrapper>
          ) : (
            <Wrapper>
              <CloseRounded
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '30px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  closeForgetPassword();
                }}
              />
              {!showOTP ? (
                <>
                  <Title>Reset Password</Title>
                  {resettingPassword ? (
                    <div
                      style={{
                        padding: '12px 26px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '14px',
                        justifyContent: 'center',
                      }}
                    >
                      Updating password
                      <CircularProgress color='inherit' size={20} />
                    </div>
                  ) : (
                    <>
                      <OutlinedBox style={{ marginTop: '24px' }}>
                        <EmailRounded
                          sx={{ fontSize: '20px' }}
                          style={{ paddingRight: '12px' }}
                        />
                        <TextInput
                          placeholder='Email Id'
                          type='email'
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </OutlinedBox>
                      <Error error={emailError}>{emailError}</Error>
                      <OutlinedBox>
                        <PasswordRounded
                          sx={{ fontSize: '20px' }}
                          style={{ paddingRight: '12px' }}
                        />
                        <TextInput
                          placeholder='New Password'
                          type='text'
                          onChange={(e) => setNewpassword(e.target.value)}
                        />
                      </OutlinedBox>
                      <OutlinedBox>
                        <PasswordRounded
                          sx={{ fontSize: '20px' }}
                          style={{ paddingRight: '12px' }}
                        />
                        <TextInput
                          placeholder='Confirm Password'
                          type={values.showPassword ? 'text' : 'password'}
                          onChange={(e) => setConfirmedpassword(e.target.value)}
                        />
                        <IconButton
                          color='inherit'
                          onClick={() =>
                            setValues({
                              ...values,
                              showPassword: !values.showPassword,
                            })
                          }
                        >
                          {values.showPassword ? (
                            <Visibility sx={{ fontSize: '20px' }} />
                          ) : (
                            <VisibilityOff sx={{ fontSize: '20px' }} />
                          )}
                        </IconButton>
                      </OutlinedBox>
                      <Error error={samepassword}>{samepassword}</Error>
                      <OutlinedBox
                        button={true}
                        activeButton={!resetDisabled}
                        style={{ marginTop: '6px', marginBottom: '24px' }}
                        onClick={() => sendOtp()}
                      >
                        {Loading ? (
                          <CircularProgress color='inherit' size={20} />
                        ) : (
                          'Submit'
                        )}
                      </OutlinedBox>
                      <LoginText>
                        Don't have an account ?
                        <Span
                          onClick={() => {
                            setSignUpOpen(true);
                            dispatch(closeSignin());
                          }}
                          style={{
                            fontWeight: '500',
                            marginLeft: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          Create Account
                        </Span>
                      </LoginText>
                    </>
                  )}
                </>
              ) : (
                <OTP
                  email={email}
                  name='User'
                  otpVerified={otpVerified}
                  setOtpVerified={setOtpVerified}
                  reason='FORGOTPASSWORD'
                />
              )}
            </Wrapper>
          )}
        </Container>
      </Modal>
    );
  };
  
  export default SignIn;

  
  import {
    CloseRounded,
    EmailRounded,
    PasswordRounded,
    Person,
    Visibility,
    VisibilityOff,
    TroubleshootRounded,
  } from '@mui/icons-material';
  import React, { useState, useEffect } from 'react';
  import styled from 'styled-components';
  import { useTheme } from 'styled-components';
  import Google from '../Images/google.webp';
  import { IconButton, Modal } from '@mui/material';
  import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice';
  import { openSnackbar } from '../redux/snackbarSlice';
  import { useDispatch } from 'react-redux';
  import axios from 'axios';
  import CircularProgress from '@mui/material/CircularProgress';
  import validator from 'validator';
  import { signUp } from '../api/index';
  import OTP from './OTP';
  // import { useGoogleLogin } from '@react-oauth/google';
  import { closeSignin, openSignin } from '../redux/setSigninSlice';
  import { kakaoSignIn } from '../api/index';
  import KakaoLogin from 'react-kakao-login';
  import { useTranslation } from 'react-i18next';
  import LogoIcon from '../Images/kakao.png';
  
  const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const Wrapper = styled.div`
    width: 380px;
    border-radius: 16px;
    background-color: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_secondary};
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
  `;
  
  const Title = styled.div`
    font-size: 22px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
    margin: 16px 28px;
  `;
  const OutlinedBox = styled.div`
    height: 44px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.text_secondary};
    color: ${({ theme }) => theme.text_secondary};
    ${({ googleButton, theme }) =>
      googleButton &&
      `
      user-select: none; 
    gap: 16px;`}
    ${({ button, theme }) =>
      button &&
      `
      user-select: none; 
    border: none;
      background: ${theme.button};
      color: '${theme.text_secondary}';`}
      ${({ activeButton, theme }) =>
      activeButton &&
      `
      user-select: none; 
    border: none;
      background: ${theme.primary};
      color: white;`}
    margin: 3px 20px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    padding: 0px 14px;
  `;
  const GoogleIcon = styled.img`
    width: 22px;
  `;
  const Divider = styled.div`
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.text_secondary};
    font-size: 14px;
    font-weight: 600;
  `;
  const Line = styled.div`
    width: 80px;
    height: 1px;
    border-radius: 10px;
    margin: 0px 10px;
    background-color: ${({ theme }) => theme.text_secondary};
  `;
  
  const TextInput = styled.input`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const LoginText = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_secondary};
    margin: 20px 20px 38px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  const Span = styled.span`
    color: ${({ theme }) => theme.primary};
  `;
  
  const Error = styled.div`
    color: red;
    font-size: 10px;
    margin: 2px 26px 8px 26px;
    display: block;
    ${({ error, theme }) =>
      error === '' &&
      `    display: none;
      `}
  `;
  
  const Image = styled.img`
    height: 30px;
  `;
  
  const SignUp = ({ setSignUpOpen, setSignInOpen }) => {
    const [nameValidated, setNameValidated] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [credentialError, setcredentialError] = useState('');
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [nameCorrect, setNameCorrect] = useState(false);
    const [values, setValues] = useState({
      password: '',
      showPassword: false,
    });
  
    const { t } = useTranslation();
  
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
  
    const dispatch = useDispatch();
  
    const createAccount = () => {
      if (otpVerified) {
        dispatch(loginStart());
        setDisabled(true);
        setLoading(true);
        try {
          signUp({ name, email, password }).then((res) => {
            if (res.status === 200) {
              dispatch(loginSuccess(res.data));
              dispatch(
                openSnackbar({
                  message: `OTP verified & Account created successfully`,
                  severity: 'success',
                })
              );
              setLoading(false);
              setDisabled(false);
              setSignUpOpen(false);
              dispatch(closeSignin());
            } else {
              dispatch(loginFailure());
              setcredentialError(`${res.data.message}`);
              setLoading(false);
              setDisabled(false);
            }
          });
        } catch (err) {
          dispatch(loginFailure());
          setLoading(false);
          setDisabled(false);
          dispatch(
            openSnackbar({
              message: err.message,
              severity: 'error',
            })
          );
        }
      }
    };
  
    const kakaoClientId = process.env.REACT_APP_KAKAO_KEY; // 카카오 개발자 콘솔에서 얻은 클라이언트 ID
  
    const handleKakaoSuccess = (data) => {
      kakaoSignIn({
        name: data.profile.properties.nickname,
        email: data.profile.kakao_account.email,
        img: data.profile.properties.profile_image,
      }).then((res) => {
        if (res.status === 200) {
          dispatch(loginSuccess(res.data));
          dispatch(closeSignin());
          dispatch(
            openSnackbar({
              message: 'Logged In Successfully with Kakao',
              severity: 'success',
            })
          );
        } else {
          dispatch(loginFailure(res.data));
          dispatch(
            openSnackbar({
              message: res.data.message,
              severity: 'error',
            })
          );
        }
      });
    };
  
    const handleKakaoFail = (err) => {
      dispatch(loginFailure());
      dispatch(
        openSnackbar({
          message: err.message,
          severity: 'error',
        })
      );
    };
  
    const handleSignUp = async (e) => {
      e.preventDefault();
      if (!disabled) {
        // setOtpSent(true);
        // testing purposes due to google cloud sign-in issue
        setOtpSent(false);
        setOtpVerified(true);
      }
  
      if (name === '' || email === '' || password === '') {
        dispatch(
          openSnackbar({
            message: 'Please fill all the fields',
            severity: 'error',
          })
        );
      }
    };
  
    useEffect(() => {
      if (email !== '') validateEmail();
      if (password !== '') validatePassword();
      if (name !== '') validateName();
      if (
        name !== '' &&
        validator.isEmail(email) &&
        passwordCorrect &&
        nameCorrect
      ) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }, [name, email, passwordCorrect, password, nameCorrect]);
  
    useEffect(() => {
      createAccount();
    }, [otpVerified]);
  
    //validate email
    const validateEmail = () => {
      if (validator.isEmail(email)) {
        setEmailError('');
      } else {
        setEmailError('Enter a valid Email Id!');
      }
    };
  
    //validate password
    const validatePassword = () => {
      if (password.length < 8) {
        setcredentialError('Password must be atleast 8 characters long!');
        setPasswordCorrect(false);
      } else if (password.length > 16) {
        setcredentialError('Password must be less than 16 characters long!');
        setPasswordCorrect(false);
      } else if (
        !password.match(/[a-z]/g) ||
        !password.match(/[A-Z]/g) ||
        !password.match(/[0-9]/g) ||
        !password.match(/[^a-zA-Z\d]/g)
      ) {
        setPasswordCorrect(false);
        setcredentialError(
          'Password must contain atleast one lowercase, uppercase, number and special character!'
        );
      } else {
        setcredentialError('');
        setPasswordCorrect(true);
      }
    };
  
    //validate name
    const validateName = () => {
      if (name.length < 4) {
        setNameValidated(false);
        setNameCorrect(false);
        setcredentialError('Name must be atleast 4 characters long!');
      } else {
        setNameCorrect(true);
        if (!nameValidated) {
          setcredentialError('');
          setNameValidated(true);
        }
      }
    };
  
    //Google SignIn
    // const googleLogin = useGoogleLogin({
    //   onSuccess: async (tokenResponse) => {
    //     setLoading(true);
    //     const user = await axios
    //       .get('https://www.googleapis.com/oauth2/v3/userinfo', {
    //         headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    //       })
    //       .catch((err) => {
    //         dispatch(loginFailure());
    //         dispatch(
    //           openSnackbar({
    //             message: err.message,
    //             severity: 'error',
    //           })
    //         );
    //       });
  
    //     googleSignIn({
    //       name: user.data.name,
    //       email: user.data.email,
    //       img: user.data.picture,
    //     }).then((res) => {
    //       console.log(res);
    //       if (res.status === 200) {
    //         dispatch(loginSuccess(res.data));
    //         dispatch(closeSignin());
    //         setSignUpOpen(false);
    //         dispatch(
    //           openSnackbar({
    //             message: 'Logged In Successfully',
    //             severity: 'success',
    //           })
    //         );
  
    //         setLoading(false);
    //       } else {
    //         dispatch(loginFailure(res.data));
    //         dispatch(
    //           openSnackbar({
    //             message: res.data.message,
    //             severity: 'error',
    //           })
    //         );
    //         setLoading(false);
    //       }
    //     });
    //   },
    //   onError: (errorResponse) => {
    //     dispatch(loginFailure());
    //     dispatch(
    //       openSnackbar({
    //         message: errorResponse.error,
    //         severity: 'error',
    //       })
    //     );
    //     setLoading(false);
    //   },
    // });
  
    const theme = useTheme();
    //ssetSignInOpen(false)
    return (
      <Modal open={true} onClose={() => dispatch(closeSignin())}>
        <Container>
          <Wrapper>
            <CloseRounded
              style={{
                position: 'absolute',
                top: '24px',
                right: '30px',
                cursor: 'pointer',
                color: 'inherit',
              }}
              onClick={() => setSignUpOpen(false)}
            />
            {!otpSent ? (
              <>
                <Title>{t('signup')}</Title>
                <KakaoLogin
                  token={kakaoClientId}
                  onSuccess={handleKakaoSuccess}
                  onFail={handleKakaoFail}
                  render={({ onClick }) => (
                    <OutlinedBox
                      googleButton={true}
                      onClick={onClick}
                      style={{
                        margin: '24px',
                        cursor: 'pointer',
                        background: '#FEE500',
                        color: '#000000',
                      }}
                    >
                      <Image src={LogoIcon} />
                      {t('signinwithkakao')}
                    </OutlinedBox>
                  )}
                />
                {/* <OutlinedBox
                  googleButton={TroubleshootRounded}
                  style={{ margin: '24px' }}
                  onClick={() => googleLogin()}
                >
                  {Loading ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : (
                    <>
                      <GoogleIcon src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png?20210618182606' />
                      Sign In with Google
                    </>
                  )}
                </OutlinedBox> */}
                <Divider>
                  <Line />
                  or
                  <Line />
                </Divider>
                <OutlinedBox style={{ marginTop: '24px' }}>
                  <Person
                    sx={{ fontSize: '20px' }}
                    style={{ paddingRight: '12px' }}
                  />
                  <TextInput
                    placeholder={t('fullname')}
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                  />
                </OutlinedBox>
                <OutlinedBox>
                  <EmailRounded
                    sx={{ fontSize: '20px' }}
                    style={{ paddingRight: '12px' }}
                  />
                  <TextInput
                    placeholder={t('emailid')}
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </OutlinedBox>
                <Error error={emailError}>{emailError}</Error>
                <OutlinedBox>
                  <PasswordRounded
                    sx={{ fontSize: '20px' }}
                    style={{ paddingRight: '12px' }}
                  />
                  <TextInput
                    type={values.showPassword ? 'text' : 'password'}
                    placeholder={t('password')}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    color='inherit'
                    onClick={() =>
                      setValues({ ...values, showPassword: !values.showPassword })
                    }
                  >
                    {values.showPassword ? (
                      <Visibility sx={{ fontSize: '20px' }} />
                    ) : (
                      <VisibilityOff sx={{ fontSize: '20px' }} />
                    )}
                  </IconButton>
                </OutlinedBox>
                <Error error={credentialError}>{credentialError}</Error>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: '6px' }}
                  onClick={handleSignUp}
                >
                  {Loading ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : (
                    t('createaccount')
                  )}
                </OutlinedBox>
              </>
            ) : (
              <OTP
                email={email}
                name={name}
                otpVerified={otpVerified}
                setOtpVerified={setOtpVerified}
              />
            )}
            <LoginText>
              {t('alreadyhaveanaccount')}
              <Span
                onClick={() => {
                  setSignUpOpen(false);
                  dispatch(openSignin());
                }}
                style={{
                  fontWeight: '500',
                  marginLeft: '6px',
                  cursor: 'pointer',
                }}
              >
                {t('signin')}
              </Span>
            </LoginText>
          </Wrapper>
        </Container>
      </Modal>
    );
  };
  
  export default SignUp;

  
  import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';
import { closeSnackbar } from '../redux/snackbarSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const ToastMessage = ({ message, severity, open }) => {
  const dispatch = useDispatch();
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => dispatch(closeSnackbar())}
    >
      <Alert
        onClose={() => dispatch(closeSnackbar())}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastMessage;



import * as React from 'react';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';

const SearchedCard = styled(Link)`
  width: 500px;
  display: flex;
  flex-direction: column;
  padding: 18px 18px 30px 18px;
  border-radius: 6px;
  gap: 12px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  @media (max-width: 768px) {
    width: 290px;
  }
`;
const PodcastImage = styled.img`
  object-fit: cover;
  width: 50%;
  border-radius: 6px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.3);
`;
const PodcastTitle = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: -webkit-box;
  font-size: 24px;
  font-weight: 520;
`;
const UploadInfo = styled.div`
  display: flex;
  width: 80%;
  gap: 12px;
`;
const Time = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (max-width: 560px) {
    font-size: 10px;
  }
`;
const CreatorName = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (max-width: 560px) {
    font-size: 10px;
  }
`;
const Description = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  display: -webkit-box;
  max-width: 100%;
  font-size: 14px;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TopResult = ({ podcast }) => {
  return (
    <SearchedCard to={`/podcast/${podcast?._id}`}>
      <PodcastImage src={podcast?.thumbnail} />
      <PodcastTitle>{podcast?.name}</PodcastTitle>
      <UploadInfo>
        <Time>• {podcast.views} Views</Time>
        <Time>• {format(podcast?.createdAt)}</Time>
        <CreatorName style={{ marginLeft: '18px' }}>
          {podcast?.creator.name}
        </CreatorName>
      </UploadInfo>
      <Description>{podcast?.desc}</Description>
    </SearchedCard>
  );
};

export default TopResult;


import {
    BackupRounded,
    CloseRounded,
    CloudDone,
    CloudDoneRounded,
    Create,
  } from '@mui/icons-material';
  import {
    CircularProgress,
    IconButton,
    LinearProgress,
    Modal,
  } from '@mui/material';
  import React, { useEffect } from 'react';
  import styled from 'styled-components';
  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage';
  import app from '../firebase';
  import ImageSelector from './ImageSelector';
  import { useDispatch } from 'react-redux';
  import { openSnackbar } from '../redux/snackbarSlice';
  import { createPodcast } from '../api';
  import { Category } from '../utils/Data';
  
  const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    display: flex;
    align-items: top;
    justify-content: center;
    overflow-y: scroll;
  `;
  
  const Wrapper = styled.div`
    max-width: 500px;
    width: 100%;
    border-radius: 16px;
    margin: 50px 20px;
    height: min-content;
    background-color: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
  `;
  
  const Title = styled.div`
    font-size: 22px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
    margin: 12px 20px;
  `;
  
  const TextInput = styled.input`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const Desc = styled.textarea`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    padding: 10px 0px;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const Label = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary + 80};
    margin: 12px 20px 0px 20px;
  `;
  
  const OutlinedBox = styled.div`
    min-height: 48px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.text_secondary};
    color: ${({ theme }) => theme.text_secondary};
    ${({ googleButton, theme }) =>
      googleButton &&
      `
      user-select: none; 
    gap: 16px;`}
    ${({ button, theme }) =>
      button &&
      `
      user-select: none; 
    border: none;
      font-weight: 600;
      font-size: 16px;
      background: ${theme.button};
      color:'${theme.bg}';`}
      ${({ activeButton, theme }) =>
      activeButton &&
      `
      user-select: none; 
    border: none;
      background: ${theme.primary};
      color: white;`}
    margin: 3px 20px;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 14px;
  `;
  
  const Select = styled.select`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const Option = styled.option`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.card};
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const ButtonContainer = styled.div`
    display: flex;
    gap: 0px;
    margin: 6px 20px 20px 20px;
    align-items: center;
    gap: 12px;
  `;
  
  const FileUpload = styled.label`
    display: flex;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 16px 20px 3px 20px;
    border: 1px dashed ${({ theme }) => theme.text_secondary};
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    color: ${({ theme }) => theme.text_secondary};
    &:hover {
      background-color: ${({ theme }) => theme.text_secondary + 20};
    }
  `;
  
  const File = styled.input`
    display: none;
  `;
  
  const Uploading = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
  `;
  
  const Upload = ({ setUploadOpen }) => {
    const [podcast, setPodcast] = React.useState({
      name: '',
      desc: '',
      thumbnail: '',
      tags: [],
      category: '',
      type: 'audio',
      episodes: [
        {
          name: '',
          desc: '',
          type: 'audio',
          file: '',
        },
      ],
    });
    const [showEpisode, setShowEpisode] = React.useState(false);
    const [disabled, setDisabled] = React.useState(true);
    const [backDisabled, setBackDisabled] = React.useState(false);
    const [createDisabled, setCreateDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
  
    const dispatch = useDispatch();
  
    const token = localStorage.getItem('podstreamtoken');
  
    const goToAddEpisodes = () => {
      setShowEpisode(true);
    };
  
    const goToPodcast = () => {
      setShowEpisode(false);
    };
  
    useEffect(() => {
      if (podcast === null) {
        setDisabled(true);
        setPodcast({
          name: '',
          desc: '',
          thumbnail: '',
          tags: [],
          episodes: [
            {
              name: '',
              desc: '',
              type: 'audio',
              file: '',
            },
          ],
        });
      } else {
        if (podcast.name === '' && podcast.desc === '') {
          setDisabled(true);
        } else {
          setDisabled(false);
        }
      }
    }, [podcast]);
  
    const uploadFile = (file, index) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          podcast.episodes[index].file.uploadProgress = Math.round(progress);
          setPodcast({ ...podcast, episodes: podcast.episodes });
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const newEpisodes = podcast.episodes;
            newEpisodes[index].file = downloadURL;
            setPodcast({ ...podcast, episodes: newEpisodes });
          });
        }
      );
    };
  
    const createpodcast = async () => {
      console.log(podcast);
      setLoading(true);
      await createPodcast(podcast, token)
        .then((res) => {
          console.log(res);
          setDisabled(true);
          setBackDisabled(true);
          setUploadOpen(false);
          setLoading(false);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Podcast created successfully',
              severity: 'success',
            })
          );
        })
        .catch((err) => {
          setDisabled(false);
          setBackDisabled(false);
          setLoading(false);
          console.log(err);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Error creating podcast',
              severity: 'error',
            })
          );
        });
    };
  
    useEffect(() => {
      if (
        podcast.episodes.length > 0 &&
        podcast.episodes.every(
          (episode) =>
            episode.file !== '' &&
            episode.name !== '' &&
            episode.desc !== '' &&
            podcast.name !== '' &&
            podcast.desc !== '' &&
            podcast.tags !== '' &&
            podcast.image !== '' &&
            podcast.image !== undefined &&
            podcast.image !== null
        )
      ) {
        if (podcast.episodes.every((episode) => episode.file.name === undefined))
          setCreateDisabled(false);
        else setCreateDisabled(true);
      }
    }, [podcast]);
  
    return (
      <Modal open={true} onClose={() => setUploadOpen(false)}>
        <Container>
          <Wrapper>
            <CloseRounded
              style={{
                position: 'absolute',
                top: '24px',
                right: '30px',
                cursor: 'pointer',
              }}
              onClick={() => setUploadOpen(false)}
            />
            <Title>Upload Podcast</Title>
            {!showEpisode ? (
              <>
                <Label>Podcast Details:</Label>
  
                <ImageSelector podcast={podcast} setPodcast={setPodcast} />
                <OutlinedBox style={{ marginTop: '12px' }}>
                  <TextInput
                    placeholder='Podcast Name*'
                    type='text'
                    value={podcast?.name}
                    onChange={(e) =>
                      setPodcast({ ...podcast, name: e.target.value })
                    }
                  />
                </OutlinedBox>
                <OutlinedBox style={{ marginTop: '6px' }}>
                  <Desc
                    placeholder='Podcast Description* '
                    name='desc'
                    rows={5}
                    value={podcast?.desc}
                    onChange={(e) =>
                      setPodcast({ ...podcast, desc: e.target.value })
                    }
                  />
                </OutlinedBox>
                <OutlinedBox style={{ marginTop: '6px' }}>
                  <Desc
                    placeholder='Tags seperate by ,'
                    name='tags'
                    rows={4}
                    value={podcast?.tags}
                    onChange={(e) =>
                      setPodcast({ ...podcast, tags: e.target.value.split(',') })
                    }
                  />
                </OutlinedBox>
                <div
                  style={{
                    display: 'flex',
                    gap: '0px',
                    width: '100%',
                    gap: '6px',
                  }}
                >
                  <OutlinedBox
                    style={{
                      marginTop: '6px',
                      width: '100%',
                      marginRight: '0px',
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        setPodcast({ ...podcast, type: e.target.value })
                      }
                    >
                      <Option value='audio'>Audio</Option>
                      <Option value='video'>Video</Option>
                    </Select>
                  </OutlinedBox>
                  <OutlinedBox
                    style={{ marginTop: '6px', width: '100%', marginLeft: '0px' }}
                  >
                    <Select
                      onChange={(e) =>
                        setPodcast({ ...podcast, category: e.target.value })
                      }
                    >
                      <Option value={Category[0].name} selected disabled hidden>
                        Select Category
                      </Option>
                      {Category.map((category) => (
                        <Option value={category.name}>{category.name}</Option>
                      ))}
                    </Select>
                  </OutlinedBox>
                </div>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: '22px', marginBottom: '18px' }}
                  onClick={() => {
                    !disabled && goToAddEpisodes();
                  }}
                >
                  Next
                </OutlinedBox>
              </>
            ) : (
              <>
                <Label>Episode Details:</Label>
                {podcast.episodes.map((episode, index) => (
                  <>
                    <FileUpload for={'fileField' + index}>
                      {podcast.episodes[index].file === '' ? (
                        <Uploading>
                          <BackupRounded />
                          Select Audio / Video
                        </Uploading>
                      ) : (
                        <Uploading>
                          {podcast.episodes[index].file.name === undefined ? (
                            <div
                              style={{
                                color: 'green',
                                display: 'flex',
                                gap: '6px',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CloudDoneRounded sx={{ color: 'inherit' }} />
                              File Uploaded Successfully
                            </div>
                          ) : (
                            <>
                              File: {podcast.episodes[index].file.name}
                              <LinearProgress
                                sx={{
                                  borderRadius: '10px',
                                  height: 3,
                                  width: '100%',
                                }}
                                variant='determinate'
                                value={
                                  podcast.episodes[index].file.uploadProgress
                                }
                                color={'success'}
                              />
                              {podcast.episodes[index].file.uploadProgress}%
                              Uploaded
                            </>
                          )}
                        </Uploading>
                      )}
                    </FileUpload>
                    <File
                      style={{ marginTop: '16px' }}
                      type='file'
                      accept='file_extension|audio/*|video/*|media_type'
                      id={'fileField' + index}
                      onChange={(e) => {
                        podcast.episodes[index].file = e.target.files[0];
                        setPodcast({ ...podcast, episodes: podcast.episodes });
                        uploadFile(podcast.episodes[index].file, index);
                      }}
                    />
                    <OutlinedBox>
                      <TextInput
                        placeholder='Episode Name*'
                        type='text'
                        value={episode.name}
                        onChange={(e) => {
                          const newEpisodes = podcast.episodes;
                          newEpisodes[index].name = e.target.value;
                          setPodcast({ ...podcast, episodes: newEpisodes });
                        }}
                      />
                    </OutlinedBox>
                    <OutlinedBox style={{ marginTop: '6px' }}>
                      <Desc
                        placeholder='Episode Description* '
                        name='desc'
                        rows={5}
                        value={episode.desc}
                        onChange={(e) => {
                          const newEpisodes = podcast.episodes;
                          newEpisodes[index].desc = e.target.value;
                          setPodcast({ ...podcast, episodes: newEpisodes });
                        }}
                      />
                    </OutlinedBox>
                    <OutlinedBox
                      button={true}
                      activeButton={false}
                      style={{ marginTop: '6px', marginBottom: '12px' }}
                      onClick={() =>
                        setPodcast({
                          ...podcast,
                          episodes: podcast.episodes.filter(
                            (_, i) => i !== index
                          ),
                        })
                      }
                    >
                      Delete
                    </OutlinedBox>
                  </>
                ))}
                <OutlinedBox
                  button={true}
                  activeButton
                  style={{ marginTop: '4px', marginBottom: '18px' }}
                  onClick={() =>
                    setPodcast({
                      ...podcast,
                      episodes: [
                        ...podcast.episodes,
                        { name: '', desc: '', file: '' },
                      ],
                    })
                  }
                >
                  Add Episode
                </OutlinedBox>
  
                <ButtonContainer>
                  <OutlinedBox
                    button={true}
                    activeButton={false}
                    style={{ marginTop: '6px', width: '100%', margin: 0 }}
                    onClick={() => {
                      !backDisabled && goToPodcast();
                    }}
                  >
                    Back
                  </OutlinedBox>
                  <OutlinedBox
                    button={true}
                    activeButton={!disabled}
                    style={{ marginTop: '6px', width: '100%', margin: 0 }}
                    onClick={() => {
                      !disabled && createpodcast();
                    }}
                  >
                    {loading ? (
                      <CircularProgress color='inherit' size={20} />
                    ) : (
                      'Create'
                    )}
                  </OutlinedBox>
                </ButtonContainer>
              </>
            )}
          </Wrapper>
        </Container>
      </Modal>
    );
  };
  
  export default Upload;

  
  import {
    BackupRounded,
    CloseRounded,
    CloudDone,
    CloudDoneRounded,
    Create,
  } from '@mui/icons-material';
  import {
    CircularProgress,
    IconButton,
    LinearProgress,
    Modal,
  } from '@mui/material';
  import React, { useEffect } from 'react';
  import styled from 'styled-components';
  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage';
  import app from '../firebase';
  import ImageSelector from './ImageSelector';
  import { useDispatch } from 'react-redux';
  import { openSnackbar } from '../redux/snackbarSlice';
  import { createPodcast } from '../api';
  import { Category } from '../utils/Data';
  
  import s3 from '../config/aws-config';
  
  import { useTranslation } from 'react-i18next';
  
  const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    display: flex;
    align-items: top;
    justify-content: center;
    overflow-y: scroll;
  `;
  
  const Wrapper = styled.div`
    max-width: 500px;
    width: 100%;
    border-radius: 16px;
    margin: 50px 20px;
    height: min-content;
    background-color: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
  `;
  
  const Title = styled.div`
    font-size: 22px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
    margin: 12px 20px;
  `;
  
  const TextInput = styled.input`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const Desc = styled.textarea`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    padding: 10px 0px;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const Label = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary + 80};
    margin: 12px 20px 0px 20px;
  `;
  
  const OutlinedBox = styled.div`
    min-height: 48px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.text_secondary};
    color: ${({ theme }) => theme.text_secondary};
    ${({ googleButton, theme }) =>
      googleButton &&
      `
      user-select: none; 
    gap: 16px;`}
    ${({ button, theme }) =>
      button &&
      `
      user-select: none; 
    border: none;
      font-weight: 600;
      font-size: 16px;
      background: ${theme.button};
      color:'${theme.bg}';`}
      ${({ activeButton, theme }) =>
      activeButton &&
      `
      user-select: none; 
    border: none;
      background: ${theme.primary};
      color: white;`}
    margin: 3px 20px;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 14px;
  `;
  
  const Select = styled.select`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const Option = styled.option`
    width: 100%;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.card};
    outline: none;
    color: ${({ theme }) => theme.text_secondary};
  `;
  
  const ButtonContainer = styled.div`
    display: flex;
    gap: 0px;
    margin: 6px 20px 20px 20px;
    align-items: center;
    gap: 12px;
  `;
  
  const FileUpload = styled.label`
    display: flex;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 16px 20px 3px 20px;
    border: 1px dashed ${({ theme }) => theme.text_secondary};
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    color: ${({ theme }) => theme.text_secondary};
    &:hover {
      background-color: ${({ theme }) => theme.text_secondary + 20};
    }
  `;
  
  const File = styled.input`
    display: none;
  `;
  
  const Uploading = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
  `;
  
  const Upload = ({ setUploadOpen }) => {
    const [podcast, setPodcast] = React.useState({
      name: '',
      desc: '',
      thumbnail: '',
      tags: [],
      category: '',
      type: 'audio',
      episodes: [
        {
          name: '',
          desc: '',
          type: 'audio',
          file: '',
        },
      ],
    });
    const [showEpisode, setShowEpisode] = React.useState(false);
    const [disabled, setDisabled] = React.useState(true);
    const [backDisabled, setBackDisabled] = React.useState(false);
    const [createDisabled, setCreateDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
  
    const dispatch = useDispatch();
  
    const { t } = useTranslation();
  
    const token = localStorage.getItem('podstreamtoken');
  
    const goToAddEpisodes = () => {
      setShowEpisode(true);
    };
  
    const goToPodcast = () => {
      setShowEpisode(false);
    };
  
    useEffect(() => {
      if (podcast === null) {
        setDisabled(true);
        setPodcast({
          name: '',
          desc: '',
          thumbnail: '',
          tags: [],
          episodes: [
            {
              name: '',
              desc: '',
              type: 'audio',
              file: '',
            },
          ],
        });
      } else {
        if (podcast.name === '' && podcast.desc === '') {
          setDisabled(true);
        } else {
          setDisabled(false);
        }
      }
    }, [podcast]);
  
    // const uploadFile = (file, index) => {
    //   const storage = getStorage(app);
    //   const fileName = new Date().getTime() + file.name;
    //   const storageRef = ref(storage, fileName);
    //   const uploadTask = uploadBytesResumable(storageRef, file);
  
    //   uploadTask.on(
    //     'state_changed',
    //     (snapshot) => {
    //       const progress =
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       podcast.episodes[index].file.uploadProgress = Math.round(progress);
    //       setPodcast({ ...podcast, episodes: podcast.episodes });
    //       switch (snapshot.state) {
    //         case 'paused':
    //           console.log('Upload is paused');
    //           break;
    //         case 'running':
    //           console.log('Upload is running');
    //           break;
    //         default:
    //           break;
    //       }
    //     },
    //     (error) => {},
    //     () => {
    //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //         const newEpisodes = podcast.episodes;
    //         newEpisodes[index].file = downloadURL;
    //         setPodcast({ ...podcast, episodes: newEpisodes });
    //       });
    //     }
    //   );
    // };
  
    // const uploadFile = (file, index) => {
    //   const fileName = `${new Date().getTime()}_${file.name}`;
    //   const params = {
    //     Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 bucket name
    //     Key: fileName, // File name you want to save as in S3
    //     Body: file,
    //     ContentType: file.type,
    //   };
  
    //   const upload = s3.upload(params);
  
    //   upload.on('httpUploadProgress', (event) => {
    //     const progress = Math.round((event.loaded / event.total) * 100);
    //     podcast.episodes[index].file.uploadProgress = progress;
    //     setPodcast({ ...podcast, episodes: podcast.episodes });
    //   });
  
    //   upload.send((err, data) => {
    //     if (err) {
    //       console.error('There was an error uploading your file: ', err);
    //       return;
    //     }
    //     const newEpisodes = podcast.episodes;
    //     newEpisodes[index].file = data.Location; // S3 file URL
    //     setPodcast({ ...podcast, episodes: newEpisodes });
    //   });
    // };
  
    const uploadFile = (file, index) => {
      const fileName = `${new Date().getTime()}_${file.name}`;
      const bucketName = process.env.REACT_APP_AWS_S3_BUCKET_NAME;
  
      console.log('Bucket Name:', bucketName); // Debug line
  
      const params = {
        Bucket: bucketName, // Ensure this is not undefined or empty
        Key: fileName, // File name you want to save as in S3
        Body: file,
        ContentType: file.type,
      };
  
      const upload = s3.upload(params);
  
      upload.on('httpUploadProgress', (event) => {
        const progress = Math.round((event.loaded / event.total) * 100);
        podcast.episodes[index].file.uploadProgress = progress;
        setPodcast({ ...podcast, episodes: podcast.episodes });
      });
  
      upload.send((err, data) => {
        if (err) {
          console.error('There was an error uploading your file: ', err);
          return;
        }
        const newEpisodes = podcast.episodes;
        newEpisodes[index].file = data.Location; // S3 file URL
        setPodcast({ ...podcast, episodes: newEpisodes });
      });
    };
  
    const createpodcast = async () => {
      console.log(podcast);
      setLoading(true);
      await createPodcast(podcast, token)
        .then((res) => {
          console.log(res);
          setDisabled(true);
          setBackDisabled(true);
          setUploadOpen(false);
          setLoading(false);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Podcast created successfully',
              severity: 'success',
            })
          );
        })
        .catch((err) => {
          setDisabled(false);
          setBackDisabled(false);
          setLoading(false);
          console.log(err);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Error creating podcast',
              severity: 'error',
            })
          );
        });
    };
  
    useEffect(() => {
      console.log('b' + process.env.REACT_APP_AWS_S3_BUCKET_NAME);
      if (
        podcast.episodes.length > 0 &&
        podcast.episodes.every(
          (episode) =>
            episode.file !== '' &&
            episode.name !== '' &&
            episode.desc !== '' &&
            podcast.name !== '' &&
            podcast.desc !== '' &&
            podcast.tags !== '' &&
            podcast.image !== '' &&
            podcast.image !== undefined &&
            podcast.image !== null
        )
      ) {
        if (podcast.episodes.every((episode) => episode.file.name === undefined))
          setCreateDisabled(false);
        else setCreateDisabled(true);
      }
    }, [podcast]);
  
    return (
      <Modal open={true} onClose={() => setUploadOpen(false)}>
        <Container>
          <Wrapper>
            <CloseRounded
              style={{
                position: 'absolute',
                top: '24px',
                right: '30px',
                cursor: 'pointer',
              }}
              onClick={() => setUploadOpen(false)}
            />
            <Title>{t('uploadpodcast')}</Title>
            {!showEpisode ? (
              <>
                <Label>Podcast Details:</Label>
  
                <ImageSelector podcast={podcast} setPodcast={setPodcast} />
                <OutlinedBox style={{ marginTop: '12px' }}>
                  <TextInput
                    placeholder={t('podcastname')}
                    type='text'
                    value={podcast?.name}
                    onChange={(e) =>
                      setPodcast({ ...podcast, name: e.target.value })
                    }
                  />
                </OutlinedBox>
                <OutlinedBox style={{ marginTop: '6px' }}>
                  <Desc
                    placeholder={t('podcastdescription')}
                    name='desc'
                    rows={5}
                    value={podcast?.desc}
                    onChange={(e) =>
                      setPodcast({ ...podcast, desc: e.target.value })
                    }
                  />
                </OutlinedBox>
                <OutlinedBox style={{ marginTop: '6px' }}>
                  <Desc
                    placeholder={t('tagsseparated')}
                    name='tags'
                    rows={4}
                    value={podcast?.tags}
                    onChange={(e) =>
                      setPodcast({ ...podcast, tags: e.target.value.split(',') })
                    }
                  />
                </OutlinedBox>
                <div
                  style={{
                    display: 'flex',
                    gap: '0px',
                    width: '100%',
                    gap: '6px',
                  }}
                >
                  <OutlinedBox
                    style={{
                      marginTop: '6px',
                      width: '100%',
                      marginRight: '0px',
                    }}
                  >
                    <Select
                      onChange={(e) =>
                        setPodcast({ ...podcast, type: e.target.value })
                      }
                    >
                      <Option value='audio'>Audio</Option>
                      <Option value='video'>Video</Option>
                    </Select>
                  </OutlinedBox>
                  <OutlinedBox
                    style={{ marginTop: '6px', width: '100%', marginLeft: '0px' }}
                  >
                    <Select
                      onChange={(e) =>
                        setPodcast({ ...podcast, category: e.target.value })
                      }
                    >
                      <Option value={Category[0].name} selected disabled hidden>
                        {t('selectcategory')}
                      </Option>
                      {Category.map((category) => (
                        <Option value={category.name}>
                          {t(category.name.toLowerCase())}{' '}
                        </Option>
                      ))}
                    </Select>
                  </OutlinedBox>
                </div>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: '22px', marginBottom: '18px' }}
                  onClick={() => {
                    !disabled && goToAddEpisodes();
                  }}
                >
                  Next
                </OutlinedBox>
              </>
            ) : (
              <>
                <Label>Episode Details:</Label>
                {podcast.episodes.map((episode, index) => (
                  <>
                    <FileUpload for={'fileField' + index}>
                      {podcast.episodes[index].file === '' ? (
                        <Uploading>
                          <BackupRounded />
                          Select Audio / Video
                        </Uploading>
                      ) : (
                        <Uploading>
                          {podcast.episodes[index].file.name === undefined ? (
                            <div
                              style={{
                                color: 'green',
                                display: 'flex',
                                gap: '6px',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CloudDoneRounded sx={{ color: 'inherit' }} />
                              File Uploaded Successfully
                            </div>
                          ) : (
                            <>
                              File: {podcast.episodes[index].file.name}
                              <LinearProgress
                                sx={{
                                  borderRadius: '10px',
                                  height: 3,
                                  width: '100%',
                                }}
                                variant='determinate'
                                value={
                                  podcast.episodes[index].file.uploadProgress
                                }
                                color={'success'}
                              />
                              {podcast.episodes[index].file.uploadProgress}%
                              Uploaded
                            </>
                          )}
                        </Uploading>
                      )}
                    </FileUpload>
                    <File
                      style={{ marginTop: '16px' }}
                      type='file'
                      accept='file_extension|audio/*|video/*|media_type'
                      id={'fileField' + index}
                      onChange={(e) => {
                        podcast.episodes[index].file = e.target.files[0];
                        setPodcast({ ...podcast, episodes: podcast.episodes });
                        uploadFile(podcast.episodes[index].file, index);
                      }}
                    />
                    <OutlinedBox>
                      <TextInput
                        placeholder={t('episodename')}
                        type='text'
                        value={episode.name}
                        onChange={(e) => {
                          const newEpisodes = podcast.episodes;
                          newEpisodes[index].name = e.target.value;
                          setPodcast({ ...podcast, episodes: newEpisodes });
                        }}
                      />
                    </OutlinedBox>
                    <OutlinedBox style={{ marginTop: '6px' }}>
                      <Desc
                        placeholder={t('episodedescription')}
                        name='desc'
                        rows={5}
                        value={episode.desc}
                        onChange={(e) => {
                          const newEpisodes = podcast.episodes;
                          newEpisodes[index].desc = e.target.value;
                          setPodcast({ ...podcast, episodes: newEpisodes });
                        }}
                      />
                    </OutlinedBox>
                    <OutlinedBox
                      button={true}
                      activeButton={false}
                      style={{ marginTop: '6px', marginBottom: '12px' }}
                      onClick={() =>
                        setPodcast({
                          ...podcast,
                          episodes: podcast.episodes.filter(
                            (_, i) => i !== index
                          ),
                        })
                      }
                    >
                      {t('delete')}
                    </OutlinedBox>
                  </>
                ))}
                <OutlinedBox
                  button={true}
                  activeButton
                  style={{ marginTop: '4px', marginBottom: '18px' }}
                  onClick={() =>
                    setPodcast({
                      ...podcast,
                      episodes: [
                        ...podcast.episodes,
                        { name: '', desc: '', file: '' },
                      ],
                    })
                  }
                >
                  {t('addepisode')}
                </OutlinedBox>
  
                <ButtonContainer>
                  <OutlinedBox
                    button={true}
                    activeButton={false}
                    style={{ marginTop: '6px', width: '100%', margin: 0 }}
                    onClick={() => {
                      !backDisabled && goToPodcast();
                    }}
                  >
                    {t('back')}
                  </OutlinedBox>
                  <OutlinedBox
                    button={true}
                    activeButton={!disabled}
                    style={{ marginTop: '6px', width: '100%', margin: 0 }}
                    onClick={() => {
                      !disabled && createpodcast();
                    }}
                  >
                    {loading ? (
                      <CircularProgress color='inherit' size={20} />
                    ) : (
                      t('create')
                    )}
                  </OutlinedBox>
                </ButtonContainer>
              </>
            )}
          </Wrapper>
        </Container>
      </Modal>
    );
  };
  
  export default Upload;

  

  import { CloseRounded } from '@mui/icons-material';
import { Modal } from '@mui/material';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useDispatch } from 'react-redux';
import {
  closePlayer,
  openPlayer,
  setCurrentTime,
} from '../redux/audioplayerSlice';
import { openSnackbar } from '../redux/snackbarSlice';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: top;
  justify-content: center;
  overflow-y: scroll;
  transition: all 0.5s ease;
`;

const Wrapper = styled.div`
  max-width: 800px;
  width: 100%;
  border-radius: 16px;
  margin: 50px 20px;
  height: min-content;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 12px 20px;
`;

const Videoplayer = styled.video`
  height: 100%;
  max-height: 500px;
  border-radius: 16px;
  margin: 0px 20px;
  object-fit: cover;
  margin-top: 30px;
`;

const EpisodeName = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 12px 20px 0px 20px;
`;
const EpisodeDescription = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  margin: 6px 20px 20px 20px;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px 20px 20px 20px;
  gap: 14px;
`;

const Btn = styled.div`
  border: none;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text_primary};
  padding: 14px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  &:hover {
    background-color: ${({ theme }) => theme.card_hover};
  }
`;

const VideoPlayer = ({ episode, podid, currenttime, index }) => {
  const dispatch = useDispatch();
  const videoref = useRef(null);

  const handleTimeUpdate = () => {
    const currentTime = videoref.current.currentTime;
    dispatch(
      setCurrentTime({
        currenttime: currentTime,
      })
    );
  };

  const goToNextPodcast = () => {
    //from the podid and index, get the next podcast
    //dispatch the next podcast
    if (podid.episodes.length === index + 1) {
      dispatch(
        openSnackbar({
          message: 'This is the last episode',
          severity: 'info',
        })
      );
      return;
    }
    dispatch(closePlayer());
    setTimeout(() => {
      dispatch(
        openPlayer({
          type: 'video',
          podid: podid,
          index: index + 1,
          currenttime: 0,
          episode: podid.episodes[index + 1],
        })
      );
    }, 10);
  };

  const goToPreviousPodcast = () => {
    //from the podid and index, get the next podcast
    //dispatch the next podcast
    if (index === 0) {
      dispatch(
        openSnackbar({
          message: 'This is the first episode',
          severity: 'info',
        })
      );
      return;
    }
    dispatch(closePlayer());
    setTimeout(() => {
      dispatch(
        openPlayer({
          type: 'video',
          podid: podid,
          index: index - 1,
          currenttime: 0,
          episode: podid.episodes[index - 1],
        })
      );
    }, 10);
  };

  return (
    <Modal open={true} onClose={() => dispatch(closePlayer())}>
      <Container>
        <Wrapper>
          <CloseRounded
            style={{
              position: 'absolute',
              top: '12px',
              right: '20px',
              cursor: 'pointer',
            }}
            onClick={() => {
              dispatch(closePlayer());
            }}
          />
          <Videoplayer
            controls
            ref={videoref}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => goToNextPodcast()}
            autoPlay
            onPlay={() => {
              videoref.current.currentTime = currenttime;
            }}
          >
            <source src={episode.file} type='video/mp4' />
            <source src={episode.file} type='video/webm' />
            <source src={episode.file} type='video/ogg' />
            Your browser does not support the video tag.
          </Videoplayer>
          <EpisodeName>{episode.name}</EpisodeName>
          <EpisodeDescription>{episode.desc}</EpisodeDescription>
          <BtnContainer>
            <Btn onClick={() => goToPreviousPodcast()}>Previous</Btn>
            <Btn onClick={() => goToNextPodcast()}>Next</Btn>
          </BtnContainer>
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default VideoPlayer;



// /pages
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getMostPopularPodcast } from '../api/index';
import { getPodcastByCategory } from '../api';
import { PodcastCard } from '../components/PodcastCard.jsx';
import { getUsers } from '../api/index';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DashboardMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;
const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${({ box, theme }) =>
    box &&
    `
background-color: ${theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`}
  background-color: ${({ theme }) => theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @maedia (max-width: 768px) {
    font-size: 18px;
  }
`;
const Span = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 14px;
  }
  color: ${({ theme }) => theme.primary};
  &:hover {
    transition: 0.2s ease-in-out;
  }
`;
const Podcasts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 6px;
  //center the items if only one item present
  @media (max-width: 550px) {
    justify-content: center;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

// drag right
const ItemsScrollContainerWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${({ theme }) => theme.scroll_primary_bg};
  color: ${({ theme }) => theme.scroll_primary_color};

  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.55;
  width: 55px;
  height: 55px;

  &:hover {
    ${'' /* background: rgba(0, 0, 0, 0.7); */}
    opacity: 1;
  }

  ${({ direction }) =>
    direction === 'left' ? 'left: 0;' : 'right: 0;'}/* Positions the button */
`;

// NEW SCROLL STYLE -

const PodcastsScroll = styled.div`
  display: flex;
  ${'' /* flex-wrap: wrap; */}
  gap: 14px;
  padding: 18px 6px;

  overflow-x: auto; /* Enables horizontal scrolling */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Hides scrollbar on Firefox */
  -ms-overflow-style: none; /* Hides scrollbar on IE/Edge */

  &::-webkit-scrollbar {
    display: none; /* Hides scrollbar on Chrome/Safari */
  }
`;

const FilterContainerScroll = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CategorySection = styled.section`
  margin-bottom: 40px;
`;

const DraggableItemsScrollContainer = ({ children }) => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
  };

  return (
    <ItemsScrollContainerWrapper>
      <ScrollButton direction='left' onClick={scrollLeft}>
        <FaChevronLeft />
      </ScrollButton>
      <PodcastsScroll ref={containerRef}>{children}</PodcastsScroll>
      <ScrollButton direction='right' onClick={scrollRight}>
        <FaChevronRight />
      </ScrollButton>
    </ItemsScrollContainerWrapper>
  );
};

const Dashboard = ({ setSignInOpen }) => {
  const [mostPopular, setMostPopular] = useState([]);
  const [user, setUser] = useState();
  const [comedy, setComedy] = useState([]);
  const [news, setNews] = useState([]);
  const [sports, setsports] = useState([]);
  const [crime, setCrime] = useState([]);
  const [loading, setLoading] = useState(false);

  //user
  const { currentUser } = useSelector((state) => state.user);

  const token = localStorage.getItem('podstreamtoken');
  const getUser = async () => {
    await getUsers(token)
      .then((res) => {
        setUser(res.data);
      })
      .then((error) => {
        console.log(error);
      });
  };

  const getPopularPodcast = async () => {
    await getMostPopularPodcast()
      .then((res) => {
        setMostPopular(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCommedyPodcasts = async () => {
    getPodcastByCategory('comedy')
      .then((res) => {
        setComedy(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getNewsPodcasts = async () => {
    getPodcastByCategory('news')
      .then((res) => {
        setNews(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getSportsPodcasts = async () => {
    getPodcastByCategory('sports')
      .then((res) => {
        setsports(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getCrimePodcasts = async () => {
    getPodcastByCategory('crime')
      .then((res) => {
        setCrime(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getallData = async () => {
    setLoading(true);
    if (currentUser) {
      setLoading(true);
      await getUser();
    }
    await getPopularPodcast();
    await getCommedyPodcasts();
    await getNewsPodcasts();
    await getCommedyPodcasts();
    await getCrimePodcasts();
    await getSportsPodcasts();
    setLoading(false);
  };

  const { t } = useTranslation();

  useEffect(() => {
    getallData();
  }, [currentUser]);

  return (
    <DashboardMain>
      {loading ? (
        <Loader>
          <CircularProgress />
        </Loader>
      ) : (
        <>
          {currentUser && user?.podcasts?.length > 0 && (
            <CategorySection>
              <FilterContainerScroll box={true}>
                <Topic>
                  {t('youruploads')}
                  <Link to={`/profile`} style={{ textDecoration: 'none' }}>
                    <Span>{t('showall')}</Span>
                  </Link>
                </Topic>
                <DraggableItemsScrollContainer>
                  {user?.podcasts.slice(0, 10).map((podcast) => (
                    <PodcastCard
                      podcast={podcast}
                      user={user}
                      setSignInOpen={setSignInOpen}
                    />
                  ))}
                </DraggableItemsScrollContainer>
              </FilterContainerScroll>
            </CategorySection>
          )}

          <CategorySection>
            <FilterContainerScroll>
              <Topic>
                {t('mostpopular')}
                <Link
                  to={`/showpodcasts/mostpopular`}
                  style={{ textDecoration: 'none' }}
                >
                  <Span>{t('showall')}</Span>
                </Link>
              </Topic>
              <DraggableItemsScrollContainer>
                {mostPopular.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </DraggableItemsScrollContainer>
            </FilterContainerScroll>
          </CategorySection>

          {/* 

          <FilterContainer>
            <Topic>
              {t('mostpopular')}
              <Link
                to={`/showpodcasts/mostpopular`}
                style={{ textDecoration: 'none' }}
              >
                <Span>{t('showall')}</Span>
              </Link>
            </Topic>
            <Podcasts>
              {mostPopular.slice(0, 10).map((podcast) => (
                <PodcastCard
                  podcast={podcast}
                  user={user}
                  setSignInOpen={setSignInOpen}
                />
              ))}
            </Podcasts>
          </FilterContainer> */}

          <CategorySection>
            <FilterContainerScroll>
              <Topic>
                {t('comedy')}
                <Link
                  to={`/showpodcasts/comedy`}
                  style={{ textDecoration: 'none' }}
                >
                  <Span>{t('showall')}</Span>
                </Link>
              </Topic>
              <DraggableItemsScrollContainer>
                {comedy.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </DraggableItemsScrollContainer>
            </FilterContainerScroll>
          </CategorySection>
          <CategorySection>
            <FilterContainerScroll>
              <Link
                to={`/showpodcasts/news`}
                style={{ textDecoration: 'none' }}
              >
                <Topic>
                  {t('news')}
                  <Span>{t('showall')}</Span>
                </Topic>
              </Link>
              <DraggableItemsScrollContainer>
                {news.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </DraggableItemsScrollContainer>
            </FilterContainerScroll>
          </CategorySection>
          <CategorySection>
            <FilterContainerScroll>
              <Link
                to={`/showpodcasts/crime`}
                style={{ textDecoration: 'none' }}
              >
                <Topic>
                  {t('crime')}
                  <Span>{t('showall')}</Span>
                </Topic>
              </Link>
              <DraggableItemsScrollContainer>
                {crime.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </DraggableItemsScrollContainer>
            </FilterContainerScroll>
          </CategorySection>
          <CategorySection>
            <FilterContainerScroll>
              <Link
                to={`/showpodcasts/sports`}
                style={{ textDecoration: 'none' }}
              >
                <Topic>
                  {t('sports')}
                  <Span>{t('showall')}</Span>
                </Topic>
              </Link>
              <DraggableItemsScrollContainer>
                {sports.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </DraggableItemsScrollContainer>
            </FilterContainerScroll>
          </CategorySection>
        </>
      )}
    </DashboardMain>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPodcastByCategory, getMostPopularPodcast } from '../api/index.js';
import styled from 'styled-components';
import { PodcastCard } from '../components/PodcastCard.jsx';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/snackbarSlice';
import { displayPodcastFailure } from '../redux/userSlice.jsx';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
const DisplayMain = styled.div`
  display: flex;
  padding: 30px 30px;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Podcasts = styled.div`
  ${
    '' /* display: flex;
  flex-wrap: wrap;
  height: 100%;
  gap: 10px;
  padding: 30px 0px;
  justify-content: center; */
  }
  ${
    '' /* display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  justify-items: center; */
  }
  display: grid;
  grid-template-columns: repeat(auto-fill, 230px); /* Fixed item width */
  gap: 16px;
  justify-content: center; /* Center the grid within the container */
`;
const Container = styled.div`
  ${'' /* background-color: ${({ theme }) => theme.bg}; */}
  padding: 20px;
  border-radius: 6px;
  min-height: 400px;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

const DisplayPodcasts = () => {
  const { type } = useParams();
  const [podcasts, setPodcasts] = useState([]);
  const [string, setString] = useState('');
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const mostPopular = async () => {
    await getMostPopularPodcast()
      .then((res) => {
        setPodcasts(res.data);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
      });
  };
  const getCategory = async () => {
    await getPodcastByCategory(type)
      .then((res) => {
        setPodcasts(res.data);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
      });
  };

  const getallpodcasts = async () => {
    if (type === 'mostpopular') {
      setLoading(true);
      let arr = type.split('');
      arr[0] = arr[0].toUpperCase();
      arr.splice(4, 0, ' ');
      setString(arr.join(''));
      console.log(string);
      await mostPopular();
      setLoading(false);
    } else {
      setLoading(true);
      let arr = type.split('');
      arr[0] = arr[0].toUpperCase();
      setString(arr);
      await getCategory();
      setLoading(false);
    }
  };

  useEffect(() => {
    getallpodcasts();
  }, []);
  return (
    <DisplayMain>
      <Container>
        <Topic>
          {t(
            typeof string == 'string'
              ? string.replace(/\s+/g, '').toLowerCase()
              : string.join('').replace(/\s+/g, '').toLowerCase()
          )}
        </Topic>

        {Loading ? (
          <Loader>
            <CircularProgress />
          </Loader>
        ) : (
          <Podcasts>
            {podcasts.length === 0 && <DisplayNo>No Podcasts</DisplayNo>}
            {podcasts.map((podcast) => (
              <PodcastCard podcast={podcast} />
            ))}
          </Podcasts>
        )}
      </Container>
    </DisplayMain>
  );
};

export default DisplayPodcasts;


import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PodcastCard } from '../components/PodcastCard';
import { getUsers } from '../api/index';
import { CircularProgress } from '@mui/material';

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FavouritesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 6px;
  @media (max-width: 550px) {
    justify-content: center;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

const Favourites = () => {
  const [user, setUser] = useState();
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  //user
  const { currentUser } = useSelector((state) => state.user);

  const token = localStorage.getItem('podstreamtoken');
  const getUser = async () => {
    await getUsers(token)
      .then((res) => {
        setUser(res.data);
      })
      .then((error) => {
        console.log(error);
      });
  };

  const getuser = async () => {
    if (currentUser) {
      setLoading(true);
      await getUser();
      setLoading(false);
    }
  };

  useEffect(() => {
    getuser();
  }, [currentUser]);

  return (
    <Container>
      <Topic>Favourites</Topic>
      {Loading ? (
        <Loader>
          <CircularProgress />
        </Loader>
      ) : (
        <FavouritesContainer>
          {user?.favorits?.length === 0 && <DisplayNo>No Favourites</DisplayNo>}
          {user &&
            user?.favorits.map((podcast) => (
              <PodcastCard podcast={podcast} user={user} />
            ))}
        </FavouritesContainer>
      )}
    </Container>
  );
};

export default Favourites;


import React, { useState } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CircularProgress, IconButton } from '@mui/material';
import { favoritePodcast, getPodcastById, getUsers } from '../api';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Episodecard from '../components/Episodecard';
import { openSnackbar } from '../redux/snackbarSlice';
import Avatar from '@mui/material/Avatar';
import { format } from 'timeago.js';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HeadphonesIcon from '@mui/icons-material/Headphones';

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Image = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.text_secondary};
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const Tags = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  background-color: ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_primary};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
`;

const Episodes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 22px;
  font-weight: 540;
  display: flex;
  justify-content space-between;
  align-items: center;
`;

const EpisodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Favorite = styled(IconButton)`
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 95} !important;
  color: ${({ theme }) => theme.text_primary} !important;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const Creator = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;
const CreatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const CreatorDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
const Views = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  margin-left: 20px;
`;
const Icon = styled.div`
  color: white;
  font-size: 12px;
  margin-left: 20px;
  border-radius: 50%;
  background: #9000ff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
`;

const PodcastDetails = () => {
  const { id } = useParams();
  const [favourite, setFavourite] = useState(false);
  const [podcast, setPodcast] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();

  const dispatch = useDispatch();

  const token = localStorage.getItem('podstreamtoken');
  //user
  const { currentUser } = useSelector((state) => state.user);

  const favoritpodcast = async () => {
    setLoading(true);
    if (podcast !== undefined && podcast !== null) {
      await favoritePodcast(podcast?._id, token)
        .then((res) => {
          if (res.status === 200) {
            setFavourite(!favourite);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          dispatch(
            openSnackbar({
              message: err.message,
              severity: 'error',
            })
          );
        });
    }
  };

  const getUser = async () => {
    setLoading(true);
    await getUsers(token)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .then((err) => {
        console.log(err);
        setLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
      });
  };

  const getPodcast = async () => {
    setLoading(true);
    await getPodcastById(id)
      .then((res) => {
        if (res.status === 200) {
          setPodcast(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
      });
  };

  useState(() => {
    getPodcast();
  }, [currentUser]);

  React.useEffect(() => {
    //favorits is an array of objects in which each object has a podcast id match it to the current podcast id
    if (currentUser) {
      getUser();
    }
    if (user?.favorits?.find((fav) => fav._id === podcast?._id)) {
      setFavourite(true);
    }
  }, [currentUser, podcast]);

  return (
    <Container>
      {loading ? (
        <Loader>
          <CircularProgress />
        </Loader>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Favorite onClick={() => favoritpodcast()}>
              {favourite ? (
                <FavoriteIcon
                  style={{ color: '#E30022', width: '16px', height: '16px' }}
                ></FavoriteIcon>
              ) : (
                <FavoriteIcon
                  style={{ width: '16px', height: '16px' }}
                ></FavoriteIcon>
              )}
            </Favorite>
          </div>
          <Top>
            <Image src={podcast?.thumbnail} />
            <Details>
              <Title>{podcast?.name}</Title>
              <Description>{podcast?.desc}</Description>
              <Tags>
                {podcast?.tags.map((tag) => (
                  <Tag>{tag}</Tag>
                ))}
              </Tags>
              <CreatorContainer>
                <CreatorDetails>
                  <Avatar
                    src={podcast?.creator?.img}
                    sx={{ width: '26px', height: '26px' }}
                  >
                    {podcast?.creator?.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Creator>{podcast?.creator?.name}</Creator>
                </CreatorDetails>
                <Views>• {podcast?.views} Views</Views>
                <Views>• {format(podcast?.createdAt)}</Views>
                <Icon>
                  {podcast?.type === 'audio' ? (
                    <HeadphonesIcon />
                  ) : (
                    <PlayArrowIcon />
                  )}
                </Icon>
              </CreatorContainer>
            </Details>
          </Top>
          <Episodes>
            <Topic>All Episodes</Topic>
            <EpisodeWrapper>
              {podcast?.episodes.map((episode, index) => (
                <Episodecard
                  episode={episode}
                  podid={podcast}
                  type={podcast.type}
                  user={user}
                  index={index}
                />
              ))}
            </EpisodeWrapper>
          </Episodes>
        </>
      )}
    </Container>
  );
};

export default PodcastDetails;


import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import { getUsers } from '../api/index';
import { PodcastCard } from '../components/PodcastCard.jsx';
import { useTranslation } from 'react-i18next';
const ProfileAvatar = styled.div`
  padding-left: 3rem;
  @media (max-width: 768px) {
    padding-left: 0rem;
  }
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;
const ProfileName = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 34px;
  font-weight: 500;
`;
const Profile_email = styled.div`
  color: #2b6fc2;
  font-size: 14px;
  font-weight: 400;
`;
const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${({ box, theme }) =>
    box &&
    `
background-color: ${theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`}
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Span = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  &:hover {
    transition: 0.2s ease-in-out;
  }
`;
const Podcasts = styled.div`
  ${
    '' /* display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 6px;
  @media (max-width: 550px) {
    justify-content: center;
  } */
  }
  display: grid;
  grid-template-columns: repeat(auto-fill, 230px); /* Fixed item width */
  gap: 16px;
  justify-content: center;
`;
const ProfileMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const UserDetails = styled.div`
display flex;
gap: 120px;
margin: auto;
@media (max-width: 768px) {
    width: fit-content;
    flex-direction: column; 
    gap: 20px;
    justify-content: center;
    align-items: center;
    
  }
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ButtonContainer = styled.div`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 12px;
  width: 100%;
  max-width: 70px;
  padding: 8px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const Profile = () => {
  const [user, setUser] = useState();
  const { currentUser } = useSelector((state) => state.user);
  const [name, setName] = useState('');

  const { t } = useTranslation();
  const token = localStorage.getItem('podstreamtoken');
  const getUser = async () => {
    await getUsers(token)
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (currentUser) {
      getUser();
      // setName(user?.name.split("")[0].toUpperCase());
    }
  }, [currentUser]);

  return (
    <ProfileMain>
      <UserDetails>
        <ProfileAvatar>
          <Avatar
            sx={{ height: 165, width: 165, fontSize: '24px' }}
            src={user?.img}
          >
            {user?.name.charAt(0).toUpperCase()}
          </Avatar>
        </ProfileAvatar>

        <ProfileContainer>
          <ProfileName>{name}</ProfileName>
          <Profile_email>Email: {user?.email}</Profile_email>
        </ProfileContainer>
      </UserDetails>
      {currentUser && user?.podcasts.length > 0 && (
        <FilterContainer box={true}>
          <Topic>{t('youruploads')}</Topic>
          <Podcasts>
            {user?.podcasts.map((podcast) => (
              <PodcastCard podcast={podcast} user={user} />
            ))}
          </Podcasts>
        </FilterContainer>
      )}
      {currentUser && user?.podcasts.length === 0 && (
        <FilterContainer box={true}>
          <Topic>{t('youruploads')}</Topic>
          {/* <Container>
            <ButtonContainer>Upload</ButtonContainer>
          </Container> */}
        </FilterContainer>
      )}
      <FilterContainer box={true}>
        <Topic>{t('yourfavorites')}</Topic>
        <Podcasts>
          {user &&
            user?.favorits.map((podcast) => (
              <PodcastCard podcast={podcast} user={user} />
            ))}
        </Podcasts>
      </FilterContainer>
    </ProfileMain>
  );
};

export default Profile;


import React, { useState } from 'react';
import styled from 'styled-components';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { DefaultCard } from '../components/DefaultCard.jsx';
import { Category } from '../utils/Data.js';
import { searchPodcast } from '../api/index.js';
import { PodcastCard } from '../components/PodcastCard.jsx';
import TopResult from '../components/TopResult.jsx';
import MoreResult from '../components/MoreResult.jsx';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/snackbarSlice.jsx';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SearchMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 20px 9px;
  }
`;
const Heading = styled.div`
  align-items: flex-start;
  color: ${({ theme }) => theme.text_primary};
  font-size: 22px;
  font-weight: 540;
  margin: 10px 14px;
`;
const BrowseAll = styled.div`
  ${
    '' /* display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 14px; */
  }
  display: grid;
  grid-template-columns: repeat(auto-fill, 190px); /* Fixed item width */
  gap: 16px;
  justify-content: center; /* Center the grid within the container */
  ${
    '' /* 
  @media (max-width: 700px) {
    grid-template-columns: 2fr;
  } */
  }
`;
const SearchedCards = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  padding: 14px;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    padding: 6px;
  }
`;
const Categories = styled.div`
  margin: 20px 10px;
`;
const Search_whole = styled.div`
  max-width: 700px;
  display: flex;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 30px;
  cursor: pointer;
  padding: 12px 16px;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.text_secondary};
`;
const OtherResults = styled.div`
  display: flex;
  flex-direction: column;
  height: 700px;
  overflow-y: scroll;
  overflow-x: hidden;
  gap: 6px;
  padding: 4px 4px;
  @media (max-width: 768px) {
    height: 100%;
    padding: 4px 0px;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

const Search = () => {
  const [searched, setSearched] = useState('');
  const [searchedPodcasts, setSearchedPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleChange = async (e) => {
    setSearchedPodcasts([]);
    setLoading(true);
    setSearched(e.target.value);
    await searchPodcast(e.target.value)
      .then((res) => {
        setSearchedPodcasts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
      });
    setLoading(false);
  };

  return (
    <SearchMain>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Search_whole>
          <SearchOutlinedIcon sx={{ color: 'inherit' }} />
          <input
            type='text'
            placeholder='Search Artist/Podcast'
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              background: 'inherit',
              color: 'inherit',
            }}
            value={searched}
            onChange={(e) => handleChange(e)}
          />
        </Search_whole>
      </div>
      {searched === '' ? (
        <Categories>
          <Heading>{t('browseall')}</Heading>
          <BrowseAll>
            {Category.map((category) => (
              <Link
                to={`/showpodcasts/${category.name.toLowerCase()}`}
                style={{ textDecoration: 'none' }}
              >
                <DefaultCard category={category} />
              </Link>
            ))}
          </BrowseAll>
        </Categories>
      ) : (
        <>
          {loading ? (
            <Loader>
              <CircularProgress />
            </Loader>
          ) : (
            <SearchedCards>
              {searchedPodcasts.length === 0 ? (
                <DisplayNo>No Podcasts Found</DisplayNo>
              ) : (
                <>
                  <TopResult podcast={searchedPodcasts[0]} />
                  <OtherResults>
                    {searchedPodcasts.map((podcast) => (
                      <MoreResult podcast={podcast} />
                    ))}
                  </OtherResults>
                </>
              )}
            </SearchedCards>
          )}
        </>
      )}
    </SearchMain>
  );
};

export default Search;


import { ThemeProvider } from 'styled-components';
import { useState, useEffect } from 'react';
import { darkTheme, lightTheme } from './utils/Themes.js';
import Signup from '../src/components/Signup.jsx';
import Signin from '../src/components/Signin.jsx';
import OTP from '../src/components/OTP.jsx';
import Navbar from '../src/components/Navbar.jsx';
import Menu from '../src/components/Menu.jsx';
import Dashboard from '../src/pages/Dashboard.jsx';
import ToastMessage from './components/ToastMessage.jsx';
import Search from '../src/pages/Search.jsx';
import Favourites from '../src/pages/Favourites.jsx';
import Profile from '../src/pages/Profile.jsx';
import Upload from '../src/components/Upload.jsx';
import DisplayPodcasts from '../src/pages/DisplayPodcasts.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import AudioPlayer from './components/AudioPlayer.jsx';
import VideoPlayer from './components/VideoPlayer.jsx';
import PodcastDetails from './pages/PodcastDetails.jsx';
import { closeSignin } from './redux/setSigninSlice.jsx';
import i18n from './i18n'; // Import i18n configuration

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  overflow-y: auto;
`;

const Podstream = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.bgLight};
  overflow-y: hidden;
  overflow-x: hidden;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const { openplayer, type, episode, podid, currenttime, index } = useSelector(
    (state) => state.audioplayer
  );
  const { opensi } = useSelector((state) => state.signin);
  const [SignUpOpen, setSignUpOpen] = useState(false);
  const [SignInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((response) => response.json())
      .then((data) => {
        const userCountry = data.country_code;
        if (userCountry === 'KR') {
          i18n.changeLanguage('ko');
          console.log('ko');
        } else {
          i18n.changeLanguage('en');
          console.log('en');
        }
      })
      .catch(() => i18n.changeLanguage('en'));
  }, []);

  //set the menuOpen state to false if the screen size is less than 768px
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 1110) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_KEY);
    }
  });

  useEffect(() => {
    dispatch(closeSignin());
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        {opensi && (
          <Signin setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
        )}
        {SignUpOpen && (
          <Signup setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
        )}
        {uploadOpen && <Upload setUploadOpen={setUploadOpen} />}
        {openplayer && type === 'video' && (
          <VideoPlayer
            episode={episode}
            podid={podid}
            currenttime={currenttime}
            index={index}
          />
        )}
        {openplayer && type === 'audio' && (
          <AudioPlayer
            episode={episode}
            podid={podid}
            currenttime={currenttime}
            index={index}
          />
        )}
        <Podstream>
          {menuOpen && (
            <Menu
              setMenuOpen={setMenuOpen}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setUploadOpen={setUploadOpen}
              setSignInOpen={setSignInOpen}
            />
          )}
          <Frame>
            <Navbar
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setSignInOpen={setSignInOpen}
              setSignUpOpen={setSignUpOpen}
            />
            <Routes>
              <Route
                path='/'
                exact
                element={<Dashboard setSignInOpen={setSignInOpen} />}
              />
              <Route path='/search' exact element={<Search />} />
              <Route path='/favourites' exact element={<Favourites />} />
              <Route path='/profile' exact element={<Profile />} />
              <Route path='/podcast/:id' exact element={<PodcastDetails />} />
              <Route
                path='/showpodcasts/:type'
                exact
                element={<DisplayPodcasts />}
              />
            </Routes>
          </Frame>

          {open && (
            <ToastMessage open={open} message={message} severity={severity} />
          )}
        </Podstream>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
