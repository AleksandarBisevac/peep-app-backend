import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { authService } from '@services/db/authService';

const log: Logger = config.createLogger('authWorker');

class AuthWorker {
  async addAuthUserToDB(job: Job, done: DoneCallback) {
    try {
      const { value } = job.data;
      // add method to send data to database
      await authService.createAuthUser(value);
      job.progress(100);
      done(null, job.data); // first argument is error
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
