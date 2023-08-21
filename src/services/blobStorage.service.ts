import { env } from '@/config';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import path from 'node:path';
import * as querystring from 'querystring';

const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '/keys/doc_depot/private_key.pem'), 'utf8');
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

  public generateDownloadToken(url: string) {
    const token = jwt.sign({ url }, PUBLIC_KEY, { expiresIn: '1h', algorithm: 'RS256' });
    console.log(token);
    const encodedToken = querystring.escape(token);
    return encodedToken;
  }
}

export const blobService = new BlobService();
