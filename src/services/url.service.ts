import { ErrorEnum } from "@/exceptions/errorCodes";
import { HttpException } from "@/exceptions/httpException";
import { redisClient } from "@/redisClient";
import { FastifyReply } from "fastify";

class UrlService {
  public async redirectUrl(urlID: string, Reply: FastifyReply) {
    const shortUrl = `${process.env.HOST_URL}/sr/${urlID}`
    const url = await redisClient.get(shortUrl);
    if (!url) {
      throw new HttpException(ErrorEnum.URL_NOT_FOUND);
    }
    Reply.redirect(url);
  }
}

export const urlService = new UrlService();

