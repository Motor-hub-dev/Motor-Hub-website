import { supabase } from './supabaseClient.js';

/**
 * Retrieves all applications (admin use).
 * @returns {Promise<Array>} List of applications with job/team info
 */
export async function getApplications() {
    const { data, error } = await supabase
        .from('applications')
        .select('*, job_vacancies(title_en, title_ar, teams(name_en, name_ar))')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

/**
 * Creates a new application (public-facing).
 * @param {Object} application - Application data
 * @returns {Promise<Object>} Created application
 */
export async function createApplication(application) {
    const { error } = await supabase.from('applications').insert([application]);
    if (error) throw error;
    return null;
}

/**
 * Deletes an application.
 * @param {string} id - Application ID
 * @returns {Promise<Object>} Deleted data
 */
export async function deleteApplication(id) {
    const { data, error } = await supabase.from('applications').delete().eq('id', id);
    if (error) throw error;
    return data;
}

/**
 * Uploads a resume/CV file to the private resumes bucket.
 * @param {File} file - The file to upload
 * @returns {Promise<string>} The storage path of the uploaded file
 */
export async function uploadResume(file) {
    if (!file) throw new Error('No file provided.');
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `applications/${fileName}`;

    const { data, error } = await supabase.storage.from('resumes').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
    });

    if (error) {
        console.error('Resume Upload Error:', error.message);
        throw error;
    }

    // Return the storage path (not a public URL since bucket is private)
    return filePath;
}

/**
 * Gets a signed URL for a resume (admin download).
 * @param {string} filePath - The storage path
 * @param {number} [expiresIn=3600] - Seconds until the URL expires
 * @returns {Promise<string>} Signed download URL
 */
export async function getResumeSignedUrl(filePath, expiresIn = 3600) {
    const { data, error } = await supabase.storage.from('resumes').createSignedUrl(filePath, expiresIn);
    if (error) throw error;
    return data.signedUrl;
}
