<template>
  <div>
    <!-- Header with Cart Button -->
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <h1 class="navbar-brand">Store Shop</h1>
          <NuxtLink to="/" class="navbar-link">หน้าแรก</NuxtLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <!-- ตะกร้า -->
              <li class="nav-item">
                <button class="btn btn-light position-relative" @click="toggleCartModal">
                  ตะกร้า
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {{ cart.length }}
                    <span class="visually-hidden">สินค้าที่อยู่ในตะกร้า</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Cart Modal -->
    <div v-if="isCartModalVisible" class="modal fade show" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="false" style="display: block;">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content custom-modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cartModalLabel">รายการตะกร้าสินค้า</h5>
            <button type="button" class="btn-close" @click="toggleCartModal"></button>
          </div>

          <div class="modal-body">
            <div v-if="cart.length === 0" class="text-center">
              <p>ตะกร้าของคุณว่างเปล่า</p>
            </div>
            <div v-else>
              <!-- Select All Checkbox -->
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleSelectAll" id="selectAllCheckbox">
                <label class="form-check-label" for="selectAllCheckbox">
                  เลือกทั้งหมด ({{ selectedItemsCount }} / {{ cart.length }})
                </label>
              </div>

              <!-- Cart Items -->
              <ul class="list-group">
                <li v-for="(item, index) in cart" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center w-100">
                    <input class="form-check-input me-2" type="checkbox" v-model="item.selectedForCheckout">

                    <img :src="item.thumbnail" class="img-fluid cart-product-img" alt="Product image">

                    <div class="ms-2 w-100">
                      <h6>{{ item.title }}</h6>
                      <p class="text-muted">{{ item.category }}</p>

                      <p class="fw-bold text-danger mb-1">
                        ${{ (item.price * item.quantity).toFixed(2) }}
                      </p>

                      <p class="text-muted small mb-2">ราคา: ${{ item.price.toFixed(2) }} ต่อชิ้น</p>
                    </div>

                    <div class="d-flex align-items-center position-relative">
                      <button @click="changeQuantity(item, -1)" class="btn btn-sm btn-outline-secondary">-</button>
                      <span class="mx-2">{{ item.quantity }}</span>
                      <button @click="changeQuantity(item, 1)" class="btn btn-sm btn-outline-secondary">+</button>
                      <button @click="removeFromCart(index)" class="btn btn-danger btn-sm ms-3">ลบ</button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <p class="fw-bold">จำนวนสิ้นค้าที่เลือก: {{ selectedItemsCount }}</p>
            <p class="fw-bold">รวมยอดสินค้าที่เลือกชำระ: ${{ selectedTotalPriceFormatted }}</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="toggleCartModal">ยกเลิก</button>
            <button type="button" class="btn btn-primary btn-sm" @click="checkout">ชำระเงิน</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Page -->
    <div>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue';

// State for the cart and modal visibility
const cart = ref([]);
const isCartModalVisible = ref(false);
const selectAll = ref(false);

// Compute total price of selected items for checkout
const selectedTotalPrice = computed(() => {
  return cart.value.filter(item => item.selectedForCheckout).reduce((total, item) => total + item.price * item.quantity, 0);
});

// Format selected total price
const selectedTotalPriceFormatted = computed(() => {
  return formatPrice(selectedTotalPrice.value);
});

// Compute the count of selected items
const selectedItemsCount = computed(() => {
  return cart.value.filter(item => item.selectedForCheckout).length;
});

// Helper function to format prices
const formatPrice = (price) => {
  return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Toggle Select All functionality
const toggleSelectAll = () => {
  if (selectAll.value) {
    cart.value.forEach(item => item.selectedForCheckout = true);
  } else {
    cart.value.forEach(item => item.selectedForCheckout = false);
  }
};

// Change product quantity
const changeQuantity = (item, delta) => {
  if (item.quantity + delta >= 1) {
    item.quantity += delta;
  }
};

// Remove product from cart
const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

// Proceed to checkout with selected items
const checkout = () => {
  const selectedItems = cart.value.filter(item => item.selectedForCheckout);
  alert(`ไปที่หน้าชำระเงินกับสินค้าที่เลือก: ${selectedItems.map(item => item.title).join(', ')}`);
};

// Toggle visibility of cart modal
const toggleCartModal = () => {
  isCartModalVisible.value = !isCartModalVisible.value;
};

// Provide cart and addToCart function for child components
provide('cart', cart);
provide('addToCart', (product, quantity) => {
  const productInCart = cart.value.find(item => item.id === product.id);

  if (productInCart) {
    productInCart.quantity += quantity;
  } else {
    cart.value.push({
      ...product,
      quantity,
      selectedForCheckout: false, // Initially not selected for checkout
    });
  }
});
</script>

<style scoped>
/* Add styles as needed */
</style>
