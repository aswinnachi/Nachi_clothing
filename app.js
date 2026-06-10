/* ============================================
   NACHI CLOTHING - Core App Logic
   ============================================ */

// ---- Default Categories ----
const DEFAULT_CATEGORIES = [
  'Sarees', 'Kurtis', 'Ethnic Sets', 'Kids', 'Maternity', 'Casuals'
];

// ---- Default Sample Products ----
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Royal Kanjivaram Silk Saree',
    price: 3499,
    originalPrice: 4999,
    category: 'Sarees',
    image: '',
    caption: 'Handwoven pure Kanjivaram silk with zari border. Perfect for weddings and festivals.',
    isFeatured: true,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'prod-2',
    name: 'Banarasi Silk Saree in Teal',
    price: 2799,
    originalPrice: 3500,
    category: 'Sarees',
    image: '',
    caption: 'Rich Banarasi weave with golden motifs. Elegant drape for any occasion.',
    isFeatured: true,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'prod-3',
    name: 'Anarkali Embroidered Kurti',
    price: 1299,
    originalPrice: 1799,
    category: 'Kurtis',
    image: '',
    caption: 'Floor-length Anarkali with floral embroidery. Comes with matching dupatta.',
    isFeatured: true,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'prod-4',
    name: 'Cotton Block Print Kurti',
    price: 799,
    originalPrice: 0,
    category: 'Kurtis',
    image: '',
    caption: 'Breathable cotton with traditional block print. Ideal for daily wear.',
    isFeatured: false,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'prod-5',
    name: 'Lehenga Choli Set - Maroon',
    price: 4299,
    originalPrice: 5999,
    category: 'Ethnic Sets',
    image: '',
    caption: 'Stunning maroon lehenga with heavy embroidery and matching choli & dupatta.',
    isFeatured: true,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'prod-6',
    name: 'Salwar Kameez - Pastel Green',
    price: 1599,
    originalPrice: 2100,
    category: 'Ethnic Sets',
    image: '',
    caption: 'Lightweight georgette salwar suit. Perfect for office and casual outings.',
    isFeatured: false,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'prod-7',
    name: 'Girls Pavadai Sattai - Pink',
    price: 699,
    originalPrice: 999,
    category: 'Kids',
    image: '',
    caption: 'Traditional half saree set for girls. Beautiful silk fabric with gold border.',
    isFeatured: false,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'prod-8',
    name: 'Boys Dhoti Kurta Set',
    price: 599,
    originalPrice: 850,
    category: 'Kids',
    image: '',
    caption: 'Festive dhoti kurta set for boys. Soft cotton, easy to wear.',
    isFeatured: false,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'prod-9',
    name: 'Maternity Kurta with Palazzo',
    price: 1099,
    originalPrice: 1499,
    category: 'Maternity',
    image: '',
    caption: 'Comfortable elasticated maternity kurta set. Stylish and bump-friendly.',
    isFeatured: false,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'prod-10',
    name: 'Printed Casual Kurti - Blue',
    price: 549,
    originalPrice: 0,
    category: 'Casuals',
    image: '',
    caption: 'Trendy printed casual kurti for everyday wear. Rayon fabric, light and breezy.',
    isFeatured: false,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 8
  },
  {
    id: 'prod-11',
    name: 'Chikankari Lucknowi Kurta',
    price: 1899,
    originalPrice: 2499,
    category: 'Casuals',
    image: '',
    caption: 'Authentic Lucknowi chikankari hand embroidery on white georgette fabric.',
    isFeatured: true,
    isNewArrival: false,
    createdAt: Date.now() - 86400000 * 10
  },
  {
    id: 'prod-12',
    name: 'Pure Cotton Saree - Yellow',
    price: 999,
    originalPrice: 1399,
    category: 'Sarees',
    image: '',
    caption: 'Soft handloom cotton saree in bright yellow with contrast border.',
    isFeatured: false,
    isNewArrival: true,
    createdAt: Date.now() - 86400000 * 1
  }
];

// ---- Category gradient backgrounds (for image-less categories) ----
const CATEGORY_STYLES = {
  'Sarees':      { bg: 'linear-gradient(135deg, #8B1A2C, #C9A84C)', icon: '👘' },
  'Kurtis':      { bg: 'linear-gradient(135deg, #2E4A8C, #8BA7D8)', icon: '👗' },
  'Ethnic Sets': { bg: 'linear-gradient(135deg, #1A6B45, #4DAF7C)', icon: '✨' },
  'Kids':        { bg: 'linear-gradient(135deg, #7B3A9A, #C07DD8)', icon: '🌸' },
  'Maternity':   { bg: 'linear-gradient(135deg, #C47622, #E8A84C)', icon: '💛' },
  'Casuals':     { bg: 'linear-gradient(135deg, #3A2A6B, #7B6BC0)', icon: '🎀' }
};

// ============================================
// DATA MANAGEMENT
// ============================================

function getProducts() {
  const stored = localStorage.getItem('nachi_products');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) {}
  }
  // Initialize with defaults
  localStorage.setItem('nachi_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem('nachi_products', JSON.stringify(products));
}

function getCategories() {
  const stored = localStorage.getItem('nachi_categories');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) {}
  }
  localStorage.setItem('nachi_categories', JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
}

function saveCategories(categories) {
  localStorage.setItem('nachi_categories', JSON.stringify(categories));
}

function getCategoryImages() {
  try { return JSON.parse(localStorage.getItem('nachi_category_images') || '{}'); } catch { return {}; }
}

function saveCategoryImages(obj) {
  localStorage.setItem('nachi_category_images', JSON.stringify(obj));
}

// ============================================
// PRODUCT IMAGE PLACEHOLDER
// ============================================

function getProductImage(product) {
  if (product.image && product.image.length > 10) return product.image;
  // Generate a colored placeholder based on category
  const style = CATEGORY_STYLES[product.category] || { bg: 'linear-gradient(135deg, #8B1A2C, #C9A84C)', icon: '👗' };
  // Return a data URL as SVG placeholder
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='530'>
    <defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' style='stop-color:${style.bg.match(/#[A-Fa-f0-9]+/g)?.[0] || '#8B1A2C'}'/>
      <stop offset='100%' style='stop-color:${style.bg.match(/#[A-Fa-f0-9]+/g)?.[1] || '#C9A84C'}'/>
    </linearGradient></defs>
    <rect width='400' height='530' fill='url(#g)'/>
    <text x='200' y='240' font-size='80' text-anchor='middle' dominant-baseline='middle'>${style.icon}</text>
    <text x='200' y='320' font-size='22' text-anchor='middle' fill='rgba(255,255,255,0.9)' font-family='sans-serif'>${product.category}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function getCategoryImage(categoryName) {
  // Check admin-uploaded category images first
  const stored = getCategoryImages();
  if (stored[categoryName] && stored[categoryName].length > 10) return stored[categoryName];

  const style = CATEGORY_STYLES[categoryName] || { bg: 'linear-gradient(135deg, #8B1A2C, #C9A84C)', icon: '✨' };
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400'>
    <defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' style='stop-color:${style.bg.match(/#[A-Fa-f0-9]+/g)?.[0] || '#8B1A2C'}'/>
      <stop offset='100%' style='stop-color:${style.bg.match(/#[A-Fa-f0-9]+/g)?.[1] || '#C9A84C'}'/>
    </linearGradient></defs>
    <rect width='300' height='400' fill='url(#g)'/>
    <text x='150' y='180' font-size='70' text-anchor='middle' dominant-baseline='middle'>${style.icon}</text>
    <text x='150' y='260' font-size='20' text-anchor='middle' fill='rgba(255,255,255,0.9)' font-family='sans-serif' font-weight='bold'>${categoryName}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ============================================
// RENDERING HELPERS
// ============================================

function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

function getDiscount(price, original) {
  if (!original || original <= price) return 0;
  return Math.round((1 - price / original) * 100);
}

function renderProductCard(product) {
  const img = getProductImage(product);
  const discount = getDiscount(product.price, product.originalPrice);
  const badges = [];
  if (product.isNewArrival) badges.push('<span class="badge badge-new">New</span>');
  if (discount > 0) badges.push(`<span class="badge badge-sale">${discount}% Off</span>`);
  if (product.freeDelivery) badges.push('<span class="badge" style="background:#16a34a;color:#fff">🚚 Free Delivery</span>');

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <img src="${img}" alt="${product.name}" loading="lazy" onerror="this.src='${getCategoryImage(product.category)}'">
        <div class="product-badges">${badges.join('')}</div>
        <button class="product-wishlist" onclick="toggleWishlist('${product.id}', this)" title="Save">♡</button>
        <div class="product-quick-add">
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">🛒 Add to Cart</button>
          <button class="btn-view" onclick="openQuickView('${product.id}')">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        ${product.caption ? `<div class="product-caption">${product.caption}</div>` : ''}
        <div class="product-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${discount > 0 ? `<span class="price-original">${formatPrice(product.originalPrice)}</span><span class="price-discount">${discount}% off</span>` : ''}
        </div>
        ${product.freeDelivery ? '<div style="font-size:0.75rem;color:#16a34a;font-weight:700;margin-top:4px">🚚 Free Delivery</div>' : ''}
      </div>
    </div>
  `;
}

function renderCategoryCard(name) {
  const storedImgs = getCategoryImages();
  const hasStoredImg = storedImgs[name] && storedImgs[name].length > 10;
  const img = hasStoredImg ? storedImgs[name] : ((name === 'Sarees') ? 'assets/category_sarees.png' : getCategoryImage(name));
  return `
    <div class="category-card" onclick="window.location='collection.html?category=${encodeURIComponent(name)}'">
      <img class="category-img" src="${img}" alt="${name}" loading="lazy" onerror="this.src='${getCategoryImage(name)}'">
      <div class="category-overlay">
        <div class="category-icon">${(CATEGORY_STYLES[name] || {icon:'✨'}).icon}</div>
        <div class="category-name">${name}</div>
        <div class="category-shop-link">Shop Now →</div>
      </div>
    </div>
  `;
}

// ============================================
// WISHLIST
// ============================================

function getWishlist() {
  try { return JSON.parse(localStorage.getItem('nachi_wishlist') || '[]'); } catch { return []; }
}

function toggleWishlist(productId, btn) {
  let wl = getWishlist();
  if (wl.includes(productId)) {
    wl = wl.filter(id => id !== productId);
    if (btn) { btn.textContent = '♡'; btn.classList.remove('active'); }
    showToast('Removed from wishlist', 'info');
  } else {
    wl.push(productId);
    if (btn) { btn.textContent = '♥'; btn.classList.add('active'); }
    showToast('Added to wishlist ♥', 'success');
  }
  localStorage.setItem('nachi_wishlist', JSON.stringify(wl));
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', cart: '🛒' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '✅'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ============================================
// MOBILE NAVIGATION
// ============================================

function initMobileNav() {
  const toggle = document.getElementById('mobileMenuToggle');
  const overlay = document.getElementById('mobileNavOverlay');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavClose');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const close = () => {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);
}

// ============================================
// SEARCH
// ============================================

function initSearch() {
  const searchBtns = document.querySelectorAll('[data-open-search]');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('searchClose');
  const input = document.getElementById('searchInput');
  const form = document.getElementById('searchForm');

  if (!overlay) return;

  searchBtns.forEach(btn => btn.addEventListener('click', () => {
    overlay.classList.add('open');
    if (input) setTimeout(() => input.focus(), 100);
  }));

  const close = () => overlay.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const q = input.value.trim();
      if (q) window.location = `collection.html?search=${encodeURIComponent(q)}`;
    });
  }
}

// ============================================
// HERO SLIDER
// ============================================

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function start() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  function reset() {
    clearInterval(timer);
    start();
  }

  slides[0].classList.add('active');
  if (dots[0]) dots[0].classList.add('active');
  start();

  const prevBtn = document.querySelector('.hero-arrow-prev');
  const nextBtn = document.querySelector('.hero-arrow-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); reset(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); reset(); });

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); reset(); }));
}

// ============================================
// WHATSAPP FLOATING BUTTON
// ============================================

function initWhatsAppFloatingButton() {
  const number = '919514142266';
  const text = encodeURIComponent("Hello Nachi Clothing! I'm visiting your website and have a query.");
  const url = `https://wa.me/${number}?text=${text}`;

  const btn = document.createElement('a');
  btn.href = url;
  btn.target = '_blank';
  btn.className = 'whatsapp-float';
  btn.setAttribute('aria-label', 'Chat on WhatsApp');
  btn.innerHTML = `💬<span class="whatsapp-float-tooltip">Chat with Us</span>`;
  document.body.appendChild(btn);
}

// ============================================
// PRODUCT QUICK-VIEW MODAL
// ============================================

let _qvQty = 1;
let _qvProductId = null;

function initQuickViewModal() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'qv-overlay';
  overlay.id = 'qvOverlay';
  overlay.addEventListener('click', closeQuickView);

  // Create modal shell
  const modal = document.createElement('div');
  modal.className = 'qv-modal';
  modal.id = 'qvModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="qv-handle"></div>
    <div class="qv-close"><button onclick="closeQuickView()" aria-label="Close">✕</button></div>
    <div class="qv-body" id="qvBody"></div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuickView(); });
}

function openQuickView(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  _qvProductId = productId;
  _qvQty = 1;

  const overlay = document.getElementById('qvOverlay');
  const modal = document.getElementById('qvModal');
  const body = document.getElementById('qvBody');
  if (!overlay || !modal || !body) return;

  const img = getProductImage(product);
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const wl = getWishlist();
  const isWished = wl.includes(productId);
  const waText = encodeURIComponent(
    `Hello Nachi Clothing! 👋\n\nI'm interested in ordering:\n\n👗 *${product.name}*\n💰 Price: ${formatPrice(product.price)}\n📦 Category: ${product.category}\n${product.image && product.image.startsWith('http') ? '🖼 Image: ' + product.image + '\n' : ''}\nPlease help me place the order.`
  );

  body.innerHTML = `
    <div class="qv-image-wrap">
      <img src="${img}" alt="${product.name}" id="qvMainImg" onerror="this.src='${getCategoryImage(product.category)}'">
    </div>
    <div class="qv-info">
      <div class="qv-category">${product.category}</div>
      <h2 class="qv-name">${product.name}</h2>
      <div class="qv-badges">
        ${product.isNewArrival ? '<span class="badge badge-new">New Arrival</span>' : ''}
        ${discount > 0 ? `<span class="badge badge-sale">${discount}% Off</span>` : ''}
      </div>
      <div class="qv-price">
        <span class="current">${formatPrice(product.price)}</span>
        ${discount > 0 ? `<span class="original">${formatPrice(product.originalPrice)}</span><span class="discount">${discount}% off</span>` : ''}
      </div>
      ${product.caption ? `<p class="qv-caption">${product.caption}</p>` : ''}
      <div class="qv-divider"></div>
      <div class="qv-qty-row">
        <span class="qv-qty-label">Qty:</span>
        <div class="qv-qty-ctrl">
          <button onclick="qvChangeQty(-1)">−</button>
          <span class="qv-qty-num" id="qvQtyNum">1</span>
          <button onclick="qvChangeQty(1)">+</button>
        </div>
        <button class="product-wishlist ${isWished ? 'active' : ''}" id="qvWishBtn" onclick="qvToggleWishlist()" title="Wishlist" style="font-size:1.4rem">${isWished ? '♥' : '♡'}</button>
      </div>
      <div class="qv-actions">
        <button class="btn btn-primary" onclick="qvAddToCart()">🛒 Add to Cart</button>
        <button class="btn btn-gold" onclick="qvBuyNow()">⚡ Buy Now</button>
      </div>
      <button class="qv-wa-link" onclick="shareProductToWhatsApp('${productId}')">📲 Share on WhatsApp (with Photo)</button>
      <div class="qv-divider"></div>
      <div class="qv-meta">
        <div class="qv-meta-row"><span>Category</span><span>${product.category}</span></div>
        <div class="qv-meta-row"><span>Availability</span><span style="color:#16a34a">✓ In Stock</span></div>
        ${product.freeDelivery ? '<div class="qv-meta-row"><span>Delivery</span><span style="color:#16a34a;font-weight:700">🚚 Free Delivery</span></div>' : ''}
      </div>
      <button class="qv-full-link" onclick="closeQuickView(); window.location='product.html?id=${productId}';">→ View Full Product Page</button>
    </div>
  `;

  document.body.style.overflow = 'hidden';
  overlay.classList.add('open');
  // Small delay so CSS transition fires
  requestAnimationFrame(() => { requestAnimationFrame(() => { modal.classList.add('open'); }); });
}

function closeQuickView() {
  const overlay = document.getElementById('qvOverlay');
  const modal = document.getElementById('qvModal');
  if (!overlay || !modal) return;
  modal.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  _qvProductId = null;
}

function qvChangeQty(delta) {
  _qvQty = Math.max(1, _qvQty + delta);
  const el = document.getElementById('qvQtyNum');
  if (el) el.textContent = _qvQty;
}

function qvAddToCart() {
  if (!_qvProductId) return;
  const products = getProducts();
  const product = products.find(p => p.id === _qvProductId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === _qvProductId);
  if (existing) existing.qty += _qvQty;
  else cart.push({ id: _qvProductId, qty: _qvQty });
  saveCart(cart);
  showToast(`"${product.name}" added to cart!`, 'cart');
  closeQuickView();
  setTimeout(() => openCartDrawer(), 350);
}

function qvBuyNow() {
  qvAddToCart();
  // Close quick view and open order form after cart is updated
  setTimeout(() => {
    closeQuickView();
    setTimeout(() => openOrderForm(), 400);
  }, 300);
}

function qvToggleWishlist() {
  if (!_qvProductId) return;
  const btn = document.getElementById('qvWishBtn');
  toggleWishlist(_qvProductId, btn);
  const wl = getWishlist();
  if (btn) btn.textContent = wl.includes(_qvProductId) ? '♥' : '♡';
}

// ============================================
// ORDER DETAILS FORM (before WhatsApp)
// ============================================

function initOrderForm() {
  // Inject HTML into body
  const html = `
    <div id="orderFormOverlay">
      <div id="orderFormModal">
        <div class="order-form-handle"></div>
        <div class="order-form-header">
          <div class="wa-icon">📦</div>
          <h3>Almost there!</h3>
          <p>Enter your details so we can deliver to you</p>
        </div>

        <div class="order-form-fields">
          <div class="order-field-group">
            <label>YOUR NAME *</label>
            <input type="text" id="orderName" placeholder="e.g. Priya Sharma" autocomplete="name">
          </div>
          <div class="order-field-group">
            <label>WHATSAPP / PHONE NUMBER *</label>
            <input type="tel" id="orderPhone" placeholder="e.g. 9876543210" autocomplete="tel" maxlength="15">
          </div>
          <div class="order-field-row">
            <div class="order-field-group">
              <label>CITY</label>
              <input type="text" id="orderCity" placeholder="e.g. Chennai" autocomplete="address-level2">
            </div>
            <div class="order-field-group">
              <label>PINCODE</label>
              <input type="text" id="orderPincode" placeholder="e.g. 600001" maxlength="6" inputmode="numeric">
            </div>
          </div>
        </div>

        <div class="order-form-summary" id="orderFormSummary">
          <strong>🛍️ Your Order</strong>
          <div id="orderSummaryItems"></div>
          <div class="order-summary-total" id="orderSummaryTotal"></div>
        </div>

        <div class="order-form-actions">
          <button class="order-wa-btn" id="orderConfirmBtn" onclick="confirmOrderToWhatsApp()">
            <span class="btn-icon">💬</span>
            Send Order on WhatsApp
          </button>
          <button class="order-cancel-btn" onclick="closeOrderForm()">Cancel</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  // Close when clicking outside modal
  document.getElementById('orderFormOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeOrderForm();
  });

  // Restore saved name/phone for convenience
  const saved = getSavedCustomer();
  if (saved.name) document.getElementById('orderName').value = saved.name;
  if (saved.phone) document.getElementById('orderPhone').value = saved.phone;
  if (saved.city) document.getElementById('orderCity').value = saved.city;
  if (saved.pincode) document.getElementById('orderPincode').value = saved.pincode;
}

function getSavedCustomer() {
  try { return JSON.parse(localStorage.getItem('nachi_customer') || '{}'); } catch { return {}; }
}
function saveCustomer(data) {
  localStorage.setItem('nachi_customer', JSON.stringify(data));
}

function openOrderForm() {
  const overlay = document.getElementById('orderFormOverlay');
  if (!overlay) return;

  // Populate order summary
  const cart = getCart();
  const products = getProducts();
  const summaryEl = document.getElementById('orderSummaryItems');
  const totalEl   = document.getElementById('orderSummaryTotal');

  if (cart.length === 0) {
    // Nothing in cart - fallback direct WA
    orderViaWhatsApp();
    return;
  }

  let subtotal = 0;
  let hasPaidShipping = false;
  let summaryHtml = '';

  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return;
    const lineTotal = p.price * item.qty;
    subtotal += lineTotal;
    if (!p.freeDelivery) hasPaidShipping = true;
    summaryHtml += `<div class="order-summary-item"><span>${p.name} ×${item.qty}</span><span>${formatPrice(lineTotal)}</span></div>`;
  });

  const shipping = hasPaidShipping ? 80 : 0;
  const total = subtotal + shipping;

  if (summaryEl) summaryEl.innerHTML = summaryHtml + (shipping > 0 ? `<div class="order-summary-item"><span>Shipping</span><span>₹${shipping}</span></div>` : '<div class="order-summary-item"><span>Shipping</span><span style="color:#16a34a">FREE 🚚</span></div>');
  if (totalEl) totalEl.innerHTML = `<div class="order-summary-item"><span>Total</span><span>${formatPrice(total)}</span></div>`;

  document.body.style.overflow = 'hidden';
  overlay.classList.add('open');

  // Focus first empty field
  setTimeout(() => {
    const nameEl = document.getElementById('orderName');
    if (nameEl && !nameEl.value) nameEl.focus();
  }, 400);
}

function closeOrderForm() {
  const overlay = document.getElementById('orderFormOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

async function confirmOrderToWhatsApp() {
  const name    = (document.getElementById('orderName')?.value || '').trim();
  const phone   = (document.getElementById('orderPhone')?.value || '').trim();
  const city    = (document.getElementById('orderCity')?.value || '').trim();
  const pincode = (document.getElementById('orderPincode')?.value || '').trim();

  if (!name) {
    document.getElementById('orderName')?.focus();
    document.getElementById('orderName').style.borderColor = 'var(--maroon)';
    return;
  }
  if (!phone) {
    document.getElementById('orderPhone')?.focus();
    document.getElementById('orderPhone').style.borderColor = 'var(--maroon)';
    return;
  }

  // Save for next time
  saveCustomer({ name, phone, city, pincode });

  closeOrderForm();

  // Build message
  const cart = getCart();
  const products = getProducts();

  let message = `🛍️ *New Order – Nachi Clothing*\n\n`;
  message += `👤 *Customer Details*\n`;
  message += `Name: ${name}\n`;
  message += `Phone: ${phone}\n`;
  if (city)    message += `City: ${city}\n`;
  if (pincode) message += `Pincode: ${pincode}\n`;
  message += `\n📦 *Order Items*\n`;
  message += `─────────────────\n`;

  let subtotal = 0;
  let hasPaidShipping = false;
  let firstProduct = null;

  cart.forEach((item, i) => {
    const p = products.find(x => x.id === item.id);
    if (!p) return;
    const lineTotal = p.price * item.qty;
    subtotal += lineTotal;
    if (!p.freeDelivery) hasPaidShipping = true;
    if (!firstProduct) firstProduct = p;
    message += `${i + 1}. *${p.name}*\n`;
    message += `   Category: ${p.category}\n`;
    message += `   Qty: ${item.qty} × ${formatPrice(p.price)} = ${formatPrice(lineTotal)}\n\n`;
  });

  const shipping = hasPaidShipping ? 80 : 0;
  const total = subtotal + shipping;

  message += `─────────────────\n`;
  message += `Subtotal: ${formatPrice(subtotal)}\n`;
  message += `Shipping: ${shipping === 0 ? 'FREE 🚚' : formatPrice(shipping)}\n`;
  message += `*Total: ${formatPrice(total)}*\n\n`;
  message += `✅ Please confirm this order. Thank you!`;

  // Try Web Share API with product image (works on mobile)
  if (navigator.share && firstProduct) {
    try {
      const imgSrc = getProductImage(firstProduct);
      const pngBlob = await imageSrcToPngBlob(imgSrc);
      if (pngBlob && navigator.canShare && navigator.canShare({ files: [new File([pngBlob], 'order.png', { type: 'image/png' })] })) {
        const file = new File([pngBlob], 'nachi-order.png', { type: 'image/png' });
        await navigator.share({ files: [file], text: message });
        return;
      }
      await navigator.share({ text: message });
      return;
    } catch(e) {}
  }

  // Fallback
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================
// GLOBAL INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initSearch();
  initHeroSlider();
  initWhatsAppFloatingButton();
  initQuickViewModal();
  initOrderForm();

  // Hook the cart's "Order via WhatsApp" button to open form instead
  const orderBtn = document.getElementById('orderWhatsApp');
  if (orderBtn) {
    orderBtn.removeEventListener('click', orderViaWhatsApp);
    orderBtn.addEventListener('click', openOrderForm);
  }
});
