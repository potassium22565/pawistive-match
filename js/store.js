import {validateDogs} from './engine.js';
export const KEY='pawistive-dogs-v1';
export async function loadDogs(){let local;try{local=localStorage.getItem(KEY);}catch{}if(local)return validateDogs(JSON.parse(local));const r=await fetch('data/dogs.json');if(!r.ok)throw Error('Dog records could not be loaded.');return validateDogs(await r.json());}
export function saveDogs(d){localStorage.setItem(KEY,JSON.stringify(validateDogs(d)));}
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function portrait(d){return d.photo?`<div class="portrait"><img src="${esc(d.photo)}" alt="${esc(d.name)}" loading="lazy"></div>`:'<div class="portrait" aria-label="No dog photograph available">🐕</div>';}
export function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
