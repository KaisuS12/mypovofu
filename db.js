// ── Supabase config ──
const SUPABASE_URL = 'https://gtgbaangnkivsbixafsk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eVY5fo-lKV5d5oDTr6OouA_8fJkASGU';

let sb;
function initSB() {
  if (!sb) sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return sb;
}

async function dbGetAll(table) {
  const { data, error } = await initSB().from(table).select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

async function dbInsert(table, row) {
  const { data, error } = await initSB().from(table).insert([row]).select().single();
  if (error) throw error;
  return data;
}

async function dbDelete(table, id) {
  const { error } = await initSB().from(table).delete().eq('id', id);
  if (error) throw error;
}

async function uploadPhoto(file) {
  const ext      = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error: upErr } = await initSB().storage.from('photos').upload(filename, file, { cacheControl: '3600', upsert: false });
  if (upErr) throw upErr;
  const { data } = initSB().storage.from('photos').getPublicUrl(filename);
  return await dbInsert('photos', { name: file.name, url: data.publicUrl });
}

async function deletePhoto(id, url) {
  const filename = url.split('/').pop();
  await initSB().storage.from('photos').remove([filename]);
  await dbDelete('photos', id);
}
