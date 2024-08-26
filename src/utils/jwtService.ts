import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import {authServiceClient} from "../lib/axiosClient";

const AUTH_SERVICE_URL: string | undefined = process.env.VERIFY_TOKEN_URL_ENDPOINT;


async function validateToken(token: string) {
    if (!AUTH_SERVICE_URL) {
        throw new Error('AUTH_SERVICE_URL is not defined');
    }
    try {
        const response = await authServiceClient.get(AUTH_SERVICE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return {status: true, data: response.data};
    } catch (error) {
        console.error('JWT validation error:', error);
        return {status: false, data: null};
    }
}


export const extractAuthorizationToken = async (ws: WebSocket, request: IncomingMessage): Promise<any | null> => {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
        ws.close(1008, 'Authorization token is missing');
        return null;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        ws.close(1008, 'Invalid Authorization token format');
        return null;
    }

    try {
        const isValid = await validateToken(token);

        if (!isValid.status) {
            ws.close(1008, 'Invalid or expired token');
            return null;
        }

        return isValid.data;
    } catch (error) {
        ws.close(1008, 'Error during token validation');
        return null;
    }
}
