import { apiGet } from './api.js';

(async function(){
  // My bookings
  try{
    const my = await apiGet('/api/bookings/my');
    if(my.success){
      const box = document.querySelector('#myBookings');
      if(box){
        box.innerHTML = (my.data||[]).map(b => `
          <div class="booking-row">
            <div>${b.event?.title}</div>
            <div>${new Date(b.createdAt).toLocaleString()}</div>
          </div>`).join('') || '<p>No bookings yet</p>';
      }
    }
  }catch(e){}

  // My hosted events
  try{
    const evs = await apiGet('/api/events?hostedBy=me');
    if(evs.success){
      const box = document.querySelector('#myHosted');
      if(box){
        box.innerHTML = (evs.data||[]).map(ev=>`
          <div class="event-row">
            <a href="event.html?id=${ev._id}">${ev.title}</a>
            <span>${new Date(ev.date).toLocaleDateString()}</span>
          </div>
        `).join('') || '<p>No events hosted yet</p>';
      }
    }
  }catch(e){}
})();