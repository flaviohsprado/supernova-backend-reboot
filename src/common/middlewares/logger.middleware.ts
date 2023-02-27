import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Log } from '../../modules/log/log.entity';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, baseUrl, body, headers } = request;
    const userAgent = request.get('user-agent') || '';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hostname = require('os').hostname();
    const referer = request.get('referer') || '';
    const start = new Date();

    response.on('close', async () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const duration = new Date().getTime() - new Date(start).getTime();

      await getRepository(Log).save({
        ip,
        method,
        path: baseUrl,
        userAgent,
        hostname,
        referer,
        statusCode,
        contentLength,
        body: JSON.stringify(body),
        headers: JSON.stringify(headers),
        requestedAt: String(start),
        duration: String(duration) + 'ms',
      });
    });

    next();
  }
}
