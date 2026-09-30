function showToast(message){
  document.querySelectorAll('.toast-v2').forEach(x=>x.remove());
  const t=document.createElement('div');
  t.className='toast-v2'; t.textContent=message; document.body.appendChild(t);
  setTimeout(()=>t.classList.add('out'),2200); setTimeout(()=>t.remove(),2500);
}

function applyTheme(){
  const dark = localStorage.getItem('revalora_theme') === 'dark';
  document.body.classList.toggle('dark', dark);
  const toggle=document.getElementById('darkToggle');
  if(toggle) toggle.checked=dark;
}
function applyCompact(){
  const compact = localStorage.getItem('revalora_compact') === '1';
  document.body.classList.toggle('compact', compact);
  const toggle=document.getElementById('compactToggle');
  if(toggle) toggle.checked=compact;
}

document.addEventListener('DOMContentLoaded',()=>{
  applyTheme(); applyCompact();

  document.querySelectorAll('.show-pass').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const input=document.getElementById(btn.dataset.target);
      input.type=input.type==='password'?'text':'password';
      btn.textContent=input.type==='password'?'mostrar':'ocultar';
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn=>{
    btn.addEventListener('click',()=>btn.closest('.modal')?.classList.add('hidden'));
  });
  document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{
    if(e.target===m)m.classList.add('hidden');
  }));
  document.querySelectorAll('[data-toast]').forEach(el=>{
    el.addEventListener('click',e=>{
      if(el.tagName==='A' && el.getAttribute('href')==='#')e.preventDefault();
      showToast(el.dataset.toast);
    });
  });

  const settingsBtn=document.getElementById('settingsBtn');
  const panel=document.getElementById('settingsPanel');
  const overlay=document.getElementById('settingsOverlay');
  const close=document.getElementById('closeSettings');
  const openSettings=()=>{panel?.classList.add('open');overlay?.classList.add('show');applyTheme();applyCompact();};
  const closeSettings=()=>{panel?.classList.remove('open');overlay?.classList.remove('show');};
  settingsBtn?.addEventListener('click',openSettings);
  close?.addEventListener('click',closeSettings);
  overlay?.addEventListener('click',closeSettings);

  document.getElementById('darkToggle')?.addEventListener('change',e=>{
    localStorage.setItem('revalora_theme',e.target.checked?'dark':'light');
    applyTheme();
  });
  document.getElementById('compactToggle')?.addEventListener('change',e=>{
    localStorage.setItem('revalora_compact',e.target.checked?'1':'0');
    applyCompact();
  });
  document.getElementById('settingsSave')?.addEventListener('click',()=>{
    const n=document.getElementById('notifyToggle');
    localStorage.setItem('revalora_notify',n.checked?'1':'0');
    showToast('Preferências salvas.');
    closeSettings();
  });
});
