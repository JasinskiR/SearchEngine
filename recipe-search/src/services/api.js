import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const searchRecipes = (query, page = 1) =>
  axios.get(`${API_URL}/search`, { params: { query, page } });

export const filterRecipes = (filters, page = 1) =>
  axios.post(`${API_URL}/filter?page=${page}`, filters);

export const advancedSearch = (q, page = 1) =>
  axios.get(`${API_URL}/advanced`, { params: { q, page } });
