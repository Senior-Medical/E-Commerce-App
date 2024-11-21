import { unlink } from "fs/promises";
import { join } from "path";

export const removeFiles = async (uploadDir: string, filesNames: string[]) => {
  let filePath: string;
  for (const fileName of filesNames) {
    filePath = join(uploadDir, fileName);
    try {
      await unlink(filePath);
      console.log(`File removed: ${filePath}`);
    } catch (err) {
      if (err.code === 'ENOENT') {
          console.warn(`File not found (skipping): ${filePath}`);
      } else {
          console.error(`Error removing file ${filePath}:`, err.message);
      }
    }
  }
};