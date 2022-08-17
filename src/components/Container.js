import update from "immutability-helper";
import { useCallback, useState, useEffect } from "react";
import { Card } from "./FavoriteCard.js";
import style from "./favorites.css"
import FavoritesDataService from "../services/favorites";
import Image from 'react-bootstrap/Image';

const mStyle = {
  width: 500,
  margin: 1
}

const FavoriteContainer = ({
  user,
  favorites,
  addFavorite,
  deleteFavorite
}) => {
  const [farms, setFarms] = useState([]);
  const [myFavorites, setMyFavorites] = useState([favorites]);
  const [doSaveFaves, setDoSaveFaves] = useState(false);

  useEffect(() => {
    const getFarms = favorites => {
      FavoritesDataService.getFavoriteListByFarmIds(favorites)
        .then(response => {
          let myFarm = response.data.farms
          console.error(myFarm);
          myFarm.sort((a, b) => favorites.indexOf(a._id) - favorites.indexOf(b._id));
          setFarms(response.data.farms);
        })
        .catch(e => {
          console.log(e);
        });
    }
    getFarms(favorites);
    setMyFavorites(favorites);
  }, [favorites]);

  const saveFavorites = useCallback(() => {
    var data = {
      _id: user.googleId,
      favorites: myFavorites
    }
    FavoritesDataService.updateFavorites(data).catch(e => {
      console.error(e);
    });
  }, [myFavorites, user]);
  
  useEffect(() => {
    if (user && doSaveFaves) {
      saveFavorites();
      setDoSaveFaves(false);
    }
  }, [user, myFavorites, saveFavorites, doSaveFaves]);


  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setFarms((prevFarms) =>
      update(prevFarms, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevFarms[dragIndex]]
        ]
      })
    );

    setMyFavorites((prevMyFavorites) =>
      update(prevMyFavorites, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevMyFavorites[dragIndex]]
        ]
      })
    );
    setDoSaveFaves(true);
  }, []);

  const renderCard = useCallback((farm, index) => {
    return (
      <div>
        <Card
          key={farm._id}
          index={index}
          id={farm._id}
          farm={farm}
          moveCard={moveCard}
        />
      </div>
    );
  }, []);

  return (
    <div className="favoritesContainer container">
      <div className="favoritesPanel">
        Your Saved Favorite Farms
      </div>
      <div>
        {farms.map((farm, i) => renderCard(farm, i))}
      </div>
    </div>
  );

};
export default FavoriteContainer;
