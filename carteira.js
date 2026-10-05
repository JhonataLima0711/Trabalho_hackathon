function walletRender(){
  const s=RevaloraStore.get();
  document.getElementById('walletBalance')?.replaceChildren(document.createTextNode(RevaloraStore.money(s.balance)));
  document.getElementById('walletPending')?.replaceChildren(document.createTextNode(RevaloraStore.money(s.pending)));
  document.getElementById('walletRedeemed')?.replaceChildren(document.createTextNode(RevaloraStore.money(s.redeemed)));
  const st=document.getElementById('statement'); if(st) st.innerHTML=s.transactions.map(t=>`<div><i class="tx ${t.type}">${t.type==='plus'?'+':'−'}</i><span><strong>${t.title}</strong><small>${t.detail}</small></span><b class="${t.type==='plus'?'green-text':''}">${t.type==='plus'?'+':'−'} ${RevaloraStore.money(t.value)}</b></div>`).join('');
}
document.addEventListener('DOMContentLoaded',()=>{
  const modal=document.getElementById('redeemModal');
  document.getElementById('redeemBtn')?.addEventListener('click',()=>modal?.classList.remove('hidden'));
  document.getElementById('redeemForm')?.addEventListener('submit',e=>{e.preventDefault();const value=Number(document.getElementById('redeemValue').value);const title=document.getElementById('redeemBenefit').value;if(RevaloraStore.redeem(title,value)){modal.classList.add('hidden');e.target.reset();showToast('Benefício resgatado e lançado no extrato.');walletRender();}else showToast('Saldo insuficiente para este resgate.');});
  walletRender();window.addEventListener('revalora:updated',walletRender);
});
