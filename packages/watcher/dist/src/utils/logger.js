"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
// Possible log level types
const logLevels = {
    'none': 0,
    'error': 1,
    'debug': 2,
    'info': 3
};
// Getting log level from the ENV
const logLevel = logLevels[process.env.REACT_APP_LOG_LEVEL || 'none'] || 0;
// Default logging function
const logFunction = (subject, args) => console.log(...[`${subject}:`, ...args]);
// Creates logger
const Logger = (subject) => ({
    error: (...args) => {
        if (logLevel >= 1) {
            logFunction(subject, args);
        }
    },
    debug: (...args) => {
        if (logLevel >= 2) {
            logFunction(subject, args);
        }
    },
    info: (...args) => {
        if (logLevel >= 3) {
            logFunction(subject, args);
        }
    }
});
exports.default = Logger;
//# sourceMappingURL=logger.js.map