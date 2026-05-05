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
 * Retrieves global settings from the database.
 * @returns {Promise<Object>} Settings object
 */
export async function getSettings() {
  return fetchWithCache('cache_settings', async () => {
    const { data, error } = await supabase.from('settings').select('*').single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || {};
  });
}

/**
 * Updates global settings.
 * @param {Object} updates - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
export async function updateSettings(updates) {
  const { data, error } = await supabase.from('settings').upsert({ id: 1, ...updates }).select();
  if (error) throw error;
  try { localStorage.removeItem('cache_settings'); } catch(e) {}
  return data[0];
}

/**
 * Subscribes to real-time changes on the settings table.
 * @param {Function} callback - Function to call when settings change
 * @returns {Object} Subscription channel
 */
export function subscribeToSettings(callback) {
  const channel = supabase
    .channel('settings_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'settings' },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}
