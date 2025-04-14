"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationError = void 0;
const validationError = (err) => {
    let errorSource = Object.values(err === null || err === void 0 ? void 0 : err.errors).map((val) => {
        return {
            path: val === null || val === void 0 ? void 0 : val.path,
            message: val === null || val === void 0 ? void 0 : val.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation Error!",
        sucess: false,
        errorSource,
    };
};
exports.validationError = validationError;
