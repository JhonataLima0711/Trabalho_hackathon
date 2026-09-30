function getUser(){
  try{return JSON.parse(localStorage.getItem('revalora_user'))||null}catch{return null}
}
const appPages=['dashboard.html','residuos.html','coletas.html','parceiros.html','carteira.html'];

document.addEventListener('DOMContentLoaded',()=>{
  const user=getUser();
  const current=location.pathname.split('/').pop()||'index.html';

  if(appPages.includes(current)&&!user){location.href='login.html';return;}

  if(user){
    const company=user.company||'Minha Empresa';
    const email=user.email||'empresa@email.com';
    const initials=company.split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'RV';
    document.querySelectorAll('#topAvatar,#settingsAvatar').forEach(x=>x.textContent=initials);
    document.querySelectorAll('#settingsCompany').forEach(x=>x.textContent=company);
    document.querySelectorAll('#settingsEmail').forEach(x=>x.textContent=email);
    document.querySelectorAll('#companyIntro').forEach(x=>x.textContent=`Resumo de ${company}.`);
  }

  document.getElementById('logoutLink')?.addEventListener('click',e=>{
    e.preventDefault(); localStorage.removeItem('revalora_user'); location.href='login.html';
  });

  document.getElementById('loginForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.getElementById('loginEmail').value.trim();
    const password=document.getElementById('loginPassword').value.trim();
    const alert=document.getElementById('authAlert');
    if(!email||!password){alert.textContent='Preencha e-mail e senha.';alert.className='alert error';return;}
    let saved=getUser();
    localStorage.setItem('revalora_user',JSON.stringify({
      company:saved?.company||'Oficina Revalora',
      email,
      owner:saved?.owner||'Administrador'
    }));
    location.href='dashboard.html';
  });

  document.getElementById('registerForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const company=document.getElementById('companyName').value.trim();
    const email=document.getElementById('registerEmail').value.trim();
    const password=document.getElementById('registerPassword').value;
    const alert=document.getElementById('registerAlert');
    if(password.length<6){alert.textContent='A senha precisa ter pelo menos 6 caracteres.';alert.className='alert error';return;}
    localStorage.setItem('revalora_user',JSON.stringify({company,email,owner:'Administrador'}));
    alert.textContent='Cadastro concluído! Abrindo painel...';alert.className='alert success';
    setTimeout(()=>location.href='dashboard.html',350);
  });
});
