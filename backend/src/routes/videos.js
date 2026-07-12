const express = require('express');
const Video = require('../models/Video');
const { protect, creatorOrAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1, limit = parseInt(req.query.limit) || 12;
    let query = { isPublished: true };
    if (req.query.category && req.query.category !== 'All') query.category = req.query.category;
    if (req.query.search) query.$text = { $search: req.query.search };
    const videos = await Video.find(query).populate('uploader','username avatar').sort(req.query.sort||'-createdAt').skip((page-1)*limit).limit(limit);
    const total = await Video.countDocuments(query);
    res.json({ videos, page, pages: Math.ceil(total/limit), total });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/featured', async (req, res) => { try { res.json(await Video.find({isPublished:true,isFeatured:true}).populate('uploader','username avatar').limit(6)); } catch(e){res.status(500).json({message:e.message});} });
router.get('/trending', async (req, res) => { try { res.json(await Video.find({isPublished:true}).populate('uploader','username avatar').sort('-views').limit(10)); } catch(e){res.status(500).json({message:e.message});} });
router.get('/categories', async (req, res) => { try { res.json(await Video.aggregate([{$match:{isPublished:true}},{$group:{_id:'$category',count:{$sum:1}}},{$sort:{count:-1}}])); } catch(e){res.status(500).json({message:e.message});} });

router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploader','username avatar').populate('comments.user','username avatar');
    if (!video) return res.status(404).json({ message: 'Not found' });
    video.views += 1; await video.save(); res.json(video);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', protect, creatorOrAdmin, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, duration, category, tags } = req.body;
    const video = await Video.create({ title, description, videoUrl, thumbnailUrl, duration, category, tags: tags||[], uploader: req.user._id });
    res.status(201).json(await Video.findById(video._id).populate('uploader','username avatar'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', protect, creatorOrAdmin, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    if (video.uploader.toString()!==req.user._id.toString()&&req.user.role!=='admin') return res.status(403).json({message:'Not authorized'});
    res.json(await Video.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('uploader','username avatar'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', protect, creatorOrAdmin, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    if (video.uploader.toString()!==req.user._id.toString()&&req.user.role!=='admin') return res.status(403).json({message:'Not authorized'});
    await Video.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/like', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    const uid = req.user._id;
    if (video.dislikedBy.includes(uid)) { video.dislikedBy.pull(uid); video.dislikes--; }
    if (video.likedBy.includes(uid)) { video.likedBy.pull(uid); video.likes--; } else { video.likedBy.push(uid); video.likes++; }
    await video.save(); res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/comment', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    video.comments.unshift({ user: req.user._id, text: req.body.text });
    await video.save();
    res.json((await Video.findById(req.params.id).populate('comments.user','username avatar')).comments);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
