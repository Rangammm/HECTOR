import { supabase } from './supabase.js';

// ═══════════════════════════════════════════
// TRIPS
// ═══════════════════════════════════════════

export async function getTrips(userId) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTripById(id) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createTrip(trip) {
  const { data, error } = await supabase
    .from('trips')
    .insert(trip)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrip(id, updates) {
  const { data, error } = await supabase
    .from('trips')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrip(id) {
  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════
// STOPS
// ═══════════════════════════════════════════

export async function getStops(tripId) {
  const { data, error } = await supabase
    .from('stops')
    .select('*')
    .eq('trip_id', tripId)
    .order('order_index');
  if (error) throw error;
  return data;
}

export async function createStop(stop) {
  const { data, error } = await supabase
    .from('stops')
    .insert(stop)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStop(id, updates) {
  const { data, error } = await supabase
    .from('stops')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStop(id) {
  const { error } = await supabase.from('stops').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderStops(tripId, orderedIds) {
  const updates = orderedIds.map((id, index) =>
    supabase.from('stops').update({ order_index: index }).eq('id', id)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}

// ═══════════════════════════════════════════
// ACTIVITIES
// ═══════════════════════════════════════════

export async function getActivities(stopId) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('stop_id', stopId)
    .order('time_slot');
  if (error) throw error;
  return data;
}

export async function createActivity(activity) {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteActivity(id) {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════
// BUDGET ITEMS
// ═══════════════════════════════════════════

export async function getBudgetItems(tripId) {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('category');
  if (error) throw error;
  return data;
}

export async function createBudgetItem(item) {
  const { data, error } = await supabase
    .from('budget_items')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBudgetItem(id) {
  const { error } = await supabase.from('budget_items').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════
// CHECKLIST
// ═══════════════════════════════════════════

export async function getChecklist(tripId) {
  const { data, error } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('category');
  if (error) throw error;
  return data;
}

export async function addChecklistItem(item) {
  const { data, error } = await supabase
    .from('checklist_items')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleChecklistItem(id, isPacked) {
  const { data, error } = await supabase
    .from('checklist_items')
    .update({ is_packed: isPacked })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════

export async function getNotes(tripId) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createNote(note) {
  const { data, error } = await supabase
    .from('notes')
    .insert(note)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote(id) {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════
// CITIES (public lookup)
// ═══════════════════════════════════════════

export async function searchCities(query = '', region = null) {
  let q = supabase
    .from('cities')
    .select('*')
    .order('popularity', { ascending: false });

  if (query) {
    q = q.ilike('name', `%${query}%`);
  }
  if (region) {
    q = q.eq('region', region);
  }

  const { data, error } = await q;
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════
// USER PROFILE
// ═══════════════════════════════════════════

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
