// State Management
const state = {
  products: [],
  cart: [],
  wishlist: [],
  compareList: [],
  user: null,
  addresses: [],
  orders: [],
  currentFilter: 'all',
  currentSort: null,
  categories: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'],
  brands: ['TechPro', 'StyleHub', 'HomeEssence', 'GlowLux', 'FitGear', 'NexaTech', 'UrbanWear', 'SmartHome'],
  trendingSearches: ['wireless earbuds', 'smartwatch', 'sneakers', 'laptop', 'skincare', 'yoga mat', '4k monitor', 'coffee maker']
};

// Utility Functions
const currency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

const saveToMemory = () => {
  // Note: Using in-memory storage instead of localStorage for Claude.ai compatibility
  sessionStorage.setItem('nexamart_data', JSON.stringify({
    cart: state.cart,
    wishlist: state.wishlist,
    compareList: state.compareList,
    user: state.user,
    addresses: state.addresses,
    orders: state.orders
  }));
};

const loadFromMemory = () => {
  try {
    const saved = sessionStorage.getItem('nexamart_data');
    if (saved) {
      const data = JSON.parse(saved);
      Object.assign(state, data);
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
};

// Initialize Products
const initProducts = () => {
  state.products = [
    {
      id: 'p1',
      title: 'Premium Wireless Earbuds Pro',
      brand: 'TechPro',
      category: 'Electronics',
      price: 4999,
      originalPrice: 7999,
      rating: 4.8,
      reviews: 2341,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
      badge: 'deal',
      trending: true,
      new: false
    },
    {
      id: 'p2',
      title: 'Ultra Slim Laptop 14"',
      brand: 'NexaTech',
      category: 'Electronics',
      price: 65990,
      originalPrice: 89990,
      rating: 4.6,
      reviews: 856,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
      badge: 'new',
      trending: true,
      new: true
    },
    {
      id: 'p3',
      title: 'Smart Fitness Watch Ultra',
      brand: 'FitGear',
      category: 'Electronics',
      price: 12999,
      originalPrice: 19999,
      rating: 4.7,
      reviews: 1523,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      badge: 'deal',
      trending: true,
      new: false
    },
    {
      id: 'p4',
      title: 'Premium Running Shoes',
      brand: 'FitGear',
      category: 'Sports',
      price: 5499,
      originalPrice: 8999,
      rating: 4.5,
      reviews: 987,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      trending: false,
      new: false
    },
    {
      id: 'p5',
      title: 'Designer Denim Jacket',
      brand: 'UrbanWear',
      category: 'Fashion',
      price: 3999,
      originalPrice: 6999,
      rating: 4.4,
      reviews: 654,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
      trending: false,
      new: true
    },
    {
      id: 'p6',
      title: 'Smart Home Hub Controller',
      brand: 'SmartHome',
      category: 'Home',
      price: 8999,
      originalPrice: 12999,
      rating: 4.6,
      reviews: 432,
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=800&fit=crop',
      badge: 'new',
      trending: false,
      new: true
    },
    {
      id: 'p7',
      title: 'Luxury Skincare Set',
      brand: 'GlowLux',
      category: 'Beauty',
      price: 2999,
      originalPrice: 4999,
      rating: 4.9,
      reviews: 1876,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop',
      trending: true,
      new: false
    },
    {
      id: 'p8',
      title: '4K Ultra HD Monitor 27"',
      brand: 'NexaTech',
      category: 'Electronics',
      price: 24999,
      originalPrice: 34999,
      rating: 4.7,
      reviews: 543,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop',
      trending: false,
      new: false
    },
    {
      id: 'p9',
      title: 'Premium Yoga Mat Set',
      brand: 'FitGear',
      category: 'Sports',
      price: 1999,
      originalPrice: 3499,
      rating: 4.6,
      reviews: 765,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop',
      trending: false,
      new: false
    },
    {
      id: 'p10',
      title: 'Minimalist Backpack',
      brand: 'UrbanWear',
      category: 'Fashion',
      price: 2499,
      originalPrice: 3999,
      rating: 4.5,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      trending: false,
      new: false
    },
    {
      id: 'p11',
      title: 'Bluetooth Speaker Pro',
      brand: 'TechPro',
      category: 'Electronics',
      price: 6999,
      originalPrice: 9999,
      rating: 4.8,
      reviews: 1234,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
      badge: 'deal',
      trending: true,
      new: false
    },
    {
      id: 'p12',
      title: 'Ceramic Coffee Maker',
      brand: 'HomeEssence',
      category: 'Home',
      price: 4499,
      originalPrice: 6999,
      rating: 4.3,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=800&fit=crop',
      trending: false,
      new: false
    }
  ];
};

// UI Components
const createProductCard = (product) => {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.title}" loading="lazy">
      <div class="product-badges">
        ${product.badge === 'deal' ? '<span class="product-badge deal">Deal</span>' : ''}
        ${product.badge === 'new' ? '<span class="product-badge new">New</span>' : ''}
      </div>
      <div class="product-actions">
        <button class="product-action-btn wishlist-btn" data-id="${product.id}" aria-label="Add to wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
        <button class="product-action-btn compare-btn" data-id="${product.id}" aria-label="Add to compare">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-brand">${product.brand}</div>
      <h3 class="product-title">${product.title}</h3>
      <div class="product-rating">
        <span class="rating-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
        <span class="rating-count">(${product.reviews.toLocaleString()})</span>
      </div>
      <div class="product-price">
        <span class="current-price">${currency(product.price)}</span>
        <span class="original-price">${currency(product.originalPrice)}</span>
        <span class="discount-badge">${discount}% OFF</span>
      </div>
      <div class="product-cta">
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
      </div>
    </div>
  `;
  
  return card;
};

const createCategoryCard = (category) => {
  const images = {
    'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
    'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
    'Home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop',
    'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
    'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop'
  };
  
  const card = document.createElement('div');
  card.className = 'category-card';
  card.dataset.category = category.toLowerCase();
  card.innerHTML = `
    <img src="${images[category]}" alt="${category}">
    <div class="category-info">
      <h3>${category}</h3>
      <p>Explore collection →</p>
    </div>
  `;
  
  return card;
};

// Cart Functions
const addToCart = (productId) => {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = state.cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      id: productId,
      quantity: 1,
      price: product.price
    });
  }
  
  updateCartCount();
  saveToMemory();
  showToast('Added to cart successfully!', 'success');
};

const removeFromCart = (productId) => {
  state.cart = state.cart.filter(item => item.id !== productId);
  updateCartCount();
  saveToMemory();
  showToast('Removed from cart', 'success');
};

const updateCartQuantity = (productId, change) => {
  const item = state.cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity = Math.max(1, item.quantity + change);
  updateCartCount();
  saveToMemory();
};

const getCartTotal = () => {
  return state.cart.reduce((total, item) => {
    const product = state.products.find(p => p.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
};

const updateCartCount = () => {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
};

// Wishlist Functions
const addToWishlist = (productId) => {
  if (!state.wishlist.includes(productId)) {
    state.wishlist.push(productId);
    updateWishlistCount();
    saveToMemory();
    showToast('Added to wishlist!', 'success');
  } else {
    showToast('Already in wishlist', 'warning');
  }
};

const removeFromWishlist = (productId) => {
  state.wishlist = state.wishlist.filter(id => id !== productId);
  updateWishlistCount();
  saveToMemory();
  showToast('Removed from wishlist', 'success');
};

const updateWishlistCount = () => {
  document.getElementById('wishCount').textContent = state.wishlist.length;
};

// Compare Functions
const addToCompare = (productId) => {
  if (state.compareList.length >= 4) {
    showToast('Maximum 4 products can be compared', 'warning');
    return;
  }
  
  if (!state.compareList.includes(productId)) {
    state.compareList.push(productId);
    updateCompareCount();
    saveToMemory();
    showToast('Added to compare list!', 'success');
  } else {
    showToast('Already in compare list', 'warning');
  }
};

const removeFromCompare = (productId) => {
  state.compareList = state.compareList.filter(id => id !== productId);
  updateCompareCount();
  saveToMemory();
};

const updateCompareCount = () => {
  document.getElementById('compareCount').textContent = state.compareList.length;
};

// Modal Functions
const showModal = (content) => {
  const overlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = content;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const hideModal = () => {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

// Toast Notifications
const showToast = (message, type = 'success') => {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Product Detail Modal
const showProductDetail = (productId) => {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  const content = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
      <div>
        <img src="${product.image}" alt="${product.title}" style="width: 100%; border-radius: 16px;">
      </div>
      <div>
        <div style="font-size: 14px; color: #6366f1; font-weight: 600; margin-bottom: 8px;">${product.brand}</div>
        <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 16px;">${product.title}</h2>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <span style="color: #fbbf24; font-size: 18px;">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span style="color: #64748b;">${product.rating}/5 (${product.reviews.toLocaleString()} reviews)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
          <span style="font-size: 36px; font-weight: 800;">${currency(product.price)}</span>
          <span style="font-size: 20px; color: #94a3b8; text-decoration: line-through;">${currency(product.originalPrice)}</span>
          <span style="padding: 6px 12px; background: #ec4899; color: white; border-radius: 8px; font-weight: 700;">${discount}% OFF</span>
        </div>
        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <button onclick="addToCart('${product.id}'); hideModal();" style="flex: 1; padding: 16px; background: #6366f1; color: white; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; border: none;">Add to Cart</button>
          <button onclick="addToWishlist('${product.id}');" style="padding: 16px 24px; background: white; border: 2px solid #e2e8f0; border-radius: 12px; cursor: pointer;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px;">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>
        <div style="padding: 24px; background: #f1f5f9; border-radius: 12px;">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">Product Highlights</h3>
          <ul style="list-style: none; padding: 0; display: grid; gap: 8px;">
            <li style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #10b981;">✓</span> Free Shipping
            </li>
            <li style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #10b981;">✓</span> 30-Day Returns
            </li>
            <li style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #10b981;">✓</span> 1 Year Warranty
            </li>
            <li style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #10b981;">✓</span> Cash on Delivery Available
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  showModal(content);
};

// Cart Modal
const showCartModal = () => {
  if (state.cart.length === 0) {
    showModal('<div style="text-align: center; padding: 60px 20px;"><h2 style="font-size: 24px; margin-bottom: 16px;">Your cart is empty</h2><p style="color: #64748b; margin-bottom: 24px;">Add some products to get started!</p><button onclick="hideModal()" style="padding: 12px 32px; background: #6366f1; color: white; border-radius: 50px; font-weight: 600; cursor: pointer; border: none;">Continue Shopping</button></div>');
    return;
  }
  
  const cartItems = state.cart.map(item => {
    const product = state.products.find(p => p.id === item.id);
    if (!product) return '';
    
    return `
      <div style="display: flex; gap: 20px; padding: 20px; background: #f8fafc; border-radius: 16px; margin-bottom: 16px;">
        <img src="${product.image}" alt="${product.title}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 12px;">
        <div style="flex: 1;">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${product.title}</h3>
          <div style="font-size: 20px; font-weight: 800; color: #6366f1; margin-bottom: 12px;">${currency(product.price)}</div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="updateCartQuantity('${item.id}', -1); showCartModal();" style="width: 32px; height: 32px; border-radius: 8px; background: white; border: 1px solid #e2e8f0; cursor: pointer;">-</button>
            <span style="font-weight: 600; min-width: 24px; text-align: center;">${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.id}', 1); showCartModal();" style="width: 32px; height: 32px; border-radius: 8px; background: white; border: 1px solid #e2e8f0; cursor: pointer;">+</button>
            <button onclick="removeFromCart('${item.id}'); showCartModal();" style="margin-left: auto; padding: 8px 16px; background: #ef4444; color: white; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none;">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  const total = getCartTotal();
  
  const content = `
    <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 24px;">Shopping Cart</h2>
    ${cartItems}
    <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
        <span style="font-size: 18px; font-weight: 600;">Subtotal:</span>
        <span style="font-size: 24px; font-weight: 800;">${currency(total)}</span>
      </div>
      <div style="display: flex; gap: 12px;">
        <button onclick="hideModal()" style="flex: 1; padding: 16px; background: white; border: 2px solid #e2e8f0; border-radius: 12px; font-weight: 600; cursor: pointer;">Continue Shopping</button>
        <button onclick="showCheckout()" style="flex: 1; padding: 16px; background: #6366f1; color: white; border-radius: 12px; font-weight: 600; cursor: pointer; border: none;">Proceed to Checkout</button>
      </div>
    </div>
  `;
  
  showModal(content);
};

// Checkout Modal
const showCheckout = () => {
  const total = getCartTotal();
  
  const content = `
    <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 24px;">Checkout</h2>
    <div style="display: grid; grid-template-columns: 1fr 400px; gap: 40px;">
      <div>
        <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Delivery Information</h3>
        <form id="checkoutForm" style="display: grid; gap: 16px;">
          <input type="text" placeholder="Full Name" required style="padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px;">
          <input type="email" placeholder="Email" required style="padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px;">
          <input type="tel" placeholder="Phone Number" required style="padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px;">
          <input type="text" placeholder="Address Line 1" required style="padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px;">
          <input type="text" placeholder="City" required style="padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px;">
          <input type="text" placeholder="PIN Code" required style="padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px;">
          
          <h3 style="font-size: 20px; font-weight: 700; margin-top: 16px;">Payment Method</h3>
          <label style="padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer;">
            <input type="radio" name="payment" value="cod" checked style="width: 20px; height: 20px;">
            <span style="font-weight: 600;">Cash on Delivery</span>
          </label>
          <label style="padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer;">
            <input type="radio" name="payment" value="card" style="width: 20px; height: 20px;">
            <span style="font-weight: 600;">Card Payment (Demo)</span>
          </label>
        </form>
      </div>
      <div>
        <div style="padding: 24px; background: #f8fafc; border-radius: 16px;">
          <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span>Subtotal:</span>
            <span style="font-weight: 600;">${currency(total)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span>Shipping:</span>
            <span style="color: #10b981; font-weight: 600;">FREE</span>
          </div>
          <div style="border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between;">
            <span style="font-size: 20px; font-weight: 700;">Total:</span>
            <span style="font-size: 24px; font-weight: 800;">${currency(total)}</span>
          </div>
          <button onclick="placeOrder()" style="width: 100%; padding: 16px; background: #6366f1; color: white; border-radius: 12px; font-weight: 600; font-size: 16px; margin-top: 20px; cursor: pointer; border: none;">Place Order</button>
        </div>
      </div>
    </div>
  `;
  
  showModal(content);
};

// Place Order
const placeOrder = () => {
  const orderId = 'ORD' + Date.now();
  const orderDate = new Date().toISOString();
  
  state.orders.unshift({
    id: orderId,
    date: orderDate,
    items: [...state.cart],
    total: getCartTotal(),
    status: 'Processing'
  });
  
  state.cart = [];
  updateCartCount();
  saveToMemory();
  
  const content = `
    <div style="text-align: center; padding: 40px 20px;">
      <div style="width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" style="width: 40px; height: 40px;">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 12px;">Order Placed Successfully!</h2>
      <p style="font-size: 18px; color: #64748b; margin-bottom: 8px;">Order ID: <strong>${orderId}</strong></p>
      <p style="color: #64748b; margin-bottom: 32px;">You will receive a confirmation email shortly</p>
      <button onclick="hideModal()" style="padding: 16px 32px; background: #6366f1; color: white; border-radius: 50px; font-weight: 600; cursor: pointer; border: none; font-size: 16px;">Continue Shopping</button>
    </div>
  `;
  
  showModal(content);
  showToast('Order placed successfully!', 'success');
};

// Filter and Sort Products
const filterProducts = (filter) => {
  state.currentFilter = filter;
  renderProducts();
};

const sortProducts = (sortType) => {
  state.currentSort = sortType;
  renderProducts();
};

const getFilteredProducts = () => {
  let products = [...state.products];
  
  // Apply filter
  if (state.currentFilter === 'trending') {
    products = products.filter(p => p.trending);
  } else if (state.currentFilter === 'top-rated') {
    products = products.sort((a, b) => b.rating - a.rating);
  } else if (state.currentFilter === 'new') {
    products = products.filter(p => p.new);
  }
  
  // Apply sort
  if (state.currentSort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (state.currentSort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  }
  
  return products;
};

// Render Functions
const renderProducts = () => {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  const products = getFilteredProducts();
  grid.innerHTML = '';
  
  products.slice(0, 8).forEach(product => {
    grid.appendChild(createProductCard(product));
  });
};

const renderCategories = () => {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  
  state.categories.forEach(category => {
    grid.appendChild(createCategoryCard(category));
  });
};

const renderDealsCarousel = () => {
  const carousel = document.getElementById('dealsCarousel');
  if (!carousel) return;
  
  const dealProducts = state.products.filter(p => p.badge === 'deal');
  
  dealProducts.forEach(product => {
    carousel.appendChild(createProductCard(product));
  });
};

const renderBrands = () => {
  const grid = document.getElementById('brandsGrid');
  if (!grid) return;
  
  state.brands.forEach(brand => {
    const card = document.createElement('div');
    card.className = 'brand-card';
    card.textContent = brand;
    card.onclick = () => showToast(`Showing ${brand} products`, 'success');
    grid.appendChild(card);
  });
};

const renderTrendingTags = () => {
  const container = document.getElementById('trendTags');
  if (!container) return;
  
  state.trendingSearches.forEach(term => {
    const tag = document.createElement('button');
    tag.className = 'trend-tag';
    tag.textContent = term;
    tag.onclick = () => {
      document.getElementById('searchInput').value = term;
      showToast(`Searching for "${term}"`, 'success');
    };
    container.appendChild(tag);
  });
};

// Countdown Timer
const startDealTimer = () => {
  const endTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
  
  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = endTime - now;
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    
    if (distance < 0) {
      clearInterval(timerInterval);
    }
  };
  
  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
};

// Event Handlers
const handleHeaderScroll = () => {
  const header = document.querySelector('.main-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

const handleBannerClose = () => {
  const banner = document.querySelector('.top-banner');
  if (banner) {
    banner.style.display = 'none';
  }
};

// Initialize App
const init = () => {
  loadFromMemory();
  initProducts();
  
  // Render initial content
  renderCategories();
  renderProducts();
  renderDealsCarousel();
  renderBrands();
  renderTrendingTags();
  
  // Update counts
  updateCartCount();
  updateWishlistCount();
  updateCompareCount();
  
  // Start countdown timer
  startDealTimer();
  
  // Event Listeners
  window.addEventListener('scroll', handleHeaderScroll);
  
  // Banner close
  const bannerClose = document.querySelector('.banner-close');
  if (bannerClose) {
    bannerClose.addEventListener('click', handleBannerClose);
  }
  
  // Search trigger
  const searchTrigger = document.getElementById('searchTrigger');
  const searchBar = document.getElementById('searchBar');
  const searchClose = document.getElementById('searchClose');
  
  if (searchTrigger && searchBar) {
    searchTrigger.addEventListener('click', () => {
      searchBar.classList.add('active');
      document.getElementById('searchInput').focus();
    });
  }
  
  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchBar.classList.remove('active');
    });
  }
  
  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileSidebar = document.getElementById('mobileSidebar');
  const sidebarClose = document.getElementById('sidebarClose');
  
  if (mobileMenuBtn && mobileSidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileSidebar.classList.add('active');
    });
  }
  
  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      mobileSidebar.classList.remove('active');
    });
  }
  
  // Header action buttons
  const wishlistBtn = document.getElementById('wishlistBtn');
  const cartBtn = document.getElementById('cartBtn');
  const compareBtn = document.getElementById('compareBtn');
  
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const wishlistProducts = state.wishlist.map(id => state.products.find(p => p.id === id)).filter(Boolean);
      const content = `
        <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 24px;">My Wishlist</h2>
        ${wishlistProducts.length === 0 ? '<p style="text-align: center; color: #64748b; padding: 40px;">Your wishlist is empty</p>' : ''}
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
          ${wishlistProducts.map(p => `
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <img src="${p.image}" alt="${p.title}" style="width: 100%; aspect-ratio: 1; object-fit: cover;">
              <div style="padding: 16px;">
                <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${p.title}</h3>
                <div style="font-size: 20px; font-weight: 800; color: #6366f1; margin-bottom: 12px;">${currency(p.price)}</div>
                <div style="display: flex; gap: 8px;">
                  <button onclick="addToCart('${p.id}'); showToast('Added to cart!', 'success');" style="flex: 1; padding: 10px; background: #6366f1; color: white; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; font-size: 14px;">Add to Cart</button>
                  <button onclick="removeFromWishlist('${p.id}'); wishlistBtn.click();" style="padding: 10px 14px; background: #ef4444; color: white; border-radius: 8px; cursor: pointer; border: none;">×</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      showModal(content);
    });
  }
  
  if (cartBtn) {
    cartBtn.addEventListener('click', showCartModal);
  }
  
  if (compareBtn) {
    compareBtn.addEventListener('click', () => {
      const compareProducts = state.compareList.map(id => state.products.find(p => p.id === id)).filter(Boolean);
      const content = `
        <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 24px;">Compare Products</h2>
        ${compareProducts.length === 0 ? '<p style="text-align: center; color: #64748b; padding: 40px;">No products to compare</p>' : ''}
        <div style="display: grid; grid-template-columns: repeat(${compareProducts.length}, 1fr); gap: 20px;">
          ${compareProducts.map(p => `
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
              <img src="${p.image}" alt="${p.title}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
              <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${p.title}</h3>
              <div style="font-size: 20px; font-weight: 800; color: #6366f1; margin-bottom: 12px;">${currency(p.price)}</div>
              <div style="margin-bottom: 12px;">
                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Rating</div>
                <div style="color: #fbbf24; font-weight: 600;">${p.rating}/5</div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Brand</div>
                <div style="font-weight: 600;">${p.brand}</div>
              </div>
              <button onclick="removeFromCompare('${p.id}'); compareBtn.click();" style="width: 100%; padding: 10px; background: #ef4444; color: white; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; margin-top: 12px;">Remove</button>
            </div>
          `).join('')}
        </div>
      `;
      showModal(content);
    });
  }
  
  // Modal close
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  
  if (modalClose) {
    modalClose.addEventListener('click', hideModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        hideModal();
      }
    });
  }
  
  // Filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const filter = e.target.dataset.filter;
      const sort = e.target.dataset.sort;
      
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      
      if (filter) {
        filterProducts(filter);
      }
      
      if (sort) {
        sortProducts(sort);
      }
    });
  });
  
  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing!', 'success');
      newsletterForm.reset();
    });
  }
  
  // Event delegation for dynamic elements
  document.addEventListener('click', (e) => {
    // Add to cart
    if (e.target.closest('.add-to-cart-btn')) {
      const productId = e.target.closest('.add-to-cart-btn').dataset.id;
      addToCart(productId);
    }
    
    // Wishlist
    if (e.target.closest('.wishlist-btn')) {
      const productId = e.target.closest('.wishlist-btn').dataset.id;
      addToWishlist(productId);
    }
    
    // Compare
    if (e.target.closest('.compare-btn')) {
      const productId = e.target.closest('.compare-btn').dataset.id;
      addToCompare(productId);
    }
    
    // Quick view
    if (e.target.closest('.quick-view-btn')) {
      const productId = e.target.closest('.quick-view-btn').dataset.id;
      showProductDetail(productId);
    }
    
    // Product card click (for quick view)
    if (e.target.closest('.product-card') && !e.target.closest('button')) {
      const card = e.target.closest('.product-card');
      const productId = card.querySelector('[data-id]')?.dataset.id;
      if (productId) {
        showProductDetail(productId);
      }
    }
    
    // Category cards
    if (e.target.closest('.category-card')) {
      const category = e.target.closest('.category-card').dataset.category;
      showToast(`Showing ${category} products`, 'success');
    }
    
    // Route navigation
    if (e.target.closest('[data-route]')) {
      const route = e.target.closest('[data-route]').dataset.route;
      if (route === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        hideModal();
        if (mobileSidebar) mobileSidebar.classList.remove('active');
      }
    }
  });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}