// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error(err);

    // Set default error response
    const statusCode = err.statusCode || 500;
    const errorResponse = {
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    // Handle specific error types
    if (err.name === 'ValidationError') {
        // Mongoose validation error
        errorResponse.message = Object.values(err.errors)
            .map(error => error.message)
            .join(', ');
        errorResponse.statusCode = 400;
    }

    if (err.name === 'CastError') {
        // MongoDB cast error (e.g., invalid ID)
        errorResponse.message = `Invalid ${err.path}: ${err.value}`;
        errorResponse.statusCode = 400;
    }

    if (err.code === 11000) {
        // Duplicate key error
        errorResponse.message = `Duplicate key error: ${Object.keys(err.keyValue)} already exists`;
        errorResponse.statusCode = 409;
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;