const fs = require("node:fs");
const path = require("node:path");

const outDir = path.join(process.cwd(), "dist");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const html = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>慧缘纸制品数字化官网</title>
  <meta name="description" content="丹阳市丹北镇慧缘纸制品数字化官网演示，包含产品、询盘、后台和 AI 客服。" />
  <style>
    :root{--ink:#171717;--paper:#f7f3ea;--red:#9f2f24;--graphite:#30343b;--line:rgba(0,0,0,.12)}
    *{box-sizing:border-box}body{margin:0;font-family:Arial,"Microsoft YaHei",sans-serif;background:var(--paper);color:var(--ink)}
    header{position:sticky;top:0;z-index:5;border-bottom:1px solid var(--line);background:rgba(247,243,234,.95);backdrop-filter:blur(12px)}
    .shell{max-width:1180px;margin:0 auto;padding:0 20px}.nav{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:18px}
    .brand small{display:block;color:var(--red);font-weight:700}.brand strong{font-size:20px}.links{display:flex;gap:6px;flex-wrap:wrap}.links button,.btn{border:0;border-radius:6px;padding:10px 14px;background:transparent;color:var(--graphite);font-weight:700;cursor:pointer}.links button:hover{background:rgba(0,0,0,.06)}
    .btn.primary{background:var(--red);color:white}.btn.secondary{border:1px solid var(--line);background:white;color:var(--ink)}
    .hero{background:linear-gradient(120deg,#f7f3ea,#fff 45%,#ead9b8);border-bottom:1px solid var(--line)}.hero-inner{min-height:calc(100vh - 64px);display:grid;grid-template-columns:1.08fr .92fr;align-items:center;gap:40px;padding:56px 20px}
    h1{font-size:56px;line-height:1.1;margin:18px 0 16px}h2{font-size:34px;margin:0 0 12px}p{line-height:1.8;color:rgba(48,52,59,.78)}.tag{display:inline-block;border:1px solid rgba(159,47,36,.22);border-radius:6px;background:white;padding:7px 12px;color:var(--red);font-weight:700}
    .panel,.card{background:white;border:1px solid var(--line);border-radius:8px;box-shadow:0 18px 50px rgba(31,28,23,.08)}.panel{padding:22px}.grid{display:grid;gap:16px}.grid4{grid-template-columns:repeat(4,1fr)}.grid3{grid-template-columns:repeat(3,1fr)}.grid2{grid-template-columns:repeat(2,1fr)}
    section{padding:64px 0}.card{padding:22px}.card .icon{height:42px;width:42px;border-radius:6px;background:rgba(159,47,36,.1);color:var(--red);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px}
    input,textarea,select{width:100%;border:1px solid var(--line);border-radius:6px;padding:12px;font:inherit}textarea{resize:vertical}.form{display:grid;gap:14px}.hidden{display:none!important}
    .adminbar{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}.table{width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden}.table th,.table td{border-top:1px solid var(--line);padding:12px;text-align:left;vertical-align:top}.table th{background:#efe8da}
    .chat{position:fixed;right:20px;bottom:20px;z-index:10}.chatbox{width:min(360px,calc(100vw - 40px));height:500px;background:white;border:1px solid var(--line);border-radius:8px;box-shadow:0 18px 50px rgba(31,28,23,.18);display:flex;flex-direction:column;margin-bottom:10px}.chatlog{flex:1;overflow:auto;background:rgba(247,243,234,.6);padding:14px}.msg{max-width:88%;margin:0 0 10px;padding:10px;border-radius:8px;background:white;line-height:1.6}.msg.user{margin-left:auto;background:var(--red);color:white}.chat form{display:flex;gap:8px;border-top:1px solid var(--line);padding:10px}
    footer{background:#20231f;color:white;padding:34px 0}footer p{color:rgba(255,255,255,.72)}
    @media(max-width:840px){.hero-inner,.grid4,.grid3,.grid2{grid-template-columns:1fr}h1{font-size:40px}.links{display:none}section{padding:42px 0}}
  </style>
</head>
<body>
  <header><div class="shell nav"><div class="brand"><small>丹阳市丹北镇</small><strong>慧缘纸制品</strong></div><nav class="links"><button data-view="home">首页</button><button data-view="products">产品</button><button data-view="inquiry">询盘</button><button data-view="admin">后台</button></nav><button class="btn primary" data-view="inquiry">立即询盘</button></div></header>
  <main id="home" class="view">
    <div class="hero"><div class="shell hero-inner"><div><span class="tag">江苏丹阳 · 三代世家造纸 · 长三角供货</span><h1>慧缘纸制品</h1><p>主营抽泡纸，覆盖黄纸、元宝纸、锡箔纸、纸扎、竹浆纸、板纸和定制加工。以传统信誉承接批发与零售需求，用数字化工具提升咨询、跟进和管理效率。</p><button class="btn primary" data-view="inquiry">发起询盘</button> <button class="btn secondary" data-view="products">查看产品</button></div><div class="panel grid"><div class="card">主打产品：<strong>抽泡纸</strong></div><div class="card">客户类型：<strong>批发商、零售商</strong></div><div class="card">服务区域：<strong>长三角</strong></div><div class="card">AI 客服：<strong>先承接，后转人工</strong></div></div></div></div>
    <section><div class="shell"><h2>完整品类</h2><p>围绕祭祀纸制品加工与批发的产品体系。</p><div id="homeProducts" class="grid grid4"></div></div></section>
    <section style="background:white"><div class="shell grid grid2"><div><h2>工厂实力</h2><p>三代世家造纸，面向长三角批发和零售客户，强调稳定供货、品类完整和人工跟进。</p></div><div class="grid"><div class="card">传统纸品加工经验</div><div class="card">主营抽泡纸，多品类配套</div><div class="card">支持定制加工沟通</div><div class="card">线上询盘与人工销售结合</div></div></div></section>
  </main>
  <main id="products" class="view hidden"><section><div class="shell"><h2>产品中心</h2><p>后台新增或下架产品后，这里会同步展示。</p><div id="productGrid" class="grid grid4"></div></div></section></main>
  <main id="inquiry" class="view hidden"><section><div class="shell grid grid2"><div><h2>在线咨询</h2><p>留下产品、数量、地区和联系方式。价格、库存、发货、账期由人工确认。</p><div class="card">地址：江苏省镇江市丹阳市丹北镇埤城镇</div></div><form id="inquiryForm" class="form panel"><input name="name" required placeholder="姓名"><input name="phone" required placeholder="手机"><input name="wechat" placeholder="微信"><input name="region" placeholder="所在地区"><select name="product" required></select><input name="quantity" placeholder="预计数量"><textarea name="note" rows="4" placeholder="需求说明"></textarea><button class="btn primary">提交询盘</button><p id="inquiryStatus"></p></form></div></section></main>
  <main id="admin" class="view hidden"><section><div class="shell"><h2>管理后台演示</h2><p>默认账号 admin@example.com / change-me。此在线版本使用浏览器本地存储演示，真实业务部署使用 PostgreSQL。</p><form id="loginForm" class="form panel" style="max-width:420px"><input name="email" type="email" placeholder="管理员邮箱"><input name="password" type="password" placeholder="密码"><button class="btn primary">登录后台</button><p id="loginStatus"></p></form><div id="adminPanel" class="hidden"><div class="adminbar"><button class="btn primary" data-admin="products">产品管理</button><button class="btn secondary" data-admin="inquiries">询盘管理</button><button class="btn secondary" data-admin="knowledge">AI 知识库</button></div><div id="adminContent"></div></div></div></section></main>
  <div class="chat"><div id="chatbox" class="chatbox hidden"><div class="panel" style="border:0;border-bottom:1px solid var(--line);border-radius:8px 8px 0 0;padding:12px"><strong>慧缘 AI 客服</strong></div><div id="chatlog" class="chatlog"></div><form id="chatForm"><input name="message" placeholder="输入产品、数量或地区"><button class="btn primary">发送</button></form></div><button id="chatToggle" class="btn primary">AI 客服</button></div>
  <footer><div class="shell"><strong>慧缘纸制品</strong><p>扎根江苏丹阳丹北镇，服务长三角批发、零售供货、定制加工和长期合作。</p></div></footer>
  <script>
    const seedCategories = ["抽泡纸","黄纸/烧纸","元宝纸","锡箔纸","纸扎","竹浆纸","板纸","定制加工"].map((name,i)=>({id:"c"+i,name,description:["主打产品，适合批发、零售渠道和长期稳定供货。","传统祭祀场景常用品类，可按客户需求匹配规格。","覆盖常规流通规格，适合区域批发和门店补货。","面向祭祀用品渠道，支持多品类组合采购。","配合传统祭祀用品需求，后续可扩展定制展示。","原料来源灵活，适合对纸质有要求的客户沟通。","可作为加工配套品类，服务更完整的采购需求。","支持批量加工、规格沟通和长期渠道合作。"][i],active:true}));
    const state = {
      categories: JSON.parse(localStorage.getItem("hy_categories")||"null") || seedCategories,
      products: JSON.parse(localStorage.getItem("hy_products")||"[]"),
      inquiries: JSON.parse(localStorage.getItem("hy_inquiries")||"[]"),
      knowledge: JSON.parse(localStorage.getItem("hy_knowledge")||"null") || [{id:"k1",title:"基础客服口径",content:"慧缘纸制品位于江苏丹阳丹北镇，主营抽泡纸，服务长三角批发商和零售商。价格、发货、规格请客户留下微信或手机号，由人工确认。",active:true}],
      authed: false
    };
    const save=()=>{localStorage.setItem("hy_categories",JSON.stringify(state.categories));localStorage.setItem("hy_products",JSON.stringify(state.products));localStorage.setItem("hy_inquiries",JSON.stringify(state.inquiries));localStorage.setItem("hy_knowledge",JSON.stringify(state.knowledge));};
    const $=s=>document.querySelector(s); const $$=s=>Array.from(document.querySelectorAll(s));
    function show(view){ $$(".view").forEach(v=>v.classList.add("hidden")); $("#"+view).classList.remove("hidden"); render(); }
    $$("[data-view]").forEach(b=>b.onclick=()=>show(b.dataset.view));
    function cards(){return state.products.filter(p=>p.active).length?state.products.filter(p=>p.active).map(p=>({name:p.name,description:p.description,category:state.categories.find(c=>c.id===p.categoryId)?.name||""})):state.categories;}
    function renderProducts(target){$(target).innerHTML=cards().map(p=>'<div class="card"><div class="icon">'+p.name.slice(0,1)+'</div>'+(p.category?'<small style="color:var(--red);font-weight:700">'+p.category+'</small>':'')+'<h3>'+p.name+'</h3><p>'+p.description+'</p></div>').join("");}
    function render(){renderProducts("#homeProducts");renderProducts("#productGrid"); const select=$('#inquiryForm select[name=product]'); select.innerHTML='<option value="">请选择产品</option>'+state.categories.map(c=>'<option>'+c.name+'</option>').join(""); if(state.authed) renderAdmin("products");}
    $("#inquiryForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.inquiries.unshift({id:crypto.randomUUID(),createdAt:new Date().toLocaleString(),status:"待跟进",name:f.get("name"),phone:f.get("phone"),wechat:f.get("wechat"),region:f.get("region"),product:f.get("product"),quantity:f.get("quantity"),note:f.get("note")});save();e.target.reset();$("#inquiryStatus").textContent="已收到询盘，后台可查看。";};
    $("#loginForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.authed=f.get("email")==="admin@example.com"&&f.get("password")==="change-me";$("#loginStatus").textContent=state.authed?"登录成功":"账号或密码错误";$("#adminPanel").classList.toggle("hidden",!state.authed);if(state.authed)renderAdmin("products");};
    $$("[data-admin]").forEach(b=>b.onclick=()=>renderAdmin(b.dataset.admin));
    function renderAdmin(tab){const box=$("#adminContent"); if(tab==="products"){box.innerHTML='<div class="grid grid2"><form id="catForm" class="form panel"><h3>新增分类</h3><input name="name" required placeholder="分类名"><textarea name="description" required placeholder="说明"></textarea><button class="btn primary">保存分类</button></form><form id="prodForm" class="form panel"><h3>新增产品</h3><select name="categoryId">'+state.categories.map(c=>'<option value="'+c.id+'">'+c.name+'</option>').join("")+'</select><input name="name" required placeholder="产品名"><textarea name="description" required placeholder="说明"></textarea><button class="btn primary">保存产品</button></form></div><div class="grid" style="margin-top:18px">'+state.products.map(p=>'<div class="card"><strong>'+p.name+'</strong><p>'+p.description+'</p><button class="btn secondary" onclick="toggleProduct(\\''+p.id+'\\')">'+(p.active?'下架':'上架')+'</button></div>').join("")+'</div>';$("#catForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.categories.push({id:crypto.randomUUID(),name:f.get("name"),description:f.get("description"),active:true});save();renderAdmin("products");render();};$("#prodForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.products.push({id:crypto.randomUUID(),categoryId:f.get("categoryId"),name:f.get("name"),description:f.get("description"),active:true});save();renderAdmin("products");render();};}
      if(tab==="inquiries"){box.innerHTML='<table class="table"><tr><th>时间</th><th>客户</th><th>电话</th><th>产品</th><th>状态</th></tr>'+state.inquiries.map(i=>'<tr><td>'+i.createdAt+'</td><td>'+i.name+'</td><td>'+i.phone+'</td><td>'+i.product+'</td><td><select onchange="setInquiry(\\''+i.id+'\\',this.value)"><option '+(i.status==="待跟进"?"selected":"")+'>待跟进</option><option '+(i.status==="已联系"?"selected":"")+'>已联系</option><option '+(i.status==="已关闭"?"selected":"")+'>已关闭</option></select></td></tr>').join("")+'</table>';}
      if(tab==="knowledge"){box.innerHTML='<form id="knowForm" class="form panel"><h3>新增知识</h3><input name="title" required placeholder="标题"><textarea name="content" required rows="5" placeholder="客服参考资料"></textarea><button class="btn primary">保存知识</button></form><div class="grid" style="margin-top:18px">'+state.knowledge.map(k=>'<div class="card"><strong>'+k.title+'</strong><p>'+k.content+'</p></div>').join("")+'</div>';$("#knowForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.knowledge.unshift({id:crypto.randomUUID(),title:f.get("title"),content:f.get("content"),active:true});save();renderAdmin("knowledge");};}}
    window.toggleProduct=id=>{const p=state.products.find(x=>x.id===id);p.active=!p.active;save();renderAdmin("products");render();}; window.setInquiry=(id,status)=>{state.inquiries.find(i=>i.id===id).status=status;save();};
    $("#chatToggle").onclick=()=>$("#chatbox").classList.toggle("hidden"); const addMsg=(text,role="assistant")=>{$("#chatlog").innerHTML+='<div class="msg '+role+'">'+text+'</div>';$("#chatlog").scrollTop=99999;}; addMsg("您好，我是慧缘纸制品在线客服。请告诉我产品、数量和地区，价格发货由人工确认。");
    $("#chatForm").onsubmit=e=>{e.preventDefault();const msg=new FormData(e.target).get("message");if(!msg)return;addMsg(msg,"user");const hit=state.knowledge.find(k=>msg.includes("抽泡纸")||msg.includes("价格")||msg.includes("发货"));addMsg((hit?hit.content+" ":"")+"方便的话请留下微信或手机号，人工会继续确认规格、价格和发货。");e.target.reset();};
    render();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, "index.html"), html);

const serverDir = path.join(outDir, "server");
const openaiDir = path.join(outDir, ".openai");
fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(openaiDir, { recursive: true });
fs.copyFileSync(
  path.join(process.cwd(), ".openai", "hosting.json"),
  path.join(openaiDir, "hosting.json")
);

fs.writeFileSync(
  path.join(serverDir, "index.js"),
  `const html = ${JSON.stringify(html)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, service: "huiyuan-paper-sites-demo" });
    }
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }
};
`
);
