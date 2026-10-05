const RevaloraStore = (() => {
  const KEY = 'revalora_v20_state';

  const seed = {
    balance: 842.70,
    pending: 84.30,
    recoveredKg: 1248,
    collectionsCompleted: 38,
    confirmedPercent: 91,
    movedValue: 4286,
    residues: [
      {id:1,type:'Óleo lubrificante',qty:80,unit:'L',rate:3.55,status:'Em coleta',partner:'EcoÓleo',date:'Hoje'},
      {id:2,type:'Papelão',qty:126,unit:'kg',rate:0.58,status:'Disponível',partner:'EcoCiclo',date:'Ontem'},
      {id:3,type:'Sucata metálica',qty:140,unit:'kg',rate:3,status:'Disponível',partner:'MetalVerde',date:'27/09'},
      {id:4,type:'Plástico rígido',qty:60,unit:'kg',rate:0.60,status:'Destinado',partner:'EcoCiclo',date:'25/09'}
    ],
    collections: [
      {id:1,partner:'EcoÓleo',material:'Óleo lubrificante',qty:80,unit:'L',date:'2026-10-06',time:'09:00–11:00',value:284,status:'Agendada'},
      {id:2,partner:'EcoCiclo',material:'Papelão',qty:126,unit:'kg',date:'2026-10-08',time:'10:00–12:00',value:73.08,status:'Agendada'},
      {id:3,partner:'MetalVerde',material:'Sucata metálica',qty:32,unit:'kg',date:'2026-09-24',time:'08:00–10:00',value:96.20,status:'Confirmada'}
    ],
    transactions: [
      {id:1,type:'plus',title:'Óleo lubrificante',detail:'EcoÓleo · 29/09',value:84},
      {id:2,type:'plus',title:'Papelão',detail:'EcoCiclo · 28/09',value:32.50},
      {id:3,type:'minus',title:'Benefício AutoMais',detail:'26/09',value:120},
      {id:4,type:'plus',title:'Sucata metálica',detail:'MetalVerde · 24/09',value:96.20}
    ],
    redeemed:120,
    partners:[
      {name:'EcoÓleo',tags:'óleo',rating:'4,9',distance:'4,8 km',logo:'EO',className:'oil-logo',availability:'Hoje',description:'Óleos lubrificantes e coleta corporativa.'},
      {name:'MetalVerde',tags:'metal',rating:'4,8',distance:'6,2 km',logo:'MV',className:'metal-logo',availability:'Amanhã',description:'Triagem e reciclagem de metais e sucatas.'},
      {name:'EcoCiclo',tags:'papelão plástico',rating:'4,7',distance:'6,1 km',logo:'EC',className:'paper-logo',availability:'Rota limitada',description:'Papel, papelão e plásticos recicláveis.'},
      {name:'Recicla Centro',tags:'papelão',rating:'4,6',distance:'3,7 km',logo:'RC',className:'purple-logo',availability:'Disponível',description:'Coleta empresarial de papelão e embalagens.'}
    ]
  };

  function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
  function load(){
    try { const saved = JSON.parse(localStorage.getItem(KEY)); return saved || clone(seed); }
    catch { return clone(seed); }
  }
  function save(state){ localStorage.setItem(KEY, JSON.stringify(state)); window.dispatchEvent(new CustomEvent('revalora:updated')); return state; }
  function get(){ return load(); }
  function reset(){ return save(clone(seed)); }
  function money(value){ return Number(value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
  function nextId(list){ return list.length ? Math.max(...list.map(x=>Number(x.id)||0))+1 : 1; }
  function addResidue(type, qty, unit, rate){
    const s=load(); const item={id:nextId(s.residues),type,qty:Number(qty),unit,rate:Number(rate),status:'Disponível',partner:'A definir',date:'agora'};
    s.residues.unshift(item); save(s); return item;
  }
  function addCollection(data){
    const s=load(); const item={id:nextId(s.collections),status:'Agendada',...data,value:Number(data.value||0)};
    s.collections.unshift(item); s.pending += item.value; save(s); return item;
  }
  function confirmCollection(id){
    const s=load(); const c=s.collections.find(x=>x.id===Number(id)); if(!c || c.status==='Confirmada') return false;
    c.status='Confirmada';
    s.pending=Math.max(0,s.pending-c.value);
    s.balance += c.value;
    s.movedValue += c.value;
    s.collectionsCompleted += 1;
    s.recoveredKg += c.unit==='kg' ? c.qty : Math.round(c.qty*0.9);
    s.confirmedPercent=Math.min(100,s.confirmedPercent+1);
    s.transactions.unshift({id:nextId(s.transactions),type:'plus',title:c.material,detail:`${c.partner} · hoje`,value:c.value});
    const residue=s.residues.find(r=>r.type===c.material && r.status!=='Destinado');
    if(residue) residue.status='Destinado';
    save(s); return true;
  }
  function cancelCollection(id){
    const s=load(); const i=s.collections.findIndex(x=>x.id===Number(id)); if(i<0) return false;
    const c=s.collections[i]; if(c.status==='Confirmada') return false;
    s.pending=Math.max(0,s.pending-c.value); s.collections.splice(i,1); save(s); return true;
  }
  function redeem(title,value){
    const s=load(); value=Number(value); if(!value || value>s.balance) return false;
    s.balance-=value; s.redeemed+=value; s.transactions.unshift({id:nextId(s.transactions),type:'minus',title,detail:'Resgate de benefício · hoje',value}); save(s); return true;
  }
  return {seed,get,save,reset,money,addResidue,addCollection,confirmCollection,cancelCollection,redeem};
})();
