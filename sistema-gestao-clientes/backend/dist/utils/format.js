"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumber = toNumber;
exports.startOfMonth = startOfMonth;
exports.endOfMonth = endOfMonth;
exports.toDateOnly = toDateOnly;
function toNumber(value) {
    if (value === null || value === undefined)
        return 0;
    return Number(value);
}
function startOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}
function toDateOnly(date) {
    return date.toISOString().slice(0, 10);
}
