import { createApp } from 'vue';

const app = createApp({
    data() {
        return {
            currentTab: 'products',
            allProducts: [],
            isEditing: false,
            editingIndex: -1,
            newProduct: {
                name: '',
                price: 0,
                emoji: '',
                image: '',
                description: '',
                category: 'popular',
                id: Date.now(),
                imageFile: null,
                specs: [],
                details: {
                    brand: 'Gang',
                    inStock: true,
                    strength: '',
                    flavor: '',
                    volume: '',
                    capacity: '',
                    additionalDescription: ''
                }
            },
            paymentSettings: {
                bankName: '',
                cardNumber: '',
                recipient: ''
            },
            categories: [],
            newCategory: '',
            currentLogo: localStorage.getItem('shopLogo') || '/default-logo.png'
        };
    },
    mounted() {
        this.loadProducts();
        this.loadPaymentSettings();
        this.loadCategories();
        document.body.style.display = ''; // Remove the initial "display: none"
    },
    methods: {
        loadCategories() {
            const storedCategories = localStorage.getItem('categories');
            if (storedCategories) {
                this.categories = JSON.parse(storedCategories);
            } else {
                this.categories = ['Популярное', 'Устройства', 'Жидкости', 'Аксессуары', 'Акции']; // Default categories
                this.saveCategories();
            }
        },
        addCategory() {
            if (this.newCategory) {
                this.categories.push(this.newCategory);
                this.saveCategories();
                this.newCategory = '';
            }
        },
        deleteCategory(index) {
            if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
                this.categories.splice(index, 1);
                this.saveCategories();
                //update products
                this.allProducts.forEach(product => {
                    product.category = 'popular';
                });
                this.saveProductsToStorage();
            }
        },
        saveCategories() {
            localStorage.setItem('categories', JSON.stringify(this.categories));
        },
        getCategoryValue(categoryName) {
            const categoryMap = {
                'Популярное': 'popular',
                'Устройства': 'devices',
                'Жидкости': 'liquids',
                'Аксессуары': 'accessories',
                'Акции': 'sales'
            };
            return categoryMap[categoryName] || 'popular';
        },
        loadProducts() {
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                this.allProducts = JSON.parse(storedProducts);
            }
        },
        loadPaymentSettings() {
            const settings = localStorage.getItem('paymentSettings');
            if (settings) {
                this.paymentSettings = JSON.parse(settings);
            }
        },
        editProduct(index) {
            this.isEditing = true;
            this.editingIndex = index;
            this.newProduct = JSON.parse(JSON.stringify(this.allProducts[index]));
            if (!this.newProduct.specs) {
                this.newProduct.specs = [];
            }
            if (!this.newProduct.details) {
                this.newProduct.details = {
                    brand: 'Gang',
                    inStock: true,
                    strength: '',
                    flavor: '',
                    volume: '',
                    capacity: '',
                    additionalDescription: ''
                };
            }
        },
        editProductPage(product) {
            // Add fields for product page customization
            if (!product.specs) {
                product.specs = [];
            }
            // The rest of the product details are already handled in the existing form
        },
        deleteProduct(index) {
            if (confirm('Вы уверены, что хотите удалить этот товар?')) {
                this.allProducts.splice(index, 1);
                this.saveProductsToStorage();
            }
        },
        cancelEdit() {
            this.isEditing = false;
            this.editingIndex = -1;
            this.resetNewProduct();
        },
        saveProduct() {
            if (!this.newProduct.name || !this.newProduct.price) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }

            if (this.newProduct.imageFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.newProduct.image = reader.result;
                    this.finalizeProductSave();
                };
                reader.readAsDataURL(this.newProduct.imageFile);
            } else {
                this.finalizeProductSave();
            }
        },
        finalizeProductSave() {
            const productData = {
                ...this.newProduct,
                details: {
                    ...this.newProduct.details,
                    brand: this.newProduct.details.brand || 'Gang',
                    inStock: true
                }
            };

            if (this.isEditing) {
                this.allProducts[this.editingIndex] = {...productData};
                this.isEditing = false;
                this.editingIndex = -1;
            } else {
                productData.id = Date.now();
                this.allProducts.push({...productData});
            }
            
            this.saveProductsToStorage();
            this.resetNewProduct();
        },
        addSpec() {
            if (!this.newProduct.specs) {
                this.newProduct.specs = [];
            }
            this.newProduct.specs.push({ name: '', value: '' });
        },
        removeSpec(index) {
            this.newProduct.specs.splice(index, 1);
        },
        resetNewProduct() {
            this.newProduct = {
                name: '',
                price: 0,
                emoji: '',
                image: '',
                description: '',
                category: 'popular',
                id: Date.now(),
                imageFile: null,
                specs: [],
                details: {
                    brand: 'Gang',
                    inStock: true,
                    strength: '',
                    flavor: '',
                    volume: '',
                    capacity: '',
                    additionalDescription: ''
                }
            };
        },
        saveProductsToStorage() {
            localStorage.setItem('products', JSON.stringify(this.allProducts));
        },
        savePaymentSettings() {
            localStorage.setItem('paymentSettings', JSON.stringify(this.persistence));
            alert('Настройки оплаты сохранены');
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.newProduct.imageFile = file;
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Just for preview
                    this.newProduct.image = reader.result;
                };
                reader.readAsDataURL(file);
            }
        },
        handleLogoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.currentLogo = reader.result;
                };
                reader.readAsDataURL(file);
            }
        },
        saveLogo() {
            localStorage.setItem('shopLogo', this.currentLogo);
            alert('Логотип успешно сохранен');
        }
    }
});

app.mount('#app');