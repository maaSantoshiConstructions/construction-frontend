/**
 * Validates image files before upload
 * @param {File[]} files
 * @param {Object} options
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFiles(files, options = {}) {
  const {
    maxCount = 10,
    maxSizeBytes = 5 * 1024 * 1024, // 5MB limit
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions = ['jpeg', 'jpg', 'png', 'webp', 'gif'],
  } = options;

  if (!files || files.length === 0) {
    return { valid: true };
  }

  if (files.length > maxCount) {
    return {
      valid: false,
      error: `Maximum ${maxCount} images allowed. You selected ${files.length} images.`,
    };
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Check size
    if (file.size > maxSizeBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File "${file.name}" exceeds the 5MB size limit (file size: ${sizeMb}MB). Please select smaller files.`,
      };
    }

    // Check mime type and extension
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const typeValid = allowedTypes.includes(file.type.toLowerCase()) || allowedExtensions.includes(ext);

    if (!typeValid) {
      return {
        valid: false,
        error: `File "${file.name}" has an invalid format. Allowed formats are: JPG, JPEG, PNG, WEBP, GIF.`,
      };
    }
  }

  return { valid: true };
}
