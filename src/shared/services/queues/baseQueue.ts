import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';
import { IAuthJob } from '@auth/interfaces/authInterface';

type IBaseJobData = IAuthJob;
let bullAdapters: BullAdapter[] = [];

export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    // bullAdapters are used to create the serverAdapter for the bull-board UI
    bullAdapters.push(new BullAdapter(this.queue));
    // we assure that the serverAdapter is created only once and not for every queue instance
    // we make sure there are no duplicates in the bullAdapters array
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapters,
      serverAdapter
    });
    this.log = config.createLogger(`${queueName}Queue`);

    // listen to the queue events

    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });

    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });

    this.queue.on('error', (error) => {
      this.log.error(error.message);
    });
  }

  // methods to allow as to add jobs to the queue and process them inside the queue

  // addJob is used to add jobs to the queue
  // jobName is the name of the job
  // data is the data that will be passed to the job
  // attempts is the number of times the job will be retried if it fails
  protected addJob(jobName: string, data: IBaseJobData): void {
    this.queue.add(jobName, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  }
  // processJob is used to process the jobs inside the queue
  // jobName is the name of the job
  // concurrency is the number of jobs that will be processed at the same time
  // callback is the function that will be called when the job is processed
  protected processJob(jobName: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(jobName, concurrency, callback);
  }
}
