import axios from 'axios'

const apiRequest = axios.create({
    baseURL: "https://raelestbackend-1.onrender.com/api",
    withCredentials: true
});

export default apiRequest