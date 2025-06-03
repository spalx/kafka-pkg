"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelatedRequestDTOSchema = void 0;
const zod_1 = require("zod");
exports.CorrelatedRequestDTOSchema = zod_1.z.object({
    correlation_id: zod_1.z.string(),
    request_id: zod_1.z.string().optional(),
    data: zod_1.z.object({}),
});
