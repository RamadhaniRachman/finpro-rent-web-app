export const getImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // Clean up the URL string to handle Windows backslashes
  const cleanUrl = url.replace(/\\/g, '/');
  
  // Use the VITE_API_URL or fallback to localhost
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  
  // Since VITE_API_URL might end in /api, we need to extract the base URL
  // e.g. "https://my-backend.vercel.app/api" -> "https://my-backend.vercel.app"
  const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
  
  // Ensure no double slashes when joining
  const separator = cleanUrl.startsWith('/') ? '' : '/';
  
  return `${baseUrl}${separator}${cleanUrl}`;
};
