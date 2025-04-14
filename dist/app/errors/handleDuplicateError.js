"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicatError = void 0;
const handleDuplicatError = (err) => {
    const match = err.message.match(/"([^"]*)"/);
    const extretedMessage = match && match[1];
    const statusCode = 400;
    const errorSource = [
        {
            path: "",
            message: `${extretedMessage} is already exist`,
        },
    ];
    return {
        statusCode,
        message: "Invalide Id!",
        sucess: false,
        errorSource,
    };
};
exports.handleDuplicatError = handleDuplicatError;
