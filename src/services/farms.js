import axios from "axios";

class FarmsDataService {
    getAll(page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms?page=${page}`);
    }

    find(query, by = "name", page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms?${by}=${query}&page=${page}`);
    }

    findById(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms/id/${id}`);
    }

    getRatings() {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms/ratings`);
    }

    createReview(data) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms/review`, data);
    }

    updateReview(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms/updatereview`, data);
    }

    deleteReview(deleteData) {
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/farms/deletereview`, { data: deleteData });
    }
}

export default new FarmsDataService();