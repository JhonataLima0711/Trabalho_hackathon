function residueRender(){
  const s=RevaloraStore.get();
  const cards=document.getElementById('residueCards');
  if(!cards) return;
  const search=(document.getElementById('residueSearch')?.value||'').toLowerCase();
  const filter=document.getElementById('residueFilter')?.value||'Todos';
  const filtered=s.residues.filter(r=>(filter==='Todos'||r.status===filter) && `${r.type} ${r.partner}`.toLowerCase().includes(search));
  cards.innerHTML=filtered.map(r=>{
    const icon=r.type.includes('Óleo')?'🛢️':r.type.includes('Metal')||r.type.includes('Alumínio')?'🔩':r.type.includes('Plástico')?'🧴':'📦';
    const cls=r.status==='Disponível'?'green':r.status==='Em coleta'?'amber':'gray';
    return `<article class="residue-item" data-status="${r.status}"><div class="material-symbol paper">${icon}</div><div class="residue-info"><strong>${r.type}</strong><small>${r.qty} ${r.unit} · ${r.date} · ${r.partner}</small></div><div class="residue-value"><strong>${RevaloraStore.money(r.qty*r.rate)}</strong><span class="badge ${cls}">${r.status}</span></div>${r.status==='Disponível'?`<button class="btn outline small residue-collect" data-id="${r.id}">Solicitar coleta</button>`:''}</article>`;
  }).join('') || '<div class="empty-state">Nenhum resíduo encontrado.</div>';
  const available=s.residues.filter(r=>r.status==='Disponível').reduce((a,r)=>a+(r.unit==='kg'?r.qty:0),0);
  const value=s.residues.filter(r=>r.status!=='Destinado').reduce((a,r)=>a+r.qty*r.rate,0);
  document.getElementById('residueAvailable')?.replaceChildren(document.createTextNode(`${available.toLocaleString('pt-BR')} kg`));
  document.getElementById('residueValue')?.replaceChildren(document.createTextNode(RevaloraStore.money(value)));
  document.getElementById('residueInCollection')?.replaceChildren(document.createTextNode(String(s.residues.filter(r=>r.status==='Em coleta').length)));
  cards.querySelectorAll('.residue-collect').forEach(btn=>btn.addEventListener('click',()=>{
    const r=s.residues.find(x=>x.id===Number(btn.dataset.id)); if(!r) return;
    const value=r.qty*r.rate;
    RevaloraStore.addCollection({partner:r.partner==='A definir'?'EcoCiclo':r.partner,material:r.type,qty:r.qty,unit:r.unit,date:new Date(Date.now()+86400000).toISOString().slice(0,10),time:'08:00–10:00',value});
    const state=RevaloraStore.get(); const same=state.residues.find(x=>x.id===r.id); if(same) same.status='Em coleta'; RevaloraStore.save(state);
    showToast('Coleta solicitada. Agora ela aparece em Coletas.');
    residueRender();
  }));
}

document.addEventListener('DOMContentLoaded',()=>{
  const modal=document.getElementById('residueModal');
  document.getElementById('addResidue')?.addEventListener('click',()=>modal?.classList.remove('hidden'));
  if(new URLSearchParams(location.search).get('action')==='add') modal?.classList.remove('hidden');
  const type=document.getElementById('materialType'),qty=document.getElementById('materialQty'),unit=document.getElementById('materialUnit'),est=document.getElementById('materialEstimate');
  function calc(){const opt=type?.options[type.selectedIndex],rate=Number(opt?.dataset.rate||0);if(unit)unit.value=opt?.dataset.unit||'';if(est)est.textContent=RevaloraStore.money(Number(qty?.value||0)*rate);}
  type?.addEventListener('change',calc); qty?.addEventListener('input',calc);
  document.getElementById('residueForm')?.addEventListener('submit',e=>{e.preventDefault();const opt=type.options[type.selectedIndex];if(!opt?.value)return;RevaloraStore.addResidue(opt.text,Number(qty.value),opt.dataset.unit,Number(opt.dataset.rate));modal.classList.add('hidden');e.target.reset();calc();showToast('Resíduo adicionado ao catálogo.');residueRender();});
  document.getElementById('residueSearch')?.addEventListener('input',residueRender);document.getElementById('residueFilter')?.addEventListener('change',residueRender);
  residueRender(); window.addEventListener('revalora:updated',residueRender);
});
