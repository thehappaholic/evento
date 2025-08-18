import { apiPost } from './api.js';

const form = document.querySelector('#createEventForm');
if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const res = await apiPost('/api/events', fd);
    if(!res.success){
      alert(res.message || 'Failed to create event');
      return;
    }
    const id = res.data?._id;
    if(id){
      location.href = `event.html?id=${id}`;
    } else {
      location.href = 'dashboard.html';
    }
  });
}