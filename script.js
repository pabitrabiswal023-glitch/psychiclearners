// ---------- AUTH (localStorage - private, sirf aapke browser me) ----------
function getUsers(){return JSON.parse(localStorage.getItem('pl_users')||'{}')}
function currentUser(){return localStorage.getItem('pl_current')}
function registerUser(email,pass){
  const u=getUsers();
  if(u[email])return'exists';
  u[email]={pass:btoa(pass),created:new Date().toISOString()};
  localStorage.setItem('pl_users',JSON.stringify(u));
  return'ok';
}
function loginUser(email,pass){
  const u=getUsers();
  if(!u[email])return'no';
  if(u[email].pass!==btoa(pass))return'wrong';
  localStorage.setItem('pl_current',email);return'ok';
}
function logout(){localStorage.removeItem('pl_current');location.href='login.html'}
function requireLogin(){if(!currentUser())location.href='login.html';else document.querySelectorAll('.user-email').forEach(e=>e.textContent=currentUser())}

// ---------- PROGRESS ----------
function getProgress(){return JSON.parse(localStorage.getItem('pl_progress_'+currentUser())||'{"telekinesis":0,"telepathy":0,"intuition":0,"chi":0,"spells":0,"breathing":0,"xp":0}')}
function addProgress(skill,amount){
  const p=getProgress();
  p[skill]=Math.min(100,(p[skill]||0)+amount);
  p.xp=(p.xp||0)+amount*10;
  localStorage.setItem('pl_progress_'+currentUser(),JSON.stringify(p));
  renderProgress();
}
function renderProgress(){
  const p=getProgress();
  document.querySelectorAll('[data-skill]').forEach(el=>{
    const v=p[el.dataset.skill]||0;
    el.querySelector('.progress-fill').style.width=v+'%';
    const t=el.querySelector('.pct'); if(t)t.textContent=v+'%';
  });
  const xp=document.getElementById('xp'); if(xp)xp.textContent=p.xp||0;
}

// ---------- SEARCH (YouTube/Google/TikTok sab ke direct links) ----------
function doSearch(){
  const q=document.getElementById('searchQ').value.trim();
  if(!q)return;
  const links={
    yt:'https://www.youtube.com/results?search_query='+encodeURIComponent(q),
    google:'https://www.google.com/search?q='+encodeURIComponent(q),
    tiktok:'https://www.tiktok.com/search?q='+encodeURIComponent(q),
    ig:'https://www.instagram.com/explore/tags/'+encodeURIComponent(q.replace(/\s/g,'')),
    twitter:'https://twitter.com/search?q='+encodeURIComponent(q),
    wp:'https://en.wikipedia.org/wiki/Special:Search?search='+encodeURIComponent(q)
  };
  const box=document.getElementById('searchResults');
  box.innerHTML=Object.entries(links).map(([k,v])=>`<a class="btn" target="_blank" rel="noopener" href="${v}">🔍 ${k.toUpperCase()}</a>`).join('');
}

// ---------- JOURNAL ----------
function saveJournal(){
  const t=document.getElementById('journalText').value;
  const d=document.getElementById('journalDate').value||new Date().toISOString().slice(0,10);
  if(!t.trim())return alert('Kuch likho pehle 😊');
  const j=JSON.parse(localStorage.getItem('pl_journal_'+currentUser())||'[]');
  j.unshift({date:d,text:t});
  localStorage.setItem('pl_journal_'+currentUser(),JSON.stringify(j));
  document.getElementById('journalText').value='';
  showJournal();
}
function delJournal(i){
  const j=JSON.parse(localStorage.getItem('pl_journal_'+currentUser())||'[]');
  j.splice(i,1);
  localStorage.setItem('pl_journal_'+currentUser(),JSON.stringify(j));
  showJournal();
}
function showJournal(){
  const j=JSON.parse(localStorage.getItem('pl_journal_'+currentUser())||'[]');
  document.getElementById('journalList').innerHTML=j.map((e,i)=>
    `<div class="card"><b>${e.date}</b><p>${e.text.replace(/</g,'&lt;')}</p><button class="btn" onclick="delJournal(${i})">🗑 Delete</button></div>`).join('')||'<p>Abhi koi entry nahi. Pehli practice likho! ✍️</p>';
}

// ---------- BREATHING TIMER ----------
let bTimer=null;
function startBreathing(){
  let phase=0;const box=document.getElementById('breathBox'),txt=document.getElementById('breathText');
  const phases=[['SAANS LO (4s)',4,'scale(1.3)'],['ROKO (4s)',4,'scale(1.3)'],['CHHODO (6s)',6,'scale(1)']];
  clearInterval(bTimer);
  function step(){
    const[t,s,sc]=phases[phase];
    txt.textContent=t;box.style.transform=sc;
    let left=s;txt.textContent=t;
    bTimer=setInterval(()=>{left--;txt.textContent=t.split('(')[0]+`(${left}s)`;if(left<=0){clearInterval(bTimer);phase=(phase+1)%3;step()}},1000);
  }
  step();
}
function stopBreathing(){clearInterval(bTimer);document.getElementById('breathText').textContent='Ready...'}

// ---------- CHI ENERGY BALL ----------
let chiTimer=null,chiLevel=0;
function chargeChi(){
  const orb=document.getElementById('chiOrb');
  clearInterval(chiTimer);
  chiTimer=setInterval(()=>{
    chiLevel=Math.min(100,chiLevel+2);
    orb.style.transform=`scale(${1+chiLevel/100})`;
    orb.style.boxShadow=`0 0 ${20+chiLevel}px #6ac0ff`;
    document.getElementById('chiPct').textContent=chiLevel+'%';
    if(chiLevel>=100){clearInterval(chiTimer);document.getElementById('chiMsg').textContent='⚡ CHI BALL READY! Haatho ke beech feel karo!';addProgress('chi',10)}
  },80);
}

// ---------- LANGUAGE (sab pages me kaam karega) ----------
const i18n={
  en:{title:'Psychic Learners',welcome:'Welcome',start:'Start Learning'},
  hi:{title:'साइकिक लर्नर्स',welcome:'स्वागत है',start:'सीखना शुरू करें'},
  es:{title:'Aprendices Psíquicos',welcome:'Bienvenido',start:'Empezar'},
  ar:{title:'متعلما الحسية',welcome:'مرحبا',start:'ابدأ التعلم'},
  fr:{title:'Apprentis Psychiques',welcome:'Bienvenue',start:'Commencer'},
  ru:{title:'Психические Ученики',welcome:'Добро пожаловать',start:'Начать'}
};
function setLang(l){
  localStorage.setItem('pl_lang',l);
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent=i18n[l][el.dataset.i18n]||el.textContent;
  });
}
document.addEventListener('DOMContentLoaded',()=>{
  const l=localStorage.getItem('pl_lang')||'en';
  const sel=document.getElementById('langSel');if(sel){sel.value=l;sel.onchange=e=>setLang(e.target.value)}
  setLang(l);
});
