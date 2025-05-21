import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const searchRecipes = (query) =>
  axios.get(`${API_URL}/search`, { params: { query } });

export const filterRecipes = (filters) =>
  axios.post(`${API_URL}/filter`, filters);

export const advancedSearch = (q) =>
  axios.get(`${API_URL}/advanced`, { params: { q } });
