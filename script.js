(function(){
  var prayers=[
    "May this new age open doors that no one can shut.",
    "May God give you wisdom in every decision and peace in every season.",
    "May your hard work be rewarded, and your project end in success.",
    "May you always be surrounded by people who love and encourage you.",
    "May your health be strong and your joy overflow all year.",
    "May everything you lay your hands on prosper.",
    "Happy birthday, Precious. This year will be your best yet."
  ];
  var i=0, p=document.getElementById('prayer');
  document.getElementById('next').addEventListener('click',function(){
    p.textContent=prayers[i%prayers.length]; i++;
    this.textContent='Open another prayer';
    if(i===prayers.length) burst();
  });

  // photo viewer with next / previous (all photos, in page order)
  var dlg=document.getElementById('viewer'), vimg=document.getElementById('v-img'),
      vcount=document.getElementById('v-count'),
      btns=Array.prototype.slice.call(document.querySelectorAll('.grid button, .feature button, .masonry button, .begin figure button')),
      idx=0, lastBtn=null;
  function show(i){
    idx=(i+btns.length)%btns.length;
    var im=btns[idx].querySelector('img');
    vimg.src=im.getAttribute('src'); vimg.alt=im.alt;
    vcount.textContent=(idx+1)+' / '+btns.length;
  }
  btns.forEach(function(b,i){ b.addEventListener('click',function(){ lastBtn=b; show(i); if(dlg.showModal) dlg.showModal(); }); });
  document.getElementById('v-prev').addEventListener('click',function(){show(idx-1)});
  document.getElementById('v-next').addEventListener('click',function(){show(idx+1)});
  document.getElementById('v-close').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('close',function(){ if(lastBtn) lastBtn.focus(); });
  dlg.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight') show(idx+1);
    if(e.key==='ArrowLeft') show(idx-1);
  });
  var sx=null;
  dlg.addEventListener('touchstart',function(e){sx=e.changedTouches[0].clientX},{passive:true});
  dlg.addEventListener('touchend',function(e){
    if(sx===null) return;
    var dx=e.changedTouches[0].clientX-sx; sx=null;
    if(Math.abs(dx)>50) show(dx<0?idx+1:idx-1);
  },{passive:true});

  // theme toggle
  var root=document.documentElement;
  document.getElementById('theme').addEventListener('click',function(){
    var dark=getComputedStyle(root).colorScheme.indexOf('dark')>-1 || root.dataset.theme==='dark';
    root.dataset.theme = dark ? 'light' : 'dark';
  });

  // confetti
  var cv=document.getElementById('confetti'), ctx=cv.getContext('2d'), bits=[], running=false;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){cv.width=innerWidth;cv.height=innerHeight}
  size(); addEventListener('resize',size);
  var colors=['#d6245e','#ff5c93','#c9c1d6','#ffffff','#2a1020','#ffd166'];
  function burst(){
    if(reduce) return;
    for(var n=0;n<160;n++){
      bits.push({x:innerWidth/2,y:innerHeight*0.35,vx:(Math.random()-.5)*16,vy:Math.random()*-14-2,
        w:6+Math.random()*7,h:4+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.4,
        c:colors[Math.floor(Math.random()*colors.length)],life:0});
    }
    if(!running){running=true;requestAnimationFrame(tick)}
  }
  function tick(){
    ctx.clearRect(0,0,cv.width,cv.height);
    bits=bits.filter(function(b){return b.y<cv.height+20 && b.life<260});
    bits.forEach(function(b){
      b.vy+=.35; b.x+=b.vx; b.y+=b.vy; b.vx*=.99; b.r+=b.vr; b.life++;
      ctx.save(); ctx.translate(b.x,b.y); ctx.rotate(b.r); ctx.fillStyle=b.c;
      ctx.fillRect(-b.w/2,-b.h/2,b.w,b.h); ctx.restore();
    });
    if(bits.length) requestAnimationFrame(tick); else {running=false; ctx.clearRect(0,0,cv.width,cv.height)}
  }

  // landing page gate
  var cover=document.getElementById('cover'), site=document.getElementById('site');
  document.body.classList.add('locked');
  cover.addEventListener('click',function(){
    site.hidden=false;
    document.body.classList.remove('locked');
    window.scrollTo(0,0);
    cover.classList.add('open');
    burst();
    setTimeout(function(){cover.remove()},650);
  });
  cover.focus();

  // WhatsApp wish
  var waNum='2349092643159', wa=document.getElementById('wa'),
      wn=document.getElementById('w-name'), wt=document.getElementById('w-text'), ww=document.getElementById('w-warn');
  function waLink(){
    var who=wn.value.trim(), msg=wt.value.trim();
    var text='Happy birthday Precious! \uD83C\uDF89\n\n'+msg+(who?'\n\n- '+who:'');
    wa.href='https://wa.me/'+waNum+'?text='+encodeURIComponent(text);
  }
  wn.addEventListener('input',waLink); wt.addEventListener('input',waLink); waLink();
  wa.addEventListener('click',function(e){
    if(!wt.value.trim()){ e.preventDefault(); ww.textContent='Please write your wish first.'; wt.focus(); }
    else { ww.textContent=''; waLink(); }
  });
  document.getElementById('party').addEventListener('click',burst);
  var p2=document.getElementById('party2'); if(p2) p2.addEventListener('click',burst);
})();
