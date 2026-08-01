/**
 * File Download Utility
 */

/**
 * Triggers a browser download for a Blob response
 * @param {Blob|ArrayBuffer|string} blobData 
 * @param {string} filename 
 * @param {string} contentType 
 */
export const downloadBlobFile = (blobData, filename = 'document.pdf', contentType = 'application/pdf') => {
  const blob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: contentType });
  const url = (window.URL || window.webkitURL).createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  (window.URL || window.webkitURL).revokeObjectURL(url);
};
