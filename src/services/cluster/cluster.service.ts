import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class AppClusterService {
  static clusterize(callback): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cluster = require('cluster');
    const numberOfCPUs = os.cpus().length;
    let numberOfWorkers = process.env.NUMBER_OF_WORKERS || 1;

    if (cluster.isMaster) {
      console.log(`Master server started on ${process.pid}`);

      //ensure workers exit cleanly
      process.on('SIGINT', function () {
        console.log('Cluster shutting down...');
        for (const id in cluster.workers) {
          cluster.workers[id].kill();
        }
        // exit the master process
        process.exit(0);
      });

      if (numberOfWorkers > numberOfCPUs) numberOfWorkers = numberOfCPUs;

      for (let i = 0; i < numberOfWorkers; i++) {
        cluster.fork();
      }
      cluster.on('online', function (worker) {
        console.log('Worker %s is online', worker.process.pid);
      });
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      callback();
    }
  }
}
