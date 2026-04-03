import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

/* ====== CART CONTEXT ====== */
const CartCtx = createContext();
const useCart = () => useContext(CartCtx);
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const add = (item) => setItems(p => { const e = p.find(i => i.name === item.name); return e ? p.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i) : [...p, { ...item, qty: 1 }]; });
  const remove = (n) => setItems(p => p.filter(i => i.name !== n));
  const updateQty = (n, q) => { if (q <= 0) return remove(n); setItems(p => p.map(i => i.name === n ? { ...i, qty: q } : i)); };
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const getQty = (n) => items.find(i => i.name === n)?.qty || 0;
  return <CartCtx.Provider value={{ items, add, remove, updateQty, clear, total, count, getQty }}>{children}</CartCtx.Provider>;
}

/* ====== MENU DATA ====== */
const MENU = {
  'Gopal Specials': [
    { name: 'Gopal Midway Special', price: 349, tag: '★ House Special', desc: 'Our legendary signature creation' },
    { name: 'Kaju Masala', price: 329, tag: 'Premium', desc: 'Rich cashew curry in royal gravy' },
    { name: 'Paneer Tawa Masala', price: 279, tag: 'Signature', desc: 'Griddle-cooked paneer in spiced gravy' },
    { name: 'Tawa Veg', price: 249, tag: '', desc: 'Mixed vegetables on iron griddle' },
    { name: 'Sarso Da Saag', price: 229, tag: 'Seasonal', desc: 'Punjabi mustard greens with butter' },
    { name: 'Katahal Masala', price: 239, tag: 'Seasonal', desc: 'Jackfruit cooked in Nimari style' },
    { name: 'Methi Malai Mutter', price: 249, tag: 'Seasonal', desc: 'Fenugreek peas in creamy gravy' },
    { name: 'Mushroom Masala', price: 259, tag: '', desc: 'Mushrooms in aromatic curry' },
    { name: 'Green Peas Kaju', price: 289, tag: '', desc: 'Cashew & peas in tomato base' },
  ],
  'Soups': [
    { name: 'Cream of Mushroom', price: 149, tag: 'Creamy', desc: 'Velvety mushroom broth' },
    { name: 'Talmiri Soup', price: 129, tag: 'Regional', desc: 'Nimari spiced broth' },
    { name: 'Veg Manchow', price: 139, tag: 'Popular', desc: 'Crispy noodle topped soup' },
    { name: 'Hot & Sour Soup', price: 139, tag: 'Spicy', desc: 'Tangy spicy vegetables' },
    { name: 'Sweet Corn Soup', price: 129, tag: '', desc: 'Creamy corn with pepper' },
    { name: 'Tomato Soup', price: 109, tag: 'Classic', desc: 'Rich tomato bisque' },
  ],
  'Starters': [
    { name: 'Cheese Corn Roll', price: 199, tag: 'Popular', desc: 'Crispy cheesy corn rolls' },
    { name: 'Veg Gold Coin', price: 219, tag: 'Chef Special', desc: 'Golden fried medallions' },
    { name: 'Spicy Crispy Potato', price: 179, tag: 'Spicy', desc: 'Fiery baby potatoes' },
    { name: 'Veg Manchurian', price: 199, tag: 'Popular', desc: 'Veggie balls in gravy' },
    { name: 'Mushroom Tikka', price: 229, tag: '', desc: 'Tandoor-grilled mushrooms' },
    { name: 'Crispy Corn', price: 189, tag: '', desc: 'Golden seasoned corn' },
  ],
  'Paneer': [
    { name: 'Barbecue Paneer', price: 269, tag: 'Signature', desc: 'Smoky chargrilled BBQ paneer' },
    { name: 'Paneer Malai Tikka', price: 259, tag: 'Popular', desc: 'Creamy tandoor paneer' },
    { name: 'Paneer Pahadi', price: 259, tag: 'Chef Special', desc: 'Green herb mountain style' },
    { name: 'Chilly Paneer', price: 249, tag: 'Popular', desc: 'Bell peppers Indo-Chinese' },
    { name: 'Schezan Paneer', price: 249, tag: 'Spicy', desc: 'Fiery Schezwan sauce' },
    { name: 'Paneer 65', price: 249, tag: '', desc: 'South-Indian spiced crispy' },
  ],
  'Kababs': [
    { name: 'Malai Seek Kabab', price: 279, tag: 'Signature', desc: 'Creamy seekh on skewers' },
    { name: 'Dahi Kabab', price: 249, tag: 'Must Try', desc: 'Melt in mouth curd kabab' },
    { name: 'Hara Bhara Kabab', price: 219, tag: 'Popular', desc: 'Spinach peas green kabab' },
    { name: 'Cheese Corn Kabab', price: 239, tag: '', desc: 'Corn cheese fusion' },
    { name: 'Aloo Cheese Tiki', price: 229, tag: '', desc: 'Cheesy potato tikki' },
  ],
  'Chinese': [
    { name: 'Veg Hakka Noodles', price: 189, tag: 'Popular', desc: 'Classic hakka style' },
    { name: 'Burnt Garlic Noodles', price: 199, tag: '', desc: 'Smoky garlic noodles' },
    { name: 'Sehezwan Noodles', price: 199, tag: 'Spicy', desc: 'Fiery Schezwan noodles' },
    { name: 'American Choupsey', price: 209, tag: '', desc: 'Crispy sweet sour noodles' },
    { name: 'Veg Chowmin', price: 179, tag: '', desc: 'Street-style chowmein' },
  ],
  'Main Course': [
    { name: 'Mix Veg', price: 199, tag: '', desc: 'Seasonal vegetables in gravy' },
    { name: 'Veg Jaipuri', price: 219, tag: '', desc: 'Royal Rajasthani curry' },
    { name: 'Chana Masala', price: 189, tag: '', desc: 'Punjabi chickpea curry' },
    { name: 'Bhindi Masala', price: 189, tag: '', desc: 'Crispy okra dry masala' },
    { name: 'Veg Jalfrezi', price: 219, tag: '', desc: 'Tangy stir-fried veg' },
  ],
  'Sweets': [
    { name: 'Jalebi', price: 129, tag: 'Legendary', desc: 'Golden syrup spirals' },
    { name: 'Kathiyawadi Gulab Jamun', price: 149, tag: 'Signature', desc: 'Regional melt-in-mouth' },
    { name: 'Gulab Jamun', price: 99, tag: '', desc: 'Classic milk dumplings' },
    { name: 'Ice Cream', price: 119, tag: '', desc: 'Vanilla mango chocolate' },
  ],
  'Beverages': [
    { name: 'Masala Chai', price: 49, tag: '', desc: 'Indian spiced tea' },
    { name: 'Mango Lassi', price: 109, tag: 'Popular', desc: 'Creamy mango yogurt' },
    { name: 'Cold Coffee', price: 129, tag: '', desc: 'Chilled blended coffee' },
    { name: 'Fresh Lime Soda', price: 79, tag: '', desc: 'Refreshing citrus' },
    { name: 'Butter Milk', price: 69, tag: '', desc: 'Spiced yogurt drink' },
  ],
  'Munchies': [
    { name: 'Chole Bhature', price: 179, tag: 'Popular', desc: 'Fluffy bhature with chickpeas' },
    { name: 'French Fries', price: 149, tag: '', desc: 'Golden crispy fries' },
    { name: 'Peanut Chaat', price: 129, tag: '', desc: 'Spiced peanut street chaat' },
    { name: 'Shahi Papad', price: 99, tag: '', desc: 'Royal papad with masala' },
  ],
};

// const WA = '919826354976';//whatsapp
const WA = '6263745969';
const RESTAURANT_COORDS = { lat: 22.2400, lng: 76.0500 };

const GAL = [
  { name: 'Cheese Foslin', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/cheese-foslin.jpg', cat: 'Starter' },
  { name: 'Dahi Kabab', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/dahi-kabab.png', cat: 'Kabab' },
  { name: 'Kadai Paneer', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/kadai-panner.png', cat: 'Paneer' },
  { name: 'Moong Daal', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/moong-bada.png', cat: 'Special' },
  { name: 'Paneer BBQ', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/paneer-barbeque.jpg', cat: 'Paneer' },
  { name: 'Sezwan Veg', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/sezwan-veg.png', cat: 'Chinese' },
  { name: 'Sizzler', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/sizzler.png', cat: 'Special' },
  { name: 'Spider Roll', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/spider-roll.jpg', cat: 'Starter' },
  { name: 'Veg Lollipop', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/food-items/veg-lolipop.jpg', cat: 'Starter' },
];
const CEL = [
  { name: 'Javed Akhtar', role: 'Legendary Lyricist', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/celebrities/javed_akhtar.jpg' },
  { name: 'Mukesh Khanna', role: 'Iconic Actor', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/celebrities/mukesh_khanna.jpg' },
  { name: 'Daler Mehndi', role: 'Legendary Singer', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/celebrities/daler_mehndi.jpg' },
  { name: 'Rajpal Yadav', role: 'Comedy Star', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/celebrities/rajpal_yadav.jpg' },
  { name: 'Preeti Jhangiani', role: 'Bollywood Actress', img: 'https://hotelgopalmidway.com/static/hotelgopalmidway/images/celebrities/preeti-jhangiani.jpg' },
];
const HOTEL_SLIDES = [
  'https://hotelgopalmidway.com/static/hotelgopalmidway/images/slides/award_2017.jpg',
  'https://hotelgopalmidway.com/static/hotelgopalmidway/images/slides/award_2016.jpg',
  'https://hotelgopalmidway.com/static/hotelgopalmidway/images/slides/hotel_1.jpg',
  'https://hotelgopalmidway.com/static/hotelgopalmidway/images/slides/hotel_2.jpg',
  'https://hotelgopalmidway.com/static/hotelgopalmidway/images/slides/hotel_3.jpg',
];

/* ====== HOOKS ====== */
function useInView(opts = {}) {
  const ref = useRef(null); const [vis, setVis] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.unobserve(el); } }, { threshold: opts.threshold || 0.12, rootMargin: '0px 0px -40px 0px' }); ob.observe(el); return () => ob.disconnect(); }, []);
  return [ref, vis];
}
function useCounter(end, dur = 2000, go = false) {
  const [v, setV] = useState(0);
  useEffect(() => { if (!go) return; let s = null; const a = (t) => { if (!s) s = t; const p = Math.min((t - s) / dur, 1); setV(Math.floor(p * end)); if (p < 1) requestAnimationFrame(a); }; requestAnimationFrame(a); }, [go, end, dur]);
  return v;
}

/* ====== ANIMATED WRAPPERS ====== */
function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, vis] = useInView();
  const t = { up: 'translateY(60px)', left: 'translateX(-60px)', right: 'translateX(60px)' };
  return <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : t[direction], transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>{children}</div>;
}
function Stagger({ children, className = '', stagger = 100 }) {
  const [ref, vis] = useInView();
  return <div ref={ref} className={className}>{Array.isArray(children) ? children.map((c, i) => <div key={i} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(40px)', transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${i * stagger}ms, transform .7s cubic-bezier(.16,1,.3,1) ${i * stagger}ms` }}>{c}</div>) : children}</div>;
}
function HeroStat({ end, suffix, label, active }) { const v = useCounter(end, 2000, active); return <div className="hero-stat"><div className="hero-stat-num">{v}{suffix}</div><div className="hero-stat-label">{label}</div></div>; }

/* ====== CART UI COMPONENTS ====== */
function AddBtn({ item }) {
  const { add, getQty, updateQty } = useCart(); const q = getQty(item.name); const [pop, setPop] = useState(false);
  const h = () => { add(item); setPop(true); setTimeout(() => setPop(false), 400); };
  if (q > 0) return <div className="add-btn-group"><button className="qty-btn" onClick={() => updateQty(item.name, q - 1)}>-</button><span className="qty-val">{q}</span><button className="qty-btn" onClick={() => updateQty(item.name, q + 1)}>+</button></div>;
  return <button className={`add-btn ${pop ? 'pop' : ''}`} onClick={h}>ADD <span className="add-plus">+</span></button>;
}

function CartDrawer({ open, onClose }) {
  const { items, updateQty, clear, total, count } = useCart();
  const navigate = useNavigate();

  const checkout = () => {
    if (!items.length) return;
    const orderNum = 'GM-' + Date.now().toString(36).toUpperCase().slice(-6);
    const orderTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const orderDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const orderItems = items.map(it => ({ ...it }));
    const orderTotal = total;
    const orderCount = count;

    let m = '🍽️ *New Order — Hotel Gopal Midway*\n';
    m += '📋 Order #' + orderNum + '\n';
    m += '━━━━━━━━━━━━━━━━━\n\n';
    items.forEach((it, i) => { m += (i+1) + '. ' + it.name + '\n   Qty: ' + it.qty + ' × ₹' + it.price + ' = ₹' + (it.qty * it.price) + '\n\n'; });
    m += '━━━━━━━━━━━━━━━━━\n📦 *Total Items:* ' + orderCount + '\n💰 *Grand Total:* ₹' + orderTotal + '\n\n📍 Please confirm delivery/pickup.\nThank you! 🙏';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(m), '_blank');

    clear();
    onClose();

    navigate('/order-confirmed', {
      state: { id: orderNum, time: orderTime, date: orderDate, items: orderItems, total: orderTotal, count: orderCount }
    });
  };

  return (
    <>
      <div className={'cart-overlay' + (open ? ' open' : '')} onClick={onClose} />
      <div className={'cart-drawer' + (open ? ' open' : '')}>
        <div className="cart-header">
          <div><h3 className="cart-title">Your Order</h3><p className="cart-count">{count} item{count !== 1 ? 's' : ''}</p></div>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div style={{fontSize:'3rem',opacity:.4,marginBottom:16}}>🛒</div>
              <p style={{fontFamily:'var(--fd)',fontSize:'1.1rem',color:'var(--cream)'}}>Your cart is empty</p>
              <span style={{fontFamily:'var(--fu)',fontSize:'.78rem',color:'rgba(250,245,235,.3)'}}>Browse the menu to add items!</span>
            </div>
          ) : items.map(it => (
            <div key={it.name} className="cart-item">
              <div className="cart-item-info">
                <span style={{color:'#4caf50',fontSize:'.6rem'}}>●</span>
                <div><div className="cart-item-name">{it.name}</div><div className="cart-item-price">₹{it.price}</div></div>
              </div>
              <div className="cart-item-controls">
                <button className="qty-btn" onClick={() => updateQty(it.name, it.qty - 1)}>-</button>
                <span className="qty-val">{it.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(it.name, it.qty + 1)}>+</button>
              </div>
              <div className="cart-item-sub">₹{it.price * it.qty}</div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-footer">
            <button className="cart-clear" onClick={clear}>Clear All</button>
            <div className="cart-total-row"><span>Grand Total</span><span className="cart-grand-total">₹{total}</span></div>
            <button className="cart-checkout" onClick={checkout}><span>Order via WhatsApp</span><span>💬</span></button>
            <p className="cart-note">You'll be redirected to WhatsApp to confirm your order</p>
          </div>
        )}
      </div>
    </>
  );
}

function CartFAB() {
  const { count, total } = useCart(); const [open, setOpen] = useState(false); const [bounce, setBounce] = useState(false);
  useEffect(() => { if (count > 0) { setBounce(true); setTimeout(() => setBounce(false), 600); } }, [count]);
  if (count === 0) return null;
  return (
    <>
      <button className={'cart-fab' + (bounce ? ' bounce' : '')} onClick={() => setOpen(true)}>
        <span>🛒</span><span>{count} item{count !== 1 ? 's' : ''} · ₹{total}</span><span style={{opacity:.6}}>→</span>
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ====== REAL PHOTOS CAROUSEL ====== */
function PhotoCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % HOTEL_SLIDES.length), 4000); return () => clearInterval(t); }, []);
  return (
    <section className="real-photos">
      <div className="container">
        <Reveal className="text-center">
          <div className="section-label center">Real Photos</div>
          <h2 className="section-title">Our Restaurant & Awards</h2>
          <p className="section-sub center">Real photographs from Hotel Gopal Midway — our space, our pride, our achievements</p>
        </Reveal>
        <div className="carousel" style={{marginTop:48}}>
          <div className="carousel-track" style={{transform:'translateX(-'+(idx*100)+'%)'}}>
            {HOTEL_SLIDES.map((s, i) => <div key={i} className="carousel-slide"><img src={s} alt={'Hotel Gopal Midway - Photo '+(i+1)} /></div>)}
          </div>
          <div className="carousel-dots">
            {HOTEL_SLIDES.map((_, i) => <button key={i} className={'carousel-dot'+(idx===i?' active':'')} onClick={() => setIdx(i)} />)}
          </div>
          <button className="carousel-arrow carousel-prev" onClick={() => setIdx(p => (p - 1 + HOTEL_SLIDES.length) % HOTEL_SLIDES.length)}>‹</button>
          <button className="carousel-arrow carousel-next" onClick={() => setIdx(p => (p + 1) % HOTEL_SLIDES.length)}>›</button>
        </div>
      </div>
    </section>
  );
}

/* ====== NAVIGATE TO RESTAURANT ====== */
function NavigateButton() {
  const handleNavigate = () => {
    const dest = RESTAURANT_COORDS.lat + ',' + RESTAURANT_COORDS.lng;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const origin = pos.coords.latitude + ',' + pos.coords.longitude;
          window.open('https://www.google.com/maps/dir/' + origin + '/' + dest, '_blank');
        },
        () => { window.open('https://www.google.com/maps/dir//' + dest, '_blank'); }
      );
    } else {
      window.open('https://www.google.com/maps/dir//' + dest, '_blank');
    }
  };
  return <button className="btn-gold" onClick={handleNavigate} style={{marginTop:20}}>Navigate to Restaurant 📍</button>;
}

/* ====== ORDER CONFIRMATION PAGE ====== */
function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;
  const [statusStep, setStatusStep] = useState(0);
  const [confettiDone, setConfettiDone] = useState(false);

  useEffect(() => {
    if (!order) { navigate('/'); return; }
    const t1 = setTimeout(() => setStatusStep(1), 1500);
    const t2 = setTimeout(() => setStatusStep(2), 4000);
    const t3 = setTimeout(() => setStatusStep(3), 7000);
    const t4 = setTimeout(() => setConfettiDone(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [order, navigate]);

  if (!order) return null;

  const statuses = [
    { icon: '📨', label: 'Order sent to restaurant', sub: 'Via WhatsApp' },
    { icon: '👀', label: 'Restaurant will review your order', sub: 'Checking availability' },
    { icon: '💬', label: 'You\'ll receive a confirmation reply', sub: 'On WhatsApp from the owner' },
    { icon: '✅', label: 'Keep WhatsApp open for updates', sub: 'The owner will confirm & share details' },
  ];

  return (
    <div className="oc-page">
      {/* Animated background particles */}
      <div className="oc-bg-particles">
        {Array.from({length:12}).map((_,i) => <div key={i} className="oc-particle" style={{left: (8+i*8)+'%', animationDelay: i*0.5+'s', animationDuration: (8+i*2)+'s'}} />)}
      </div>

      {/* Confetti burst */}
      {!confettiDone && <div className="oc-confetti">{Array.from({length:40}).map((_,i) => <div key={i} className="confetti-piece" style={{left: Math.random()*100 + '%', animationDelay: Math.random()*1.5 + 's', animationDuration: (2 + Math.random()*2) + 's', background: ['#c8a04a','#e4c97a','#25D366','#fff','#ff6b6b','#48dbfb','#feca57','#ff9ff3'][i%8], width: (6+Math.random()*6)+'px', height: (8+Math.random()*8)+'px', borderRadius: Math.random()>.5?'50%':'2px'}} />)}</div>}

      <div className="oc-page-inner">
        {/* Header */}
        <div className="oc-page-header">
          <div className="oc-page-logo" onClick={() => navigate('/')}>
            <div className="nav-logo-mark">G</div>
            <div><div className="nav-logo-name" style={{color:'var(--cream)'}}>Gopal Midway</div><div className="nav-logo-tag" style={{color:'var(--gold)'}}>Taste of Nimar</div></div>
          </div>
        </div>

        {/* Success hero */}
        <div className="oc-page-hero">
          <div className="oc-page-check-wrap">
            <div className="oc-page-glow" />
            <div className="oc-page-check">✓</div>
            <div className="oc-page-ripple" />
            <div className="oc-page-ripple r2" />
            <div className="oc-page-ripple r3" />
          </div>
          <h1 className="oc-page-title">Order Placed Successfully!</h1>
          <p className="oc-page-subtitle">Your delicious food is on its way! The restaurant has been notified via WhatsApp.</p>
        </div>

        {/* Order ID card */}
        <div className="oc-page-id-card">
          <div className="oc-page-id-badge">✓ CONFIRMED</div>
          <div className="oc-page-id-label">YOUR ORDER ID</div>
          <div className="oc-page-id-value">#{order.id}</div>
          <div className="oc-page-id-divider" />
          <div className="oc-page-id-meta">
            <div className="oc-meta-chip"><span>📅</span> {order.date}</div>
            <div className="oc-meta-chip"><span>⏰</span> {order.time}</div>
            <div className="oc-meta-chip"><span>🍽️</span> {order.count} item{order.count !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Content grid */}
        <div className="oc-page-grid">
          {/* Order summary — receipt style */}
          <div className="oc-page-card oc-receipt">
            <div className="oc-page-card-header">
              <span className="oc-page-card-icon">🧾</span>
              <h3>Order Receipt</h3>
            </div>
            <div className="oc-page-items">
              {order.items.map((it, i) => (
                <div key={i} className="oc-page-item">
                  <div className="oc-page-item-num">{i+1}</div>
                  <span className="oc-page-item-veg">●</span>
                  <div className="oc-page-item-info">
                    <span className="oc-page-item-name">{it.name}</span>
                    <span className="oc-page-item-qty">Qty: {it.qty} × ₹{it.price}</span>
                  </div>
                  <span className="oc-page-item-price">₹{it.price * it.qty}</span>
                </div>
              ))}
            </div>
            <div className="oc-page-total">
              <span>Grand Total</span>
              <span>₹{order.total}</span>
            </div>
            <div className="oc-receipt-footer">
              <span>Thank you for ordering! 🙏</span>
            </div>
          </div>

          {/* Status tracker */}
          <div className="oc-page-card">
            <div className="oc-page-card-header">
              <span className="oc-page-card-icon">📍</span>
              <h3>Order Status</h3>
            </div>
            <div className="oc-page-tracker">
              {statuses.map((s, i) => (
                <div key={i} className={'oc-page-step' + (i <= statusStep ? ' active' : '') + (i === statusStep ? ' current' : '')}>
                  <div className="oc-page-step-icon-col">
                    <div className="oc-page-step-icon">{i <= statusStep ? s.icon : '○'}</div>
                    {i < statuses.length - 1 && <div className={'oc-page-step-line' + (i < statusStep ? ' filled' : '')} />}
                  </div>
                  <div className="oc-page-step-text">
                    <div className="oc-page-step-label">{s.label}</div>
                    <div className="oc-page-step-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Help note */}
        <div className="oc-page-note">
          <div className="oc-page-note-icon">💡</div>
          <div>
            <strong>Need help with your order?</strong>
            <p>If WhatsApp didn't open, call us at <a href="tel:9826354976">98263 54976</a> and share order <strong>#{order.id}</strong>. We're here to help!</p>
          </div>
        </div>

        {/* Actions */}
        <div className="oc-page-actions">
          <button className="oc-btn-back" onClick={() => navigate('/')}>← Back to Menu</button>
          <button className="oc-btn-whatsapp" onClick={() => window.open('https://wa.me/' + WA, '_blank')}>💬 Open WhatsApp</button>
          <button className="oc-btn-call" onClick={() => window.open('tel:9826354976')}>📞 Call Restaurant</button>
        </div>
      </div>
    </div>
  );
}

/* ====== MAIN APP ====== */
function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('Gopal Specials');
  const [lightbox, setLightbox] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const [heroVis, setHeroVis] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fd, setFd] = useState({ name:'', phone:'', date:'', time:'', guests:'2', occasion:'', message:'' });
  const [formSent, setFormSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Compute filtered and sorted menu items
  const getFilteredItems = () => {
    const q = searchQuery.trim().toLowerCase();
    let items;
    if (q) {
      // Search across ALL categories
      items = [];
      Object.values(MENU).forEach(catItems => {
        catItems.forEach(item => {
          if (item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || (item.tag && item.tag.toLowerCase().includes(q))) {
            items.push(item);
          }
        });
      });
    } else {
      items = [...(MENU[activeTab] || [])];
    }
    // Sort
    switch(sortBy) {
      case 'price-low': items.sort((a,b) => a.price - b.price); break;
      case 'price-high': items.sort((a,b) => b.price - a.price); break;
      case 'name-az': items.sort((a,b) => a.name.localeCompare(b.name)); break;
      case 'name-za': items.sort((a,b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    return items;
  };
  const filteredItems = getFilteredItems();
  const totalAllItems = Object.values(MENU).reduce((s, c) => s + c.length, 0);

  useEffect(() => { setTimeout(() => setHeroVis(true), 600); }, []);
  useEffect(() => { const h = () => { setScrolled(window.scrollY > 60); setShowTop(window.scrollY > 500); }; window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  const sendResv = (e) => {
    e.preventDefault();
    let m = '🪷 *Table Reservation*\n\n👤 ' + fd.name + '\n📞 ' + fd.phone + '\n📅 ' + fd.date + '\n⏰ ' + fd.time + '\n👥 ' + fd.guests;
    if (fd.occasion) m += '\n🎉 ' + fd.occasion;
    if (fd.message) m += '\n📝 ' + fd.message;
    m += '\n\nPlease confirm. 🙏';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(m), '_blank');
    setFormSent(true); setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <>
      {/* NAV */}
      <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => go('hero')}>
            <div className="nav-logo-mark">G</div>
            <div><div className="nav-logo-name">Gopal Midway</div><div className="nav-logo-tag">Taste of Nimar</div></div>
          </div>
          <ul className={'nav-links' + (menuOpen ? ' open' : '')}>
            {[['Home','hero'],['About','about'],['Menu','menu'],['Gallery','gallery'],['Events','events'],['Contact','contact']].map(([l,id]) => (
              <li key={id}><a onClick={() => go(id)}>{l}</a></li>
            ))}
            <li><a className="nav-cta-btn" onClick={() => go('menu')}>Order Now 🍽️</a></li>
          </ul>
          <button className={'hamburger' + (menuOpen ? ' open' : '')} onClick={() => setMenuOpen(!menuOpen)}><span/><span/><span/></button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg" />
        <div className={'hero-content' + (heroVis ? ' visible' : '')}>
          <div className="hero-badge"><div className="hero-dot" /><span>Serving Since 24+ Years · Pure Veg</span></div>
          <h1><span className="hero-line hero-line-1">Experience the</span><span className="hero-line hero-line-2"><em>Taste of Nimar</em></span></h1>
          <p className="hero-desc">A legendary culinary destination near the holy Narmada River, where heritage spices meet passionate cooking and every dish tells a story of tradition.</p>
          <div className="hero-btns">
            <button className="btn-gold" onClick={() => go('menu')}>Explore Menu & Order →</button>
            <button className="btn-ghost" onClick={() => go('resv')}>Reserve a Table</button>
          </div>
        </div>
        <div className={'hero-stats' + (heroVis ? ' visible' : '')}>
          <HeroStat end={24} suffix="+" label="Years Legacy" active={heroVis} />
          <div className="hero-stat-divider" />
          <HeroStat end={100} suffix="+" label="Menu Items" active={heroVis} />
          <div className="hero-stat-divider" />
          <HeroStat end={5} suffix="L+" label="Happy Guests" active={heroVis} />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-bar"><div className="marquee-track">
        {[0,1,2].map(i => <span key={i} className="marquee-content">★ Award Winning ★ Pure Vegetarian ★ Celebrity Approved ★ 24+ Years Legacy ★ Narmada River View ★ Authentic Nimari Cuisine ★ Free Parking ★ Taste of Nimar </span>)}
      </div></div>

      {/* ABOUT */}
      <section className="about" id="about"><div className="container"><div className="about-grid">
        <Reveal className="about-images" direction="left">
          <div className="about-img-1"><img src={HOTEL_SLIDES[2]} alt="Hotel" /></div>
          <div className="about-img-2"><img src={HOTEL_SLIDES[3]} alt="Interior" /></div>
          <div className="about-badge"><span className="about-badge-num">24+</span><span className="about-badge-txt">Years</span></div>
        </Reveal>
        <Reveal direction="right" delay={250}>
          <div className="section-label">Our Story</div>
          <h2 className="section-title">A Legacy of Taste & Hospitality</h2>
          <p className="about-text">Hotel Gopal ventured into the food industry 24 years ago. Now Gopal Midway has become a synonymous trademark in hospitality, taste & ambience, located near the holy Narmada Bridge on Indore-Khandwa Road, making your journey to Shri Omkareshwar Temple memorable.</p>
          <p className="about-text">What sets us apart is our mixture of the best spices. We use fresh quality ingredients to serve delicious food. The glimpse of holy Narmada from the venue enhances the pleasure of your journey. Welcome to savor the 'Taste of Nimar'.</p>
          <div className="about-features">
            {[['🍛','Authentic Nimari Cuisine'],['🏔️','Narmada River Views'],['👨‍🍳','Expert Chefs'],['🎉','Event Hosting'],['🅿️','Free Parking'],['🕉️','Pure Vegetarian']].map(([ic,lb],i) => (
              <div key={i} className="about-feat"><span className="about-feat-ic">{ic}</span><span>{lb}</span></div>
            ))}
          </div>
        </Reveal>
      </div></div></section>

      {/* REAL PHOTOS */}
      <PhotoCarousel />

      {/* SPECIALTIES */}
      <section className="specialties"><div className="container">
        <Reveal className="text-center"><div className="section-label center">Signature Dishes</div><h2 className="section-title">Our Legendary Specialties</h2></Reveal>
        <Stagger className="spec-grid" stagger={200}>
          {[['Jalebi','Golden spirals dripping with sweetness','https://hotelgopalmidway.com/static/hotelgopalmidway/images/specialities/jalebi.png','₹129'],
            ['Kathiyawadi Gulab Jamun','Melt-in-mouth regional delicacy','https://hotelgopalmidway.com/static/hotelgopalmidway/images/specialities/kathiyawadi-gulab-jamun.png','₹149'],
            ['Katahal Sabji','Seasonal jackfruit masterpiece','https://hotelgopalmidway.com/static/hotelgopalmidway/images/specialities/khatahal-sabji.png','₹239']
          ].map(([n,d,img,p],i) => (
            <div key={i} className="spec-card"><div className="spec-img-wrap"><img src={img} alt={n} /><div className="spec-price">{p}</div></div><h3>{n}</h3><p>{d}</p></div>
          ))}
        </Stagger>
      </div></section>

      {/* MENU WITH ORDERING */}
      <section className="menu-section" id="menu"><div className="container">
        <Reveal className="text-center">
          <div className="section-label center light">Order Online</div>
          <h2 className="section-title light">Our Complete Menu</h2>
          <p className="section-sub center light">Browse, add to cart, and order via WhatsApp — instant delivery</p>
        </Reveal>

        {/* Search & Sort Bar */}
        <div className="menu-controls">
          <div className="menu-search">
            <span className="menu-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search dishes, ingredients, tags..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); }}
              className="menu-search-input"
            />
            {searchQuery && <button className="menu-search-clear" onClick={() => setSearchQuery('')}>✕</button>}
          </div>
          <div className="menu-sort">
            <label className="menu-sort-label">Sort by</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="menu-sort-select">
              <option value="default">Default</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="name-az">Name: A → Z</option>
              <option value="name-za">Name: Z → A</option>
            </select>
          </div>
        </div>

        {/* Search results info */}
        {searchQuery && (
          <div className="menu-search-info">
            <span>Found <strong>{filteredItems.length}</strong> result{filteredItems.length !== 1 ? 's' : ''} for "<em>{searchQuery}</em>" across all categories</span>
            <button className="menu-search-info-clear" onClick={() => setSearchQuery('')}>Clear search</button>
          </div>
        )}

        {/* Category tabs — hidden when searching */}
        {!searchQuery && (
          <div className="menu-tabs-wrap"><div className="menu-tabs">
            {Object.keys(MENU).map(c => (
              <button key={c} className={'menu-tab' + (activeTab === c ? ' active' : '')} onClick={() => setActiveTab(c)}>
                {c} <span className="tab-count">{MENU[c].length}</span>
              </button>
            ))}
          </div></div>
        )}

        <div className="menu-grid">
          {filteredItems.length === 0 ? (
            <div className="menu-no-results">
              <div className="mnr-icon">🍽️</div>
              <h4>No dishes found</h4>
              <p>Try a different search term or browse by category</p>
            </div>
          ) : filteredItems.map((item, i) => (
            <div key={(searchQuery ? 'search' : activeTab) + '-' + item.name} className="mi-card" style={{animationDelay: (i * 50) + 'ms'}}>
              <div className="mi-left">
                <div className="mi-veg"><span style={{color:'#2e7d32',fontSize:'.6rem'}}>●</span><span>VEG</span></div>
                <h4 className="mi-name">{item.name}</h4>
                <p className="mi-desc">{item.desc}</p>
                <div className="mi-price-row">
                  <span className="mi-price">₹{item.price}</span>
                  {item.tag && <span className="mi-tag">{item.tag}</span>}
                </div>
              </div>
              <div className="mi-right"><AddBtn item={item} /></div>
            </div>
          ))}
        </div>
      </div></section>

      {/* GALLERY */}
      <section className="gallery" id="gallery"><div className="container">
        <Reveal className="text-center"><div className="section-label center">Food Gallery</div><h2 className="section-title">A Feast for the Eyes</h2></Reveal>
        <Stagger className="gallery-grid" stagger={100}>
          {GAL.map((it, i) => (
            <div key={i} className="gal-card" onClick={() => setLightbox(it)}>
              <img src={it.img} alt={it.name} loading="lazy" />
              <div className="gal-overlay"><span className="gal-cat">{it.cat}</span><h4>{it.name}</h4></div>
            </div>
          ))}
        </Stagger>
      </div>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox.img} alt={lightbox.name} />
          <div className="lb-info"><h3>{lightbox.name}</h3></div>
        </div>
      )}
      </section>

      {/* CELEBRITIES */}
      <section className="celebs"><div className="container">
        <Reveal className="text-center"><div className="section-label center">Celebrity Corner</div><h2 className="section-title">Chosen by the Stars</h2><p className="section-sub center">Hotel Gopal Midway is the preferred destination for hundreds of celebrities</p></Reveal>
        <Stagger className="celeb-grid" stagger={150}>
          {CEL.map((c, i) => <div key={i} className="celeb-card"><div className="celeb-img-wrap"><img src={c.img} alt={c.name} /></div><h4>{c.name}</h4><p>{c.role}</p></div>)}
        </Stagger>
      </div></section>

      {/* TESTIMONIALS */}
      <section className="testi"><div className="container">
        <Reveal className="text-center"><div className="section-label center light">Reviews</div><h2 className="section-title light">What Our Guests Say</h2></Reveal>
        <Stagger className="testi-grid" stagger={150}>
          {[{n:'Arvind P.',i:'A',r:'Travel Enthusiast',t:'The Jalebi here is unlike anything across India. Narmada view while dining is divine!'},
            {n:'Sunita M.',i:'S',r:'Food Blogger',t:'Paneer Tawa Masala is incredible — fresh ingredients, authentic spices, real hospitality.'},
            {n:'Raghav K.',i:'R',r:'Regular 8+ Years',t:'Consistency in taste is remarkable. Gopal Midway Special is an absolute must-try!'}
          ].map((t, idx) => (
            <div key={idx} className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">"{t.t}"</p>
              <div className="testi-author"><div className="testi-avatar">{t.i}</div><div><div className="testi-name">{t.n}</div><div className="testi-role">{t.r}</div></div></div>
            </div>
          ))}
        </Stagger>
      </div></section>

      {/* EVENTS */}
      <section className="events" id="events"><div className="container">
        <Reveal className="text-center"><div className="section-label center">Private Events</div><h2 className="section-title">Host Your Special Moments</h2></Reveal>
        <Stagger className="events-grid" stagger={150}>
          {[['🎂','Birthday Parties','Custom menus and dedicated celebration space','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'],
            ['🤝','Corporate Meetings','Professional spaces with premium catering','https://images.unsplash.com/photo-1511578314322-379afb476865?w=600'],
            ['🎊','Ceremonies','Family ceremonies and festive celebrations','https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600']
          ].map(([ic,t,d,img],i) => (
            <div key={i} className="event-card"><img src={img} alt={t} loading="lazy" /><div className="event-overlay"><span className="event-icon">{ic}</span><h3>{t}</h3><p>{d}</p></div></div>
          ))}
        </Stagger>
      </div></section>

      {/* RESERVATION */}
      <section className="resv" id="resv"><div className="container"><Reveal className="resv-inner">
        <div className="section-label center light">Reservations</div>
        <h2 className="section-title light text-center">Reserve Your Table</h2>
        <p className="section-sub center light">Book via WhatsApp — instant confirmation from the owner</p>
        {formSent ? (
          <div className="resv-success"><h3>✓ Reservation Sent!</h3><p>Check WhatsApp for confirmation.</p></div>
        ) : (
          <div className="resv-form">
            <div className="rf-group"><input placeholder="Your Name *" value={fd.name} onChange={e => setFd(p => ({...p, name: e.target.value}))} /></div>
            <div className="rf-group"><input placeholder="Phone *" value={fd.phone} onChange={e => setFd(p => ({...p, phone: e.target.value}))} /></div>
            <div className="rf-group"><input type="date" value={fd.date} onChange={e => setFd(p => ({...p, date: e.target.value}))} /></div>
            <div className="rf-group">
              <select value={fd.time} onChange={e => setFd(p => ({...p, time: e.target.value}))}>
                <option value="">Select Time</option>
                {['7 AM','8 AM','11 AM','12 PM','1 PM','7 PM','8 PM','9 PM'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="rf-group">
              <select value={fd.guests} onChange={e => setFd(p => ({...p, guests: e.target.value}))}>
                {['1','2','3','4','5','6+','10+'].map(g => <option key={g}>{g} Guest{g !== '1' ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="rf-group">
              <select value={fd.occasion} onChange={e => setFd(p => ({...p, occasion: e.target.value}))}>
                <option value="">Occasion</option>
                {['Birthday','Anniversary','Business','Family','Religious'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="rf-group full"><textarea placeholder="Special requests or dietary needs..." value={fd.message} onChange={e => setFd(p => ({...p, message: e.target.value}))} /></div>
            <div className="rf-group full" style={{textAlign:'center',paddingTop:8}}><button className="btn-gold" onClick={sendResv}>Reserve via WhatsApp 💬</button></div>
          </div>
        )}
      </Reveal></div></section>

      {/* CONTACT WITH MAP NAVIGATION */}
      <section className="contact" id="contact"><div className="container"><div className="contact-grid">
        <Reveal direction="left">
          <div className="section-label">Find Us</div>
          <h2 className="section-title">Visit Us Today</h2>
          <p className="section-sub">On the Indore-Khandwa highway, by the sacred Narmada</p>
          <div className="contact-items">
            {[['📍','Address','Hotel Gopal Midway, Near Narmada Bridge, Indore-Khandwa Road, Mortakka, Barwaha (M.P) – 451115'],
              ['📞','Phone','07280-290123 · 98263 54976'],
              ['✉️','Email','hotelgopalmidway@gmail.com'],
              ['🕐','Hours','6:00 AM – 11:00 PM · All 7 Days']
            ].map(([ic,h,p],i) => (
              <div key={i} className="contact-item"><span className="contact-ic">{ic}</span><div><h4>{h}</h4><p>{p}</p></div></div>
            ))}
          </div>
          <NavigateButton />
        </Reveal>
        <Reveal direction="right" delay={200} className="contact-map-wrap">
          <iframe
            title="Hotel Gopal Midway"
            src={'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.5!2d76.05!3d22.24!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3963711111111111%3A0x1111111111111111!2sHotel%20Gopal%20Midway!5e0!3m2!1sen!2sin!4v1'}
            style={{width:'100%',height:'100%',border:'none',position:'absolute',inset:0,filter:'grayscale(0.2) contrast(1.05)'}}
            loading="lazy"
          />
        </Reveal>
      </div></div></section>

      {/* FOOTER */}
      <footer className="footer"><div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" style={{cursor:'default'}}><div className="nav-logo-mark">G</div><div><div className="nav-logo-name">Gopal Midway</div><div className="nav-logo-tag">Taste of Nimar</div></div></div>
            <p>Legendary culinary destination near the holy Narmada. Serving authentic Nimari cuisine with love for 24+ years.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>{[['Home','hero'],['About','about'],['Menu','menu'],['Gallery','gallery'],['Contact','contact']].map(([l,id]) => <li key={id}><a onClick={() => go(id)}>{l}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>{['Order Online','Reservations','Birthday Parties','Corporate Events','Takeaway'].map(s => <li key={s}><a onClick={() => go('menu')}>{s}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:07280290123">07280-290123</a></li>
              <li><a href="tel:9826354976">98263 54976</a></li>
              <li><a href="mailto:hotelgopalmidway@gmail.com">Email Us</a></li>
              <li><a href={'https://wa.me/' + WA} target="_blank" rel="noopener noreferrer">WhatsApp Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Hotel Gopal Midway. All Rights Reserved.</p>
          <p>Crafted with ❤️ for the Taste of Nimar</p>
        </div>
      </div></footer>

      {/* FLOATING ELEMENTS */}
      <CartFAB />
      {showTop && <button className="btt" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>↑</button>}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order-confirmed" element={<OrderConfirmation />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
