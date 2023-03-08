import { Injectable } from '@nestjs/common';
import * as os from 'os';

const numCPUs = os.cpus().length;

@Injectable()
export class AppClusterService {
  static clusterize(callback): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cluster = require('cluster');

    if (cluster.isMaster) {
      console.log(`Master server started on ${process.pid}`);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
