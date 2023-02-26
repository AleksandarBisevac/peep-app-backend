import { IAuthJob } from '@auth/interfaces/authInterface';
import { BaseQueue } from '@services/queues/baseQueue';
import { authWorker } from '@workers/authWorker';

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
  }

  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
