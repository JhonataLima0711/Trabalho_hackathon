document.addEventListener('DOMContentLoaded',()=>{
  const m=document.getElementById('collectionModal');
  document.getElementById('newCollection')?.addEventListener('click',()=>m.classList.remove('hidden'));
  document.getElementById('collectionForm')?.addEventListener('submit',e=>{
    e.preventDefault();m.classList.add('hidden');e.target.reset();showToast('Coleta solicitada com sucesso.');
  });
});
