import { env } from '@/config';
import { redisUtilClient } from '@/redisClient';
import { BlobSASPermissions, BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters } from '@azure/storage-blob';
const STORAGE_ACCOUNT = env('STORAGE_ACCOUNT');
const STORAGE_ACCESS_KEY = env('STORAGE_ACCESS_KEY');

class SASTokenService {
  private async generateSASToken(containerName) {
    const blobServiceClient = new BlobServiceClient(
      `https://${STORAGE_ACCOUNT}.blob.core.windows.net`,
      new StorageSharedKeyCredential(STORAGE_ACCOUNT, STORAGE_ACCESS_KEY),
    );

    const container = await blobServiceClient.getContainerClient(containerName);
    const permissions = BlobSASPermissions.parse('r');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10);
    const sasTokenParams = {
      containerName: container.containerName,
      permissions: permissions,
      startsOn: new Date(),
      expiresOn: expiryDate,
    };

    const sasToken = generateBlobSASQueryParameters(sasTokenParams, new StorageSharedKeyCredential(STORAGE_ACCOUNT, STORAGE_ACCESS_KEY)).toString();

    return sasToken;
  }

  public async getSAStoken(userID: string) {
    await redisUtilClient.del(userID);

    const newToken = await this.generateSASToken(userID);
    const expiry = 60 * 60 * 24 * 9;
    await redisUtilClient.setEx(userID, expiry, newToken);

    return newToken;
  }

  public async getSAStokenForPeer(userID: string, peerID: string) {
    const newToken = await this.generateSASToken(userID);
    const expiry = 60 * 60 * 24;
    await redisUtilClient.setEx(peerID, expiry, newToken);

    return newToken;
  }
}

export const SAStokenService = new SASTokenService();
