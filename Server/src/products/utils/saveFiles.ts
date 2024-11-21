import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

export const saveFiles = async (files: Array<Express.Multer.File>, uploadDir: string): Promise<Array<string>> => {
  await mkdir(uploadDir, { recursive: true });
  const filenames = await Promise.all(
    files.map(async (file): Promise<string> => {
      const filepath = join(uploadDir, file.filename);
      await writeFile(filepath, file.buffer);
      return file.filename;
    })
  );
  return filenames;
}