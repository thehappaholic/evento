const API_BASE = (window.API_BASE || 'http://localhost:3000'); // change if needed

export async function apiGet(path, opts={}){
  const res = await fetch(API_BASE + path, { credentials:'include', ...opts });
  if(!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

export async function apiPost(path, body, opts={}){
  const isForm = body instanceof FormData;
  const headers = isForm ? {} : { 'Content-Type':'application/json' };
  const res = await fetch(API_BASE + path, {
    method:'POST',
    credentials:'include',
    headers,
    body: isForm ? body : JSON.stringify(body),
    ...opts
  });
  return res.json();
}

export function requireLogin(redirectTo=location.href){
  location.href = `login.html?next=${encodeURIComponent(redirectTo)}`;
}
