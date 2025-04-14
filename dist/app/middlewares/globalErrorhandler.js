"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../errors/AppError");
const handleValidationError_1 = require("../errors/handleValidationError");
const handleCastError_1 = require("../errors/handleCastError");
const handleDuplicateError_1 = require("../errors/handleDuplicateError");
const globalErrorHandeller = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Somethis went worng!";
    let errorSourse = [
        {
            path: "",
            message: "Something went wrong!",
        },
    ];
    if (err instanceof AppError_1.AppError) {
        statusCode = err.ststusCode;
        (message = err.message),
            (errorSourse = [
                {
                    path: "",
                    message: err.message,
                },
            ]);
    }
    else if (err.name === "ValidationError") {
        const error = (0, handleValidationError_1.validationError)(err);
        message = error.message;
        errorSourse = error.errorSource;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
        const simplifildError = (0, handleCastError_1.handleCastError)(err);
        message = simplifildError === null || simplifildError === void 0 ? void 0 : simplifildError.message;
        errorSourse = simplifildError === null || simplifildError === void 0 ? void 0 : simplifildError.errorSource;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifildError = (0, handleDuplicateError_1.handleDuplicatError)(err);
        message = simplifildError === null || simplifildError === void 0 ? void 0 : simplifildError.message;
        errorSourse = simplifildError === null || simplifildError === void 0 ? void 0 : simplifildError.errorSource;
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSourse = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    return res.status(statusCode).send({
        sucess: false,
        message: message,
        errorSourse,
        stack: err.stack,
        err,
    });
};
exports.default = globalErrorHandeller;
