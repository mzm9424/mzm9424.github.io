const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k,d=null){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};
const defaultMarkets=[
 {sym:"BTC",name:"Bitcoin",pair:"BTC / USD",price:68420.18,change:2.84},
 {sym:"ETH",name:"Ethereum",pair:"ETH / USD",price:2488.72,change:1.92},
 {sym:"SOL",name:"Solana",pair:"SOL / USD",price:148.62,change:-0.71},
 {sym:"BNB",name:"BNB",pair:"BNB / USD",price:611.35,change:0.63},
 {sym:"XRP",name:"XRP",pair:"XRP / USD",price:2.31,change:-1.13},
 {sym:"ADA",name:"Cardano",pair:"ADA / USD",price:.84,change:3.41}
];
let state=store.get("btn_state",{user:null,loggedIn:false,selected:"BTC",transactions:[],favorites:["BTC","ETH"]});
const fmt=(n,d=2)=>new Intl.NumberFormat("en-US",{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
const money=n=>"$"+fmt(n);
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2600)};
function save(){store.set("btn_state",state)}
function market(sym){return defaultMarkets.find(x=>x.sym===sym)||defaultMarkets[0]}
function lineSVG(seed=1){let pts=[],y=55;for(let i=0;i<34;i++){y+=Math.sin(i*1.7+seed)*4+(Math.random()-.48)*5;y=Math.max(18,Math.min(88,y));pts.push(`${i*3.03},${y}`)}return pts.join(" ")}
function chartSVG(){const pts=[5,70,12,62,20,65,29,44,38,51,47,33,56,39,65,23,74,31,83,17,92,28,100,20].reduce((a,v,i)=>{if(i%2===0)a.push(`${v},${[70,58,62,42,48,34,40,25,32,19,24,15][i/2]}`);return a},[]);return `<svg viewBox="0 0 105 90" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient></defs><line class="gridline" x1="0" y1="20" x2="105" y2="20"/><line class="gridline" x1="0" y1="45" x2="105" y2="45"/><line class="gridline" x1="0" y1="70" x2="105" y2="70"/><polyline class="area" points="${pts} 100,90 0,90"/><polyline class="line" points="${pts}"/></svg>`}
function auth(show){$("#loginPanel").classList.toggle("hidden",show!=="login");$("#signupPanel").classList.toggle("hidden",show!=="signup")}
function loginView(){const ok=state.loggedIn&&state.user;$("#authView").classList.toggle("hidden",!!ok);$("#appView").classList.toggle("hidden",!ok);if(ok){$("#topUser").textContent=state.user.name.split(" ")[0];$("#avatar").textContent=state.user.name[0].toUpperCase()}}
function cardMetric(label,value,change,cls="up"){return `<div class="card metric"><div class="label">${label}</div><div class="value">${value}</div><div class="change ${cls}">${change}</div></div>`}
function marketsTable(rows=defaultMarkets){return `<div class="table-wrap"><table class="table"><thead><tr><th>Asset</th><th>Price</th><th>24h</th><th>Market</th><th></th></tr></thead><tbody>${rows.map(m=>`<tr><td><div class="coin"><span class="coin-icon">${m.sym[0]}</span>${m.name}<span class="mini-tag">${m.sym}</span></div></td><td class="price">${money(m.price)}</td><td class="${m.change>=0?"up":"down"}">${m.change>=0?"+":""}${m.change}%</td><td>${money(m.price*18240)}</td><td><button class="btn" style="padding:6px 10px;font-size:10px" data-trade="${m.sym}">Trade</button></td></tr>`).join("")}</tbody></table></div>`}
function dashboard(){
 const total=128420.74;
 return `<div class="page-head"><div><span class="eyebrow">OVERVIEW</span><h1>Good evening, ${state.user.name.split(" ")[0]}</h1><p>Your simulated portfolio at a glance.</p></div><div class="actions"><button class="btn" data-route-go="deposit">＋ Deposit</button><button class="btn primary" data-route-go="trade">Trade now</button></div></div>
 <div class="grid grid-4">${cardMetric("Portfolio balance",money(total),"+$3,842.18 · +3.08%","up")}${cardMetric("Available balance",money(48260.12),"Ready for simulated orders","up")}${cardMetric("24h P&L","+$2,184.60","+1.72% today","up")}${cardMetric("Open positions","08","2 positions changed today","up")}</div>
 <div class="two-col" style="margin-top:16px"><div class="card chart-card"><div class="chart-head"><div><span class="eyebrow">PORTFOLIO VALUE</span><h2>${money(total)}</h2><span class="up" style="font-size:11px">↗ 3.08% this period</span></div><div class="range">${["1D","1W","1M","1Y"].map((x,i)=>`<button class="${i===2?"active":""}">${x}</button>`).join("")}</div></div><div class="chart">${chartSVG()}</div></div>
 <div class="card"><div class="section-title" style="margin-top:0"><h3>Allocation</h3><span class="kpi-note">Simulated</span></div>${[["BTC",52],["ETH",24],["USDT",14],["SOL",10]].map(x=>`<div style="margin:17px 0"><div style="display:flex;justify-content:space-between;font-size:11px"><span>${x[0]}</span><span class="muted">${x[1]}%</span></div><div style="height:5px;background:#18273a;border-radius:10px;margin-top:7px"><div style="height:100%;width:${x[1]}%;background:#38bdf8;border-radius:10px"></div></div></div>`).join("")}</div></div>
 <div class="section-title"><h3>Market watch</h3><a href="#markets">View all →</a></div><div class="card">${marketsTable(defaultMarkets.slice(0,4))}</div>`;
}
function marketsPage(){
 return `<div class="page-head"><div><span class="eyebrow">MARKETS</span><h1>Market overview</h1><p>Indicative simulated prices for interface testing.</p></div><button class="btn">☆ Watchlist</button></div><div class="grid grid-3">${defaultMarkets.map((m,i)=>`<div class="card market-card"><div class="market-top"><div><div class="market-symbol">${m.name} <span class="mini-tag">${m.sym}/USD</span></div><div class="market-price">${money(m.price)}</div></div><span class="${m.change>=0?"up":"down"}">${m.change>=0?"+":""}${m.change}%</span></div><div class="spark"><svg viewBox="0 0 100 50" preserveAspectRatio="none"><polyline points="${lineSVG(i+1)}" fill="none" stroke="${m.change>=0?"#10b981":"#ef4444"}" stroke-width="2"/></svg></div><button class="btn" data-trade="${m.sym}">Trade ${m.sym} →</button></div>`).join("")}</div><div class="section-title"><h3>All markets</h3></div><div class="card">${marketsTable()}</div>`;
}
function tradePage(){
 const m=market(state.selected);
 return `<div class="page-head"><div><span class="eyebrow">TRADE</span><h1>Spot trading</h1><p>Orders are simulated locally and never broadcast to a network.</p></div><span class="pill green">SIMULATION ACTIVE</span></div>
 <div class="grid grid-3"><div class="card" style="grid-column:span 2"><div class="chart-head"><div><span class="eyebrow">${m.pair}</span><h2>${money(m.price)} <span class="up" style="font-size:11px">+${m.change}%</span></h2></div><div class="range">${["5m","1H","4H","1D"].map((x,i)=>`<button class="${i===1?"active":""}">${x}</button>`).join("")}</div></div><div class="chart" style="height:370px">${chartSVG()}</div></div>
 <div class="card"><div class="section-title" style="margin-top:0"><h3>Order ticket</h3><span class="pill">SPOT</span></div><div class="field"><label>Asset</label><div class="select"><select id="tradeAsset">${defaultMarkets.map(x=>`<option value="${x.sym}" ${x.sym===m.sym?"selected":""}>${x.sym} / USD</option>`).join("")}</select></div></div><div class="field"><label>Side</label><div class="actions"><button class="btn primary" id="buySide" style="flex:1">Buy</button><button class="btn" id="sellSide" style="flex:1">Sell</button></div></div><div class="field"><label>Order type</label><select class="select" style="padding:12px;background:#09111e;color:white;border:1px solid #1c2a40;border-radius:11px"><option>Market</option><option>Limit</option></select></div><div class="field"><label>Amount (USD)</label><input id="orderAmount" type="number" min="1" placeholder="1,000.00"></div><div class="balance-box"><small>Available balance</small><strong>$48,260.12 USD</strong></div><button class="btn primary full" id="placeOrder">Place simulated order</button></div></div>`;
}
function walletPage(){
 return `<div class="page-head"><div><span class="eyebrow">WALLET</span><h1>Assets</h1><p>Portfolio balances shown for interface simulation.</p></div><div class="actions"><button class="btn" data-route-go="deposit">Deposit</button><button class="btn primary" data-route-go="withdraw">Withdraw</button></div></div>
 <div class="grid grid-3">${cardMetric("Total balance","$128,420.74","+3.08% 24h","up")}${cardMetric("Crypto assets","$119,860.62","93.3% of portfolio","up")}${cardMetric("Cash / stable","$8,560.12","6.7% of portfolio","up")}</div>
 <div class="section-title"><h3>Asset balances</h3></div><div class="card">${marketsTable(defaultMarkets.map((m,i)=>({...m,price:[68420.18,2488.72,148.62,611.35,2.31,.84][i]})))}</div>`;
}
function formPage(type){
 const deposit=type==="deposit";
 return `<div class="page-head"><div><span class="eyebrow">${deposit?"FUND ACCOUNT":"SEND ASSETS"}</span><h1>${deposit?"Deposit":"Withdraw"}</h1><p>${deposit?"Choose a simulated funding method.":"Create a simulated withdrawal request for UI testing."}</p></div></div>
 <div class="card form-card"><div class="notice ${deposit?"":"danger"}">${deposit?"Simulation only: no payment is processed and no funds are received.":"Simulation only: no blockchain transaction or bank transfer will be created."}</div><div style="height:18px"></div>
 ${deposit?`<div class="field"><label>Funding asset</label><select id="fundAsset" class="select"><option>USDT — Tether</option><option>BTC — Bitcoin</option><option>ETH — Ethereum</option></select></div><div class="field"><label>Amount (USD)</label><input id="fundAmount" type="number" placeholder="5,000"></div><div class="field"><label>Method</label><select class="select"><option>Simulated bank transfer</option><option>Simulated crypto transfer</option></select></div>`:`<div class="balance-box"><small>Available simulated balance</small><strong>$48,260.12 USD</strong></div><div class="field"><label>Asset</label><select id="withdrawAsset" class="select"><option>USDT — Tether</option><option>BTC — Bitcoin</option><option>ETH — Ethereum</option></select></div><div class="field"><label>Destination address</label><input id="withdrawAddress" placeholder="Enter simulated destination"></div><div class="field"><label>Amount (USD)</label><input id="withdrawAmount" type="number" placeholder="2,500"></div>`}
 <button class="btn primary full" id="${deposit?"depositBtn":"withdrawBtn"}>${deposit?"Add simulated funds":"Submit simulated withdrawal"} →</button></div>`;
}
function transactionsPage(){
 const tx=state.transactions.length?state.transactions:[{type:"Trade",asset:"BTC/USD",amount:"+$1,250.00",status:"Completed",date:"Today · 18:42"},{type:"Deposit",asset:"USDT",amount:"+$5,000.00",status:"Completed",date:"Oct 05 · 13:20"},{type:"Trade",asset:"ETH/USD",amount:"-$820.00",status:"Completed",date:"Oct 04 · 09:16"}];
 return `<div class="page-head"><div><span class="eyebrow">ACTIVITY</span><h1>Transactions</h1><p>Local simulated activity history.</p></div></div><div class="card">${tx.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Type</th><th>Asset</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>${tx.map(t=>`<tr><td>${t.type}</td><td>${t.asset}</td><td class="${String(t.amount).startsWith("+")?"up":"down"}">${t.amount}</td><td><span class="pill green">${t.status}</span></td><td class="muted">${t.date}</td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">No transactions yet.</div>`}</div>`;
}
function settingsPage(){
 return `<div class="page-head"><div><span class="eyebrow">PREFERENCES</span><h1>Settings</h1><p>Manage your local frontend preferences.</p></div></div><div class="card settings-list">
 ${[["Price alerts","Receive simulated market alert notifications.",true],["Two-step verification","UI preference only — no real authentication is performed.",false],["Compact charts","Use a tighter chart presentation.",true],["Email notifications","Local notification preference.",false]].map(x=>`<div class="setting"><div><strong>${x[0]}</strong><span>${x[1]}</span></div><button class="toggle ${x[2]?"on":""}" data-toggle></button></div>`).join("")}
 </div><div class="section-title"><h3>Profile</h3></div><div class="card"><div class="field"><label>Display name</label><input id="profileName" value="${state.user.name}"></div><button class="btn primary" id="saveProfile">Save changes</button></div>`;
}
function render(){
 if(!state.loggedIn){loginView();return}
 loginView();
 const route=(location.hash.replace("#","")||"dashboard").split("/")[0];
 const pages={dashboard:dashboard,markets:marketsPage,trade:tradePage,wallet:walletPage,deposit:()=>formPage("deposit"),withdraw:()=>formPage("withdraw"),transactions:transactionsPage,settings:settingsPage};
 $("#main").innerHTML=(pages[route]||dashboard)();
 $$("[data-route]").forEach(a=>a.classList.toggle("active",a.dataset.route===route));
 bindDynamic();
}
function bindDynamic(){
 $$("[data-route-go]").forEach(b=>b.onclick=()=>location.hash=b.dataset.routeGo);
 $$("[data-trade]").forEach(b=>b.onclick=()=>{state.selected=b.dataset.trade;save();location.hash="trade"});
 $$("[data-toggle]").forEach(b=>b.onclick=()=>b.classList.toggle("on"));
 const asset=$("#tradeAsset"); if(asset)asset.onchange=()=>{state.selected=asset.value;save();render()};
 const order=$("#placeOrder"); if(order)order.onclick=()=>{const a=+$("#orderAmount").value;if(!a||a<=0)return toast("Enter an order amount.");state.transactions.unshift({type:"Trade",asset:state.selected+"/USD",amount:"$"+fmt(a),status:"Completed",date:"Just now"});save();toast("Simulated order completed.");location.hash="transactions"};
 const dep=$("#depositBtn");if(dep)dep.onclick=()=>{const a=+$("#fundAmount").value;if(!a)return toast("Enter a funding amount.");state.transactions.unshift({type:"Deposit",asset:$("#fundAsset").value.split(" ")[0],amount:"+$"+fmt(a),status:"Completed",date:"Just now"});save();toast("Simulated deposit added.");location.hash="transactions"};
 const wd=$("#withdrawBtn");if(wd)wd.onclick=()=>{const a=+$("#withdrawAmount").value;if(!a||!$("#withdrawAddress").value.trim())return toast("Enter an amount and destination.");state.transactions.unshift({type:"Withdrawal",asset:$("#withdrawAsset").value.split(" ")[0],amount:"-$"+fmt(a),status:"Pending",date:"Just now"});save();toast("Simulated withdrawal submitted.");location.hash="transactions"};
 const sp=$("#saveProfile");if(sp)sp.onclick=()=>{const n=$("#profileName").value.trim();if(n){state.user.name=n;save();render();toast("Profile updated locally.")}};
}
$("#loginForm").onsubmit=e=>{e.preventDefault();state.user={name:"BTN User",email:$("#loginEmail").value};state.loggedIn=true;save();location.hash="dashboard";render();toast("Signed in to simulated workspace.")};
$("#signupForm").onsubmit=e=>{e.preventDefault();state.user={name:$("#signupName").value.trim(),email:$("#signupEmail").value.trim()};state.loggedIn=true;save();location.hash="dashboard";render();toast("Account created locally.")};
$$("[data-auth]").forEach(b=>b.onclick=()=>auth(b.dataset.auth));
$$("[data-action]").forEach(b=>b.onclick=e=>{const a=b.dataset.action;if(a==="logout"){state.loggedIn=false;save();location.hash="login";render();toast("Signed out.")}if(a==="forgot")toast("Password recovery is not connected in this frontend.");if(a==="notify")toast("No new simulated notifications.")});
$("#mobileMenu").onclick=()=>$("#sidebar").classList.toggle("open");
$("#profileBtn").onclick=()=>location.hash="settings";
$("#globalSearch").oninput=e=>{const q=e.target.value.toLowerCase().trim();if(q.length>1&&location.hash!=="#markets")location.hash="markets";};
window.addEventListener("hashchange",render);
if(!location.hash)location.hash=state.loggedIn?"dashboard":"login";
render();
