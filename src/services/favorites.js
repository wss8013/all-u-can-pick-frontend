import axios from "axios";
class FavoritesDataService {
    updateFavorites(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms/favorites`, data);
    }

    getFavoritesByUserId(userId) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms/favorites/${userId}`);
    }

    getFavoriteListByFarmIds(fIds) {
        console.error(fIds);
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms/favoritelist`, { params: { farmId: fIds } });
    }
}
export default new FavoritesDataService();