import axios from 'axios';

const API_BASE_URL = 'https://v2.jokeapi.dev';

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response?.data?.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchJokes = async (category: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/joke/${category}?type=single&amount=2`);
    if (response.data.error) {
      console.error(`Error fetching jokes for ${category}:`, response.data.message);
      return [];
    }

    return response?.data?.jokes?.map((joke: { joke: string }) => joke.joke);
  } catch (error) {
    console.error(`Error fetching jokes for ${category}:`, error);
    return [];
  }
};
