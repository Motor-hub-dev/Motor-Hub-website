import { supabase } from './supabaseClient.js';

/**
 * Retrieves job vacancies, optionally filtered by team.
 * @param {string} [teamId] - Optional team ID to filter by
 * @returns {Promise<Array>} List of job vacancies
 */
export async function getJobs(teamId) {
    let query = supabase.from('job_vacancies').select('*, teams(name_en, name_ar)').order('order_index', { ascending: true });
    if (teamId) query = query.eq('team_id', teamId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

/**
 * Retrieves only active job vacancies (for public careers page).
 * @returns {Promise<Array>} List of active job vacancies
 */
export async function getActiveJobs() {
    const { data, error } = await supabase
        .from('job_vacancies')
        .select('*, teams(name_en, name_ar)')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
    if (error) throw error;
    return data;
}

/**
 * Creates a new job vacancy.
 * @param {Object} job - Job data
 * @returns {Promise<Object>} Created job
 */
export async function createJob(job) {
    const { data, error } = await supabase.from('job_vacancies').insert([job]).select();
    if (error) throw error;
    return data[0];
}

/**
 * Updates a job vacancy.
 * @param {string} id - Job ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated job
 */
export async function updateJob(id, updates) {
    const { data, error } = await supabase.from('job_vacancies').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
}

/**
 * Deletes a job vacancy.
 * @param {string} id - Job ID
 * @returns {Promise<Object>} Deleted data
 */
export async function deleteJob(id) {
    const { data, error } = await supabase.from('job_vacancies').delete().eq('id', id);
    if (error) throw error;
    return data;
}
