"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timelineSchema = new mongoose_1.Schema({
    requestId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Request" },
    status: { type: String, required: true },
    date: { type: Date, required: true },
    note: { type: String, required: true },
});
const Timeline = (0, mongoose_1.model)("Timeline", timelineSchema);
exports.default = Timeline;
