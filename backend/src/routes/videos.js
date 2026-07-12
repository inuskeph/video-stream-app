const express = require('express');
const supabase = require('../config/db');
const { protect, creatorOrAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/videos - list videos with pagination, search, filter
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    let query = supabase.from('videos').select('*, uploader:users(id, username, avatar)', { count: 'exact' }).eq('is_published', true);

    if (req.query.category && req.query.category !== 'All') {
      query = query.eq('category', req.query.category);
    }
    if (req.query.search) {
      query = query.or(`title.ilike.%${req.query.search}%,description.ilike.%${req.query.search}%,tags.cs.{${req.query.search}}`);
    }

    const sort = req.query.sort || '-created_at';
    const ascending = !sort.startsWith('-');
    const sortField = sort.replace('-', '');
    query = query.order(sortField, { ascending }).range(offset, offset + limit - 1);

    const { data: videos, count, error } = await query;
    if (error) return res.status(500).json({ message: error.message });

    res.json({ videos, page, pages: Math.ceil((count || 0) / limit), total: count || 0 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/videos/featured
router.get('/featured', async (req, res) => {
  try {
    const { data, error } = await supabase.from('videos').select('*, uploader:users(id, username, avatar)').eq('is_published', true).eq('is_featured', true).order('created_at', { ascending: false }).limit(6);
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/videos/trending
router.get('/trending', async (req, res) => {
  try {
    const { data, error } = await supabase.from('videos').select('*, uploader:users(id, username, avatar)').eq('is_published', true).order('views', { ascending: false }).limit(10);
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/videos/categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('videos').select('category').eq('is_published', true);
    if (error) return res.status(500).json({ message: error.message });
    const counts = {};
    data.forEach(v => { counts[v.category] = (counts[v.category] || 0) + 1; });
    res.json(Object.entries(counts).map(([_id, count]) => ({ _id, count })).sort((a, b) => b.count - a.count));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/videos/:id
router.get('/:id', async (req, res) => {
  try {
    const { data: video, error } = await supabase.from('videos').select('*, uploader:users(id, username, avatar)').eq('id', req.params.id).single();
    if (error || !video) return res.status(404).json({ message: 'Video not found' });

    // Increment views
    await supabase.from('videos').update({ views: (video.views || 0) + 1 }).eq('id', req.params.id);
    video.views += 1;

    // Get comments
    const { data: comments } = await supabase.from('comments').select('*, user:users(id, username, avatar)').eq('video_id', req.params.id).order('created_at', { ascending: false });
    video.comments = comments || [];

    // Format for frontend compatibility
    video._id = video.id;
    video.createdAt = video.created_at;
    video.thumbnailUrl = video.thumbnail_url;
    video.videoUrl = video.video_url;
    video.isFeatured = video.is_featured;

    res.json(video);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/videos
router.post('/', protect, creatorOrAdmin, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, duration, category, tags } = req.body;
    const { data, error } = await supabase.from('videos').insert({
      title, description, video_url: videoUrl, thumbnail_url: thumbnailUrl,
      duration: duration || 0, category: category || 'Other',
      tags: tags || [], uploader_id: req.user.id
    }).select('*, uploader:users(id, username, avatar)').single();
    if (error) return res.status(500).json({ message: error.message });
    data._id = data.id;
    res.status(201).json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/videos/:id
router.put('/:id', protect, creatorOrAdmin, async (req, res) => {
  try {
    const { data: video } = await supabase.from('videos').select('uploader_id').eq('id', req.params.id).single();
    if (!video) return res.status(404).json({ message: 'Not found' });
    if (video.uploader_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.videoUrl) updates.video_url = req.body.videoUrl;
    if (req.body.thumbnailUrl) updates.thumbnail_url = req.body.thumbnailUrl;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.tags) updates.tags = req.body.tags;

    const { data, error } = await supabase.from('videos').update(updates).eq('id', req.params.id).select('*, uploader:users(id, username, avatar)').single();
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/videos/:id
router.delete('/:id', protect, creatorOrAdmin, async (req, res) => {
  try {
    const { data: video } = await supabase.from('videos').select('uploader_id').eq('id', req.params.id).single();
    if (!video) return res.status(404).json({ message: 'Not found' });
    if (video.uploader_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    await supabase.from('videos').delete().eq('id', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/videos/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const { data: existing } = await supabase.from('likes').select('id').eq('video_id', req.params.id).eq('user_id', req.user.id).single();
    if (existing) {
      await supabase.from('likes').delete().eq('id', existing.id);
      await supabase.rpc('decrement_likes', { video_id_input: req.params.id });
    } else {
      await supabase.from('likes').insert({ video_id: req.params.id, user_id: req.user.id });
      await supabase.rpc('increment_likes', { video_id_input: req.params.id });
    }
    const { data: video } = await supabase.from('videos').select('likes').eq('id', req.params.id).single();
    res.json({ likes: video?.likes || 0, dislikes: 0 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/videos/:id/comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    await supabase.from('comments').insert({ video_id: req.params.id, user_id: req.user.id, text: req.body.text });
    const { data: comments } = await supabase.from('comments').select('*, user:users(id, username, avatar)').eq('video_id', req.params.id).order('created_at', { ascending: false });
    res.json(comments);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
