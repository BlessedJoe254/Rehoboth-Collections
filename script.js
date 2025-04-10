// Product Data
const products = [{
        id: 1,
        name: "Maroon Blazer",
        price: 800,
        image: "images/blazzer.jpg",
        description: "Premium quality formal blazer"
    },
    {
        id: 2,
        name: "Orange Summer Dress",
        price: 49.99,
        image: "images/dress.jpg",
        description: "Lightweight summer dress"
    },
    {
        id: 3,
        name: "Black Denim Jeans",
        price: 59.99,
        image: "images/jeans.jpg",
        description: "Classic slim-fit jeans"
    },
    {
        id: 4,
        name: "casual shoe",
        price: 1500,
        image: "images/jeans.jpg",
        description: "Classic slim-fit jeans"
    }


];

// Cart
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const cartCount = document.querySelector('.cart-count');

// Display Products
function displayProducts() {
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productEl);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to Cart
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    // Check if already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// Update Cart Display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty">Your cart is empty</p>';
        totalPrice.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
        `;
        cartItems.appendChild(cartItemEl);
    });

    // Update total
    totalPrice.textContent = total.toFixed(2);

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Remove from Cart
function removeFromCart(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Initialize
displayProducts();

// Checkout button
document.querySelector('.checkout').addEventListener('click', () => {
    if (cart.length > 0) {
        alert(`Thank you for your purchase! Total: $${totalPrice.textContent}`);
        cart = [];
        updateCart();
    } else {
        alert('Your cart is empty!');
    }
});