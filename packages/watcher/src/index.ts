import * as trying from './try';
import EventsService from "./services/EventsService";
import SendEmailService from "./services/SendEmailService";

export function testing(a: number, b: number): number {
  return trying.add(a, b);
}

export function testEventServiceWork() {
  const service = new EventsService(new SendEmailService);
  const result = service.getNewEvents();
  const sent = service.send();
  return [result, sent];
}

export function testSendEmailServiceWork() {
  return SendEmailService.check();
}
