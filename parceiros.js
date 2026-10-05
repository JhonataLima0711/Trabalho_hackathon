function partnerRender(){
  const cards=[...document.querySelectorAll('.partner-v2-card')], search=document.getElementById('partnerSearch');
  const filter=document.querySelector('.chip.active')?.dataset.filter||'all'; const q=(search?.value||'').toLowerCase();
  cards.forEach(c=>{const tags=c.dataset.tags||'';c.style.display=(filter==='all'||tags.includes(filter))&&c.textContent.toLowerCase().includes(q)?'':'none';});
}
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('partnerSearch')?.addEventListener('input',partnerRender);
  document.querySelectorAll('.chip').forEach(ch=>ch.addEventListener('click',()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));ch.classList.add('active');partnerRender();}));
  document.querySelectorAll('.partner-request').forEach(btn=>btn.addEventListener('click',()=>{const partner=btn.dataset.partner; const samples={EcoÓleo:['Óleo lubrificante',80,'L',284],MetalVerde:['Sucata metálica',32,'kg',96.20],EcoCiclo:['Papelão',126,'kg',73.08], 'Recicla Centro':['Papelão',60,'kg',34.80]}; const x=samples[partner]||['Material reciclável',1,'kg',1]; RevaloraStore.addCollection({partner,material:x[0],qty:x[1],unit:x[2],date:new Date(Date.now()+86400000).toISOString().slice(0,10),time:'08:00–10:00',value:x[3]});showToast(`Coleta solicitada para ${partner}. Confira em Coletas.`);}));
  partnerRender();
});
