import { apiGet } from './api.js';

(async function(){
  try{
    const json = await apiGet('/api/events');
    if(!json.success) throw new Error(json.message || 'Failed to load events');
    const list = json.data || [];
    const grid = document.querySelector('.event-grid');
    if(!grid) return;
    grid.innerHTML = '';
    list.forEach(ev => {
      const el = document.createElement('div');
      el.className = 'event-card';
      el.onclick = () => location.href = `event.html?id=${ev._id}`;
      el.innerHTML = `
        <img src="${ev.flyerUrl || 'images/placeholder.jpg'}" alt="Event Image" />
        <h3>${ev.title}</h3>
        <p class="meta">📅 ${new Date(ev.date).toLocaleDateString()} | 📍 ${ev.location || ''}</p>
        <p class="desc">${ev.description?.slice(0,120) || ''}</p>
        <div class="tags"><span>${ev.type||''}</span><span>${ev.mode||''}</span>${ev.isFree?'<span>Free</span>':''}</div>
      `;
      grid.appendChild(el);
    });
  }catch(e){
    console.error(e);
  }
})();
