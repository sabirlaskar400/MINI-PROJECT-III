// ==================== CART MANAGEMENT SYSTEM ====================

// Cart Manager using Session-based storage (workaround without localStorage)
const CartManager = {
    storageKey: 'ecommerce_cart',
    
    // Initialize cart from sessionStorage-like approach using cookies
    init: function() {
        // Try to load from cookie
        const cartData = this.getCookie(this.storageKey);
        if (cartData) {
            try {
                cart = JSON.parse(decodeURIComponent(cartData));
            } catch (e) {
                cart = [];
            }
        }
        return cart;
    },
    
    // Save cart to cookie (as workaround)
    save: function() {
        const cartString = encodeURIComponent(JSON.stringify(cart));
        this.setCookie(this.storageKey, cartString, 1); // 1 day expiry
    },
    
    // Set cookie
    setCookie: function(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },
    
    // Get cookie
    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
};

// Cart array to store products
let cart = [];

// Load cart
function loadCart() {
    cart = CartManager.init();
    return cart;
}

// Save cart
function saveCart() {
    CartManager.save();
    updateCartUI();
}

// Add product to cart
function addToCart(product) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => 
        item.name === product.name && item.brand === product.brand
    );
    
    if (existingProduct) {
        // If product exists, increase quantity
        existingProduct.quantity += 1;
    } else {
        // Add new product with quantity 1
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    showCartNotification(product.name);
}

// Remove product from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartPage();
}

// Update product quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = parseInt(newQuantity);
        saveCart();
        renderCartPage();
    }
}

// Calculate subtotal for a product
function calculateSubtotal(price, quantity) {
    const priceValue = parseFloat(price.replace('$', ''));
    return (priceValue * quantity).toFixed(2);
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => {
        const priceValue = parseFloat(item.price.replace('$', ''));
        return total + (priceValue * item.quantity);
    }, 0).toFixed(2);
}

// Update cart icon badge
function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart icon badge
    let cartBadge = document.querySelector('.cart-badge');
    const cartIcon = document.querySelector('#navbar li a[href="cart.html"]');
    
    if (!cartBadge && cartIcon) {
        // Create badge if it doesn't exist
        cartBadge = document.createElement('span');
        cartBadge.className = 'cart-badge';
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(cartBadge);
    }
    
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// Show notification when product is added
function showCartNotification(productName) {
    // Remove existing notification if any
    const existingNotif = document.querySelector('.cart-notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} added to cart!</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Render cart page (for cart.html)
function renderCartPage() {
    const cartTableBody = document.querySelector('#cart tbody');
    
    if (!cartTableBody) return;
    
    // Load fresh cart data
    loadCart();
    
    if (cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <i class="fas fa-shopping-cart" style="font-size: 60px; color: #cce7d0; margin-bottom: 20px;"></i>
                        <h3 style="color: #222; margin-bottom: 10px;">Your cart is empty</h3>
                        <p style="color: #606063; margin-bottom: 20px;">Add some products to get started!</p>
                        <a href="shop.html" style="display: inline-block; padding: 12px 30px; background-color: #088178; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600;">Continue Shopping</a>
                    </div>
                </td>
            </tr>
        `;
        updateCartSummary();
        return;
    }
    
    cartTableBody.innerHTML = cart.map((item, index) => `
        <tr>
            <td><i class="far fa-times-circle" onclick="removeFromCart(${index})" style="cursor: pointer; color: #e74c3c; font-size: 20px; transition: 0.2s;" onmouseover="this.style.color='#c0392b'" onmouseout="this.style.color='#e74c3c'"></i></td>
            <td><img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70x70?text=No+Image'"></td>
            <td><strong>${item.brand}</strong> - ${item.name}</td>
            <td><strong>${item.price}</strong></td>
            <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" style="width: 60px; padding: 8px; border: 2px solid #cce7d0; border-radius: 4px; text-align: center;"></td>
            <td><strong style="color: #088178;">$${calculateSubtotal(item.price, item.quantity)}</strong></td>
        </tr>
    `).join('');
    
    updateCartSummary();
}

// Update cart summary section
function updateCartSummary() {
    let cartSummary = document.querySelector('#cart-summary');
    
    // Create cart summary if it doesn't exist
    if (!cartSummary && document.querySelector('#cart')) {
        cartSummary = document.createElement('section');
        cartSummary.id = 'cart-summary';
        cartSummary.className = 'section-p1';
        document.querySelector('#cart').after(cartSummary);
    }
    
    if (cartSummary && cart.length > 0) {
        const subtotal = calculateCartTotal();
        const shipping = 10.00; // Fixed shipping cost
        const total = (parseFloat(subtotal) + shipping).toFixed(2);
        
        cartSummary.innerHTML = `
            <div class="cart-summary-container">
                <div class="coupon-section">
                    <h3>Apply Coupon</h3>
                    <div class="coupon-input">
                        <input type="text" placeholder="Enter your coupon code" id="couponInput">
                        <button class="normal" onclick="applyCoupon()">Apply</button>
                    </div>
                </div>
                
                <div class="cart-total-section">
                    <h3>Cart Totals</h3>
                    <table>
                        <tr>
                            <td>Cart Subtotal</td>
                            <td>$${subtotal}</td>
                        </tr>
                        <tr>
                            <td>Shipping</td>
                            <td>$${shipping.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><strong>Total</strong></td>
                            <td><strong style="color: #088178; font-size: 18px;">$${total}</strong></td>
                        </tr>
                    </table>
                    <button class="normal" onclick="proceedToCheckout()" style="background-color: #088178; color: #fff; width: 100%; margin-top: 10px;">Proceed to Checkout</button>
                </div>
            </div>
        `;
    } else if (cartSummary && cart.length === 0) {
        cartSummary.innerHTML = '';
    }
}

// Apply coupon
function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const code = couponInput.value.trim().toUpperCase();
    
    if (code === 'SAVE10') {
        showCartNotification('Coupon applied! 10% discount');
    } else if (code === '') {
        alert('Please enter a coupon code');
    } else {
        alert('Invalid coupon code');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout with ' + cart.length + ' item(s)!\nTotal: $' + (parseFloat(calculateCartTotal()) + 10).toFixed(2));
    // Here you would redirect to checkout page
    // window.location.href = 'checkout.html';
}

// Add "Add to Cart" buttons to all products
function initializeProducts() {
    // For index.html and shop.html - add cart buttons to products
    const productContainers = document.querySelectorAll('.pro');
    
    productContainers.forEach((productDiv, index) => {
        // Check if cart button already exists
        if (productDiv.querySelector('.cart')) return;
        
        // Get product information
        const brand = productDiv.querySelector('.des span')?.textContent || 'Unknown';
        const name = productDiv.querySelector('.des h5')?.textContent || 'Unknown Product';
        const price = productDiv.querySelector('.des h4')?.textContent || '$0';
        const image = productDiv.querySelector('img')?.src || '';
        const rating = productDiv.querySelectorAll('.star i.fas').length || 0;
        
        const product = {
            brand,
            name,
            price,
            image,
            rating
        };
        
        // Create cart button
        const cartBtn = document.createElement('a');
        cartBtn.className = 'cart';
        cartBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
        cartBtn.onclick = function(e) {
            e.stopPropagation(); // Prevent product click event
            e.preventDefault();
            addToCart(product);
        };
        
        productDiv.appendChild(cartBtn);
    });
    
    // For search results
    const searchResults = document.querySelectorAll('.search-result-item');
    searchResults.forEach((productDiv) => {
        if (productDiv.querySelector('.cart')) return;
        
        const brand = productDiv.querySelector('.des span')?.textContent || 'Unknown';
        const name = productDiv.querySelector('.des h5')?.textContent || 'Unknown Product';
        const price = productDiv.querySelector('.des h4')?.textContent || '$0';
        const image = productDiv.querySelector('img')?.src || '';
        const rating = productDiv.querySelectorAll('.star i.fas').length || 0;
        
        const product = {
            brand,
            name,
            price,
            image,
            rating
        };
        
        const cartBtn = document.createElement('a');
        cartBtn.className = 'cart';
        cartBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
        cartBtn.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            addToCart(product);
        };
        
        productDiv.appendChild(cartBtn);
    });
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        renderCartPage();
        showCartNotification('Cart cleared!');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from cookie storage
    loadCart();
    
    // Update cart UI
    updateCartUI();
    
    // If on cart page, render cart
    if (document.querySelector('#cart')) {
        renderCartPage();
    }
    
    // Initialize products with cart buttons
    setTimeout(initializeProducts, 100);
    
    // Re-initialize products after search results are displayed
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        const originalClick = searchBtn.onclick;
        searchBtn.addEventListener('click', function() {
            setTimeout(initializeProducts, 200);
        });
    }
    
    // Also check for search input enter key
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                setTimeout(initializeProducts, 200);
            }
        });
    }
});

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    /* Cart Badge */
    .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: #e74c3c;
        color: #fff;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        animation: cartBadgePulse 0.3s ease;
    }
    
    @keyframes cartBadgePulse {
        0% { transform: scale(0.8); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    /* Cart Notification */
    .cart-notification {
        position: fixed;
        top: 100px;
        right: -350px;
        background: linear-gradient(135deg, #088178 0%, #066e66 100%);
        color: #fff;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(8, 129, 120, 0.4);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: right 0.3s ease;
        min-width: 280px;
    }
    
    .cart-notification.show {
        right: 20px;
    }
    
    .cart-notification i {
        font-size: 22px;
    }
    
    .cart-notification span {
        font-weight: 600;
        font-size: 14px;
    }
    
    /* Cart Summary Section */
    #cart-summary {
        padding: 40px 80px;
        background-color: #f9f9f9;
    }
    
    .cart-summary-container {
        display: flex;
        justify-content: space-between;
        gap: 40px;
        flex-wrap: wrap;
    }
    
    .coupon-section {
        flex: 1;
        min-width: 300px;
        background-color: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .coupon-section h3 {
        font-size: 18px;
        margin-bottom: 15px;
        color: #222;
    }
    
    .coupon-input {
        display: flex;
        gap: 10px;
    }
    
    .coupon-input input {
        flex: 1;
        padding: 12px 15px;
        border: 2px solid #cce7d0;
        border-radius: 4px;
        font-size: 14px;
    }
    
    .coupon-input input:focus {
        outline: none;
        border-color: #088178;
    }
    
    .cart-total-section {
        flex: 1;
        min-width: 300px;
        border: 2px solid #088178;
        padding: 30px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 10px rgba(8, 129, 120, 0.1);
    }
    
    .cart-total-section h3 {
        font-size: 18px;
        margin-bottom: 20px;
        color: #222;
        border-bottom: 2px solid #cce7d0;
        padding-bottom: 10px;
    }
    
    .cart-total-section table {
        width: 100%;
        margin-bottom: 20px;
    }
    
    .cart-total-section table tr {
        border-bottom: 1px solid #e2e9e1;
    }
    
    .cart-total-section table tr:last-child {
        border-bottom: 2px solid #088178;
        border-top: 2px solid #088178;
    }
    
    .cart-total-section table td {
        padding: 12px 0;
        font-size: 15px;
    }
    
    .cart-total-section table td:last-child {
        text-align: right;
        color: #088178;
        font-weight: 600;
    }
    
    .cart-total-section button {
        width: 100%;
        background-color: #088178;
        color: #fff;
        padding: 15px;
        font-size: 16px;
        transition: 0.3s;
    }
    
    .cart-total-section button:hover {
        background-color: #066e66;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(8, 129, 120, 0.3);
    }
    
    /* Cart table improvements */
    #cart table tbody tr td {
        vertical-align: middle;
        padding: 20px 15px !important;
    }
    
    #cart table tbody tr {
        transition: 0.2s;
    }
    
    #cart table tbody tr:hover {
        background-color: #f5f5f5;
    }
    
    #cart table input[type="number"] {
        border: 2px solid #cce7d0;
        border-radius: 4px;
        text-align: center;
        font-weight: 600;
    }
    
    #cart table input[type="number"]:focus {
        outline: none;
        border-color: #088178;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        #cart-summary {
            padding: 20px;
        }
        
        .cart-summary-container {
            flex-direction: column;
        }
        
        .coupon-section,
        .cart-total-section {
            min-width: 100%;
        }
    }
`;
document.head.appendChild(style);