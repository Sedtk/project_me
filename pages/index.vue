<template>
    <div class="container-fluid">
      <div class="d-flex flex-column flex-md-row">
        <!-- Sidebar: Category Selection -->
        <div class="sidebar bg-light p-3">
          <h4>เลือกหมวดหมู่</h4>
          <div class="d-flex flex-column gap-3">
            <div v-for="category in categories" :key="category" class="form-check">
              <input type="checkbox" class="form-check-input" :id="category" v-model="selectedCategories" :value="category" />
              <label class="form-check-label ms-2" :for="category">
                {{ category.charAt(0).toUpperCase() + category.slice(1) }}
              </label>
            </div>
          </div>
        </div>
  
        <!-- Main Content: Products and Pagination -->
        <div class="main-content p-4" style="flex-grow: 1;">
          <h1 class="text-center mb-4">ร้านค้าออนไลน์</h1>
  
          <!-- Loading & Error States -->
          <div v-if="loading" class="text-center">
            <p>กำลังโหลดข้อมูล...</p>
          </div>
  
          <div v-if="error" class="text-center text-danger">
            <p>{{ error }}</p>
          </div>
  
          <!-- Product List -->
          <div v-if="!loading && !error" class="row">
            <div v-for="product in paginatedProducts" :key="product.id" class="col-12 col-sm-6 col-md-4 mb-4">
              <div class="card p-2">
                <img :src="product.thumbnail" class="card-img-top" :alt="product.title" style="height: 250px; object-fit: cover;">
                <div class="card-body p-2">
                  <h5 class="card-title" style="font-size: 1rem;">{{ product.title }}</h5>
                  <p class="card-text text-muted" style="font-size: 0.875rem;">{{ product.category }}</p>
                  <p class="card-text" style="font-size: 0.875rem;">{{ product.description }}</p>
                  <p class="card-text fw-bold" style="font-size: 1rem;">Price: ${{ product.price }}</p>
                  <button @click="openModal(product)" class="btn btn-success btn-sm">เพิ่มลงตะกร้า</button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Pagination Controls -->
          <nav aria-label="Product pagination" v-if="totalPages > 1">
            <ul class="pagination justify-content-center mt-4">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              <li v-if="currentPage > 2" class="page-item">
                <button class="page-link" @click="changePage(currentPage - 1)">{{ currentPage - 1 }}</button>
              </li>
              <li class="page-item active">
                <input v-model="currentPageInput" min="1" :max="totalPages" class="page-link" @change="handlePageInputChange" />
              </li>
              <li v-if="currentPage < totalPages - 1" class="page-item">
                <button class="page-link" @click="changePage(currentPage + 1)">{{ currentPage + 1 }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
            <div class="text-center mt-2">
              <small>แสดงหน้า {{ currentPage }} จากทั้งหมด {{ totalPages }} หน้า</small>
            </div>
          </nav>
        </div>
      </div>
  
      <!-- Modal for Quantity Selection -->
      <div v-if="isModalVisible" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">เลือกจำนวนสินค้า</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="d-flex">
                <img :src="selectedProduct?.thumbnail" class="img-fluid" style="max-width: 120px; object-fit: cover;">
                <div class="ms-3">
                  <h6>{{ selectedProduct?.title }}</h6>
                  <p class="text-muted">{{ selectedProduct?.category }}</p>
                  <p class="fw-bold">$ {{ selectedProduct?.price }}</p>
                </div>
              </div>
              <div class="mt-3">
                <label for="quantity">จำนวน:</label>
                <input type="number" v-model="quantity" id="quantity" min="1" :max="selectedProduct?.stock || 10" class="form-control">
                ยอดรวม: ${{ formattedTotalPrice }}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">ยกเลิก</button>
              <button type="button" class="btn btn-primary" @click="addToCartFromModal">ยืนยัน</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, inject } from 'vue';
  
  // Inject cart and addToCart function from parent
  const cart = inject('cart');
  const addToCart = inject('addToCart');
  
  // State management
  const categories = ref([]);
  const selectedCategories = ref([]);
  const products = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const currentPage = ref(1);
  const currentPageInput = ref(1);
  const itemsPerPage = ref(6);
  const quantity = ref(1);
  const isModalVisible = ref(false);
  const selectedProduct = ref(null);
  
  // Fetch data from API
  const { data, error: apiError, isFetching } = await useFetch('https://dummyjson.com/products?limit=50');
  
  // Handle loading and errors
  loading.value = isFetching;
  if (apiError.value) {
    error.value = apiError.value;
    loading.value = false;
  }
  
  // Populate products and categories
  products.value = data._rawValue?.products || [];
  categories.value = [...new Set(products.value.map(product => product.category))];
  
  // Filter products based on selected categories
  const filteredProducts = computed(() => {
    if (!selectedCategories.value.length) return products.value;
    return products.value.filter(product => selectedCategories.value.includes(product.category));
  });
  
  // Pagination logic
  const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value));
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredProducts.value.slice(start, start + itemsPerPage.value);
  });
  
  // Page change handler
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      currentPageInput.value = page;
    }
  };
  
  // Handle page input
  const handlePageInputChange = () => {
    const page = parseInt(currentPageInput.value);
    if (page >= 1 && page <= totalPages.value) {
      changePage(page);
    } else {
      currentPageInput.value = currentPage.value;
    }
  };
  
  // Modal logic
  const openModal = (product) => {
    selectedProduct.value = product;
    quantity.value = 1;
    isModalVisible.value = true;
  };
  const closeModal = () => {
    isModalVisible.value = false;
    selectedProduct.value = null;
  };
  
  // Calculate total price in modal
  const totalPrice = computed(() => {
    return selectedProduct.value ? selectedProduct.value.price * quantity.value : 0;
  });
  const formattedTotalPrice = computed(() => totalPrice.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  
  // Add to cart
  const addToCartFromModal = () => {
    if (selectedProduct.value) {
      addToCart(selectedProduct.value, quantity.value);
      closeModal();
    }
  };
  </script>
  
  <style scoped>
  /* Sidebar */
  .sidebar {
    width: 100%;
    max-width: 240px;
    height: 100vh;
    overflow-y: auto;
    position: sticky;
    top: 0;
  }
  
  /* Main content layout */
  .main-content {
    flex-grow: 1;
  }
  
  /* Form styling for category filter */
  .form-check {
    display: flex;
    align-items: center;
  }
  
  .form-check-input {
    margin-right: 10px;
  }
  
  /* Pagination Styling */
  .pagination input {
    width: 70px;
    height: 38px;
    text-align: center;
  }
  
  /* Modal Styling */
  .modal-body {
    display: flex;
    gap: 20px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: space-between;
  }
  
  /* Media queries for responsive design */
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
    }
    .main-content {
      padding-left: 0;
      padding-right: 0;
    }
  }
  </style>
  