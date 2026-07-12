require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const sampleVideos = [
  { title:'Beautiful Nature Relaxation', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail_url:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400', duration:596, category:'Entertainment', tags:['nature'], is_featured:true },
  { title:'Learn JavaScript in 10 Minutes', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnail_url:'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400', duration:653, category:'Education', tags:['javascript'], is_featured:true },
  { title:'Epic Gaming Highlights', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail_url:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', duration:15, category:'Gaming', tags:['gaming'], is_featured:true },
  { title:'Cooking Italian Pasta', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnail_url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', duration:15, category:'Lifestyle', tags:['cooking'], is_featured:false },
  { title:'Top 10 Tech Gadgets', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnail_url:'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400', duration:60, category:'Technology', tags:['tech'], is_featured:false },
  { title:'Morning Yoga for Beginners', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnail_url:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', duration:900, category:'Lifestyle', tags:['yoga'], is_featured:false },
  { title:'World Cup Best Goals', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', thumbnail_url:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400', duration:600, category:'Sports', tags:['football'], is_featured:false },
  { title:'Stand Up Comedy Special', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', thumbnail_url:'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400', duration:888, category:'Comedy', tags:['comedy'], is_featured:true },
  { title:'Space Discovery News', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', thumbnail_url:'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400', duration:594, category:'News', tags:['space'], is_featured:false },
  { title:'Acoustic Guitar Covers', video_url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', thumbnail_url:'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', duration:734, category:'Music', tags:['guitar'], is_featured:true }
];

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('likes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('videos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Create users
  const adminPass = await bcrypt.hash('admin123', 10);
  const creatorPass = await bcrypt.hash('creator123', 10);

  const { data: admin, error: adminErr } = await supabase.from('users').insert({ username: 'admin', email: 'admin@streamify.com', password: adminPass, role: 'admin' }).select().single();
  if (adminErr) { console.error('Admin error:', adminErr.message); process.exit(1); }

  const { data: creator, error: creatorErr } = await supabase.from('users').insert({ username: 'creator1', email: 'creator@streamify.com', password: creatorPass, role: 'creator' }).select().single();
  if (creatorErr) { console.error('Creator error:', creatorErr.message); process.exit(1); }

  // Create videos
  const videos = sampleVideos.map(v => ({
    ...v,
    uploader_id: creator.id,
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 500)
  }));

  const { error: videoErr } = await supabase.from('videos').insert(videos);
  if (videoErr) { console.error('Video error:', videoErr.message); process.exit(1); }

  console.log('Done! Admin: admin@streamify.com/admin123, Creator: creator@streamify.com/creator123');
  process.exit(0);
}

seed();
