import { Request, Response } from "express";
import responseTime from "response-time";
import { dataSource } from "../dataSource";
import { ResponseTime } from "../entities/ResponseTime";

const saveResponseTime = () =>
  responseTime((req: Request, res: Response, millis) => {
    const repo = dataSource.getRepository(ResponseTime);
    const contentLength = res.getHeader("content-length");

    repo.save({
      endpoint: req.originalUrl,

      method: req.method,
      contentLengthBytes: contentLength ? Number(contentLength) : 0,
      statusCode: res.statusCode,
      millis: Math.floor(millis),
    });
  });

export default saveResponseTime;
