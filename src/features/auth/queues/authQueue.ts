import { IAuthJob } from '@auth/interfaces/authInterface';
import { BaseQueue } from '@services/queues/baseQueue';

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
  }

  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
