const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002',
  appSiteUrl: import.meta.env.VITE_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  supportWhatsapp: import.meta.env.VITE_DEFAULT_SUPPORT_WHATSAPP || '919142328629',
  fallbackImageUrl: import.meta.env.VITE_FALLBACK_IMAGE_URL || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
};

/**
 * Resolves full asset/image URL given relative path, localhost URL, backend URL, or absolute URL.
 * Automatically extracts /uploads/ relative paths from ANY domain (past, present, or future backend URLs)
 * and attaches the active environment's VITE_BACKEND_URL.
 * @param {string} img 
 * @returns {string}
 */
export const getAssetUrl = (img) => {
  if (!img) return config.fallbackImageUrl;
  
  let cleanImg = String(img).trim();

  // If path contains /uploads/, extract relative path starting from /uploads/
  // This automatically strips ANY domain (localhost, staging, or any future backend URL)
  const uploadsIndex = cleanImg.toLowerCase().indexOf('/uploads/');
  if (uploadsIndex !== -1) {
    cleanImg = cleanImg.slice(uploadsIndex);
  }

  // Strip configured backendUrl if cleanImg starts with it
  if (config.backendUrl && cleanImg.startsWith(config.backendUrl)) {
    cleanImg = cleanImg.slice(config.backendUrl.length);
  }

  // If it's a valid remote external URL (e.g. Unsplash, Cloudinary, AWS S3)
  if (cleanImg.startsWith('http://') || cleanImg.startsWith('https://') || cleanImg.startsWith('data:')) {
    return cleanImg;
  }

  // Prepend active environment's backend URL to relative paths (e.g., /uploads/... or uploads/...)
  const cleanPath = cleanImg.replace(/^\//, '');
  return `${config.backendUrl}/${cleanPath}`;
};

export default config;
