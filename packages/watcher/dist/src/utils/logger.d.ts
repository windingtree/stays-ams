export interface LoggerApi {
    error: (...message: unknown[]) => void;
    debug: (...message: unknown[]) => void;
    info: (...message: unknown[]) => void;
}
declare const Logger: (subject: string) => LoggerApi;
export default Logger;
