import { supabase } from './supabaseClient.js';

/**
 * Retrieves all teams, ordered by order_index.
 * @returns {Promise<Array>} List of teams
 */
export async function getTeams() {
    const { data, error } = await supabase.from('teams').select('*').order('order_index', { ascending: true });
    if (error) throw error;
    return data;
}

/**
 * Creates a new team.
 * @param {Object} team - Team data
 * @returns {Promise<Object>} Created team
 */
export async function createTeam(team) {
    const { data, error } = await supabase.from('teams').insert([team]).select();
    if (error) throw error;
    return data[0];
}

/**
 * Updates a team.
 * @param {string} id - Team ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated team
 */
export async function updateTeam(id, updates) {
    const { data, error } = await supabase.from('teams').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
}

/**
 * Deletes a team (cascades to its job vacancies).
 * @param {string} id - Team ID
 * @returns {Promise<Object>} Deleted data
 */
export async function deleteTeam(id) {
    const { data, error } = await supabase.from('teams').delete().eq('id', id);
    if (error) throw error;
    return data;
}
