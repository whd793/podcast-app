import React from 'react';
import styled from 'styled-components';

const Results = styled.div`
background-color: ${({ theme }) => theme.bgLight};
width: 700px;
display: flex;
align-items: center;
padding: 8px;
border-radius: 6px;
gap: 20px;
&:hover{
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
`
const PodcastImage = styled.img`
height: 70px;
border-radius: 4px;
`
const PodcastInfo = styled.div`
display: flex;
flex-direction: column;
gap: 8px;
`
const PodcastName = styled.div`
display: flex;
flex-direction: column;
color: ${({ theme }) => theme.text_primary};
`
const Creator = styled.div`
color: ${({ theme }) => theme.text_secondary};
font-size: 12px;

`
const MoreResult = ({podcast}) => {
  return (
    <Results>
        <PodcastImage src={podcast?.thumbnail}/>
        <PodcastInfo>
            <PodcastName>{podcast?.name}</PodcastName>
            <Creator>{podcast?.creator.name}</Creator>
        </PodcastInfo>
    </Results>
  )
}

export default MoreResult