import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const searchRecipes = (query, filters = {}, page = 1) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v && v !== '')
  );
  
  if (Object.keys(activeFilters).length > 0) {
    return axios.post(`${API_URL}/search?page=${page}`, {
      query,
      filters: activeFilters
    });
  } else {
    return axios.get(`${API_URL}/search`, { params: { query, page } });
  }
};

export const advancedSearch = (q, filters = {}, page = 1) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v && v !== '')
  );
  
  if (Object.keys(activeFilters).length > 0) {
    return axios.post(`${API_URL}/advanced?page=${page}`, {
      query: q,
      filters: activeFilters
    });
  } else {
    return axios.get(`${API_URL}/advanced`, { params: { q, page } });
  }
};

export const filterRecipes = (filters, page = 1) =>
  axios.post(`${API_URL}/filter?page=${page}`, filters);