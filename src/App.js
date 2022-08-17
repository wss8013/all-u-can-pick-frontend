import { useState, useCallback, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import FavoriteDataService from './services/favorites';
import Login from "./components/Login"
import Logout from "./components/Logout";
import AddReview from "./components/AddReview";
import HomePage from './components/HomePage';
import FarmList from './components/FarmList';
import FarmPage from './components/FarmPage';
import FavoriteContainer from './components/Container.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
function App() {

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [doSaveFaves, setDoSaveFaves] = useState(false);

  const retrieveFavorites = useCallback(() => {
    FavoriteDataService.getFavoritesByUserId(user.googleId)
      // .then(response => console.log(response.data))
      .then(response => {
        setFavorites(response.data.favorites);
      })
      .catch(e => {
        console.log(e);
      });
  }, [user]);;

  const saveFavorites = useCallback(() => {
    var data = {
      _id: user.googleId,
      favorites: favorites
    }

    FavoriteDataService.updateFavorites(data)
      .catch(e => {
        console.log(e);
      })
  }, [favorites, user]);

  useEffect(() => {
    if (user && doSaveFaves) {
      saveFavorites();
      setDoSaveFaves(false);
    }
  }, [user, favorites, saveFavorites, doSaveFaves]);

  useEffect(() => {
    if (user) {
      retrieveFavorites();
    }
  }, [user, retrieveFavorites]);


  const addFavorite = (farmId) => {
    setDoSaveFaves(true);
    setFavorites([...favorites, farmId]);
  }

  const deleteFavorite = (farmId) => {
    setDoSaveFaves(true);
    setFavorites(favorites.filter(f => f !== farmId));
  }


  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now() / 1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <div>
          <Navbar expand="lg" sticky="top" variant="dark" className='nav'>
            <Container className="container-fluid">
              <Navbar.Brand className="brand" href="/">
                <img src="/images/cherry-logo.jpg" alt="logo" className="moviesLogo" />
                All U Can Pick
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                  <Nav.Link as={Link} to={"/"}>
                    HomePage
                  </Nav.Link>
                  <Nav.Link as={Link} to={"/farms"}>
                    FarmLists
                  </Nav.Link>
                  {user ? (
                    <Nav.Link as={Link} to={"/favorites"}>
                      Favorites
                    </Nav.Link>
                  ) : (
                    <Nav.Link >
                    </Nav.Link>
                  )}
                </Nav>
              </Navbar.Collapse>
              {user ? (
                <Logout setUser={setUser} />
              ) : (
                <Login setUser={setUser} />
              )}
            </Container>
          </Navbar>
        </div>
        <Routes>
          <Route exact path={"/"} element={
            <HomePage
              user={user}
            />}
          />
          <Route exact path={"/farms"} element={
            <FarmList
              user={user}
              addFavorite={addFavorite}
              deleteFavorite={deleteFavorite}
              favorites={favorites}
            />}
          />
          <Route exact path={"/favorites"} element={
            <DndProvider backend={HTML5Backend}>
              <FavoriteContainer
                user={user}
                addFavorite={addFavorite}
                deleteFavorite={deleteFavorite}
                favorites={favorites} />
            </DndProvider>}
          />
          <Route exact path={"/farms/:id/"} element={
            <FarmPage
              user={user}
            />}
          />
          <Route path={"/farms/:id/review"} element={
            <AddReview user={user} />}
          />
        </Routes>
        <div className="bottom-container">
          <p>© Copyright Ladybugs</p>
        </div>
      </Router>
    </GoogleOAuthProvider >
  );
}

export default App;
