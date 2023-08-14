import { env } from '@/config';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
const STORAGE_ACCOUNT = env('STORAGE_ACCOUNT');
const STORAGE_ACCESS_KEY = env('STORAGE_ACCESS_KEY');

class BlobService {
  static blobServiceClient = new BlobServiceClient(
    `https://${STORAGE_ACCOUNT}.blob.core.windows.net`,
    new StorageSharedKeyCredential(STORAGE_ACCOUNT, STORAGE_ACCESS_KEY),
  );

  public async doesBlobExist(containerName: string, blobName: string) {
    const container = BlobService.blobServiceClient.getContainerClient(containerName);
    const blob = container.getBlobClient(blobName);
    const exists = await blob.exists();
    return exists;
  }

  public async deleteBlob(containerName: string, blobName: string) {
    const container = BlobService.blobServiceClient.getContainerClient(containerName);
    const blob = container.getBlobClient(blobName);
    await blob.deleteIfExists();
  }
}

export const blobService = new BlobService();
