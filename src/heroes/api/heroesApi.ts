import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const heroesApi = axios.create({
    baseURL: `${baseUrl}/api/heroes`,
});