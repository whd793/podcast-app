import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import styled from "styled-components";
import Avatar from '@mui/material/Avatar';
import { getUsers } from '../api/index';
import { PodcastCard } from '../components/PodcastCard.jsx'

const ProfileAvatar = styled.div`
  padding-left:3rem;
`
const ProfileContainer = styled.div`
display: flex;
flex-direction: column;
`
const ProfileName = styled.div`
color: ${({ theme }) => theme.text_primary};
font-size:3rem;
font-weight:700;
`
const Profile_email = styled.div`
color:#2b6fc2;
font-size:1.2rem;
font-weight:400;
`
const FilterContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
${({ box, theme }) => box && `
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
  &:hover{
    transition: 0.2s ease-in-out;
  }
  `;
const Podcasts = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 3fr));
gap: 14px;
padding: 18px 6px;
`;
const ProfileMain = styled.div`
padding: 20px;
display: flex;
flex-direction: column;
justify-content: flex-start;
gap: 20px;
overflow-y: scroll;
height: 100%;
`
const UserDetails = styled.div`
width: 100%:
display: flex;
flex-direction: row;
gap: 150px;

`
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
`
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
  &:hover{
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`

const Profile = () => {

    const [user, setUser] = useState();
    const { currentUser } = useSelector(state => state.user);

    const token = localStorage.getItem("podstreamtoken");
    const getUser = async () => {
        await getUsers(token).then((res) => {
            setUser(res.data)
            console.log(user.name)
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        if (currentUser) {
            getUser();
        }
    }, [currentUser])


    return (
        <ProfileMain>
            <UserDetails>
                <ProfileAvatar>
                    <Avatar sx={{ height: 165, width: 165 }} src={user?.thumbnail}></Avatar>
                </ProfileAvatar>
                <ProfileContainer>
                    <ProfileName>{user?.name}</ProfileName>
                    <Profile_email>Email:{user?.email}</Profile_email>
                </ProfileContainer>
            </UserDetails>
            {currentUser && user?.podcasts.length > 0 &&
                <FilterContainer box={true}>
                    <Topic>Your Uploads
                        <Span>Show All</Span>
                    </Topic>
                    <Podcasts>
                        {user?.podcasts.slice(0, 6).map((podcast) => (
                            <PodcastCard podcast={podcast} user={user} />
                        ))}
                    </Podcasts>
                </FilterContainer>

            }
            <FilterContainer box={true} >
                <Topic>Your Uploads
                </Topic>
                <Container>
                    {currentUser && user?.podcasts.length === 0 &&
                        <ButtonContainer>Upload</ButtonContainer>
                    }
                </Container>
            </FilterContainer>
            <FilterContainer box={true}>
                <Topic>Your Favourites
                </Topic>
                <Podcasts>
                    {user && user?.favorits.map((podcast) => (
                        <PodcastCard podcast={podcast} user={user} />
                    ))}
                </Podcasts>
            </FilterContainer>
        </ProfileMain>
    );
}

export default Profile;