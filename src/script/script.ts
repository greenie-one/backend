import fs from 'fs';
import path from 'path';

export class DtoCopyScript {
  public static copyDtoFiles(sourceDir: string, destinationDir: string): void {
    const files = fs.readdirSync(sourceDir);
    const dtoFiles = files.filter((file) => file.endsWith('.dto.ts'));

    dtoFiles.forEach((file) => {
      const sourceFile = path.join(sourceDir, file);
      const destinationFile = path.join(destinationDir, file);

      if (!fs.existsSync(destinationFile)) {
        fs.copyFileSync(sourceFile, destinationFile);
        console.info(`Copied ${file}`);
      } else {
        console.info(`Skipping ${file} (already exists)`);
      }
    });

    console.log('DTO files copied successfully!');
  }
}
