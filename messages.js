import { supabase } from './supabaseClient.js';

/**
 * Retrieves all messages from the database.
 * @returns {Promise<Array>} List of messages
 */
export async function getMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Creates a new message (inquiry).
 * @param {Object} message - Message data
 * @returns {Promise<Object>} Created message
 */
export async function createMessage(message) {
  const { data, error } = await supabase.from('messages').insert([{ ...message, is_read: false }]).select();
  if (error) throw error;
  return data[0];
}

/**
 * Marks a message as read.
 * @param {string} id - Message ID
 * @returns {Promise<Object>} Updated message
 */
export async function markMessageRead(id) {
  const { data, error } = await supabase.from('messages').update({ is_read: true }).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

/**
 * Marks a message as unread.
 * @param {string} id - Message ID
 * @returns {Promise<Object>} Updated message
 */
export async function markMessageUnread(id) {
  const { data, error } = await supabase.from('messages').update({ is_read: false }).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

/**
 * Deletes a message.
 * @param {string} id - Message ID
 * @returns {Promise<Object>} Deleted data
 */
export async function deleteMessage(id) {
  const { data, error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
  return data;
}
