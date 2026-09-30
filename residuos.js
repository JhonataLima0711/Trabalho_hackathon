document.addEventListener('DOMContentLoaded',()=>{
  const modal=document.getElementById('residueModal');
  const add=document.getElementById('addResidue');
  const type=document.getElementById('materialType'), qty=document.getElementById('materialQty'), unit=document.getElementById('materialUnit'), est=document.getElementById('materialEstimate');
  add?.addEventListener('click',()=>modal.classList.remove('hidden'));
  if(new URLSearchParams(location.search).get('action')==='add') modal?.classList.remove('hidden');
  function calc(){
    const opt=type?.options[type.selectedIndex], rate=Number(opt?.dataset.rate||0);
    unit.value=opt?.dataset.unit||'';
    est.textContent=(Number(qty.value||0)*rate).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  }
  type?.addEventListener('change',calc); qty?.addEventListener('input',calc);
  document.getElementById('residueForm')?.addEventListener('submit',e=>{
    e.preventDefault(); modal.classList.add('hidden'); e.target.reset(); calc();
    showToast('Resíduo adicionado ao catálogo.');
  });

  const search=document.getElementById('residueSearch'), filter=document.getElementById('residueFilter');
  const cards=[...document.querySelectorAll('.residue-item')];
  function apply(){
    const q=(search.value||'').toLowerCase(), f=filter.value;
    cards.forEach(c=>c.style.display=(c.textContent.toLowerCase().includes(q)&&(f==='Todos'||c.dataset.status===f))?'':'none');
  }
  search?.addEventListener('input',apply); filter?.addEventListener('change',apply);
});
