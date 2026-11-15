const $=id=>document.getElementById(id);
const BUDGET=8,DAYS=14,TARGET=250,BG=1.5;
const SYS={L:{n:"🫁 Life support",d:"Cleans the air. 2 units keeps air steady.",max:4},
 G:{n:"🌱 Grow lights",d:"Plants make a little air and food.",max:3},
 S:{n:"🛡️ Shielding",d:"Blocks storm radiation (more units = more blocked).",max:4},
 X:{n:"🔬 Science",d:"Earns research points. Goal: "+TARGET+".",max:5}};
let st;
function rnd(){return Math.random()}
function start(mode){
 st={mode,sol:0,air:50,dose:0,sci:0,a:{L:2,G:1,S:1,X:2},lv:[],notes:[],dust:[],badge:"ARCHIVED",cls:"arch",title:""};
 for(let i=0;i<DAYS;i++)st.dust.push(rnd()<.2?2:0);
 if(mode==="random"){st.badge="SIMULATED";st.cls="sim";st.title="Random practice sky";
  for(let i=0;i<DAYS;i++){const r=rnd();st.lv.push(r<.45?0:r<.7?1:r<.9?2:3);}
  return begin();}
 if(ARCHIVE[mode]){const s=ARCHIVE[mode];st.lv=s.levels.slice();st.notes=s.notes;st.title=s.name;return begin();}
 loadLive();
}
async function loadLive(){
 const f=d=>d.toISOString().slice(0,10),e=new Date(),s=new Date(e-13*864e5);
 try{
  const r=await fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${f(s)}&endDate=${f(e)}&api_key=DEMO_KEY`);
  if(!r.ok)throw 0;const j=await r.json();
  const m={X:3,M:2,C:1};st.lv=Array(DAYS).fill(0);st.notes={};
  (j||[]).forEach(x=>{const day=Math.round((new Date(x.beginTime.slice(0,10))-s)/864e5);
   const l=m[(x.classType||"")[0]]||0;if(day>=0&&day<DAYS&&l>=st.lv[day]){st.lv[day]=l;st.notes[day]=x.classType+" flare (real, NASA DONKI)";}});
  st.badge="LIVE (last 14 days)";st.cls="live";st.title="Real sky: "+f(s)+" to "+f(e);
 }catch(err){
  const s2=ARCHIVE.may2024;st.lv=s2.levels.slice();st.notes=s2.notes;
  st.title=s2.name+" (live feed unavailable, using archive)";
 }
 begin();
}
function begin(){$("start").hidden=true;$("game").hidden=false;render();}
const pw=()=>BUDGET-st.dust[st.sol];
const used=()=>Object.values(st.a).reduce((a,b)=>a+b,0);
function calc(){const a=st.a,lv=st.lv[st.sol];
 const air=2*a.L+1.5*a.G-6,dose=BG+[0,5,12,22][lv]*(1-0.2*a.S),sci=a.X*10;
 return{air,dose,sci,lv};}
function bar(id,label,cur,max,proj,cls,goodUp){
 const c=Math.max(0,Math.min(100,cur/max*100)),p=Math.max(0,Math.min(100,proj/max*100));
 const up=p>=c,lo=Math.min(c,p),hi=Math.max(c,p);
 const good=(up===goodUp);
 return `<div class="m"><b>${label}</b> ${cur.toFixed(0)} / ${max} <small>→ tomorrow ${proj.toFixed(0)}</small>
 <div class="bar"><div class="fill ${cls}" style="width:${lo}%"></div><div class="gh ${good?"good":"bad"}" style="left:${lo}%;width:${hi-lo}%"></div></div></div>`;}
function render(){
 const c=calc(),lv=c.lv,nx=st.lv[st.sol+1];
 $("sol").textContent=`Sol ${st.sol+1} of ${DAYS} · ${st.title}`;
 $("badge").innerHTML=`<span class="b ${st.cls}">${st.badge}</span>`;
 $("sky").innerHTML=`<h3>☀️ Today's sky: <span class="storm${lv}">${LEVELS[lv]}</span></h3>${st.notes[st.sol]?`<small>${st.notes[st.sol]}</small><br>`:""}
 <small>Tomorrow's forecast: ${nx===undefined?"mission ends":`<span class="storm${nx}">${LEVELS[nx]}</span>`}. Real crews get storm warnings from space-weather forecasters, but forecasts can be wrong!</small>`;
 $("meters").innerHTML=bar("a","💨 Air",st.air,100,st.air+c.air,"air",true)+
  bar("d","☢️ Radiation dose (max 100)",st.dose,100,st.dose+c.dose,"dose",false)+
  bar("s","🔬 Science",st.sci,TARGET,st.sci+c.sci,"sci",true);
 $("left").textContent=pw()-used();
 $("dustnote").textContent=st.dust[st.sol]?"(Moon dust on the solar panels: -2 power today!)":"";
 $("ctl").innerHTML=Object.keys(SYS).map(k=>`<div class="row"><div>${SYS[k].n}<span class="d">${SYS[k].d}</span></div>
 <button onclick="adj('${k}',-1)">−</button><b class="v">${st.a[k]}</b><button onclick="adj('${k}',1)">+</button></div>`).join("");
 $("end").hidden=false;$("result").hidden=true;
}
function adj(k,d){const v=st.a[k]+d;if(v<0||v>SYS[k].max)return;if(d>0&&used()>=pw())return;st.a[k]=v;render();}
function why(c,before){
 const a=st.a;
 if(c.lv>=2&&a.S<=1)return["You took a big dose because shielding was low. Space radiation raises astronauts' long-term health risks, which is why NASA sets dose limits for crews and plans shelters.",SRC.dosimetry,"NASA OSDR radiation research"];
 if(c.lv>=2)return["Your shielding blocked part of the storm, but it cost power that science could have used. Mission planners make this trade every storm. Real storm data comes from DONKI.",SRC.donki,"NASA DONKI space weather"];
 if(c.air<0)return["Your air went down. Life support burns real power on the Moon and Mars. Plants help a little, and experiments in OSDR study how plants grow in space, where light is a key factor.",SRC.veggie,"NASA OSDR plant biology"];
 if(a.X>=4)return["Lots of science! But a calm sky can turn into a storm quickly, so crews keep a power reserve. Artemis plans a sustained Moon presence where every watt is counted.",SRC.artemis,"NASA Artemis"];
 return["A calm day. Mission planners still balance air, radiation and science every day because small choices add up over weeks.",SRC.artemis,"NASA Artemis"];}
function endSol(){
 const c=calc(),before=st.air;
 st.air=Math.min(100,st.air+c.air);st.dose+=c.dose;st.sci+=c.sci;
 const w=why(c,before);
 $("end").hidden=true;$("result").hidden=false;
 $("result").innerHTML=`<h3>Sol ${st.sol+1} report</h3>Air ${c.air>=0?"+":""}${c.air.toFixed(1)} · Dose +${c.dose.toFixed(1)} · Science +${c.sci}
 <p><b>❓ Why?</b> ${w[0]} <a href="${w[1]}" target="_blank" rel="noopener">${w[2]} ↗</a></p>
 <button class="go" onclick="next()">Next sol ▶</button>`;
 $("meters").innerHTML=bar("a","💨 Air",st.air,100,st.air,"air",true)+bar("d","☢️ Radiation dose (max 100)",st.dose,100,st.dose,"dose",false)+bar("s","🔬 Science",st.sci,TARGET,st.sci,"sci",true);
}
function next(){
 if(st.air<=0)return over("💨 Out of air!","The crew ran out of breathable air. Life support is the first thing a base can never skip.");
 if(st.dose>=100)return over("☢️ Too much radiation!","The crew absorbed too much radiation. Shielding and storm shelters are why real missions watch the Sun.");
 st.sol++;if(st.sol>=DAYS)return finish();render();
}
function finish(){
 const ok=st.sci>=TARGET,stars=ok?(st.dose<50?3:2):1;
 over(ok?"🎉 Mission success! "+"⭐".repeat(stars):"🌙 Crew survived, but not enough science","You scored "+st.sci+" of "+TARGET+" science points with "+st.dose.toFixed(0)+" dose and "+st.air.toFixed(0)+" air left. Try a different strategy or sky!");
}
function over(t,m){$("game").hidden=true;$("over").hidden=false;
 $("over").innerHTML=`<div class="card"><h2>${t}</h2><p>${m}</p><p class="note">Failing is how engineers learn. Each sky is different, so try again!</p><button class="go" onclick="location.reload()">Play again</button></div>`;}
document.querySelectorAll("#start button").forEach(b=>b.onclick=()=>start(b.dataset.m));
$("end").onclick=endSol;
