/**
 * Authentication middleware for protecting routes
 * This middleware can be used to protect routes that require authentication
 */

import jwt from 'jsonwebtoken';
import * as UserServices from '../models/services/UserServices.js';

/**
 * Middleware to verify JWT authentication token from request headers
 * 
 * @async
 * @function verifyToken
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Authorization header containing Bearer token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Calls next() if token is valid, otherwise sends error response
 * 
 * @description
 * - Extracts JWT token from Authorization header (Bearer format)
 * - Verifies token using JWT_SECRET environment variable
 * - Retrieves user from database using decoded user_id
 * - Adds user object to request for use in subsequent middleware/routes
 * - Returns 401 status with error message if token is missing, invalid, or user not found
 * 
 * @throws {Error} Token verification errors are caught and return 401 response
 * 
 * @example
 * // Usage in Express route
 * app.get('/protected', verifyToken, (req, res) => {
 *   // req.user is now available
 *   res.json({ user: req.user });
 * });
 */
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }
        
        // Verify JWT token (implement when JWT is added)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await UserServices.getUserById(decoded.user_id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        // Add user to request object
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

/**
 * Creates middleware to check if user has required role permissions
 * @param {number|number[]} allowedRoles - Single role ID or array of role IDs that are allowed
 * @returns {Function} Express middleware function that checks user role permissions
 * @description Returns a middleware function that verifies the user's role is in the allowed roles list.
 * Requires that verifyToken middleware has run first to populate req.user
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role_id;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        
        next();
    };
};

/**
 * Basic authentication middleware that checks for user ID in headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Calls next() on success or sends error response
 * @description Simple authentication check that looks for 'user-id' header.
 * This is a placeholder implementation for session-based authentication
 */
export const requireAuth = (req, res, next) => {
    // For session-based auth, you might check for session data
    // This is a placeholder - implement based on your session strategy
    
    const userId = req.headers['user-id']; // Example: client sends user ID in headers
    
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    
    // Add user ID to request for use in controllers
    req.userId = userId;
    next();
};

/**
 * Creates middleware to validate required fields in request body
 * @param {string[]} requiredFields - Array of field names that must be present in request body
 * @returns {Function} Express middleware function that validates request body fields
 * @description Returns a middleware function that checks if all required fields are present
 * in the request body. Sends error response with missing field details if validation fails
 */
export const validateFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }
        
        next();
    };
};

/**
 * Creates a rate limiting middleware function that tracks and limits requests per client IP
 * @param {number} [maxRequests=10] - Maximum number of requests allowed per time window
 * @param {number} [windowMs=900000] - Time window in milliseconds (default: 15 minutes)
 * @returns {Function} Express middleware function that enforces rate limiting
 * @description This middleware tracks client requests by IP address and blocks requests
 * that exceed the specified limit within the time window. Returns a 429 status code
 * when the rate limit is exceeded.
 * @example
 * // Apply rate limiting with default settings (10 requests per 15 minutes)
 * app.use(rateLimit());
 * 
 * // Apply custom rate limiting (5 requests per 5 minutes)
 * app.use(rateLimit(5, 5 * 60 * 1000));
 */
export const rateLimit = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
    const clients = new Map();
    
    return (req, res, next) => {
        const clientId = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        if (!clients.has(clientId)) {
            clients.set(clientId, { requests: 1, resetTime: now + windowMs });
            return next();
        }
        
        const client = clients.get(clientId);
        
        if (now > client.resetTime) {
            client.requests = 1;
            client.resetTime = now + windowMs;
            return next();
        }
        
        if (client.requests >= maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests, please try again later'
            });
        }
        
        client.requests++;
        next();
    };
};
