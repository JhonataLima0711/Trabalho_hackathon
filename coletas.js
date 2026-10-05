function collectionRender(){
  const s=RevaloraStore.get(), list=document.getElementById('collectionList'); if(!list)return;
  list.innerHTML=s.collections.map(c=>{const d=new Date(c.date+'T12:00:00');const day=String(d.getDate()).padStart(2,'0');const month=d.toLocaleDateString('pt-BR',{month:'short'}).replace('.','').toUpperCase();const badge=c.status==='Confirmada'?'green':'amber';return `<div class="collection-row"><span class="date-box ${c.status==='Confirmada'?'done':''}"><b>${day}</b><small>${month}</small></span><div><strong>${c.partner}</strong><small>${c.qty} ${c.unit} de ${c.material}</small></div><span class="badge ${badge}">${c.status}</span><span>${RevaloraStore.money(c.value)}</span><div class="collection-actions">${c.status!=='Confirmada'?`<button class="btn outline small confirm-collection" data-id="${c.id}">Confirmar destinação</button><button class="btn outline small cancel-collection" data-id="${c.id}">Cancelar</button>`:'<span class="green-text">✓ Finalizada</span>'}</div></div>`;}).join('');
  list.querySelectorAll('.confirm-collection').forEach(b=>b.addEventListener('click',()=>{if(RevaloraStore.confirmCollection(b.dataset.id)){showToast('Destinação confirmada. Créditos adicionados à carteira.');collectionRender();}}));
  list.querySelectorAll('.cancel-collection').forEach(b=>b.addEventListener('click',()=>{if(confirm('Cancelar esta coleta?')){RevaloraStore.cancelCollection(b.dataset.id);showToast('Coleta cancelada.');collectionRender();}}));
  const next=s.collections.find(c=>c.status!=='Confirmada');
  if(next){document.getElementById('nextPartner')?.replaceChildren(document.createTextNode(next.partner));document.getElementById('nextMaterial')?.replaceChildren(document.createTextNode(`${next.material} · ${next.qty} ${next.unit}`));document.getElementById('nextDate')?.replaceChildren(document.createTextNode(new Date(next.date+'T12:00:00').toLocaleDateString('pt-BR')));document.getElementById('nextTime')?.replaceChildren(document.createTextNode(next.time));}
}

document.addEventListener('DOMContentLoaded',()=>{
  const m=document.getElementById('collectionModal');
  document.getElementById('newCollection')?.addEventListener('click',()=>m?.classList.remove('hidden'));
  document.getElementById('collectionForm')?.addEventListener('submit',e=>{e.preventDefault();const material=document.getElementById('collectionMaterial').value.split('|');const date=document.getElementById('collectionDate').value;const time=document.getElementById('collectionTime').value;if(!date){showToast('Escolha uma data.');return;}RevaloraStore.addCollection({partner:'EcoCiclo',material:material[0],qty:Number(material[1]),unit:material[2],date,time,value:Number(material[3])});m.classList.add('hidden');e.target.reset();showToast('Coleta solicitada com sucesso.');collectionRender();});
  collectionRender(); window.addEventListener('revalora:updated',collectionRender);
});
