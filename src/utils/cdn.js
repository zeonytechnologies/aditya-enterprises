/**
 * Wraps a URL in the wsrv.nl free CDN proxy to save original bandwidth.
 * Only applies to http/https URLs.
 */
export const getCdnUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  
  // Don't proxy local files, data URIs, or SVGs
  if (!url.startsWith('http') || url.endsWith('.svg')) return url;
  
  // Replace the https:// or http:// and pass it to wsrv.nl
  const cleanUrl = url.replace(/^https?:\/\//, '');
  return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}`;
};
