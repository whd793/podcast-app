import { ThemeProvider } from "styled-components";
import { useState } from "react";
import { darkTheme, lightTheme } from './utils/Themes.js'
import Signup from '../src/components/Signup.jsx';
import Signin from '../src/components/Signin.jsx';
import OTP from '../src/components/OTP.jsx'
import Navbar from '../src/components/Navbar.jsx';
import Menu from '../src/components/Menu.jsx';
import Dashboard from '../src/pages/Dashboard.jsx'
import ToastMessage from './components/ToastMessage.jsx';
import Search from '../src/pages/Search.jsx';
import Favourites from '../src/pages/Favourites.jsx';
import Upload from '../src/components/Upload.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from "react-redux";
import styled from 'styled-components';

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

const Podstream = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  background: ${({ theme }) => theme.bgLight}
`;

function App() {

  const [darkMode, setDarkMode] = useState(true);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [SignUpOpen, setSignUpOpen] = useState(false);
  const [SignInOpen, setSignInOpen] = useState(false);
  const [uploadOpen,setUploadOpen] = useState(false);


  const { currentUser } = useSelector(state => state.user);

  return (

    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>

      <BrowserRouter>
        {SignInOpen && <Signin setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />}
        {SignUpOpen && <Signup setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />}
        {uploadOpen && <Upload setUploadOpen={setUploadOpen} />}
        <Podstream>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} setUploadOpen={setUploadOpen} />
          <Frame>
            <Navbar setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
            <Routes>
              <Route path='/' exact element={<Dashboard />} />
              <Route path='/search' exact element={<Search />} />
              <Route path='/favourites' exact element={<Favourites />} />
            </Routes>
          </Frame>

          {open && <ToastMessage open={open} message={message} severity={severity} />}
        </Podstream>

      </BrowserRouter>

    </ThemeProvider>
    
  );
}

export default App;
