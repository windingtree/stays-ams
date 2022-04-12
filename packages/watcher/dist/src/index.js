"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSendEmailServiceWork = exports.testEventServiceWork = exports.testing = void 0;
const trying = __importStar(require("./try"));
const EventsService_1 = __importDefault(require("./services/EventsService"));
const SendEmailService_1 = __importDefault(require("./services/SendEmailService"));
function testing(a, b) {
    return trying.add(a, b);
}
exports.testing = testing;
function testEventServiceWork() {
    const service = new EventsService_1.default(new SendEmailService_1.default);
    const result = service.getNewEvents();
    const sent = service.send();
    return [result, sent];
}
exports.testEventServiceWork = testEventServiceWork;
function testSendEmailServiceWork() {
    return SendEmailService_1.default.check();
}
exports.testSendEmailServiceWork = testSendEmailServiceWork;
//# sourceMappingURL=index.js.map