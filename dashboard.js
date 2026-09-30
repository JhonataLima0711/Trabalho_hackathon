document.addEventListener('DOMContentLoaded',()=>{
  const h=new Date().getHours();
  const company=getUser()?.company||'sua empresa';
  const intro=document.getElementById('companyIntro');
  if(intro) intro.textContent=`Resumo de ${company}.`;
});
