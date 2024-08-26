import axios from "axios";


export const authServiceClient = axios.create({
    baseURL: process.env.AUTH_SERVICE_SERVER_URL,
    timeout: 10000,
});
