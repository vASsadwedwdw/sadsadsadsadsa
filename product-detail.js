import { createApp } from 'vue';

const app = createApp({
    data() {
        return {
            product: null,
            cart: JSON.parse(localStorage.getItem('cart') || '[]'),
            showCartDropdown: false,
            currentTab: 'characteristics',
            categories: []
        };
    },
    watch: {
        cart: {
            handler(newCart) {
                localStorage.setItem('cart', JSON.stringify(newCart));
            },
            deep: true
        }
    },
    mounted() {
        this.loadCategories();
        this.loadProductData();
        document.body.style.display = '';
    },
    computed: {
        cartCount() {
            return this.cart.length;
        },
        cartTotal() {
            return this.cart.reduce((sum, item) => sum + item.price, 0);
        }
    },
    methods: {
        loadProductData() {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            
            if (!productId) {
                window.location.href = 'index.html';
                return;
            }
            
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                const allProducts = JSON.parse(storedProducts);
                this.product = allProducts.find(p => p.id === productId);
                
                if (!this.product) {
                    window.location.href = 'index.html';
                }
                
                if (!this.product.specs) {
                    this.product.specs = [];
                }
            } else {
                window.location.href = 'index.html';
            }
        },
        loadCategories() {
            const storedCategories = localStorage.getItem('categories');
            if (storedCategories) {
                this.categories = JSON.parse(storedCategories);
            } else {
                this.categories = ['Популярное', 'Устройства', 'Жидкости', 'Аксессуары', 'Акции'];
                localStorage.setItem('categories', JSON.stringify(this.categories));
            }
        },
        getCategoryName(categoryValue) {
            const categoryMap = {
                'popular': 'Популярное',
                'devices': 'Устройства',
                'liquids': 'Жидкости',
                'accessories': 'Аксессуары',
                'sales': 'Акции'
            };
            return categoryMap[categoryValue] || 'Неизвестная категория';
        },
        addToCart(product) {
            this.cart.push({...product});
            this.showCartDropdown = true;
        },
        showCart() {
            this.showCartDropdown = !this.showCartDropdown;
        },
        removeFromCart(index) {
            this.cart.splice(index, 1);
        },
        proceedToCheckout() {
            window.location.href = 'checkout.html';
        },
        returnToShop() {
            window.location.href = 'index.html';
        }
    }
});

app.mount('#app');