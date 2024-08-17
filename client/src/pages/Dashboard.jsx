import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getMostPopularPodcast } from '../api/index';
import { getPodcastByCategory } from '../api';
import { PodcastCard } from '../components/PodcastCard.jsx';
import { getUsers } from '../api/index';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
                <PodcastsScroll>
                  {user?.podcasts.slice(0, 10).map((podcast) => (
                    <PodcastCard
                      podcast={podcast}
                      user={user}
                      setSignInOpen={setSignInOpen}
                    />
                  ))}
                </PodcastsScroll>
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

              <PodcastsScroll>
                {mostPopular.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </PodcastsScroll>
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
              <PodcastsScroll>
                {comedy.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </PodcastsScroll>
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
              <PodcastsScroll>
                {news.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </PodcastsScroll>
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
              <PodcastsScroll>
                {crime.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </PodcastsScroll>
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
              <PodcastsScroll>
                {sports.slice(0, 10).map((podcast) => (
                  <PodcastCard
                    podcast={podcast}
                    user={user}
                    setSignInOpen={setSignInOpen}
                  />
                ))}
              </PodcastsScroll>
            </FilterContainerScroll>
          </CategorySection>
        </>
      )}
    </DashboardMain>
  );
};

export default Dashboard;
