import React, { useState } from 'react';
import styled from 'styled-components';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';
import { favoritePodcast, getPodcastById, getUsers } from '../api';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Episodecard from '../components/Episodecard';

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
  align-items: center;
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

const PodcastDetails = () => {
  const { id } = useParams();
  const [favourite, setFavourite] = useState(false);
  const [podcast, setPodcast] = useState();
  const [user, setUser] = useState();

  const token = localStorage.getItem('podstreamtoken');
  //user
  const { currentUser } = useSelector((state) => state.user);

  const favoritpodcast = async () => {
    if (podcast !== undefined && podcast !== null) {
      await favoritePodcast(podcast?._id, token)
        .then((res) => {
          if (res.status === 200) {
            setFavourite(!favourite);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getUser = async () => {
    await getUsers(token)
      .then((res) => {
        setUser(res.data);
      })
      .then((error) => {
        console.log(error);
      });
  };

  const getPodcast = async () => {
    await getPodcastById(id)
      .then((res) => {
        if (res.status === 200) {
          setPodcast(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useState(() => {
    getPodcast();
  }, []);

  React.useEffect(() => {
    //favorits is an array of objects in which each object has a podcast id match it to the current podcast id
    if (currentUser) {
      getUser();
    }
    if (user?.favorits?.find((fav) => fav._id === podcast?._id)) {
      setFavourite(true);
    }
  }, [user, podcast]);

  return (
    <Container>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
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
        </Details>
      </Top>
      <Episodes>
        <Topic>All Episodes</Topic>
        <EpisodeWrapper>
          {podcast?.episodes.map((episode) => (
            <Episodecard
              episode={episode}
              podid={podcast}
              type={podcast.type}
              user={user}
            />
          ))}
        </EpisodeWrapper>
      </Episodes>
    </Container>
  );
};

export default PodcastDetails;
