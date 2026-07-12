require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');
const User = require('./models/User');
const connectDB = require('./config/db');

const sampleVideos = [
  { title:'Beautiful Nature Relaxation', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400', duration:596, category:'Entertainment', tags:['nature'], isFeatured:true },
  { title:'Learn JavaScript in 10 Minutes', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400', duration:653, category:'Education', tags:['javascript'], isFeatured:true },
  { title:'Epic Gaming Highlights', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', duration:15, category:'Gaming', tags:['gaming'], isFeatured:true },
  { title:'Cooking Italian Pasta', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', duration:15, category:'Lifestyle', tags:['cooking'] },
  { title:'Top 10 Tech Gadgets', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400', duration:60, category:'Technology', tags:['tech'] },
  { title:'Morning Yoga for Beginners', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', duration:900, category:'Lifestyle', tags:['yoga'] },
  { title:'World Cup Best Goals', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400', duration:600, category:'Sports', tags:['football'] },
  { title:'Stand Up Comedy Special', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400', duration:888, category:'Comedy', tags:['comedy'], isFeatured:true },
  { title:'Space Discovery News', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400', duration:594, category:'News', tags:['space'] },
  { title:'Acoustic Guitar Covers', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', thumbnailUrl:'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', duration:734, category:'Music', tags:['guitar'], isFeatured:true }
];

async function seed() {
  await connectDB();
  await Video.deleteMany({}); await User.deleteMany({});
  await User.create({username:'admin',email:'admin@streamify.com',password:'admin123',role:'admin'});
  const creator = await User.create({username:'creator1',email:'creator@streamify.com',password:'creator123',role:'creator'});
  await Video.insertMany(sampleVideos.map(v=>({...v,uploader:creator._id,views:Math.floor(Math.random()*10000),likes:Math.floor(Math.random()*500)})));
  console.log('Done! Admin: admin@streamify.com/admin123, Creator: creator@streamify.com/creator123');
  process.exit(0);
}
seed();
