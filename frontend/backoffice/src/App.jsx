import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.scss';
import Login from './components/Login/Login';
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import './index.css';
import { createTheme, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { grey, blue } from '@mui/material/colors';
import { useCookies } from 'react-cookie';

const App = () => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['theme']);

  useEffect(() => {
    if (cookies.theme == null)
      setCookie('theme', prefersDarkMode.matches, { path: '/' });
    setTheme(cookies.theme === 'true');
  }, [prefersDarkMode]);

  const changeTheme = () => {
    if (cookies.theme == null) {
      setCookie('theme', prefersDarkMode.matches, { path: '/' });
      return setTheme(prefersDarkMode.matches);
    }
    if (theme != null || theme != undefined) {
      setCookie('theme', !theme, { path: '/' });
      setTheme(!theme);
    }
  };

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme ? 'dark' : 'light',
          text: {
            primary: theme ? grey[200] : grey[700],
            secondary: theme ? grey[300] : grey[800],
          },
          primary: {
            main: theme ? blue['A200'] : blue['A400'],
            dark: theme ? blue['A400'] : blue[800],
          },
        },
      }),
    [theme]
  );

  return (
    <div className={'App' + (theme ? ' dark' : ' light')}>
      <ThemeProvider theme={muiTheme}>
        <div className='limit-content'>
          {window.location.pathname != '/' && (
            <Header theme={theme} changeTheme={changeTheme} />
          )}
          <Routes>
            <Route
              path='/'
              element={
                <div className='center-content'>
                  <Login theme={theme} />
                </div>
              }
            />
            <Route path='/dashboard/*' element={<Dashboard />} />
          </Routes>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default App;
