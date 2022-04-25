import('./config');
import StaysRepository from "./repositories/StaysRepository";
import StayEntityService from "./services/StayEntityService";
import {makeContract, poller} from "./helpers";
import StaysWorkerService from "./services/StaysWorkerService";

const stay = new StaysRepository()
const worker = async () => {
  const contract = await makeContract();
  if (!contract) throw new Error();
  const books = new StayEntityService(contract);
  await books.process();
  await stay.store(books.getTokenEntities());
  await new StaysWorkerService();
}
poller(worker, 60 * 1000)

