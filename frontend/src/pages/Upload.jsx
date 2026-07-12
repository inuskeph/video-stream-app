import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { videoAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './Upload.css';
const CATS = ['Entertainment','Education','Music','Sports','Gaming','News','Technology','Comedy','Lifestyle','Other'];
function Upload() {
  const { user, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({title:'',description:'',videoUrl:'',thumbnailUrl:'',duration:'',category:'Entertainment',tags:''});
  const [loading, setLoading] = useState(false);
  if (!isAuthenticated||(user.role!=='admin'&&user.role!=='creator')) return <div className="upload-page"><div className="container" style={{textAlign:'center',padding:'100px'}}><h2>Access Denied</h2><p>Creator/Admin only</p></div></div>;
  const change = (e) => setForm({...form,[e.target.name]:e.target.value});
  const submit = async (e) => { e.preventDefault(); if(!form.title||!form.videoUrl){toast.error('Title & URL required');return;} setLoading(true); try{await videoAPI.create({...form,duration:parseInt(form.duration)||0,tags:form.tags.split(',').map(t=>t.trim()).filter(Boolean)});toast.success('Uploaded!');nav('/');}catch(e){toast.error('Failed');}finally{setLoading(false);} };
  return (<div className="upload-page"><div className="container"><div className="upload-card">
    <div className="upload-header"><h1><FiUploadCloud/> Upload Video</h1></div>
    <form className="upload-form" onSubmit={submit}>
      <div className="form-group"><label>Title *</label><input name="title" placeholder="Video title" value={form.title} onChange={change} required/></div>
      <div className="form-group"><label>Description</label><textarea name="description" placeholder="Description..." value={form.description} onChange={change}/></div>
      <div className="form-group"><label>Video URL *</label><input name="videoUrl" placeholder="https://... (.mp4)" value={form.videoUrl} onChange={change} required/><span className="form-help">Direct link to video file</span></div>
      <div className="form-group"><label>Thumbnail URL</label><input name="thumbnailUrl" placeholder="https://..." value={form.thumbnailUrl} onChange={change}/></div>
      <div className="form-row"><div className="form-group"><label>Category</label><select name="category" value={form.category} onChange={change}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div><div className="form-group"><label>Duration (sec)</label><input name="duration" type="number" placeholder="300" value={form.duration} onChange={change}/></div></div>
      <div className="form-group"><label>Tags</label><input name="tags" placeholder="tag1, tag2, tag3" value={form.tags} onChange={change}/></div>
      <button type="submit" className="btn btn-primary btn-full" disabled={loading}><FiUploadCloud/> {loading?'Uploading...':'Upload'}</button>
    </form>
  </div></div></div>);
}
export default Upload;
