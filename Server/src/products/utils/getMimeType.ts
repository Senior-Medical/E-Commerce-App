const magicNumbers: Record<string, string> = {
  'FFD8FF': 'image/jpeg',               // JPEG
  '89504E47': 'image/png',              // PNG
  '47494638': 'image/gif',              // GIF (87a and 89a)
  '424D': 'image/bmp',                  // BMP
  '4D4D002A': 'image/tiff',             // TIFF (big-endian)
  '49492A00': 'image/tiff',             // TIFF (little-endian)
  '52494646': 'image/webp',             // WebP (check further for WEBP)
  '00000100': 'image/x-icon',           // ICO
  '00000200': 'image/x-cursor',         // CUR
  '38425053': 'image/vnd.adobe.photoshop', // PSD
  '6674797068656963': 'image/heic',     // HEIC/HEIF
};

/**
 * Get MIME type from file buffer
 * @param buffer File buffer
 * @returns MIME type or 'unknown/unknown'
 */
export const getMimeType = (buffer: Buffer) => {
  const header = buffer.subarray(0, 8).toString('hex').toUpperCase();

  for (const [magic, mime] of Object.entries(magicNumbers)) {
    if (header.startsWith(magic)) {
      return mime;
    }
  }

  return undefined;
} 
