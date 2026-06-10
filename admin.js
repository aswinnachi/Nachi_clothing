/* ============================================
   NACHI CLOTHING - Admin Panel Logic
   Login: nachiclothing / 28012007
   ============================================ */

const ADMIN_USERNAME = 'nachiclothing';
const ADMIN_PASSWORD = '28012007';
const ADMIN_SESSION_KEY = 'nachi_admin_session';

// ============================================
// AUTH
// ============================================

function isLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function adminLogin(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    return true;
  }
  return false;
}

function adminLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  showLoginScreen();
}

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  initAdminPanel();
}

// ============================================
// ADMIN INIT
// ============================================

function initAdminPanel() {
  renderAdminStats();
  renderAdminCategories();
  renderProductTable();
  populateCategorySelects();
  initImageUpload();
}

// ============================================
// STATS DASHBOARD
// ============================================

function renderAdminStats() {
  const products = getProducts();
  const categories = getCategories();
  const featured = products.filter(p => p.isFeatured).length;
  const newArrivals = products.filter(p => p.isNewArrival).length;

  const els = {
    'statTotal': products.length,
    'statCategories': categories.length,
    'statFeatured': featured,
    'statNew': newArrivals
  };
  for (const [id, val] of Object.entries(els)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

// ============================================
// CATEGORIES MANAGEMENT
// ============================================

function renderAdminCategories() {
  const categories = getCategories();
  const container = document.getElementById('categoriesList');
  if (!container) return;

  container.innerHTML = categories.map((cat, i) => `
    <div class="admin-category-tag" data-index="${i}">
      <span>${cat}</span>
      <button class="cat-delete-btn" onclick="deleteCategory(${i})" title="Delete">✕</button>
    </div>
  `).join('');
}

function addCategory() {
  const input = document.getElementById('newCategoryInput');
  const name = input.value.trim();
  if (!name) { showAdminToast('Please enter a category name', 'error'); return; }

  const categories = getCategories();
  if (categories.some(c => c.toLowerCase() === name.toLowerCase())) { showAdminToast('Category already exists', 'error'); return; }

  categories.push(name);
  saveCategories(categories);
  input.value = '';
  renderAdminCategories();
  populateCategorySelects();
  renderAdminStats();
  showAdminToast(`Category "${name}" added!`, 'success');
}

function deleteCategory(index) {
  const categories = getCategories();
  const name = categories[index];
  const products = getProducts();
  const hasProducts = products.some(p => p.category === name);

  if (hasProducts) {
    if (!confirm(`The category "${name}" has products. Deleting it will not remove those products. Continue?`)) return;
  } else {
    if (!confirm(`Delete category "${name}"?`)) return;
  }

  categories.splice(index, 1);
  saveCategories(categories);
  renderAdminCategories();
  populateCategorySelects();
  renderAdminStats();
  showAdminToast(`Category "${name}" deleted`, 'info');
}

function populateCategorySelects() {
  const categories = getCategories();
  const selects = document.querySelectorAll('.category-select');
  selects.forEach(sel => {
    const currentVal = sel.value;
    sel.innerHTML = '<option value="">-- Pick a Category --</option>' +
      categories.map(c => `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c}</option>`).join('');
  });
}

// ============================================
// IMAGE UPLOAD
// ============================================

let currentImageData = '';

function initImageUpload() {
  const dropzone = document.getElementById('imageDropzone');
  const fileInput = document.getElementById('imageFileInput');
  const preview = document.getElementById('imagePreview');
  const removeBtn = document.getElementById('removeImageBtn');

  if (!dropzone) return;

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      currentImageData = '';
      if (preview) { preview.src = ''; preview.style.display = 'none'; }
      dropzone.style.display = 'flex';
      removeBtn.style.display = 'none';
    });
  }
}

function handleImageFile(file) {
  if (!file.type.startsWith('image/')) { showAdminToast('Please select an image file', 'error'); return; }
  if (file.size > 5 * 1024 * 1024) { showAdminToast('Image must be under 5MB', 'error'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    currentImageData = e.target.result;
    const preview = document.getElementById('imagePreview');
    const dropzone = document.getElementById('imageDropzone');
    const removeBtn = document.getElementById('removeImageBtn');
    if (preview) { preview.src = currentImageData; preview.style.display = 'block'; }
    if (dropzone) dropzone.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

// ============================================
// PRODUCT CRUD
// ============================================

let editingProductId = null;

function openAddProductForm() {
  editingProductId = null;
  currentImageData = '';
  document.getElementById('productFormTitle').textContent = '➕ Add New Product';
  document.getElementById('productForm').reset();
  const preview = document.getElementById('imagePreview');
  const dropzone = document.getElementById('imageDropzone');
  const removeBtn = document.getElementById('removeImageBtn');
  if (preview) { preview.style.display = 'none'; preview.src = ''; }
  if (dropzone) dropzone.style.display = 'flex';
  if (removeBtn) removeBtn.style.display = 'none';
  document.getElementById('productFormSection').style.display = 'block';
  document.getElementById('productFormSection').scrollIntoView({ behavior: 'smooth' });
}

function editProduct(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  editingProductId = productId;
  currentImageData = product.image || '';

  document.getElementById('productFormTitle').textContent = '✏️ Edit Product';
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('prodOriginalPrice').value = product.originalPrice || '';
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodCaption').value = product.caption || '';
  document.getElementById('prodFeatured').checked = product.isFeatured;
  document.getElementById('prodNewArrival').checked = product.isNewArrival;
  const fdEl = document.getElementById('prodFreeDelivery');
  if (fdEl) fdEl.checked = !!product.freeDelivery;

  // Populate URL field if it's a web link
  const urlField = document.getElementById('prodImageUrl');
  if (urlField) {
    if (currentImageData.startsWith('http://') || currentImageData.startsWith('https://')) {
      urlField.value = currentImageData;
    } else {
      urlField.value = '';
    }
  }

  const preview = document.getElementById('imagePreview');
  const dropzone = document.getElementById('imageDropzone');
  const removeBtn = document.getElementById('removeImageBtn');

  if (currentImageData && currentImageData.length > 10) {
    if (preview) { preview.src = currentImageData; preview.style.display = 'block'; }
    if (dropzone) dropzone.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'flex';
  } else {
    if (preview) { preview.style.display = 'none'; }
    if (dropzone) dropzone.style.display = 'flex';
    if (removeBtn) removeBtn.style.display = 'none';
  }

  document.getElementById('productFormSection').style.display = 'block';
  document.getElementById('productFormSection').scrollIntoView({ behavior: 'smooth' });
}

function saveProduct(e) {
  e.preventDefault();
  const name = document.getElementById('prodName').value.trim();
  const price = parseInt(document.getElementById('prodPrice').value);
  const originalPrice = parseInt(document.getElementById('prodOriginalPrice').value) || 0;
  const category = document.getElementById('prodCategory').value;
  const caption = document.getElementById('prodCaption').value.trim();
  const isFeatured = document.getElementById('prodFeatured').checked;
  const isNewArrival = document.getElementById('prodNewArrival').checked;
  const freeDelivery = !!(document.getElementById('prodFreeDelivery')?.checked);

  const urlFieldVal = document.getElementById('prodImageUrl')?.value.trim() || '';
  // Prioritize URL input if it exists
  const finalImage = urlFieldVal ? urlFieldVal : currentImageData;

  if (!name) { showAdminToast('Please enter product name', 'error'); return; }
  if (!price || price <= 0) { showAdminToast('Please enter a valid price', 'error'); return; }
  if (!category) { showAdminToast('Please select a category', 'error'); return; }

  const products = getProducts();

  if (editingProductId) {
    // Update existing
    const idx = products.findIndex(p => p.id === editingProductId);
    if (idx > -1) {
      products[idx] = { ...products[idx], name, price, originalPrice, category, caption, isFeatured, isNewArrival, freeDelivery, image: finalImage };
      showAdminToast(`"${name}" updated successfully!`, 'success');
    }
  } else {
    // Add new
    const newProduct = {
      id: 'prod-' + Date.now(),
      name, price, originalPrice, category, caption, isFeatured, isNewArrival, freeDelivery,
      image: finalImage,
      createdAt: Date.now()
    };
    products.unshift(newProduct);
    showAdminToast(`"${name}" added successfully!`, 'success');
  }

  saveProducts(products);
  cancelProductForm();
  renderProductTable();
  renderAdminStats();
}

function cancelProductForm() {
  editingProductId = null;
  currentImageData = '';
  document.getElementById('productFormSection').style.display = 'none';
  document.getElementById('productForm').reset();
}

function deleteProduct(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  if (!confirm(`Delete "${product.name}"?\n\nThis cannot be undone.`)) return;

  const updated = products.filter(p => p.id !== productId);
  saveProducts(updated);
  renderProductTable();
  renderAdminStats();
  showAdminToast(`"${product.name}" deleted`, 'info');
}

function toggleFeatured(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  product.isFeatured = !product.isFeatured;
  saveProducts(products);
  renderProductTable();
  showAdminToast(product.isFeatured ? '⭐ Marked as Featured' : 'Removed from Featured', 'info');
}

function toggleNewArrival(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  product.isNewArrival = !product.isNewArrival;
  saveProducts(products);
  renderProductTable();
  showAdminToast(product.isNewArrival ? '🆕 Marked as New Arrival' : 'Removed from New Arrivals', 'info');
}

// ============================================
// QUICK PRICE EDIT
// ============================================

function editPrice(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const cell = document.getElementById(`price-${productId}`);
  if (!cell) return;

  cell.innerHTML = `
    <div style="display:flex;gap:6px;align-items:center">
      <span style="color:var(--gold)">₹</span>
      <input type="number" id="priceInput-${productId}" value="${product.price}"
        style="width:90px;padding:5px 8px;border:1.5px solid var(--maroon);border-radius:4px;font-size:0.88rem"
        min="1" onkeydown="if(event.key==='Enter') savePriceEdit('${productId}'); if(event.key==='Escape') cancelPriceEdit('${productId}', ${product.price})">
      <button onclick="savePriceEdit('${productId}')" style="background:var(--maroon);color:#fff;padding:5px 9px;border-radius:4px;font-size:0.8rem">✓</button>
      <button onclick="cancelPriceEdit('${productId}', ${product.price})" style="background:#eee;padding:5px 9px;border-radius:4px;font-size:0.8rem">✕</button>
    </div>`;
  document.getElementById(`priceInput-${productId}`).focus();
}

function savePriceEdit(productId) {
  const input = document.getElementById(`priceInput-${productId}`);
  const newPrice = parseInt(input.value);
  if (!newPrice || newPrice <= 0) { showAdminToast('Enter a valid price', 'error'); return; }

  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const oldPrice = product.price;
  product.price = newPrice;
  saveProducts(products);
  renderProductTable();
  showAdminToast(`Price updated: ₹${oldPrice} → ₹${newPrice}`, 'success');
}

function cancelPriceEdit(productId, oldPrice) {
  const cell = document.getElementById(`price-${productId}`);
  if (cell) cell.innerHTML = `<strong style="color:var(--maroon)">₹${oldPrice.toLocaleString('en-IN')}</strong> <button class="admin-link-btn" onclick="editPrice('${productId}')">✏️</button>`;
}

// ============================================
// PRODUCT TABLE
// ============================================

function renderProductTable(filterCat = undefined, filterSearch = undefined) {
  const container = document.getElementById('productsTableBody');
  if (!container) return 0;

  let products = getProducts();

  // Read current filters from DOM if not explicitly passed
  const cat = filterCat !== undefined ? filterCat : (document.getElementById('filterCategory')?.value || '');
  const search = filterSearch !== undefined ? filterSearch : (document.getElementById('filterSearch')?.value || '');

  // Apply filters
  if (cat) products = products.filter(p => p.category === cat);
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (products.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-light)">No products found</td></tr>`;
    return 0;
  }

  container.innerHTML = products.map(p => {
    const img = getProductImage(p);
    const discount = p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <img src="${img}" alt="${p.name}" style="width:48px;height:60px;object-fit:cover;border-radius:4px;border:1px solid var(--border)">
            <div>
              <div style="font-weight:600;font-size:0.88rem;color:var(--text-dark)">${p.name}</div>
              <div style="font-size:0.75rem;color:var(--text-light)">${p.caption ? p.caption.slice(0,45) + (p.caption.length>45?'…':'') : '—'}</div>
            </div>
          </div>
        </td>
        <td><span class="admin-cat-badge">${p.category}</span></td>
        <td id="price-${p.id}">
          <strong style="color:var(--maroon)">₹${p.price.toLocaleString('en-IN')}</strong>
          ${discount > 0 ? `<br><span style="font-size:0.72rem;color:var(--text-light);text-decoration:line-through">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          <button class="admin-link-btn" onclick="editPrice('${p.id}')" title="Edit Price"> ✏️</button>
        </td>
        <td>
          <button class="admin-toggle-btn ${p.isFeatured ? 'active' : ''}" onclick="toggleFeatured('${p.id}')" title="${p.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}">
            ${p.isFeatured ? '⭐ Yes' : '☆ No'}
          </button>
        </td>
        <td>
          <button class="admin-toggle-btn ${p.isNewArrival ? 'active' : ''}" onclick="toggleNewArrival('${p.id}')" title="${p.isNewArrival ? 'Remove from New' : 'Mark as New'}">
            ${p.isNewArrival ? '🆕 Yes' : '○ No'}
          </button>
        </td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="admin-btn admin-btn-edit" onclick="editProduct('${p.id}')">✏️ Edit</button>
            <button class="admin-btn admin-btn-delete" onclick="deleteProduct('${p.id}')">🗑️ Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return products.length;
}

// ============================================
// ADMIN TOAST
// ============================================

function showAdminToast(message, type = 'success') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const colors = { success: '#16a34a', error: '#8B1A2C', info: '#C9A84C' };
  let container = document.querySelector('.admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = `background:#fff;border-left:4px solid ${colors[type]};border-radius:6px;padding:12px 18px;box-shadow:0 4px 24px rgba(0,0,0,0.12);display:flex;align-items:center;gap:10px;font-size:0.88rem;color:#1A0A0E;animation:slideInRight 0.3s ease;min-width:250px`;
  toast.innerHTML = `${icons[type] || '✅'} ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ============================================
// TABLE FILTER
// ============================================

function filterProducts() {
  const cat = document.getElementById('filterCategory')?.value || '';
  const search = document.getElementById('filterSearch')?.value || '';
  renderProductTable(cat, search);
}

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('adminUsername').value.trim();
      const password = document.getElementById('adminPassword').value;
      const errorEl = document.getElementById('loginError');

      if (adminLogin(username, password)) {
        showAdminPanel();
      } else {
        if (errorEl) {
          errorEl.textContent = 'Wrong username or password. Please try again.';
          errorEl.style.display = 'block';
        }
        document.getElementById('adminPassword').value = '';
      }
    });
  }

  // Check session
  if (isLoggedIn()) {
    showAdminPanel();
  } else {
    showLoginScreen();
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', adminLogout);

  // Product form
  const productForm = document.getElementById('productForm');
  if (productForm) productForm.addEventListener('submit', saveProduct);

  // Add product button
  const addBtn = document.getElementById('addProductBtn');
  if (addBtn) addBtn.addEventListener('click', openAddProductForm);

  // Cancel form button
  const cancelBtn = document.getElementById('cancelFormBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', cancelProductForm);

  // Filter listeners
  const filterSearch = document.getElementById('filterSearch');
  if (filterSearch) filterSearch.addEventListener('input', filterProducts);

  const filterCat = document.getElementById('filterCategory');
  if (filterCat) filterCat.addEventListener('change', filterProducts);

  // Add category button
  const addCatBtn = document.getElementById('addCategoryBtn');
  if (addCatBtn) addCatBtn.addEventListener('click', addCategory);

  const catInput = document.getElementById('newCategoryInput');
  if (catInput) catInput.addEventListener('keydown', e => { if (e.key === 'Enter') addCategory(); });
});
