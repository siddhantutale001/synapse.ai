export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 10MB

export const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.txt', '.docx', '.doc', '.csv'];
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];

/**
 * Validates file size and format type
 */
export function validateUploadFile(file) {
  if (!file) return { valid: false, error: 'No file selected.' };

  // Check file size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
    };
  }

  // Check extension
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `"${file.name}" has an unsupported format. Allowed formats: ${ALLOWED_EXTENSIONS.join(', ')}.`
    };
  }

  return { valid: true };
}
