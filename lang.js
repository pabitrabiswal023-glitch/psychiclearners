<script src="lang.js"></script>
// Psychic Learners — Universal Language Selector (100+ languages, free)
(function(){
  window.googleTranslateElementInit=function(){
    new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'pl_translate');
  };
  const box=document.createElement('div');
  box.id='plLangBox';
  box.style.cssText='position:fixed;bottom:12px;left:12px;z-index:9999;background:#16163d;border:1px solid #7b5cff;border-radius:12px;padding:8px;box-shadow:0 0 15px #7b5cff55';
  box.innerHTML='<div id="pl_translate"></div><button id="plLangBtn" style="margin-top:6px;width:100%;background:#7b5cff;color:#fff;border:none;border-radius:8px;padding:6px;cursor:pointer;font-size:13px">🌍 Language</button>';
  document.body.appendChild(box);
  const s=document.createElement('script');
  s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(s);
  const t=document.getElementById('pl_translate');
  t.style.display='none';
  let open=false;
  document.getElementById('plLangBtn').onclick=()=>{open=!open;t.style.display=open?'block':'none'};
})();
