import { BaseQueue } from '@services/queues/baseQueue';
import { userWorker } from '@workers/userWorker';

class UserQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
  }

  public addUserJob(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
