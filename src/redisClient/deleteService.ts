import { redisUtilClient } from './index';

class redisPUBSUB {
  public async docDelete(fileName: string, containerName: string) {
    const deleteMessage = {
      file_name: fileName,
      container_name: containerName,
    };
    await redisUtilClient.publish('doc_delete', JSON.stringify(deleteMessage));
  }
}

export const RedisPUBSUB = new redisPUBSUB();
