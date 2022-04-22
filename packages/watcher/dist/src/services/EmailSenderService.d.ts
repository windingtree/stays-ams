declare const Stay: any;
export default class EmailSenderService {
    private fromEmail;
    private message;
    private stayModel;
    constructor();
    setMessage(stayModel: typeof Stay): void;
    sendEmail(): Promise<void>;
    private updateStayStatus;
}
export {};
