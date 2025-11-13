// Mock data and state
const state = {
  products: [],
  cart: [],
  wishlist: [],
  user: null,
  addresses: [],
  orders: [],
  searchIndex: [],
  suggestions: ["iphone", "laptop", "headphones", "air fryer", "sneakers", "t-shirts", "smartwatch", "sofa"],
};

const currency = (n) => `₹${n.toLocaleString("en-IN")}`;

// Seed products with Amazon/Flipkart-like attributes
function seedProducts() {
  const base = [
    { id: "p1", title: "Aurora Wireless Headphones", brand: "Auralite", category: "Audio", price: 3499, mrp: 5999, rating: 4.4, reviews: 812, badge: "Deal", images: ["https://picsum.photos/seed/aurora1/800/600","https://picsum.photos/seed/aurora2/800/600","https://picsum.photos/seed/aurora3/800/600"], specs: { "Battery": "40 hrs", "Noise Cancel": "Yes", "BT": "5.3" }, fbt: ["p3","p6"] },
    { id: "p2", title: "Nimbus Pro Laptop 14”", brand: "Nimbus", category: "Computers", price: 58990, mrp: 74990, rating: 4.6, reviews: 214, badge: "Top rated", images: ["https://picsum.photos/seed/nimbus1/800/600","https://picsum.photos/seed/nimbus2/800/600"], specs: { "CPU": "Ryzen 7", "RAM": "16 GB", "SSD": "1 TB NVMe" }, fbt: ["p7"] },
    { id: "p3", title: "Flux Smartwatch S2", brand: "Flux", category: "Wearables", price: 4999, mrp: 7999, rating: 4.2, reviews: 1503, images: ["https://picsum.photos/seed/flux1/800/600"], specs: { "AMOLED": "1.8 in", "GPS": "Dual-band", "IP": "68" }, fbt: ["p1"] },
    { id: "p4", title: "Breeze Air Fryer 5L", brand: "KitchPro", category: "Home & Kitchen", price: 6990, mrp: 9990, rating: 4.1, reviews: 968, images: ["https://picsum.photos/seed/air1/800/600"], specs: { "Capacity": "5 L", "Wattage": "1500 W", "Modes": "8" } },
    { id: "p5", title: "Zen Sneakers V", brand: "Stride", category: "Fashion", price: 2990, mrp: 3990, rating: 4.0, reviews: 432, images: ["https://picsum.photos/seed/zen1/800/600"] },
    { id: "p6", title: "Echo Soundbar 120W", brand: "HomeBeat", category: "Audio", price: 10990, mrp: 14990, rating: 4.3, reviews: 990, images: ["https://picsum.photos/seed/echo1/800/600"] },
    { id: "p7", title: "Nimbus USB‑C Dock", brand: "Nimbus", category: "Computers", price: 3490, mrp: 4990, rating: 4.5, reviews: 78, images: ["https://picsum.photos/seed/dock1/800/600"] },
    { id: "p8", title: "Luma LED Desk Lamp", brand: "Luma", category: "Home & Kitchen", price: 1290, mrp: 1990, rating: 4.2, reviews: 356, images: ["https://picsum.photos/seed/lamp1/800/600"] },
  ];
  state.products = base;
  state.searchIndex = base.map(p => ({ id: p.id, q: `${p.title} ${p.brand} ${p.category}`.toLowerCase() }));
}

function persist() {
  localStorage.setItem("glassy_state", JSON.stringify({
    cart: state.cart,
    wishlist: state.wishlist,
    user: state.user,
    addresses: state.addresses,
    orders: state.orders
  }));
}

function restore() {
  seedProducts();
  const raw = localStorage.getItem("glassy_state");
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    Object.assign(state, saved, { products: state.products, searchIndex: state.searchIndex });
  } catch { /* noop */ }
}

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

// UI builders
function productCard(p){
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="card-media">
      <img src="${p.images[0]}" alt="${p.title}" loading="lazy"/>
      ${p.badge ? `<span class="chip" style="position:absolute;left:10px;top:10px;background:#2f7af8;color:#fff">${p.badge}</span>` : ""}
    </div>
    <div class="card-body">
      <h3 class="card-title">${p.title}</h3>
      <div class="rating">★ ${p.rating} • ${p.reviews.toLocaleString()} reviews</div>
      <div class="price">${currency(p.price)} <span class="mrp">${currency(p.mrp)}</span></div>
    </div>
    <div class="card-actions">
      <button class="btn add" data-id="${p.id}"><span class="i i-cart"></span>Add to cart</button>
      <button class="btn heart" data-id="${p.id}" aria-label="Add to wishlist"><span class="i i-heart"></span></button>
      <button class="chip" data-view="${p.id}">View</button>
    </div>
  `;
  return el;
}

function renderGrid(list){
  const grid = qs("#productGrid");
  grid.innerHTML = "";
  list.forEach(p => grid.appendChild(productCard(p)));
}

function renderReco(){
  const rail = qs("#recoRail");
  rail.innerHTML = "";
  const picks = state.products.slice().sort((a,b)=>b.rating-a.rating).slice(0,6);
  picks.forEach(p=>{
    const el = document.createElement("div");
    el.className = "card";
    el.style.minWidth = "240px";
    el.innerHTML = `
      <div class="card-media"><img src="${p.images[0]}" alt="${p.title}" /></div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="price">${currency(p.price)}</div>
      </div>
      <div class="card-actions">
        <button class="chip" data-view="${p.id}">View</button>
      </div>
    `;
    rail.appendChild(el);
  });
}

function sortProducts(key){
  let arr = state.products.slice();
  if(key==="trending") arr.sort((a,b)=>b.reviews - a.reviews);
  if(key==="rating") arr.sort((a,b)=>b.rating - a.rating);
  if(key==="price-asc") arr.sort((a,b)=>a.price - b.price);
  if(key==="price-desc") arr.sort((a,b)=>b.price - a.price);
  renderGrid(arr);
}

function setBadgeCounts(){
  qs("#cartCount").textContent = state.cart.reduce((s,i)=>s+i.qty,0);
  qs("#wishCount").textContent = state.wishlist.length;
}

// Modal and Product Detail
function openModal(title, node){
  const modal = qs("#modal");
  qs("#modalTitle").textContent = title;
  const body = qs("#modalBody");
  body.innerHTML = "";
  body.appendChild(node);
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModal(){
  qs("#modal").classList.add("hidden");
  document.body.style.overflow = "";
}

function productDetail(p){
  const wrap = document.createElement("div");
  wrap.className = "product-detail";
  const thumbs = p.images.map((src,i)=>`<img src="${src}" alt="${p.title} ${i+1}" data-idx="${i}" class="${i===0?"active":""}"/>`).join("");
  const specs = p.specs ? Object.entries(p.specs).map(([k,v])=>`<li><strong>${k}:</strong> ${v}</li>`).join("") : "<li>No specs</li>";
  const fbt = (p.fbt||[]).map(id=>state.products.find(x=>x.id===id)).filter(Boolean);
  wrap.innerHTML = `
    <div class="p-gallery">
      <div class="main"><img id="pMainImg" src="${p.images[0]}" alt="${p.title} main"/></div>
      <div class="thumbs">${thumbs}</div>
    </div>
    <div class="p-info">
      <h2 class="p-title">${p.title}</h2>
      <div class="p-meta">
        <span>Brand: ${p.brand}</span>
        <span>Category: ${p.category}</span>
      </div>
      <div class="rating">★ ${p.rating} • ${p.reviews.toLocaleString()} reviews</div>
      <div class="price">${currency(p.price)} <span class="mrp">${currency(p.mrp)}</span></div>
      <div class="p-cta">
        <button class="btn primary" data-buy="${p.id}">Buy Now</button>
        <button class="btn add" data-id="${p.id}"><span class="i i-cart"></span>Add to cart</button>
        <button class="btn heart" data-id="${p.id}" aria-label="Add to wishlist"><span class="i i-heart"></span></button>
      </div>
      <div class="p-sections">
        <div class="p-section">
          <h4>Specifications</h4>
          <ul>${specs}</ul>
        </div>
        <div class="p-section">
          <h4>Frequently bought together</h4>
          <div class="rail cards">
            ${fbt.map(fp=>`
              <div class="card" style="min-width:220px">
                <div class="card-media"><img src="${fp.images[0]}" alt="${fp.title}" /></div>
                <div class="card-body"><div class="card-title">${fp.title}</div><div class="price">${currency(fp.price)}</div></div>
                <div class="card-actions">
                  <button class="chip" data-view="${fp.id}">View</button>
                  <button class="chip add-mini" data-id="${fp.id}">Add</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="p-section">
          <h4>Reviews</h4>
          <p class="small">Verified purchase badges, helpful votes, and media upload UI can be added here.</p>
        </div>
        <div class="p-section">
          <h4>Q&A</h4>
          <p class="small">Ask seller, get answers, and vote helpfulness.</p>
        </div>
      </div>
    </div>
  `;
  // Gallery interaction
  wrap.querySelectorAll(".thumbs img").forEach(img=>{
    img.addEventListener("click", ()=>{
      qs("#pMainImg", wrap).src = img.src;
      wrap.querySelectorAll(".thumbs img").forEach(t=>t.classList.remove("active"));
      img.classList.add("active");
    });
  });
  return wrap;
}

// Cart, Checkout, Orders
function addToCart(id, qty=1){
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  const item = state.cart.find(x=>x.id===id);
  if(item) item.qty += qty; else state.cart.push({ id, qty, price: p.price });
  setBadgeCounts(); persist();
  microToast(`${p.title} added to cart`);
}
function addToWishlist(id){
  if(!state.wishlist.includes(id)) state.wishlist.push(id);
  setBadgeCounts(); persist();
  microToast("Added to wishlist");
}
function removeFromCart(id){
  state.cart = state.cart.filter(x=>x.id!==id);
  setBadgeCounts(); persist();
}
function renderCart(){
  const box = document.createElement("div");
  const items = state.cart.map(ci=>{
    const p = state.products.find(x=>x.id===ci.id);
    return `
      <div class="card" style="margin-bottom:10px">
        <div class="card-body" style="display:flex;gap:12px;align-items:center">
          <img src="${p.images[0]}" alt="${p.title}" style="width:88px;height:88px;object-fit:cover;border-radius:12px"/>
          <div style="flex:1">
            <div class="card-title">${p.title}</div>
            <div class="price">${currency(p.price)}</div>
            <div>
              <button class="chip qty" data-id="${p.id}" data-d="-1">-</button>
              <span style="padding:0 8px">${ci.qty}</span>
              <button class="chip qty" data-id="${p.id}" data-d="1">+</button>
              <button class="chip remove" data-id="${p.id}" style="margin-left:8px;color:#fff;background:#ef4444">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
  const total = state.cart.reduce((s,ci)=> s + ci.qty * (state.products.find(p=>p.id===ci.id)?.price||0), 0);
  box.innerHTML = `
    <h4>Your Cart</h4>
    ${items || "<p>Your cart is empty.</p>"}
    <div class="p-section">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <strong>Total</strong>
        <strong>${currency(total)}</strong>
      </div>
      <div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end">
        <button class="btn ghost" id="continueShop">Continue Shopping</button>
        <button class="btn primary" id="goCheckout">Proceed to Checkout</button>
      </div>
    </div>
  `;
  // qty controls
  box.addEventListener("click", (e)=>{
    const t = e.target.closest("button");
    if(!t) return;
    if(t.classList.contains("qty")){
      const id = t.dataset.id; const d = +t.dataset.d;
      const it = state.cart.find(x=>x.id===id);
      if(!it) return;
      it.qty = Math.max(1, it.qty + d);
      persist(); openModal("Cart", renderCart());
      setBadgeCounts();
    }
    if(t.classList.contains("remove")){
      removeFromCart(t.dataset.id);
      openModal("Cart", renderCart());
    }
    if(t.id==="continueShop"){ closeModal(); }
    if(t.id==="goCheckout"){ openModal("Checkout", renderCheckout()); }
  });
  return box;
}

function renderCheckout(){
  const box = document.createElement("div");
  const addr = state.addresses[0];
  const total = state.cart.reduce((s,ci)=> s + ci.qty * (state.products.find(p=>p.id===ci.id)?.price||0), 0);
  box.innerHTML = `
    <div class="p-section">
      <h4>Delivery Address</h4>
      ${addr ? `
        <p>${addr.name}, ${addr.line1}, ${addr.city} ${addr.pin}, ${addr.phone}</p>
        <button class="chip" id="changeAddr">Change</button>
      ` : `
        <p>No address saved.</p>
        <button class="chip" id="addAddr">Add Address</button>
      `}
    </div>
    <div class="p-section">
      <h4>Payment</h4>
      <div>
        <label><input type="radio" name="pay" value="cod" checked/> Cash on Delivery</label>
      </div>
      <div>
        <label><input type="radio" name="pay" value="card"/> Card (mock)</label>
      </div>
    </div>
    <div class="p-section">
      <h4>Review Items</h4>
      ${state.cart.map(ci=>{
        const p = state.products.find(x=>x.id===ci.id);
        return `<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
          <img src="${p.images[0]}" alt="${p.title}" style="width:56px;height:56px;border-radius:10px;object-fit:cover"/>
          <div style="flex:1">${p.title}</div>
          <div>× ${ci.qty}</div>
          <div>${currency(p.price*ci.qty)}</div>
        </div>`;
      }).join("")}
      <div style="display:flex;justify-content:space-between;margin-top:8px">
        <strong>Total</strong><strong>${currency(total)}</strong>
      </div>
      <div style="margin-top:10px;display:flex;justify-content:flex-end">
        <button class="btn primary" id="placeOrder">Place Order</button>
      </div>
    </div>
  `;
  box.addEventListener("click",(e)=>{
    const t = e.target;
    if(t.id==="addAddr" || t.id==="changeAddr"){
      openModal("Add Address", renderAddressForm());
    }
    if(t.id==="placeOrder"){
      if(state.cart.length===0){ microToast("Cart is empty"); return; }
      const orderId = "O" + Math.floor(Math.random()*1e6);
      const items = state.cart.map(ci=>({...ci}));
      const now = new Date().toISOString();
      state.orders.unshift({ id: orderId, date: now, items, total: items.reduce((s,i)=> s + i.qty * (state.products.find(p=>p.id===i.id)?.price||0), 0), status: "Processing" });
      state.cart = [];
      persist(); setBadgeCounts();
      openModal("Order Placed", renderOrderPlaced(orderId));
    }
  });
  return box;
}

function renderOrderPlaced(orderId){
  const box = document.createElement("div");
  box.innerHTML = `
    <div class="p-section">
      <h3>Thank you!</h3>
      <p>Your order <strong>${orderId}</strong> has been placed. Track it from Orders.</p>
      <div style="display:flex;gap:8px">
        <button class="btn primary" id="toOrders">Go to Orders</button>
        <button class="btn ghost" id="close">Close</button>
      </div>
    </div>
  `;
  box.addEventListener("click",(e)=>{
    if(e.target.id==="toOrders"){ closeModal(); showOrders(); }
    if(e.target.id==="close"){ closeModal(); }
  });
  return box;
}

function renderAddressForm(){
  const box = document.createElement("form");
  box.className = "p-section";
  box.innerHTML = `
    <div style="display:grid;gap:8px">
      <input class="glass" placeholder="Full name" required name="name"/>
      <input class="glass" placeholder="Phone" required name="phone"/>
      <input class="glass" placeholder="Address line 1" required name="line1"/>
      <input class="glass" placeholder="City" required name="city"/>
      <input class="glass" placeholder="PIN code" required name="pin"/>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px">
        <button class="btn ghost" type="button" id="cancel">Cancel</button>
        <button class="btn primary" type="submit">Save</button>
      </div>
    </div>
  `;
  box.addEventListener("click",(e)=>{ if(e.target.id==="cancel"){ closeModal(); }});
  box.addEventListener("submit",(e)=>{
    e.preventDefault();
    const fd = new FormData(box);
    state.addresses = [{ name: fd.get("name"), phone: fd.get("phone"), line1: fd.get("line1"), city: fd.get("city"), pin: fd.get("pin") }];
    persist();
    microToast("Address saved");
    openModal("Checkout", renderCheckout());
  });
  return box;
}

// Orders and Lists
function showOrders(){
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="p-section">
      <h3>Your Orders</h3>
      ${state.orders.length===0 ? "<p>No orders yet.</p>" : ""}
      ${state.orders.map(o=>{
        return `
          <div class="card" style="margin:10px 0">
            <div class="card-body">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div><strong>${o.id}</strong> • ${new Date(o.date).toLocaleString()}</div>
                <div><strong>${o.status}</strong></div>
              </div>
              ${o.items.map(ci=>{
                const p = state.products.find(x=>x.id===ci.id);
                return `<div style="display:flex;gap:10px;align-items:center;margin-top:8px">
                  <img src="${p.images[0]}" alt="${p.title}" style="width:48px;height:48px;border-radius:10px;object-fit:cover"/>
                  <div style="flex:1">${p.title}</div>
                  <div>× ${ci.qty}</div>
                  <div>${currency(p.price*ci.qty)}</div>
                  <button class="chip return" data-id="${o.id}" data-p="${p.id}" style="margin-left:8px">Return</button>
                </div>`;
              }).join("")}
              <div style="display:flex;justify-content:flex-end;margin-top:8px">
                <strong>Total: ${currency(o.total)}</strong>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
  openModal("Orders", container);
  container.addEventListener("click",(e)=>{
    const t = e.target.closest(".return");
    if(t){
      microToast("Return initiated (mock)");
    }
  });
}

// Wishlist
function showWishlist(){
  const container = document.createElement("div");
  const items = state.wishlist.map(id=>state.products.find(p=>p.id===id)).filter(Boolean);
  container.innerHTML = `
    <h3>Wishlist</h3>
    ${items.length===0 ? "<p>No items in wishlist.</p>" : ""}
    <div class="grid products">
      ${items.map(p=>`
        <article class="card">
          <div class="card-media"><img src="${p.images[0]}" alt="${p.title}" /></div>
          <div class="card-body">
            <div class="card-title">${p.title}</div>
            <div class="price">${currency(p.price)}</div>
          </div>
          <div class="card-actions">
            <button class="btn add" data-id="${p.id}"><span class="i i-cart"></span>Add to cart</button>
            <button class="chip" data-view="${p.id}">View</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
  openModal("Wishlist", container);
}

// Account/Profile
function showProfile(){
  const box = document.createElement("div");
  const u = state.user;
  const addr = state.addresses[0];
  box.innerHTML = `
    <div class="p-section">
      <h4>Account</h4>
      ${u ? `<p>Signed in as <strong>${u.name}</strong></p>` : `<p>Not signed in.</p>`}
      <div style="display:flex;gap:8px">
        ${u ? `<button class="btn ghost" id="logout">Sign out</button>` : `<button class="btn primary" id="login">Sign in</button>`}
        <button class="btn ghost" id="addr">Manage Addresses</button>
      </div>
    </div>
    <div class="p-section">
      <h4>Saved Address</h4>
      ${addr ? `<p>${addr.name}, ${addr.line1}, ${addr.city} ${addr.pin}, ${addr.phone}</p>` : `<p>No address saved.</p>`}
    </div>
  `;
  openModal("Account", box);
  box.addEventListener("click",(e)=>{
    if(e.target.id==="login") openModal("Sign in", renderAuth());
    if(e.target.id==="logout"){ state.user=null; persist(); microToast("Signed out"); closeModal(); }
    if(e.target.id==="addr") openModal("Add Address", renderAddressForm());
  });
}

function renderAuth(){
  const box = document.createElement("form");
  box.className = "p-section";
  box.innerHTML = `
    <input class="glass" placeholder="Name" required name="name"/>
    <input class="glass" placeholder="Email" required type="email" name="email"/>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
      <button class="btn ghost" type="button" id="cancel">Cancel</button>
      <button class="btn primary" type="submit">Continue</button>
    </div>
  `;
  box.addEventListener("click",(e)=>{ if(e.target.id==="cancel") closeModal(); });
  box.addEventListener("submit",(e)=>{
    e.preventDefault();
    const fd = new FormData(box);
    state.user = { name: fd.get("name"), email: fd.get("email") };
    persist();
    microToast("Signed in");
    closeModal();
  });
  return box;
}

// Search, suggestions, filters
function showSuggestions(q){
  const sug = qs("#searchSuggest");
  if(!q){ sug.classList.add("hidden"); return; }
  const inx = state.suggestions.filter(s=>s.startsWith(q.toLowerCase())).slice(0,6);
  sug.innerHTML = inx.map(s=>`<div class="item" role="option">${s}</div>`).join("");
  sug.classList.remove("hidden");
}

function searchProducts(q){
  const s = q.toLowerCase();
  return state.products.filter(p => (`${p.title} ${p.brand} ${p.category}`).toLowerCase().includes(s));
}

function openSearch(q=""){
  const box = document.createElement("div");
  const results = searchProducts(q);
  box.innerHTML = `
    <div class="p-section">
      <h3>Search</h3>
      <div style="display:grid;gap:10px">
        <div style="display:flex;gap:8px">
          <input id="fText" class="glass" placeholder="Search..." value="${q}"/>
          <select id="fCat" class="glass">
            <option value="">All Categories</option>
            ${[...new Set(state.products.map(p=>p.category))].map(c=>`<option>${c}</option>`).join("")}
          </select>
          <select id="fSort" class="glass">
            <option value="">Sort</option>
            <option value="rating">Rating</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <button class="btn pill" id="apply">Apply</button>
        </div>
        <div class="grid products" id="fGrid">${results.map(p=>productCard(p).outerHTML).join("")}</div>
      </div>
    </div>
  `;
  openModal("Search", box);
  box.addEventListener("click",(e)=>{
    const t = e.target;
    if(t.id==="apply"){
      const text = qs("#fText", box).value.trim().toLowerCase();
      const cat = qs("#fCat", box).value;
      const sort = qs("#fSort", box).value;
      let arr = state.products.filter(p => (!text || (`${p.title} ${p.brand} ${p.category}`).toLowerCase().includes(text)) && (!cat || p.category===cat));
      if(sort==="rating") arr.sort((a,b)=>b.rating - a.rating);
      if(sort==="price-asc") arr.sort((a,b)=>a.price - b.price);
      if(sort==="price-desc") arr.sort((a,b)=>b.price - a.price);
      qs("#fGrid", box).innerHTML = arr.map(p=>productCard(p).outerHTML).join("");
    }
  });
}

// Micro toast
function microToast(text){
  const t = document.createElement("div");
  t.textContent = text;
  t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#0b1220;color:#fff;padding:10px 14px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.25);z-index:100;opacity:0;transition:opacity 200ms, transform 200ms";
  document.body.appendChild(t);
  requestAnimationFrame(()=>{ t.style.opacity=1; t.style.transform="translateX(-50%) translateY(-6px)"; });
  setTimeout(()=>{ t.style.opacity=0; t.style.transform="translateX(-50%) translateY(0)"; setTimeout(()=>t.remove(),200); }, 1600);
}

// Event wiring
function wire(){
  // initial
  restore();
  renderGrid(state.products);
  renderReco();
  setBadgeCounts();

  // header actions
  qs("#navToggle").addEventListener("click", ()=>{ qs("#sideDrawer").classList.add("open"); qs("#sideDrawer").setAttribute("aria-hidden","false"); });
  qs("#closeDrawer").addEventListener("click", ()=>{ qs("#sideDrawer").classList.remove("open"); qs("#sideDrawer").setAttribute("aria-hidden","true"); });

  qs("#wishlistBtn").addEventListener("click", showWishlist);
  qs("#cartBtn").addEventListener("click", ()=> openModal("Cart", renderCart()));
  qs("#userBtn").addEventListener("click", showProfile);

  // global clicks (delegation)
  document.addEventListener("click", (e)=>{
    const add = e.target.closest(".btn.add, .add-mini");
    const heart = e.target.closest(".btn.heart");
    const view = e.target.closest("[data-view]");
    const sort = e.target.closest("[data-sort]");
    const route = e.target.closest("[data-route]");
    if(add){ addToCart(add.dataset.id); }
    if(heart){ addToWishlist(heart.dataset.id); }
    if(view){
      const p = state.products.find(x=>x.id===view.dataset.view);
      if(p) openModal("Product", productDetail(p));
    }
    if(sort){ sortProducts(sort.dataset.sort); }
    if(route){
      const r = route.dataset.route;
      if(r==="search") openSearch(qs("#searchInput").value.trim());
      if(r==="orders") showOrders();
      if(r==="wishlist") showWishlist();
      if(r==="profile") showProfile();
      if(r==="help") openModal("Help & Support", helpPanel());
      if(r==="seller") openModal("Seller Central (Preview)", sellerPanel());
      if(r==="home") closeModal();
    }
  });

  // search
  qs("#searchInput").addEventListener("input", (e)=> showSuggestions(e.target.value.trim()));
  qs("#searchInput").addEventListener("keydown", (e)=>{ if(e.key==="Enter"){ e.preventDefault(); openSearch(e.target.value.trim()); qs("#searchSuggest").classList.add("hidden"); }});
  qs("#searchBtn").addEventListener("click", ()=> openSearch(qs("#searchInput").value.trim()));
  qs("#searchSuggest").addEventListener("click",(e)=>{
    const item = e.target.closest(".item");
    if(item){ qs("#searchInput").value = item.textContent; openSearch(item.textContent); qs("#searchSuggest").classList.add("hidden"); }
  });

  // modal controls
  qs("#closeModal").addEventListener("click", closeModal);
  qs("#modal").addEventListener("click",(e)=>{ if(e.target.id==="modal") closeModal(); });

  // keyboard accessibility
  qsa("button, a, input, select").forEach(el=> el.classList.add("focus-ring"));
}

// Help and Seller mock panels
function helpPanel(){
  const box = document.createElement("div");
  box.innerHTML = `
    <div class="p-section">
      <h4>Customer Care</h4>
      <p>Chatbot and ticketing UI can plug here. Typical flows: order issues, returns, refunds.</p>
      <button class="btn ghost">Open Chat (mock)</button>
    </div>
    <div class="p-section">
      <h4>Return Policy</h4>
      <p>Easy returns within 10 days for most items. Pickup scheduling and instant refunds (mock).</p>
    </div>
  `;
  return box;
}

function sellerPanel(){
  const box = document.createElement("div");
  box.innerHTML = `
    <div class="p-section">
      <h4>Seller Central (Preview)</h4>
      <ul>
        <li>Dashboard with orders, revenue, and performance scorecard</li>
        <li>Inventory & listing tools with bulk upload</li>
        <li>Promotions, coupons, and ads</li>
        <li>Analytics with low-stock alerts</li>
      </ul>
      <p class="small">This is a UI preview. Hook to your backend for live seller features.</p>
    </div>
  `;
  return box;
}

// Boot
document.addEventListener("DOMContentLoaded", wire);
