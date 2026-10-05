function dashboardRender(){
  const s=RevaloraStore.get();
  const set=(id,value)=>{const el=document.getElementById(id); if(el) el.textContent=value;};
  set('dashBalance',RevaloraStore.money(s.balance));
  set('dashPending',RevaloraStore.money(s.pending));
  set('dashRecovered',`${s.recoveredKg.toLocaleString('pt-BR')} kg`);
  set('dashCollections',s.collectionsCompleted);
  set('dashConfirmed',`${s.confirmedPercent}%`);
  set('dashMoved',RevaloraStore.money(s.movedValue));
  const meter=document.getElementById('impactMeter'); if(meter) meter.style.width=s.confirmedPercent+'%';
  set('impactPercent',`${s.confirmedPercent}%`);
  const list=document.getElementById('latestList');
  if(list){
    list.innerHTML=s.transactions.slice(0,5).map(t=>`<div class="latest-list-row"><i class="material-symbol ${t.type==='plus'?'paper':'oil'}">${t.type==='plus'?'♻':'◈'}</i><div><strong>${t.title}</strong><small>${t.detail}</small></div><b class="${t.type==='plus'?'green-text':''}">${t.type==='plus'?'+':'−'} ${RevaloraStore.money(t.value)}</b></div>`).join('');
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  dashboardRender();
  window.addEventListener('revalora:updated',dashboardRender);
  document.getElementById('resetDemoBtn')?.addEventListener('click',()=>{
    if(confirm('Restaurar os dados de demonstração do Revalora 2.0?')){RevaloraStore.reset();showToast('Dados de demonstração restaurados.');}
  });
});
