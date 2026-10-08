import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search, MapPin, Heart, ShoppingCart, UserRound, CalendarDays, ChevronDown,
  ChevronRight, Plus, Menu, X, Check, Truck, ShieldCheck, RotateCcw,
  Star, SlidersHorizontal, ArrowUpDown, Trash2, MessageCircle, Send, Headphones, ChevronLeft, ChevronUp
} from 'lucide-react';
import { products } from './data/products';
import './styles.css';

const categories = [
  { name: 'All', icon: '◉' },
  { name: 'GTA VI', icon: '🎮' },
  { name: 'PS5 Console', icon: 'PS5' },
  { name: 'Xbox Console', icon: 'X' },
  { name: 'VR', icon: 'VR' },
  { name: 'Racing Wheel', icon: 'RW' },
  { name: 'Big Screen Gaming', icon: 'TV' },
];

const faqItems = [
  ['How can I rent from SharePal?', 'Choose your product, select your rental dates, add the product to your cart and continue to booking. SharePal handles doorstep delivery and pickup in supported locations.'],
  ['If I rent multiple products, do I need to extend the rental duration for all or partial extension is possible?', 'Rental extensions depend on availability. You can request an extension for the products you need without automatically extending every item.'],
  ['When does the rental start?', 'The rental starts from the selected delivery date shown during checkout.'],
  ['What will be the condition of the products at the time of delivery?', 'Products are quality checked before dispatch and are delivered ready to use.'],
  ['Why is verification required?', 'Verification helps SharePal keep rentals secure and ensures the order is delivered to the right customer.']
];

const reviews = [
  ['Jayaram', 'Mumbai', 'Riding Gear', 'Great company amazing products at affordable prices and great service. I would recommend SharePal to everybody.'],
  ['Manish', 'Mumbai', 'Gaming console', 'I like the way SharePal work and really enjoyed the PS4. Will order again. Thanks SharePal.'],
  ['Rakesh', 'Mumbai', 'Trekking Gear', 'Ordered 2 pair of shoes and trekking poles. Everything was in mint condition and delivery was smooth.'],
  ['Shruti', 'Mumbai', 'Winter Wear', 'Right from the time I started till I got my refund the experience with SharePal was brilliant.']
];

const money = n => `₹${Number.isInteger(n) ? n : Number(n).toFixed(2)}`;
const isoToday = () => new Date().toISOString().slice(0, 10);
const plusDays = (date, days) => {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const pretty = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : '';

function Logo({ light=false }) { return <div className={`logo ${light ? 'light' : ''}`}>Share<span>Pal</span></div>; }

function Header({ startDate, endDate, setStartDate, setEndDate, onAvailability, onOpenDates, wishlistCount, cartCount, openDrawer, onLogin }) {
  const [mobile, setMobile] = useState(false);
  return <>
    <header className="main-header">
      <div className="header-inner">
        <button className="hamburger" onClick={() => setMobile(v => !v)}>{mobile ? <X/> : <Menu/>}</button>
        <Logo />
        <div className="header-date-picker">
          <button className="city"><MapPin size={17}/> Bangalore <ChevronDown size={14}/></button>
          <button className="date-chip" onClick={onOpenDates}><CalendarDays size={16}/><span>{startDate ? `Delivery ${pretty(startDate)}` : 'Delivery Date'}</span></button>
          <button className="date-chip" onClick={onOpenDates}><CalendarDays size={16}/><span>{endDate ? `Pickup ${pretty(endDate)}` : 'Pickup Date'}</span></button>
          <button className="select-date" onClick={onOpenDates}><CalendarDays size={16}/> {startDate && endDate ? 'Edit dates' : 'Select'}</button>
        </div>
        <div className="header-actions">
          <button aria-label="Search" onClick={onOpenDates}><Search/></button>
          <button aria-label="Cart" onClick={() => openDrawer('cart')}><ShoppingCart/><b>{cartCount}</b></button>
          <button className="login" aria-label="Login" onClick={onLogin}><UserRound/><span>Hi, Login</span></button>
          <button className="heart-header" onClick={() => openDrawer('wishlist')} aria-label="Wishlist"><Heart/><b>{wishlistCount}</b></button>
        </div>
      </div>
      <nav className={`main-nav ${mobile ? 'mobile-open' : ''}`}>
        <a>Photography</a><a className="active">Gaming</a><a>Outdoor</a><a>Entertainment</a>
      </nav>
    </header>
  </>;
}

function SideCategories({ active, setActive }) {
  return <aside className="side-categories">
    {categories.map(c => <button key={c.name} className={active === c.name ? 'active' : ''} onClick={() => setActive(c.name)}>
      <span className="side-icon">{c.icon}</span><strong>{c.name}</strong>
    </button>)}
  </aside>;
}

function HeroBanner() {
  const ps5 = products.find(p => p.name.includes('FC26 + 2')) || products[1];
  const psv = products.find(p => p.name.includes('PS5 + Games')) || products[0];
  return <section className="hero-banner">
    <div className="hero-copy">
      <h1>Gaming Consoles</h1>
      <p>Rent the latest gaming gadgets from <i>SharePal</i> PS5, Xbox,<br/> Oculus VR, Racing Wheel on rent.</p>
      <div className="brands"><span>◉ XBOX</span><span>◈ PS5</span><span>⌁ Meta</span></div>
    </div>
    <img className="hero-product hero-left" src={psv.image} alt="Gaming console"/>
    <img className="hero-product hero-right" src={ps5.image} alt="PS5 console"/>
  </section>;
}

function ProductCard({ product, wishlisted, datesSelected, onWish, onAdd }) {
  const vote = product.tag === 'Vote to Launch';
  return <article className="product-card">
    <div className="product-image">
      {product.tag && <span className={`tag ${product.tag === 'New' ? 'new' : product.tag === 'Vote to Launch' ? 'vote' : ''}`}>{product.tag}</span>}
      <button className={`card-heart ${wishlisted ? 'liked' : ''}`} onClick={() => onWish(product.id)} aria-label="Wishlist"><Heart size={22} fill={wishlisted ? 'currentColor' : 'none'}/></button>
      <img src={product.image} alt={product.name}/>
      {product.out_of_stock && <div className="unavailable">Currently unavailable</div>}
    </div>
    {vote && <div className="waitlist-note">✦ We launch if 1k people join the waitlist.</div>}
    <div className="product-info">
      <h3>{product.name}</h3>
      <div className="product-price-row">
        <div>
          {datesSelected ? <><span className="price">{money(product.per_day_rent)}</span> <small>/day</small></> : <><b className="select-price">Select Dates to view<br/>price</b><div className="blur-price">₹ {String(Math.round(product.per_day_rent * 2)).replace(/./g,'•')}</div></>}
        </div>
        <button disabled={product.out_of_stock} className="plus-button" onClick={() => onAdd(product)} aria-label="Add to cart"><Plus/></button>
      </div>
      {datesSelected && <div className="card-sub"><span>{product.rating ? `★ ${product.rating}` : 'New listing'}</span><span>{product.booked_count.toLocaleString()} booked</span></div>}
      {!datesSelected && <div className="select-overlay-label">Select rental dates to view prices</div>}
    </div>
  </article>;
}

function ProductArea({ active, setActive, wishlist, setWishlist, setCart, datesSelected, onAdded }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [limit, setLimit] = useState(12);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({minPrice:'', maxPrice:'', minRating:'', onlyAvailable:false, tags:[]});
  const [draft, setDraft] = useState(filters);

  const filtered = useMemo(() => {
    let list = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (active === 'PS5 Console') list = list.filter(p => p.name.includes('PS5'));
    if (active === 'PS5 Games') list = list.filter(p => /FC|God|Uncharted|Cricket|Spider|Games/.test(p.name));
    if (active === 'Racing Wheel') list = list.filter(p => /Wheel|Racing/.test(p.name));
    if (active === 'GTA VI') list = list.filter(p => /FC|PS5/.test(p.name));
    if (['Xbox Console','VR','Big Screen Gaming'].includes(active)) list = [];
    if (filters.minPrice !== '') list = list.filter(p => p.per_day_rent >= Number(filters.minPrice));
    if (filters.maxPrice !== '') list = list.filter(p => p.per_day_rent <= Number(filters.maxPrice));
    if (filters.minRating !== '') list = list.filter(p => p.rating >= Number(filters.minRating));
    if (filters.onlyAvailable) list = list.filter(p => !p.out_of_stock);
    if (filters.tags.length) list = list.filter(p => filters.tags.includes(p.tag));
    if (sort === 'price') list = [...list].sort((a,b)=>a.per_day_rent-b.per_day_rent);
    if (sort === 'rating') list = [...list].sort((a,b)=>b.rating-a.rating);
    if (sort === 'popular') list = [...list].sort((a,b)=>b.booked_count-a.booked_count);
    if (sort === 'default') { const rank = p => p.tag === 'New' ? 0 : p.tag === 'Vote to Launch' ? 1 : p.tag === 'Trending' ? 2 : 3; list = [...list].sort((a,b)=>rank(a)-rank(b)); }
    return list;
  }, [active, search, sort, filters]);

  const toggleWish = id => setWishlist(w => w.includes(id) ? w.filter(x=>x!==id) : [...w,id]);
  const addCart = product => { if (!product.out_of_stock) { setCart(c => { const found=c.find(x=>x.product.id===product.id); if(found) return c.map(x=>x.product.id===product.id?{...x,qty:x.qty+1}:x); return [...c,{product,qty:1}]; }); onAdded(product); } };
  const applyFilters = () => { setFilters(draft); setLimit(12); setFilterOpen(false); };
  const toggleTag = tag => setDraft(d => ({...d, tags:d.tags.includes(tag) ? d.tags.filter(x=>x!==tag) : [...d.tags,tag]}));

  return <section className="catalog">
    <div className="catalog-title"><h2>Gaming Gadgets On Rent</h2><span>Total items: {filtered.length} items</span></div>
    <div className="catalog-controls">
      <div className="search-box"><Search size={18}/><input value={search} onChange={e=>{setSearch(e.target.value);setLimit(12)}} placeholder="Search products"/></div>
      <select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Recommended</option><option value="popular">Most popular</option><option value="rating">Top rated</option><option value="price">Price low to high</option></select>
      <button onClick={()=>{setDraft(filters);setFilterOpen(true)}}><SlidersHorizontal size={16}/> Filters</button>
      <button onClick={()=>setSort(sort==='default'?'popular':'default')}><ArrowUpDown size={16}/> Sort</button>
    </div>
    <div className="grid">
      {filtered.slice(0,limit).map(p => <ProductCard key={p.id} product={p} datesSelected={datesSelected} wishlisted={wishlist.includes(p.id)} onWish={toggleWish} onAdd={addCart}/>) }
    </div>
    {filtered.length === 0 && <div className="empty"><h3>No products in this category</h3><p>Try another category or browse all gaming gadgets.</p><button onClick={()=>setActive('All')}>View all</button></div>}
    {limit < filtered.length && <button className="show-more" onClick={()=>setLimit(v=>v+12)}>Show More</button>}
    {filtered.length > 0 && <div className="results-count">Showing {Math.min(limit, filtered.length)} of {filtered.length} results</div>}
    {filterOpen && <div className="overlay center" onClick={()=>setFilterOpen(false)}><div className="filter-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><small>REFINE RESULTS</small><h2>Filters</h2></div><button className="close" onClick={()=>setFilterOpen(false)}><X/></button></div><label>Minimum price<input type="number" min="0" value={draft.minPrice} onChange={e=>setDraft({...draft,minPrice:e.target.value})} placeholder="₹ 0"/></label><label>Maximum price<input type="number" min="0" value={draft.maxPrice} onChange={e=>setDraft({...draft,maxPrice:e.target.value})} placeholder="₹ 500"/></label><label>Minimum rating<select value={draft.minRating} onChange={e=>setDraft({...draft,minRating:e.target.value})}><option value="">Any rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option><option value="4.8">4.8+ stars</option></select></label><label className="check-row"><input type="checkbox" checked={draft.onlyAvailable} onChange={e=>setDraft({...draft,onlyAvailable:e.target.checked})}/> Only show available products</label><div className="filter-tags"><b>Tags</b><div>{['New','Trending','Vote to Launch'].map(t=><button key={t} className={draft.tags.includes(t)?'selected':''} onClick={()=>toggleTag(t)}>{t}</button>)}</div></div><div className="filter-actions"><button className="clear" onClick={()=>setDraft({minPrice:'',maxPrice:'',minRating:'',onlyAvailable:false,tags:[]})}>Clear</button><button className="apply" onClick={applyFilters}>Apply filters</button></div></div></div>}
  </section>;
}

function PromoBanner() { return <div className="promo-banner"><div><strong>Become an <em>Asset Partner.</em> Earn Monthly.</strong><span>Monthly earnings · Up to ₹10,000 instant wallet credits · 10% off when you rent · Get 10% cashback</span></div><button>Know More ↗</button></div>; }
function TrustStats() {
  const loop = [...reviews, ...reviews, ...reviews];
  return <section className="stats-section"><div className="stats-head">Served more than <em>1 Lakh Orders</em></div><div className="review-window"><div className="review-track">{loop.map((r,i)=><article key={`${r[0]}-${i}`}><div className="google">G <span>★★★★★</span></div><p>“ {r[3]} ”</p><strong>{r[0]}</strong><small>{r[1]} · {r[2]}</small></article>)}</div></div><div className="stats"><div><strong>250Cr<span>+</span></strong><p>Saved Together</p></div><div><strong>4.5M <span>Kg</span></strong><p>CO₂E Emissions Saved</p></div><div><strong>100K<span>+</span></strong><p>Products In Circulation</p></div></div></section>;
}

function FAQ() { const [open,setOpen]=useState(null); return <section className="faq-section"><div className="faq-inner"><div className="faq-title"><h2>Frequently Asked Questions (FAQs)</h2></div><div className="faq-list">{faqItems.map((q,i)=><div className={`faq-row ${open===i?'open':''}`} key={q[0]}><button onClick={()=>setOpen(open===i?null:i)}><span>{q[0]}</span><ChevronDown/></button>{open===i&&<p>{q[1]}</p>}</div>)}</div><button className="more-faq">View more FAQ's</button></div></section>; }

function Footer() {
  return <footer>
    <div className="footer-seo">
      <div className="footer-link-grid">
        <div><h4>Action Cameras</h4><a>Action Cameras</a><a>Pocket Cameras</a><a>GoPro Cameras</a><a>DJI Cameras</a><a>DJI Drones</a><a>360 Cameras</a></div>
        <div><h4>Cameras</h4><a>DSLR Cameras</a><a>Cameras</a><a>iPhones</a><a>DSLR Gimbal Combos</a><a>Wildlife Photography</a><a>Tripod and camera accessories</a></div>
        <div><h4>Trekking Gear</h4><a>Trekking Gear</a><a>Trekking Jackets</a><a>Trek/Snow Pants</a><a>Trekking Shoes</a><a>Trek Accessories</a></div>
        <div><h4>Riding Gear</h4><a>Riding Gear</a><a>Riding Luggage</a><a>Riding Jackets</a><a>Riding Essentials</a><a>Riding Boots</a><a>Binoculars</a></div>
        <div><h4>Creator Gear</h4><a>Wireless & Collar Mics</a><a>Professional Cameras</a><a>Mirrorless Cameras</a><a>UNLMTD Vlogging</a><a>Mobile Gimbals</a><a>Vlogging</a></div>
        <div><h4>Gaming Console</h4><a>PS5 Console</a><a>VR</a><a>Racing Wheel</a><a>Big Screen Gaming</a><a>Xbox Console</a></div>
        <div><h4>Winter Wear</h4><a>Snow Boots</a><a>Winter Jackets</a><a>Backpacks</a></div>
        <div><h4>Camping Gear</h4><a>Camping Gear</a><a>Camping Stools & Tables</a><a>Camping Tents</a><a>Sleeping Bags & Mats</a></div>
        <div><h4>Audio Visual Equipment</h4><a>Projectors</a><a>VR</a><a>Mics</a><a>Speakers</a></div>
      </div>
      <div className="footer-copy">
        <h4>Renting from SharePal in Bangalore</h4>
        <p>Discover the convenience of renting from SharePal, your trusted partner in Bangalore for all your rental needs. Whether you're exploring the vibrant streets of Koramangala, setting up a shoot in Indiranagar, or planning a trek from the outskirts of Whitefield, SharePal has you covered. We offer a wide range of products, including cameras, action cameras, gaming consoles, projectors, speakers, trekking gear, riding gear, and creator gear. With free home delivery and pickup services, flexible rental tenures, and an easy-to-use platform, renting has never been easier. Experience the freedom to rent what you need, when you need it, without the commitment of buying.</p>
        <h4>Categories on Rent</h4>
        <a className="category-copy-link">Action Cameras on Rent</a>
        <p>Capture your adventures in stunning detail with our range of action cameras. Choose from top brands like GoPro, Insta360, and DJI, perfect for everything from extreme sports to casual vlogging. Whether you need high-quality video for your next trek or a 360-degree camera to capture every angle, we've got you covered.</p>
        <button className="read-more">Read More <ChevronDown size={14}/></button>
      </div>
    </div>
    <div className="footer-main">
      <div className="footer-brand-bar"><Logo light/></div>
      <div className="footer-columns"><div><h4>Sharepal</h4><a>About</a><a>Why SharePal</a><a>Sitemap</a><a>CarePal</a></div><div><h4>Become a Pal</h4><a>Sharepal for Creators</a><a>Careers</a><a>Sharepal for Brands</a><a>Asset Funding Program <b>New</b></a><a>Rent Your Gear <b>New</b></a></div><div><h4>Information</h4><a>How it works?</a><a>FAQs</a><a>Verification</a><a>Cancellation Policy</a><a>Life at Sharepal</a></div><div><h4>Policies</h4><a>Terms & Condition</a><a>Shipping policy</a><a>Damage Policy</a><a>Terms of Use</a><a>Privacy Policy</a></div><div><h4>Need Help</h4><a>♧ Contact Support</a><a>Contact Us</a><a>✉ care@sharepal.in</a><div className="social">f　◎　in</div></div></div>
      <div className="footer-bottom"><button>Go up ↑</button><span>© 2026. SWNAC E-Kiraya Services Pvt Ltd</span><span>Made with ❤️ for India</span></div>
    </div>
  </footer>;
}

function LoginModal({onClose}) {
  const [phone,setPhone]=useState('');
  const valid=/^[0-9]{10}$/.test(phone);
  return <div className="login-overlay" onClick={onClose}>
    <div className="login-modal" onClick={e=>e.stopPropagation()}>
      <button className="login-close" onClick={onClose}><X/></button>
      <div className="login-logo">Share<span>Pal</span></div>
      <h2>Login/Signup to Your Account</h2>
      <p>Enter your WhatsApp number to continue</p>
      <div className="phone-field"><button>+91⌄</button><input inputMode="numeric" maxLength="10" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} placeholder="Enter your number"/></div>
      <div className="login-coupon"><span>🎉</span><div><strong>Use code <b>SHAREPAL</b> & get 10%</strong> on orders above ₹1500. Maximum discount: ₹300<br/><b>Use Coupon - SHAREPAL</b></div></div>
      <button className={`otp-btn ${valid?'enabled':''}`} disabled={!valid}>Get OTP <ChevronRight/></button>
      <small className="login-terms">By continuing, you agree to the <a>Terms of Service</a> and<br/> acknowledge the <a>Privacy Policy.</a></small>
    </div>
  </div>;
}

function CartDrawer({items,onClose,onRemove,onQty,onRent,startDate,endDate,onOpenDates,onCheckout}) {
  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate)-new Date(startDate))/86400000)) : 0;
  const subtotal = items.reduce((sum,item)=>sum + item.product.per_day_rent * item.qty * (days || 1),0);
  const [coupon,setCoupon]=useState('');
  const [applied,setApplied]=useState('');
  const discount = applied==='GAMING12' ? subtotal*0.12 : applied==='SHAREPAL' && subtotal>=1500 ? Math.min(subtotal*0.10,300) : 0;
  const total = Math.max(0, subtotal-discount);
  const applyCoupon=()=>{
    const code=coupon.trim().toUpperCase();
    if(code==='GAMING12' || code==='SHAREPAL') setApplied(code); else setApplied('');
  };
  return <div className="overlay" onClick={onClose}>
    <aside className="drawer cart-drawer" onClick={e=>e.stopPropagation()}>
      <div className="drawer-head">
        <div><small>CART</small><h2>Cart Items <span className="item-pill">{items.reduce((n,i)=>n+i.qty,0)} items added</span></h2></div>
        <button onClick={onClose}><X/></button>
      </div>
      {items.length===0 ? <div className="drawer-empty"><ShoppingCart/><h3>Your cart is empty</h3><p>Add products using the + button.</p></div> : <>
        <div className="drawer-list cart-list">
          {items.map(item=><div className="drawer-product cart-product" key={item.product.id}>
            <img src={item.product.image} alt=""/>
            <div className="cart-product-main"><strong>{item.product.name}</strong><span>{money(item.product.per_day_rent)}/day</span>
              <div className="qty-row"><button onClick={()=>onQty(item.product.id,-1)}>−</button><b>{item.qty}</b><button onClick={()=>onQty(item.product.id,1)}>+</button><button className="delete-btn" onClick={()=>onRemove(item.product.id)} aria-label="Delete"><Trash2 size={16}/></button></div>
            </div>
            <div className="cart-line-total">{days ? money(item.product.per_day_rent*item.qty*days) : '—'}<small>{days ? `Rent for ${days} days` : 'Select dates'}</small></div>
          </div>)}
        </div>
        <div className="cart-bottom">
          <button className="date-summary" onClick={onOpenDates}><CalendarDays size={17}/><span>Delivery: {startDate?pretty(startDate):'Select'} &nbsp;|&nbsp; Pickup: {endDate?pretty(endDate):'Select'}</span><b>Edit</b></button>
          <div className="coupon-row"><input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter coupon code"/><button onClick={applyCoupon}>Apply</button></div>
          <div className="coupon-hints"><button onClick={()=>{setCoupon('GAMING12');setApplied('GAMING12')}}>GAMING12 · 12% off</button><button onClick={()=>{setCoupon('SHAREPAL');setApplied('SHAREPAL')}}>SHAREPAL · 10% off</button></div>
          <div className="charges"><div><strong>Total Charges</strong><small>Price incl. of all taxes</small></div><strong>{days ? money(total) : 'Select dates'}</strong></div>
          {discount>0 && <div className="discount-line">Coupon {applied} applied: −{money(discount)}</div>}
          <button className="checkout-btn" onClick={onCheckout}>Login to Checkout <ChevronRight/></button>
        </div>
      </>}
    </aside>
  </div>;
}

function WishlistDrawer({items,onClose,onRemove,onRent}){
  return <div className="overlay" onClick={onClose}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><small>WISHLIST</small><h2>Saved products</h2></div><button onClick={onClose}><X/></button></div>{items.length===0?<div className="drawer-empty"><Heart/><h3>Nothing saved yet</h3><p>Tap a heart on any product to save it.</p></div>:<div className="drawer-list">{items.map(p=><div className="drawer-product" key={p.id}><img src={p.image} alt=""/><div><strong>{p.name}</strong><span>{money(p.per_day_rent)}/day</span><button onClick={()=>onRent(p)}>Rent this</button></div><button onClick={()=>onRemove(p.id)}><Trash2 size={17}/></button></div>)}</div>}</aside></div>;
}

function AddToast({product,count,onGoToCart,onClose}){
  if(!product)return null;
  return <div className="add-toast"><img src={product.image} alt=""/><div><strong>{product.name}</strong><span>Added to cart · +{count}</span></div><button className="go-cart" onClick={onGoToCart}>Go to Cart <ChevronRight size={17}/></button><button className="toast-close" onClick={onClose}><X size={15}/></button></div>;
}

function DateModal({startDate,endDate,setStartDate,setEndDate,onClose,onConfirm}) {
  const [localStart,setLocalStart]=useState(startDate || isoToday());
  const [localEnd,setLocalEnd]=useState(endDate || plusDays(startDate || isoToday(),15));
  const submit=()=>{ if(!localStart||!localEnd){alert('Please select both dates.');return;} if(localEnd<=localStart){alert('Pickup date must be after delivery date.');return;} setStartDate(localStart);setEndDate(localEnd);onConfirm(); };
  return <div className="overlay center" onClick={onClose}><div className="date-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={onClose}><X/></button><div className="date-left"><small>RENTAL PERIOD</small><h2>Select your Dates</h2><div className="date-fields"><label>Delivery Date *<div><CalendarDays size={17}/><input type="date" min={isoToday()} value={localStart} onChange={e=>{setLocalStart(e.target.value);if(localEnd<=e.target.value)setLocalEnd(plusDays(e.target.value,15))}}/></div></label><label>Pickup Date *<div><CalendarDays size={17}/><input type="date" min={plusDays(localStart,1)} value={localEnd} onChange={e=>setLocalEnd(e.target.value)}/></div></label></div><div className="rental-summary"><b>{Math.max(1,Math.ceil((new Date(localEnd)-new Date(localStart))/86400000))} <span>Days</span></b><div>Chargeable Period<br/><strong>{pretty(localStart)} - {pretty(localEnd)}</strong></div></div><div className="save-box"><b>Save more with us!</b><p>Longer rental periods mean bigger savings. We don't charge you for delivery and pickup days!</p></div><button className="continue-date" onClick={submit}>Continue</button></div><div className="date-calendar"><div className="calendar-placeholder"><CalendarDays size={30}/><h3>Choose your rental window</h3><p>Select your delivery and pickup dates on the left. You can reopen this window anytime from the header.</p><div className="calendar-range"><span>{pretty(localStart)}</span><span>→</span><span>{pretty(localEnd)}</span></div></div></div></div></div>;
}

function ChatSupport({onClose,onLogin}) {
  return <div className="chat-page"><div className="chat-panel"><div className="chat-header"><div><Logo light/><small><i/> Online</small></div><div className="chat-header-actions"><span>⌖ Bangalore⌄</span><button onClick={onClose}><X/></button></div></div><div className="chat-login-bar">Please login to continue chatting.<button onClick={onLogin}>Login</button></div><div className="chat-body"><div className="bot-bubble"><p>Hi Pal 👋</p><p>I'm Rocket Singh. How can I help you today?</p><small>QUICK PICKS</small><button>I want to place a new order</button><button>I need help with an existing order</button><button>Something else</button><time>Just now</time></div></div><div className="chat-input"><input disabled placeholder="Login required to use chatbot"/><button onClick={onLogin}><Send size={18}/></button></div></div></div>;
}

function BookingModal({ product, startDate, endDate, onClose }) { if(!product)return null; return <div className="overlay center" onClick={onClose}><div className="booking" onClick={e=>e.stopPropagation()}><button className="close" onClick={onClose}><X/></button><img src={product.image} alt={product.name}/><div><small>RENTAL DETAILS</small><h2>{product.name}</h2><strong>{money(product.per_day_rent)} <small>/day</small></strong><div className="booking-dates"><span>DELIVERY<br/><b>{pretty(startDate)}</b></span><span>PICKUP<br/><b>{pretty(endDate)}</b></span></div><p>✓ Free delivery & pickup</p><button className="book-btn" onClick={()=>{alert(`Booking flow started for ${product.name}`);onClose();}}>Continue to booking <ChevronRight/></button></div></div></div>; }

function App(){
  const [active,setActive]=useState('All');
  const [startDate,setStartDate]=useState('');
  const [endDate,setEndDate]=useState('');
  const [datesSelected,setDatesSelected]=useState(false);
  const [dateModal,setDateModal]=useState(false);
  const [wishlist,setWishlist]=useState([]);
  const [cart,setCart]=useState([]);
  const [drawer,setDrawer]=useState(null);
  const [booking,setBooking]=useState(null);
  const [chat,setChat]=useState(false);
  const [login,setLogin]=useState(false);
  const [toast,setToast]=useState(null);

  const availability = () => {
    if (!startDate || !endDate || endDate <= startDate) { setDateModal(true); return; }
    setDatesSelected(true);
    document.getElementById('catalog')?.scrollIntoView({behavior:'smooth', block:'start'});
  };
  const confirmDates = () => { setDatesSelected(true); setDateModal(false); };
  const addFeedback = product => {
    setToast({product,count:1});
    window.clearTimeout(window.__sharepalToast);
    window.__sharepalToast=window.setTimeout(()=>setToast(null),4500);
  };
  const cartCount=cart.reduce((n,item)=>n+item.qty,0);
  const updateQty=(id,delta)=>setCart(c=>c.map(item=>item.product.id===id?{...item,qty:Math.max(1,item.qty+delta)}:item));
  const removeCart=id=>setCart(c=>c.filter(item=>item.product.id!==id));

  return <>
    <Header startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} onAvailability={availability} onOpenDates={()=>setDateModal(true)} wishlistCount={wishlist.length} cartCount={cartCount} openDrawer={setDrawer} onLogin={()=>setLogin(true)}/>
    <main>
      <div className="page-shell">
        <HeroBanner/>
        <div className="catalog-layout">
          <SideCategories active={active} setActive={setActive}/>
          <div className="catalog-column" id="catalog"><ProductArea active={active} setActive={setActive} wishlist={wishlist} setWishlist={setWishlist} setCart={setCart} datesSelected={datesSelected} onAdded={addFeedback}/><PromoBanner/></div>
        </div>
      </div>
      <TrustStats/>
      <FAQ/>
      <Footer/>
    </main>
    {drawer==='wishlist' && <WishlistDrawer items={products.filter(p=>wishlist.includes(p.id))} onClose={()=>setDrawer(null)} onRemove={id=>setWishlist(w=>w.filter(x=>x!==id))} onRent={p=>{setDrawer(null);setBooking(p)}}/>}
    {drawer==='cart' && <CartDrawer items={cart} startDate={startDate} endDate={endDate} onClose={()=>setDrawer(null)} onRemove={removeCart} onQty={updateQty} onOpenDates={()=>setDateModal(true)} onRent={p=>{setDrawer(null);setBooking(p)}} onCheckout={()=>{setDrawer(null);setLogin(true)}} />}
    {toast && <AddToast product={toast.product} count={toast.count} onGoToCart={()=>{setToast(null);setDrawer('cart')}} onClose={()=>setToast(null)}/>} 
    {!datesSelected && <button className="sticky-date-cta" onClick={()=>setDateModal(true)}><CalendarDays size={16}/> Select rental dates to view prices</button>}
    <BookingModal product={booking} startDate={startDate} endDate={endDate} onClose={()=>setBooking(null)}/>
    {dateModal && <DateModal startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} onClose={()=>setDateModal(false)} onConfirm={confirmDates}/>} 
    <button className="chat" onClick={()=>setChat(true)} aria-label="Chat support"><MessageCircle/><span></span></button>
    {chat && <ChatSupport onClose={()=>setChat(false)} onLogin={()=>{setChat(false);setLogin(true)}} />}
    {login && <LoginModal onClose={()=>setLogin(false)}/>}
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
