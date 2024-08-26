import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'
import express, {Express} from "express";

export const loadServerConfigs = (app: Express) => {
    // Middleware to parse JSON
    app.use(express.json());

    // Use Helmet to set various HTTP headers for security
    app.use(helmet());

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    })

    // Apply the rate limiting middleware to all requests.
    app.use(limiter)
}
