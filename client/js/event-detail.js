import { apiGet, apiPost, requireLogin } from './api.js';

function qs(s){ return document.querySelector(s); }

const url = new URL(location.href);
const id = url.searchParams.get('id');
if(!id){
  document.body.innerHTML = '<p style="padding:20px;color:red">Missing event id</p>';
  throw new Error('missing id');
}

(async function(){
  const data = await apiGet('/api/events/' + id);
  if(!data.success) return alert(data.message || 'Failed');
  const ev = data.data;
  // Fill basics
  const title = qs('#eventTitle'); if(title) title.textContent = ev.title;
  const flyer = qs('#flyerImg'); if(flyer) flyer.src = ev.flyerUrl || 'images/placeholder.jpg';
  const about = qs('#aboutText'); if(about) about.textContent = ev.description || '';
  const org = qs('#organizerLink'); if(org) org.textContent = ev.host?.name || 'Organizer';
  const metaList = qs('#metaList');
  if(metaList){
    metaList.innerHTML = `
      <li><img src="images/calendar.png" alt=""> ${new Date(ev.date).toLocaleDateString()}</li>
      <li><img src="images/clock.png" alt=""> ${ev.time || ''}</li>
      <li><img src="images/hourglass.png" alt=""> ${ev.duration ? ev.duration + ' hrs' : ''}</li>
      <li><img src="images/age-group.png" alt=""> ${ev.requirements?.age || 'All ages'}</li>
      <li><img src="images/translate.png" alt=""> ${(ev.requirements?.languages||[]).join(', ')}</li>
      <li><img src="images/location.png" alt=""> ${ev.venue || ev.location || ''}</li>
    `;
  }

  // Booking button
  const btn = qs('#btnConfirm');
  if(btn){
    btn.addEventListener('click', async () => {
      // optional: check auth by hitting /api/auth/is-authenticated
      const res = await apiPost('/api/bookings', { eventId: ev._id });
      if(!res.success){
        if((res.message||'').toLowerCase().includes('unauthorized')){
          return requireLogin(location.href);
        }
        return alert(res.message || 'Failed to book');
      }
      alert('Booked! Check My Events');
      location.href = 'dashboard.html#my-events';
    });
  }
})();