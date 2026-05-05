import { supabase } from './supabaseClient.js';

// ======== MAIN GALLERY IMAGES ========

export async function getGalleryImages() {
  const { data, error } = await supabase.from('gallery_images').select('*').order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createGalleryImage(imageData) {
  const { data, error } = await supabase.from('gallery_images').insert([imageData]).select();
  if (error) throw error;
  return data[0];
}

export async function updateGalleryImage(id, updates) {
  const { data, error } = await supabase.from('gallery_images').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteGalleryImage(id) {
  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) throw error;
}


