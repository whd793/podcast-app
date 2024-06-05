import React, { useState } from 'react';
import styled from 'styled-components'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { DefaultCard } from '../components/DefaultCard.jsx';
import { Category } from '../utils/Data.js';
import { searchPodcast } from '../api/index.js';
import { PodcastCard } from '../components/PodcastCard.jsx';
import TopResult from '../components/TopResult.jsx';
import MoreResult from '../components/MoreResult.jsx';
import {Link} from 'react-router-dom';

const SearchMain = styled.div`
height: 100%;
overflow-y: scroll;
width: 100%;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: center;
padding: 20px;
gap: 20px;
`;
const Heading = styled.div`
    width: 100%;
    align-items: flex-start;
    color: ${({ theme }) => theme.text_primary};
    font-size: 22px;
    font-weight: 540;
    margin: 10px 14px;
`;
const BrowseAll = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 14px;
`;
const SearchedCards = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
    padding: 14px;
`;
const Categories = styled.div`
    margin: 20px 10px;
`;
const Search_whole = styled.div`
 width:30%;
 display:flex;
 border: 1px solid ${({ theme }) => theme.text_secondary};
 border-radius:30px;
 cursor:pointer;
 padding:12px 16px;
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
`;
const Search = () => {

    const [searched, setSearched] = useState("");
    const [searchedPodcasts, setSearchedPodcasts] = useState([]);

    const handleChange = async (e) => {
        setSearched(e.target.value);
        await searchPodcast(searched)
            .then((res) => {
                setSearchedPodcasts(res.data);
                console.log(searchedPodcasts[0]);
            })
            .catch((err) => console.log(err));
    }

    const handleCategory = () => {

    }

    return (
        <SearchMain>
            <Search_whole>
                <SearchOutlinedIcon sx={{ "color": "inherit" }} />
                <input type='text' placeholder='Search Artist/Podcast'
                    style={{ "border": "none", "outline": "none", "width": "100%", "background": "inherit", "color": "inherit" }}
                    value={searched}
                    onChange={(e) => handleChange(e)} />
            </Search_whole>
            {searched === "" ?
                <Categories>
                    <Heading>Browse All</Heading>
                    <BrowseAll>
                        {Category.map((category) => (
                            <Link to={`/showpodcasts/${category.name.toLowerCase()}`} style={{textDecoration:"none"}}>
                                <DefaultCard category={category} />
                            </Link>
                        ))}
                    </BrowseAll>
                </Categories>
                :
                <SearchedCards>
                    <TopResult podcast={searchedPodcasts[0]} />
                    <OtherResults>
                        {searchedPodcasts.map((podcast) => (
                            <MoreResult podcast={podcast} />
                        ))}
                    </OtherResults>
                </SearchedCards>
            }
        </SearchMain>
    )
}

export default Search