/* ============================================
   NACHI CLOTHING - Cart Logic
   WhatsApp: 9514142266
   ============================================ */

const WHATSAPP_NUMBER = '919514142266'; // Country code prefix

// ============================================
// CART STATE
// ============================================

function getCart() {
  try { return JSON.parse(localStorage.getItem('nachi_cart') || '[]'); } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('nachi_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.textContent = total;
    badge.classList.toggle('visible', total > 0);
  });
}

// ============================================
// CART OPERATIONS
// ============================================

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  showToast(`"${product.name}" added to cart!`, 'cart');
  openCartDrawer();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
}

function getCartTotal() {
  const cart = getCart();
  const products = getProducts();
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// ============================================
// CART DRAWER UI
// ============================================

function openCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay) overlay.classList.add('open');
  if (drawer) drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartDrawer();
}

function closeCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay) overlay.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const body = document.getElementById('cartDrawerBody');
  const footer = document.getElementById('cartDrawerFooter');
  if (!body) return;

  const cart = getCart();
  const products = getProducts();

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty.<br>Explore our beautiful collection!</p>
        <button class="btn btn-primary btn-sm" onclick="closeCartDrawer(); window.location='collection.html'">Shop Now</button>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  body.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return '';
    const img = getProductImage(product);
    const itemTotal = product.price * item.qty;
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${img}" alt="${product.name}" onerror="this.src='${getCategoryImage(product.category)}'">
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-category">${product.category}</div>
          <div class="cart-item-price">${formatPrice(itemTotal)}</div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="updateQty('${product.id}', -1)">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${product.id}', 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart('${product.id}')">✕ Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Update footer totals
  const subtotal = getCartTotal();
  
  // If ANY item in cart does NOT have free delivery, charge shipping.
  const hasPaidShipping = cart.some(item => {
    const product = products.find(p => p.id === item.id);
    return product && !product.freeDelivery;
  });
  
  const shipping = hasPaidShipping ? 80 : 0;
  const total = subtotal + shipping;

  const summaryEl = document.getElementById('cartSummary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="cart-summary-row">
        <span>Subtotal (${getCartCount()} items)</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Shipping</span>
        <span>${shipping === 0 ? '<span style="color:#16a34a;font-weight:600">FREE</span>' : formatPrice(shipping)}</span>
      </div>
      <div class="cart-summary-row total">
        <span>Total</span>
        <span>${formatPrice(total)}</span>
      </div>
    `;
  }
}

// ============================================
// WHATSAPP ORDER (with direct image share)
// ============================================

async function orderViaWhatsApp() {
  const cart = getCart();
  const products = getProducts();
  if (cart.length === 0) return;

  let message = '🛍️ *New Order - Nachi Clothing*\n\n';
  message += '*Order Details:*\n';
  message += '─────────────────\n';

  let total = 0;
  let firstProduct = null;

  cart.forEach((item, index) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    const itemTotal = product.price * item.qty;
    total += itemTotal;
    if (!firstProduct) firstProduct = product;

    message += `${index + 1}. *${product.name}*\n`;
    message += `   Category: ${product.category}\n`;
    message += `   Qty: ${item.qty} × ${formatPrice(product.price)} = ${formatPrice(itemTotal)}\n\n`;
  });

  message += '─────────────────\n';
  
  const hasPaidShipping = cart.some(item => {
    const product = products.find(p => p.id === item.id);
    return product && !product.freeDelivery;
  });
  const shipping = hasPaidShipping ? 80 : 0;
  
  message += `Subtotal: ${formatPrice(total)}\n`;
  message += `Shipping: ${shipping === 0 ? 'FREE' : formatPrice(shipping)}\n`;
  message += `*Total: ${formatPrice(total + shipping)}*\n\n`;
  message += '📦 Please confirm my order. Thank you!';

  // Try Web Share API with canvas-converted product image
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
    } catch(e) {
      // user cancelled – fall through
    }
  }

  // Fallback: open WhatsApp wa.me link
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ─── Convert ANY image src to a PNG Blob via Canvas ─────────────────────────
function imageSrcToPngBlob(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Keep portrait ratio good for products
      canvas.width  = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      // White background
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image scaled to fit
      const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
      const w = img.width  * ratio;
      const h = img.height * ratio;
      const x = (canvas.width  - w) / 2;
      const y = (canvas.height - h) / 2;
      ctx.drawImage(img, x, y, w, h);

      canvas.toBlob(blob => resolve(blob), 'image/png');
    };

    img.onerror = () => resolve(null);

    // SVG data URLs must be reloaded as a Blob URL so canvas can draw them
    if (src.startsWith('data:image/svg')) {
      const blob = new Blob([decodeURIComponent(src.split(',')[1])], { type: 'image/svg+xml' });
      img.src = URL.createObjectURL(blob);
    } else {
      img.src = src;
    }
  });
}

// Share a single product (used by Quick-View modal "Share on WhatsApp")
async function shareProductToWhatsApp(productId) {
  const product = getProducts().find(p => p.id === productId);
  if (!product) return;

  const price   = formatPrice(product.price);
  const disc    = product.originalPrice > product.price
    ? ` (was ${formatPrice(product.originalPrice)})`
    : '';
  const text =
    `👗 *${product.name}*\n` +
    `💰 Price: ${price}${disc}\n` +
    `📦 Category: ${product.category}\n` +
    `${product.caption ? '\n' + product.caption + '\n' : ''}` +
    `\n👉 Order now via Nachi Clothing!\n📞 WhatsApp: +91 95141 42266`;

  // Try native share with image (works on Android & iOS)
  if (navigator.share) {
    try {
      const imgSrc = getProductImage(product);   // always returns something
      const pngBlob = await imageSrcToPngBlob(imgSrc);

      if (pngBlob && navigator.canShare && navigator.canShare({ files: [new File([pngBlob], 'product.png', { type: 'image/png' })] })) {
        const file = new File([pngBlob], `${product.name.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
        await navigator.share({ files: [file], text });
        return; // ✅ shared with image!
      }

      // Share without file (text only via share sheet)
      await navigator.share({ text });
      return;
    } catch (e) {
      // user cancelled or share sheet closed – fall through
    }
  }

  // Fallback: open WhatsApp in browser
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

// ============================================
// INIT CART
// ============================================

function initCart() {
  // Cart toggle buttons
  document.querySelectorAll('[data-open-cart]').forEach(btn => {
    btn.addEventListener('click', openCartDrawer);
  });

  // Cart overlay close
  const overlay = document.getElementById('cartOverlay');
  const closeBtn = document.getElementById('cartClose');
  if (overlay) overlay.addEventListener('click', closeCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

  // Order button
  const orderBtn = document.getElementById('orderWhatsApp');
  if (orderBtn) orderBtn.addEventListener('click', orderViaWhatsApp);

  // Initial badge update
  updateCartBadge();
}

document.addEventListener('DOMContentLoaded', initCart);
