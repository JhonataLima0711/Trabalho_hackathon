document.addEventListener('DOMContentLoaded',()=>{
  const cards=[...document.querySelectorAll('.partner-v2-card')], search=document.getElementById('partnerSearch');
  let filter='all';
  function apply(){
    const q=(search.value||'').toLowerCase();
    cards.forEach(c=>{
      const matchFilter=filter==='all'||c.dataset.tags.includes(filter);
      c.style.display=matchFilter&&c.textContent.toLowerCase().includes(q)?'':'none';
    });
  }
  search?.addEventListener('input',apply);
  document.querySelectorAll('.chip').forEach(ch=>{
    ch.addEventListener('click',()=>{
      document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));ch.classList.add('active');
      filter=ch.dataset.filter;apply();
    });
  });
});
