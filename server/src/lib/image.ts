import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const FILES_DIR = path.join(process.cwd(), 'files');

export async function saveBase64Image(base64: string): Promise<string> {
  await fs.mkdir(FILES_DIR, { recursive: true });

  const matches = base64.match(/^data:image\/\w+;base64,(.+)$/);
  const data = matches ? matches[1] : base64;
  const buffer = Buffer.from(data, 'base64');
  const filename = `${randomUUID()}.png`;
  const filepath = path.join(FILES_DIR, filename);

  await fs.writeFile(filepath, buffer);

  return filename;
}

export async function deleteImageFile(filename: string | null | undefined) {
  if (!filename) {
    return;
  }

  try {
    await fs.unlink(path.join(FILES_DIR, filename));
  } catch {
    // Ignore missing files.
  }
}
