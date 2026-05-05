import { supabase } from './supabaseClient.js';

const CACHE_TTL = 5 * 60 * 1000;
async function fetchWithCache(key, fetcher) {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
  } catch (e) {}
  const data = await fetcher();
  try { localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() })); } catch (e) {}
  return data;
}

/**
 * Retrieves all categories from the database.
 * @returns {Promise<Array>} List of categories
 */
export async function getCategories() {
  return fetchWithCache('cache_categories', async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  });
}

/**
 * Creates a new category.
 * @param {Object} category - Category data
 * @returns {Promise<Object>} Created category
 */
export async function createCategory(category) {
  const { data, error } = await supabase.from('categories').insert([category]).select();
  if (error) throw error;
  try { localStorage.removeItem('cache_categories'); } catch(e) {}
  return data[0];
}

/**
 * Updates an existing category.
 * @param {string} id - Category ID
 * @param {Object} updates - Data to update
 * @returns {Promise<Object>} Updated category
 */
export async function updateCategory(id, updates) {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select();
  if (error) throw error;
  try { localStorage.removeItem('cache_categories'); } catch(e) {}
  return data[0];
}

/**
 * Deletes a category.
 * @param {string} id - Category ID
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
  try { localStorage.removeItem('cache_categories'); } catch(e) {}
}
