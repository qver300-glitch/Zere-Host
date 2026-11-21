(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var KEY="beenhost_demo_v1";
var S={bal:0,since:Date.now(),servers:[],tickets:[],ops:[],auth:[],seq:1,user:{login:"Пользователь",email:"",vk:""},acc:"",fkey:"",avatar:""};
try{var raw=localStorage.getItem(KEY);if(raw)S=Object.assign(S,JSON.parse(raw))}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function rnd(n){return Math.floor(Math.random()*n)}
function hex(n){var a=new Uint8Array(n/2);(window.crypto||{getRandomValues:function(x){for(var i=0;i<x.length;i++)x[i]=rnd(256)}}).getRandomValues(a);return [].map.call(a,function(b){return ("0"+b.toString(16)).slice(-2)}).join("")}
if(!S.acc)S.acc=String(100000+rnd(900000));
if(!S.fkey)S.fkey=hex(32);
if(!S.auth.length||Date.now()-S.auth[0].t>6e5){S.auth.unshift({t:Date.now(),ua:(navigator.userAgent.match(/(Chrome|Firefox|Safari|Edg|OPR)\/[\d.]+/)||["Браузер"])[0]});S.auth=S.auth.slice(0,20)}
save();

/* ---------- деректер ---------- */
var TARIFFS={"FREE":{price:0,slots:[100],port:"random"},"VIP":{price:40,slots:[100,200],port:"random"},"SUPER VIP":{price:150,slots:[100,200,500],port:7777},"PREMIUM VIP":{price:300,slots:[200,500,1000],port:7777}};
var NODES=[{ip:"185.44.10.21",loc:"MSK",load:3},{ip:"185.44.10.22",loc:"MSK",load:41},{ip:"91.210.7.5",loc:"SPB",load:18}];
var VERS={SAMP:["0.3.7","0.3.DL"],CRMP:["0.3.7","0.3e"]};
var GAMES={SAMP:"GTA: San Andreas Multiplayer",CRMP:"Criminal Russia Multiplayer"};
var DAYS=[30,60,90,180,365];
var MONTHS=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
var TOOLS=[["manage","fa-wrench","Управление"],["cfg","fa-cog","Настройки server.cfg"],["pawno","fa-play","Pawno Compiler"],["mysql","fa-server","MYSQL"],["files","fa-cloud","File Manager"],["ftp","fa-cloud","FTP"],["console","fa-terminal","Консоль"],["friends","fa-users","Друзья"],["backups","fa-save","Бекапы"],["firewall","fa-shield-alt","FireWall"],["log","fa-list-ol","Лог действий"],["auto","fa-life-ring","Автоустановка"],["tasks","fa-clock","Задачи"],["stats","fa-chart-area","Статистика"],["cdn","fa-cloud-download-alt","CDN"]];
var PRIVS=["Включение сервера","Выключение сервера","Перезагрузка сервера","Управление настройками","Переустановка сервера","Продление сервера","Управление FTP","Управление друзьями","Управление консолью","Изменение слотов","Доступ к MYSQL","Файловый менеджер"];
var base=$("#content-base"),home=base?base.innerHTML:"";
var burger=$(".header__burger"),menu=$(".menu");

/* ---------- көмекші ---------- */
function money(n){return (Math.round(n*100)/100).toFixed(2)}
function days(){return Math.max(1,Math.floor((Date.now()-S.since)/864e5)+1)}
function p2(n){return ("0"+n).slice(-2)}
function ruLong(t){var d=new Date(t);return d.getDate()+" "+MONTHS[d.getMonth()]+" "+d.getFullYear()+" - "+p2(d.getHours())+":"+p2(d.getMinutes())}
function ruShort(t){var d=new Date(t);return p2(d.getDate())+"."+p2(d.getMonth()+1)+"."+d.getFullYear()+" "+p2(d.getHours())+":"+p2(d.getMinutes())}
function srv(id){for(var i=0;i<S.servers.length;i++)if(S.servers[i].id===id)return S.servers[i]}
function addOp(text,sum){S.ops.unshift({t:Date.now(),text:text,sum:sum});S.ops=S.ops.slice(0,50)}
function updateTop(){var t=$$(".display-content__text"),d=$(".user-name");if(t[0]&&t[0].firstChild)t[0].firstChild.nodeValue=money(S.bal)+" ";if(t[1])t[1].textContent=S.servers.length;if(d)d.textContent=days()+" дней"}
function toast(m){var n=$("#notifier-box");if(!n)return;n.innerHTML='<div style="position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:#2d3148;color:#fff;padding:12px 22px;border-radius:12px;z-index:10100;box-shadow:0 10px 30px rgba(0,0,0,.4);max-width:90vw;text-align:center">'+esc(m)+'</div>';clearTimeout(toast.t);toast.t=setTimeout(function(){n.innerHTML=""},2600)}
function copy(txt){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){toast("Скопировано")},function(){window.prompt("Скопируйте:",txt)})}else window.prompt("Скопируйте:",txt)}
function page(title,inner){return '<section class="intro buyx"><div class="intro__text">'+title+'</div>'+inner+'</section>'}
function box(title,inner){return '<div class="block_fulls" style="margin-bottom:16px"><div class="portlet-title"><div class="caption"><span class="caption-subject" style="text-align:center">'+title+'</span></div></div><div class="form-body">'+inner+'</div></div>'}
function placeholder(t){return '<div class="bh"><div class="bh-card"><h3>'+esc(t)+'</h3><div class="bh-empty">Раздел в разработке.</div></div></div>'}
function svgAvatar(){return 'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#c8d0de"/><circle cx="200" cy="215" r="100" fill="#f1f3f7"/><path d="M70 440q0-110 130-110t130 110q0 14-14 14H84q-14 0-14-14z" fill="#f1f3f7"/></svg>')}

/* ---------- беттер ---------- */
var P={};

/* Профиль */
function profileLinks(cur){
  var L=[["profile","fa-cog","Профиль"],["profile/partner","fa-server","Партнерская программа"],["profile/ops","fa-cloud","Последние операции счета"],["profile/bills","fa-list-ol","Счета"],["profile/auth","fa-terminal","История авторизации"],["profile/security","fa-users","Безопасность"]];
  return '<div class="bh-card"><div class="bh-links">'+L.map(function(l){return '<a href="#'+l[0]+'" class="'+(l[0]===cur?"on":"")+'"><i class="fas '+l[1]+'"></i>'+l[2]+'</a>'}).join("")+'</div></div>';
}
P["profile"]=function(){
  return '<div class="bh">'+profileLinks("profile")+
  '<div class="bh-card bh-center"><img class="bh-avatar" alt="" src="'+(S.avatar||svgAvatar())+'"><div class="bh-name">'+esc(S.user.login)+'</div><div class="bh-online">Онлайн</div></div>'+
  '<div class="bh-card bh-row"><span>Баланс: '+money(S.bal)+'</span><a class="bh-btn-red" href="#users/deposit/pay">Пополнить</a></div>'+
  '<div class="bh-card bh-row"><span>E-mail: '+esc(S.user.email||"не указан")+'</span></div>'+
  '<div class="bh-card bh-row"><span>Ссылка ВК:<br>'+(S.user.vk?'<a class="lnk" target="_blank" rel="noopener" href="'+esc(S.user.vk)+'">'+esc(S.user.vk)+'</a>':'не указана')+'</span></div>'+
  '<div class="bh-card bh-row"><span>Номер аккаунта: '+esc(S.acc)+'</span></div>'+
  '<div class="bh-card bh-row"><label class="bh-link-blue" style="margin:0;cursor:pointer">Загрузить аватар<input type="file" id="p-av" accept="image/*" style="display:none"></label></div>'+
  '<div class="bh-card bh-row"><span>Ключ для добавления в друзья:<br>'+esc(S.fkey)+'</span><i class="fas fa-copy ic" id="p-copy"></i></div>'+
  '<div class="bh-card"><h3>Изменить данные</h3><div style="display:grid;gap:10px"><input class="bh-input" id="p-login" placeholder="Имя" value="'+esc(S.user.login)+'"><input class="bh-input" id="p-mail" placeholder="E-mail" value="'+esc(S.user.email)+'"><input class="bh-input" id="p-vk" placeholder="Ссылка ВК (https://vk.com/...)" value="'+esc(S.user.vk)+'"><button class="bh-btn-red" id="p-save" style="background:#4ec97b;color:#06210f!important">Сохранить</button><button class="bh-btn-red" id="p-reset">Сбросить все данные</button></div></div></div>';
};
P["profile"].init=function(){
  $("#p-copy").addEventListener("click",function(){copy(S.fkey)});
  $("#p-save").addEventListener("click",function(){
    var vk=$("#p-vk").value.trim();if(vk&&!/^https:\/\/(m\.)?vk\.com\/[\w.]+$/i.test(vk))return toast("Ссылка ВК должна быть вида https://vk.com/id123");
    S.user={login:$("#p-login").value.trim()||"Пользователь",email:$("#p-mail").value.trim(),vk:vk};save();toast("Сохранено");route();
  });
  $("#p-reset").addEventListener("click",function(){if(confirm("Удалить все данные?")){try{localStorage.removeItem(KEY)}catch(e){}location.hash="#home";location.reload()}});
  $("#p-av").addEventListener("change",function(e){
    var f=e.target.files[0];if(!f)return;if(!/^image\//.test(f.type))return toast("Нужна картинка");if(f.size>400*1024)return toast("Максимум 400 КБ");
    var r=new FileReader();r.onload=function(){S.avatar=r.result;save();route()};r.readAsDataURL(f);
  });
};
P["profile/ops"]=function(){
  var rows=S.ops.map(function(o){return '<tr><td>'+ruShort(o.t)+'</td><td>'+esc(o.text)+'</td><td style="color:'+(o.sum>=0?'#4ec97b':'#eb4c42')+'">'+(o.sum>=0?"+":"")+money(o.sum)+'</td></tr>'}).join("");
  return '<div class="bh">'+profileLinks("profile/ops")+'<div class="bh-card"><h3>Последние операции счета</h3>'+(rows?'<table><tr><th>Дата</th><th>Операция</th><th>Сумма</th></tr>'+rows+'</table>':'<div class="bh-empty">Операций нет</div>')+'</div></div>';
};
P["profile/auth"]=function(){
  var rows=S.auth.map(function(a){return '<tr><td>'+ruShort(a.t)+'</td><td>'+esc(a.ua)+'</td></tr>'}).join("");
  return '<div class="bh">'+profileLinks("profile/auth")+'<div class="bh-card"><h3>История авторизации</h3><table><tr><th>Дата</th><th>Браузер</th></tr>'+rows+'</table></div></div>';
};
["partner:Партнерская программа","bills:Счета","security:Безопасность"].forEach(function(x){var k=x.split(":");P["profile/"+k[0]]=function(){return '<div class="bh">'+profileLinks("profile/"+k[0])+'<div class="bh-card"><h3>'+k[1]+'</h3><div class="bh-empty">Раздел в разработке.</div></div></div>'}});

/* Пополнение */
P["users/deposit/pay"]=function(){
  return page("Пополнить баланс",box("Пополнение",'<div class="form-group"><label>Сумма (руб):</label><div><input type="number" id="d-sum" value="100" min="10"></div></div><div class="form-group"><div><button class="btn" id="d-go">Пополнить</button></div></div><p style="color:#959ab7;font-size:12px">Демо-режим: оплата не подключена, баланс пополняется локально.</p>'));
};
P["users/deposit/pay"].init=function(){$("#d-go").addEventListener("click",function(){var n=+$("#d-sum").value;if(!(n>=10))return toast("Минимум 10 руб");S.bal+=n;addOp("Пополнение баланса",n);save();updateTop();toast("Баланс пополнен")})};

/* Серверлер тізімі */
P["servers"]=function(){
  if(!S.servers.length)return '<div class="bh"><div class="bh-card"><div class="bh-empty">У вас нет серверов. <a class="bh-link-blue" href="#servers/buy">Заказать сервер</a></div></div></div>';
  return '<div class="bh"><div class="bh-grid">'+S.servers.map(function(s){
    return '<div class="bh-srv"><div class="r"><span>ID:</span><b>#'+s.id+'</b></div>'+
    '<div class="r"><span>Тариф:</span><span class="bh-badge">'+esc(s.tariff)+' ['+esc(s.loc||"MSK")+']</span></div>'+
    '<div class="r"><span>Локация:</span><b>'+(s.tariff==="FREE"?"FREE":"PAID")+'</b></div>'+
    '<div class="r"><span>IP:</span><b>'+esc(s.ip)+':'+s.port+'</b></div>'+
    '<div class="r"><span>Срок:</span><b>'+ruLong(s.until)+'</b></div>'+
    '<div class="r"><span>Статус:</span><b class="'+(s.on?"bh-st-on":"bh-st-off")+'">'+(s.on?"Включен":"Выключен")+'</b></div>'+
    '<div class="r"><span>Онлайн:</span><b>'+(s.on?s.pl:0)+'/'+s.slots+'</b></div>'+
    '<a class="bh-manage" href="#server/'+s.id+'">Управление</a></div>'}).join("")+'</div></div>';
};

/* Сервер басқару */
function toolbar(id,cur){return '<div class="bh-card"><div class="bh-links">'+TOOLS.map(function(t){return '<a href="#server/'+id+(t[0]==="manage"?"":"/"+t[0])+'" class="'+(t[0]===cur?"on":"")+'"><i class="fas '+t[1]+'"></i>'+t[2]+'</a>'}).join("")+'</div></div>'}
function cfgText(s){return "echo Executing Server Config...\nlanmode 0\nrcon_password change_me\nmaxplayers "+s.slots+"\nport "+s.port+"\nhostname "+(s.name||"My "+s.game+" Server")+"\ngamemode0 main 1\nannounce 0\nquery 1\nweburl "+(s.web||"")+"\nlanguage Russian\n"}
function serverPage(id,tool){
  var s=srv(id);if(!s)return '<div class="bh"><div class="bh-card"><div class="bh-empty">Сервер не найден. <a class="bh-link-blue" href="#servers">К списку</a></div></div></div>';
  var head=toolbar(id,tool);
  if(tool==="manage"){
    var c=s.on?"#4ec97b":"#eb4c42";
    return '<div class="bh">'+head+
    '<div class="bh-card bh-power"><i class="fas fa-power-off" style="color:'+c+'"></i><div class="game">'+GAMES[s.game]+'</div><div class="st" style="color:'+c+'">'+(s.on?"Включен":"Выключен")+'</div></div>'+
    '<div class="bh-card bh-act">'+(s.on?'<div class="stop" data-a="tog"><i class="fas fa-power-off"></i>Выключить</div>':'<div class="go" data-a="tog"><i class="fas fa-power-off"></i>Включить</div>')+'<div class="re" data-a="re"><i class="fas fa-sync"></i>Переустановить</div><div class="del" data-a="del"><i class="far fa-trash-alt"></i>Удалить сервер</div></div>'+
    '<div class="bh-card bh-pill"><span>Адрес: '+esc(s.ip)+':'+s.port+'</span><span><i class="fas fa-cogs ic gear" data-a="port"></i><i class="fas fa-copy ic" data-a="copy"></i></span></div>'+
    '<div class="bh-card bh-pill"><span>Слоты: '+(s.on?s.pl:0)+'/'+s.slots+'</span><span><i class="fas fa-cogs ic gear" data-a="slots"></i></span></div>'+
    '<div class="bh-card bh-pill"><span>Тариф: '+esc(s.tariff)+'</span></div>'+
    '<div class="bh-card bh-pill"><span>Версия: '+esc(s.game)+' '+esc(s.ver)+'</span></div>'+
    '<div class="bh-card bh-pill"><span>Срок: '+ruLong(s.until)+'</span></div></div>';
  }
  if(tool==="friends"){
    var fl=(s.friends||[]).map(function(f,i){return '<div class="bh-card bh-row"><span>'+esc(f.name)+'<br><small style="color:#959ab7">'+esc(f.key)+'<br>Привилегии: '+f.privs.length+'/'+PRIVS.length+' · '+ruShort(f.t)+'</small></span><i class="fas fa-trash-alt ic" style="color:#eb4c42" data-f="'+i+'"></i></div>'}).join("");
    return '<div class="bh">'+head+'<div class="bh-fr"><span class="bh-pillbtn">Друзья</span><label class="k" for="fr-key">Ключ с профиля друга</label><input id="fr-key" class="bh-fr-in" type="text" maxlength="32" autocomplete="off" spellcheck="false" placeholder="32 символа (0-9, a-f)"><h3 style="margin-top:18px">Привилегии</h3>'+PRIVS.map(function(n,i){return '<label class="pv"><input type="checkbox" class="fr-p" value="'+i+'" checked> '+n+'</label>'}).join("")+'<button id="fr-add" class="bh-fr-add">Добавить</button></div>'+(fl?'<h3 style="margin:20px 0 10px">Добавленные друзья</h3>'+fl:'')+'</div>';
  }
  if(tool==="cfg")return '<div class="bh">'+head+'<div class="bh-card"><h3>Настройки server.cfg</h3><textarea class="bh-txt" id="cfg-t">'+esc(s.cfg||cfgText(s))+'</textarea><br><br><button class="bh-btn-red" id="cfg-s" style="background:#4ec97b;color:#06210f!important">Сохранить</button></div></div>';
  if(tool==="console")return '<div class="bh">'+head+'<div class="bh-card"><h3>Консоль</h3><div class="bh-term" id="term"></div><br><input class="bh-input" id="term-i" placeholder="Команда (help)"></div></div>';
  var names={};TOOLS.forEach(function(t){names[t[0]]=t[2]});
  return '<div class="bh">'+head+'<div class="bh-card"><h3>'+esc(names[tool]||tool)+'</h3><div class="bh-empty">Раздел в разработке.</div></div></div>';
}
serverPage.init=function(id,tool){
  var s=srv(id);if(!s)return;
  if(tool==="manage"){
    $$("[data-a]").forEach(function(b){b.addEventListener("click",function(){
      var a=b.dataset.a;
      if(a==="tog"){s.on=!s.on;s.pl=s.on?rnd(Math.floor(s.slots*0.3)+1):0;save();route()}
      else if(a==="re"){if(confirm("Переустановить сервер? Файлы будут сброшены."))toast("Переустановка выполнена")}
      else if(a==="del"){if(confirm("Удалить сервер #"+s.id+"?")){S.servers=S.servers.filter(function(x){return x.id!==s.id});save();toast("Сервер удалён");location.hash="#servers"}}
      else if(a==="copy")copy(s.ip+":"+s.port);
      else if(a==="port"){var v=window.prompt("Новый порт (1024–65535):",s.port);if(v===null)return;v=+v;if(!(v>=1024&&v<=65535))return toast("Неверный порт");s.port=v;save();route()}
      else if(a==="slots")toast(s.tariff==="FREE"?"Слоты можно менять на платных тарифах":"Изменение слотов: через поддержку");
    })});
  }
  if(tool==="friends"){
    $("#fr-add").addEventListener("click",function(){
      var k=$("#fr-key").value.trim().toLowerCase();
      if(!/^[0-9a-f]{32}$/.test(k))return toast("Неверный ключ: нужно 32 символа (0-9, a-f)");
      if(k===S.fkey)return toast("Это ваш собственный ключ");
      s.friends=s.friends||[];
      if(s.friends.some(function(f){return f.key===k}))return toast("Этот друг уже добавлен");
      var pr=$$(".fr-p:checked").map(function(c){return PRIVS[+c.value]});
      if(!pr.length)return toast("Выберите хотя бы одну привилегию");
      s.friends.push({key:k,name:"Друг #"+k.slice(0,4),privs:pr,t:Date.now()});save();toast("Друг добавлен");route();
    });
    $$("[data-f]").forEach(function(b){b.addEventListener("click",function(){var i=+b.dataset.f;if(confirm("Удалить друга из сервера?")){s.friends.splice(i,1);save();route()}})});
  }
  if(tool==="cfg")$("#cfg-s").addEventListener("click",function(){s.cfg=$("#cfg-t").value;save();toast("server.cfg сохранён")});
  if(tool==="console"){
    var T=$("#term"),I=$("#term-i");function out(t){T.textContent+=t+"\n";T.scrollTop=T.scrollHeight}
    out("[BeenHost] Консоль сервера #"+s.id+". Введите help.");
    I.addEventListener("keydown",function(e){if(e.key!=="Enter")return;var c=I.value.trim();I.value="";if(!c)return;out("> "+c);
      if(c==="help")out("Команды: help, status, players, start, stop, clear");
      else if(c==="status")out(s.on?"Сервер работает ("+s.ip+":"+s.port+")":"Сервер выключен");
      else if(c==="players")out("Игроков: "+(s.on?s.pl:0)+"/"+s.slots);
      else if(c==="start"){s.on=true;s.pl=0;save();out("Сервер запущен")}
      else if(c==="stop"){s.on=false;s.pl=0;save();out("Сервер остановлен")}
      else if(c==="clear")T.textContent="";
      else out("Неизвестная команда");
    });
  }
};

/* Тапсырыс беру */
P["servers/buy"]=function(){
  return page("Покупка сервера",box("Параметры заказа",
  '<p style="color:#a8aecb;font-size:13px">Чтобы заказать бесплатный сервер выберите тариф FREE</p>'+
  '<div class="form-group"><label>Игра:</label><div><select id="b-game"><option>SAMP</option><option>CRMP</option></select></div></div>'+
  '<div class="form-group"><label>Тариф:</label><div><select id="b-tar">'+Object.keys(TARIFFS).map(function(k){return '<option>'+k+'</option>'}).join("")+'</select></div></div>'+
  '<div class="form-group"><label>Загруженность:</label><div><div class="bh-bar"><div id="b-load"></div></div></div></div>'+
  '<div class="form-group"><label>IP:</label><div><select id="b-node">'+NODES.map(function(n,i){return '<option value="'+i+'">'+n.ip+' ['+n.loc+']</option>'}).join("")+'</select></div></div>'+
  '<div class="form-group"><label>Кол-во слотов:</label><div><select id="b-slots"></select></div></div>'+
  '<div class="form-group"><label>Оплатить на:</label><div><select id="b-days">'+DAYS.map(function(d){return '<option value="'+d+'">'+d+' дней</option>'}).join("")+'</select></div></div>'+
  '<div class="form-group"><label>Версия игры:</label><div><select id="b-ver"></select></div></div>'+
  '<hr class="bh-hr">'+
  '<div class="form-group"><label>К оплате на данный момент:</label><div><span id="sum_all">0 руб</span></div></div>'+
  '<div class="form-group"><div><label style="flex:none;max-width:none;color:#dadee9"><input type="checkbox" id="b-ok"> Я согласен с условиями <a href="#page/oferta">договора-оферты</a></label></div></div>'+
  '<div class="form-group"><div><button class="btn" id="b-go">Заказать</button></div></div>')+
  box("Информация о заказе",'<div id="infoz_1"></div>'));
};
P["servers/buy"].init=function(){
  var total=0;
  function calc(){
    var tn=$("#b-tar").value,t=TARIFFS[tn],g=$("#b-game").value,n=NODES[+$("#b-node").value],d=+$("#b-days").value;
    var sl=$("#b-slots"),cs=sl.value;sl.innerHTML=t.slots.map(function(x){return '<option>'+x+'</option>'}).join("");if(t.slots.indexOf(+cs)>-1)sl.value=cs;
    var vs=$("#b-ver"),cv=vs.value;vs.innerHTML=VERS[g].map(function(v){return '<option>'+v+'</option>'}).join("");if(VERS[g].indexOf(cv)>-1)vs.value=cv;
    if(!t.price)$("#b-days").value="30";d=+$("#b-days").value;
    $("#b-days").disabled=!t.price;
    $("#b-load").style.width=n.load+"%";
    total=Math.round(t.price*d/30);
    $("#sum_all").textContent=total+" руб";
    var until=Date.now()+d*864e5;
    $("#infoz_1").innerHTML=[["Игра",g],["Тариф",tn+" ["+n.loc+"]"],["Загруженность",n.load+"%"],["IP",n.ip],["Кол-во слотов",sl.value],["Оплатить до",ruLong(until)],["Поддержка","Стандарт"],["Версия игры",vs.value],["К оплате",total+" руб"]].map(function(r){return '<div class="color__text-inf">'+r[0]+': <span>'+esc(r[1])+'</span></div>'}).join("");
  }
  ["b-game","b-tar","b-node","b-days","b-slots","b-ver"].forEach(function(id){$("#"+id).addEventListener("change",calc)});calc();
  $("#b-go").addEventListener("click",function(){
    calc();
    if(!$("#b-ok").checked)return toast("Примите условия договора-оферты");
    var tn=$("#b-tar").value,t=TARIFFS[tn],n=NODES[+$("#b-node").value];
    if(total>S.bal)return toast("Недостаточно средств на балансе");
    if(tn==="FREE"&&S.servers.some(function(x){return x.tariff==="FREE"}))return toast("Бесплатный сервер можно заказать только один раз");
    S.bal-=total;
    var s={id:100000+rnd(900000),game:$("#b-game").value,tariff:tn,loc:n.loc,ip:n.ip,port:t.port==="random"?(3000+rnd(1000)):t.port,slots:+$("#b-slots").value,ver:$("#b-ver").value,until:Date.now()+(+$("#b-days").value)*864e5,on:false,pl:0};
    S.servers.push(s);addOp("Заказ сервера "+tn+" #"+s.id,-total);save();toast("Сервер создан");location.hash="#servers";
  });
};

/* Мониторинг, Қолдау */
P["monitoring"]=function(){
  var on=S.servers.filter(function(s){return s.on}),rows=on.map(function(s){return '<tr><td>#'+s.id+'</td><td>'+s.game+'</td><td>'+esc(s.ip)+':'+s.port+'</td><td>'+s.pl+' / '+s.slots+'</td></tr>'}).join("");
  return '<div class="bh"><div class="bh-card"><h3>Мониторинг</h3>'+(rows?'<table><tr><th>ID</th><th>Игра</th><th>Адрес</th><th>Игроки</th></tr>'+rows+'</table>':'<div class="bh-empty">Нет запущенных серверов</div>')+'</div></div>';
};
P["support"]=function(){
  var list=S.tickets.map(function(t){return '<div style="padding:10px 0;border-top:1px solid rgba(255,255,255,.08)"><b>'+esc(t.title)+'</b> <small style="color:#959ab7">'+ruShort(t.date)+'</small><div style="color:#a8aecb;margin-top:4px">'+esc(t.text)+'</div><div style="color:#4ec97b;font-size:12px;margin-top:4px">Статус: ожидает ответа</div></div>'}).join("")||'<div class="bh-empty">Обращений нет</div>';
  return '<div class="bh"><div class="bh-card"><h3>Новое обращение</h3><div style="display:grid;gap:10px"><input class="bh-input" id="t-title" placeholder="Тема"><textarea class="bh-input" id="t-text" rows="4" placeholder="Сообщение"></textarea><button class="bh-btn-red" id="t-go" style="background:#4ec97b;color:#06210f!important">Отправить</button></div></div><div class="bh-card"><h3>Мои обращения</h3>'+list+'</div></div>';
};
P["support"].init=function(){$("#t-go").addEventListener("click",function(){var a=$("#t-title").value.trim(),b=$("#t-text").value.trim();if(!a||!b)return toast("Заполните тему и сообщение");S.tickets.unshift({title:a,text:b,date:Date.now()});save();toast("Обращение отправлено");route()})};

/* Қалған бөлімдер */
var SOON={web:"Мои веб сервера","web/buy":"Заказать веб хостинг",protection:"Моя защита","protection/buy":"Купить веб защиту",domain:"Мои домены","domain/buy":"Покупка домена",launcher:"Мои лаунчеры","launcher/buy":"Заказать лаунчер",services:"Услуги","page/oferta":"Договор-оферта","page/about":"О хостинге"};
Object.keys(SOON).forEach(function(k){P[k]=function(){return placeholder(SOON[k])}});

/* ---------- маршрутизатор ---------- */
function resolve(h){
  var m=h.match(/^server\/(\d+)(?:\/([a-z]+))?$/);
  if(m)return {fn:serverPage,args:[+m[1],m[2]||"manage"]};
  if(P[h])return {fn:P[h],args:[]};
  return null;
}
function route(){
  var h=(location.hash||"#home").slice(1)||"home",r=resolve(h);
  var act=/^server\//.test(h)?"servers":(/^profile/.test(h)?"profile":h);
  $$(".menu__link").forEach(function(a){a.classList.toggle("active",(a.getAttribute("href")||"").replace(/^#/,"")===act)});
  if(base){
    if(!r)base.innerHTML=home;
    else{base.innerHTML=r.fn.apply(null,r.args);if(r.fn.init)r.fn.init.apply(null,r.args)}
  }
  updateTop();
  if(menu&&menu.classList.contains("_active")){menu.classList.remove("_active");burger.classList.remove("_active")}
  window.scrollTo(0,0);
}

/* ---------- мәзір ---------- */
if(burger&&menu)burger.addEventListener("click",function(){burger.classList.toggle("_active");menu.classList.toggle("_active")});
$$(".menu__link.sub").forEach(function(a){a.style.cursor="pointer";a.addEventListener("click",function(){var l=a.nextElementSibling;if(!l)return;var o=a.classList.toggle("down");l.style.height=o?l.scrollHeight+"px":"0px"})});
var out=$(".header__power");if(out)out.addEventListener("click",function(e){e.preventDefault();alert("Выход (демо)")});
var sn=$("#support-notify"),c=$("#support-notify-close"),go=$("#support-notify-go");
if(c)c.addEventListener("click",function(){sn.classList.remove("active")});
if(go)go.addEventListener("click",function(){sn.classList.remove("active");location.hash="#support"});
window.addEventListener("hashchange",route);route();
})();
