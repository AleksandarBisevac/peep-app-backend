import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { userService } from '@services/db/userService';

const log: Logger = config.createLogger('userWorker');

class UserWorker {
  async addUserToDB(job: Job, done: DoneCallback) {
    try {
      const { value } = job.data;
      // add method to send data to database
      await userService.addUserData(value);
      job.progress(100);
      done(null, job.data); // first argument is error
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
