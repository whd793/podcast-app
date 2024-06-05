import { CloseRounded } from '@mui/icons-material';
import { Modal } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';


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


const VideoPlayer = ({ setVideoOpen }) => {

    return (
        <Modal open={true} onClose={() => setVideoOpen(false)}>
            <Container>
                <Wrapper>
                    <CloseRounded
                        style={{
                            position: "absolute",
                            top: "24px",
                            right: "30px",
                            cursor: "pointer",
                        }}
                        onClick={() => setVideoOpen(false)}
                    />
                    <Title>Episode 1</Title>
                    <Videoplayer controls>
                        <source src="https://www.dofactory.com/media/movie.mp4" type="video/mp4" />
                        <source src="video.mp4" type="video/mp4" />
                        <source src="video.webm" type="video/webm" />
                        <source src="video.ogg" type="video/ogg" />
                        Your browser does not support the video tag.
                    </Videoplayer>
                    <EpisodeName>Some episode name</EpisodeName>
                    <EpisodeDescription> Some episode description</EpisodeDescription>
                    <BtnContainer>
                        <Btn>
                            Previous
                        </Btn>
                        <Btn>
                            Next
                        </Btn>
                    </BtnContainer>
                </Wrapper>
            </Container>
        </Modal>
    )
}

export default VideoPlayer