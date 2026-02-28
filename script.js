// LaptopZone - Shared JavaScript

// Product Data
const products = [
    {
        id: 1,
        name: "MacBook Pro M3 Max",
        image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-pro-14-space-black-202310?wid=4520&hei=3400&fmt=png-alpha&.v=1699551101700",
        specs: ["M3 Max Chip", "32GB RAM", "1TB SSD"],
        price: 45000000,
        discount: 5000000,
        badge: "TERBARU"
    },
    {
        id: 2,
        name: "ASUS ROG Strix G16",
        image: "https://dlcdnwebimgs.asus.com/gain/75713F90-1E93-4F2B-AE41-190I156V523F/w185/f_webp",
        specs: ["Intel i9-13980HX", "RTX 4070", "32GB RAM"],
        price: 35000000,
        discount: 3000000,
        badge: "BEST SELLER"
    },
    {
        id: 3,
        name: "Dell XPS 15 OLED",
        image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-series/xps-15-9530/media-gallery/black/fy22_xps_15_cn_750tks_by_bk_web.jpg?wid=600&hei=400&fmt=pjpg",
        specs: ["Intel i7-13700H", "RTX 4060", "16GB RAM"],
        price: 28000000,
        discount: 2000000,
        badge: "HOT"
    },
    {
        id: 4,
        name: "HP Spectre x360",
        image: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08375185.png",
        specs: ["Intel i7-1355U", "Touchscreen", "16GB RAM"],
        price: 22000000,
        discount: 1500000,
        badge: ""
    },
    {
        id: 5,
        name: "Lenovo ThinkPad X1 Carbon",
        image: "https://pwww6.lenovo.com/transform/w_0.5,h_0.5,q_auto:best,c_limit/media/system/asset/4POr7n4VtZpRqlC8jEnGQI/4ce76c8c4f1f0f0e552c6fc5fc2b72a8/Lenovo_ThinkPad_X1_Carbon_Gen_11_hero.jpg",
        specs: ["Intel i7-1365U", "32GB RAM", "1TB SSD"],
        price: 26000000,
        discount: 2500000,
        badge: "PREMIUM"
    },
    {
        id: 6,
        name: "Acer Predator Helios 18",
        image: "https://static.acer.com/up/2023/10/20231003152934_49922_800x600.png",
        specs: ["Intel i9-14900HX", "RTX 4090", "64GB RAM"],
        price: 55000000,
        discount: 5000000,
        badge: "ULTIMATE"
    }
];

// Cart - use localStorage to persist across pages
function getCart() {
    const cartData = localStorage.getItem('laptopzone_cart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem('laptopzone_cart', JSON.stringify(cart));
}

let cart = getCart();

// Format Rupiah
function formatRupiah(number) {
    return number.toLocaleString('id-ID');
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => {
        const discountedPrice = product.price - product.discount;
        return `
            <div class="product-card">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Laptop'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-specs">
                        ${product.specs.map(spec => `<span class="spec"><i class="fas fa-check"></i> ${spec}</span>`).join('')}
                    </div>
                    <div class="product-price">
                        <div class="price">
                            Rp ${formatRupiah(discountedPrice)}
                            ${product.discount > 0 ? `<span>Rp ${formatRupiah(product.price)}</span>` : ''}
                        </div>
<button class="add-to-cart" onclick="addToCartAndOpen(${product.id})">
                            <i class="fas fa-cart-plus"></i> Beli
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Add to Cart and Open Modal
function addToCartAndOpen(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            price: product.price - product.discount
        });
    }
    
    saveCart(cart);
    updateCart();
    showNotification(`${product.name} ditambahkan ke keranjang!`);
    openCheckout();
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            price: product.price - product.discount
        });
    }
    
    saveCart(cart);
    updateCart();
    showNotification(`${product.name} ditambahkan ke keranjang!`);
}

// Open Checkout Modal
function openCheckout() {
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCart();
}

// Update Cart
function updateCart() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (!cartBadge) return;
    
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Render cart items
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Keranjang Anda kosong</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80?text=Laptop'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rp ${formatRupiah(item.price)} x ${item.quantity}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Calculate totals
    if (subtotalEl && taxEl && totalEl) {
        const subtotalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxValue = subtotalValue * 0.1;
        const totalValue = subtotalValue + taxValue;
        
        subtotalEl.textContent = `Rp ${formatRupiah(subtotalValue)}`;
        taxEl.textContent = `Rp ${formatRupiah(taxValue)}`;
        totalEl.textContent = `Rp ${formatRupiah(totalValue)}`;
    }
}

// Toggle Cart
function toggleCart() {
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    if (modal && overlay) {
        modal.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang Anda kosong!');
        return;
    }
    showNotification('Terima kasih! Pesanan Anda akan diproses.');
    cart = [];
    saveCart(cart);
    updateCart();
    toggleCart();
}

// Set active nav link
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Contact form handler
function handleContactForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    showNotification(`Terima kasih ${name}! Pesan Anda akan segera kami balas.`);
    event.target.reset();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
    setActiveNav();
});
