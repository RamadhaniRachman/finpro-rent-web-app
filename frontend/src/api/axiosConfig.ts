import axios from "axios";

// Deteksi otomatis: Jika berjalan di localhost, tembak backend lokal.
// Jika di Vercel, tembak path relatif "/api" (akan di-proxy oleh Vercel Rewrites)
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const baseURL = isLocalhost 
  ? "http://localhost:8000/api" 
  : "/api"; 

const api = axios.create({
  baseURL,
  withCredentials: true, // WAJIB agar cookie terkirim otomatis
});

export default api;
