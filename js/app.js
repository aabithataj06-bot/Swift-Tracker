(function(){
var STEPS=['Booked','In Transit','Out for Delivery','Delivered'];
var NAV=[['index.html','Home'],['track.html','Track Parcel'],['book.html','Book Parcel'],['contact.html','About & Contact']];
var SAMPLE={
'PRC-00001':{from:'Coimbatore',to:'Chennai',weight:2.5,service:'Standard',eta:'03 Oct 2026',status:1,events:[['29 Sep 2026, 10:15','Booked','Coimbatore'],['30 Sep 2026, 18:40','In Transit','Salem Hub']]},
'PRC-00002':{from:'Madurai',to:'Chennai',weight:1.2,service:'Express',eta:'01 Oct 2026 (today)',status:2,events:[['29 Sep 2026, 09:00','Booked','Madurai'],['30 Sep 2026, 14:20','In Transit','Trichy Hub'],['01 Oct 2026, 08:30','Out for Delivery','Chennai, Anna Nagar']]},
'PRC-00003':{from:'Coimbatore',to:'Bengaluru',weight:4,service:'Standard',eta:'Delivered 29 Sep 2026',status:3,events:[['26 Sep 2026, 11:00','Booked','Coimbatore'],['27 Sep 2026, 20:10','In Transit','Hosur Hub'],['29 Sep 2026, 09:45','Out for Delivery','Bengaluru'],['29 Sep 2026, 13:05','Delivered','Received by receiver']]},
'PRC-00004':{from:'Salem',to:'Coimbatore',weight:0.8,service:'Same-day',eta:'05 Oct 2026',status:0,events:[['01 Oct 2026, 07:50','Booked','Salem pickup point']]}};
function store(){try{return JSON.parse(localStorage.getItem('st_parcels')||'{}')}catch(e){return {}}}
function save(o){try{localStorage.setItem('st_parcels',JSON.stringify(o))}catch(e){}}
function find(id){return SAMPLE[id]||store()[id]||null}
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
var page=location.pathname.split('/').pop()||'index.html';
var h=$('hdr');
if(h){h.innerHTML='<header><div class="wrap bar"><a class="logo" href="index.html">📦 Swift<span>Tracker</span></a><nav>'+NAV.map(function(n){return '<a href="'+n[0]+'"'+(n[0]===page?' class="on"':'')+'>'+n[1]+'</a>'}).join('')+'</nav></div></header>'}
var f=$('ftr');
if(f){f.innerHTML='<footer><div class="wrap"><div class="fgrid"><div><h4>📦 SwiftTracker</h4>Smart parcel booking and real-time tracking for senders, receivers and delivery agents.</div><div><h4>Quick links</h4><a href="track.html">Track a parcel</a><br><a href="book.html">Book a parcel</a><br><a href="contact.html">Contact us</a></div><div><h4>Services</h4>Standard · Express<br>Same-day · Bulk shipping</div><div><h4>Support</h4>support@swifttracker.example<br>Mon-Sat, 9 AM to 6 PM</div></div><div class="copy">© 2026 SwiftTracker. Built on Salesforce: Flows, Apex, Experience Cloud and Agentforce.</div></div></footer>'}
function chips(box,input,fn){if(!box)return;Object.keys(SAMPLE).forEach(function(k){var b=el('button','chip',k);b.type='button';b.onclick=function(){input.value=k;fn(k)};box.appendChild(b)})}
var tf=$('trackForm');
if(tf){var inp=$('tid'),out=$('result');
var show=function(id){id=(id||'').trim().toUpperCase();out.innerHTML='';
if(!id)return;var p=find(id);
if(!p){out.appendChild(el('div','msg err','No parcel found for "'+id+'". Please check the Parcel ID (format PRC-00000) and try again.'));return}
var c=el('div','card');var top=el('div','row');top.style.justifyContent='space-between';
top.appendChild(el('h2','',id));top.appendChild(el('span','badge'+(p.status===3?' ok':''),STEPS[p.status]));c.appendChild(top);
var kv=el('div','kv');[['From',p.from],['To',p.to],['Service',p.service],['Weight',p.weight+' kg'],['Estimated delivery',p.eta]].forEach(function(r){var d=el('div');d.appendChild(el('small','',r[0]));d.appendChild(el('b','',r[1]));kv.appendChild(d)});c.appendChild(kv);
var st=el('div','steps');STEPS.forEach(function(s,i){var d=el('div','step'+(i<=p.status?' on':''));d.appendChild(el('div','dot',i+1));d.appendChild(document.createTextNode(s));st.appendChild(d)});c.appendChild(st);
c.appendChild(el('h3','','Tracking history'));var ul=el('ul','tl');p.events.slice().reverse().forEach(function(e){var li=el('li');li.appendChild(el('b','',e[1]+' · '+e[2]));li.appendChild(el('br'));li.appendChild(el('small','',e[0]));ul.appendChild(li)});c.appendChild(ul);out.appendChild(c)};
tf.onsubmit=function(e){e.preventDefault();show(inp.value)};
chips($('chips'),inp,show);
var q=new URLSearchParams(location.search).get('id');if(q){inp.value=q;show(q)}}
var bf=$('bookForm');
if(bf){var est=$('est');
var price=function(){var w=parseFloat(bf.weight.value)||0,s=bf.service.value,m={Standard:1,Express:1.5,'Same-day':2.2}[s]||1;var p=Math.round((40+w*25)*m);est.textContent='Estimated price: ₹'+p;return p};
bf.oninput=price;price();
bf.onsubmit=function(e){e.preventDefault();var all=store(),n=Object.keys(all).length+5,id='PRC-'+('0000'+n).slice(-5);
var now=new Date(),t=now.toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
var days={Standard:4,Express:2,'Same-day':0}[bf.service.value];var d=new Date(Date.now()+days*864e5);
all[id]={from:bf.sfrom.value,to:bf.rto.value,weight:parseFloat(bf.weight.value),service:bf.service.value,eta:d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),status:0,events:[[t,'Booked',bf.sfrom.value+' pickup']]};
save(all);var m=$('confirm');m.innerHTML='';m.className='msg';m.appendChild(el('b','','Booking confirmed! Your Parcel ID is '+id+'. '));m.appendChild(el('span','','Total: ₹'+price()+'. '));var a=el('a','','Track this parcel');a.href='track.html?id='+id;m.appendChild(a);m.scrollIntoView({behavior:'smooth'})}}
var cf=$('contactForm');
if(cf){cf.onsubmit=function(e){e.preventDefault();var m=$('cmsg');m.className='msg';m.textContent='Thanks '+cf.cname.value+'! Our support team will reply to '+cf.cemail.value+' shortly. (Demo form: nothing is sent.)';cf.reset()}}
var hf=$('homeForm');if(hf){chips($('hchips'),$('id'),function(k){location.href='track.html?id='+k})}
})();
