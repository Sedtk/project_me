<template>
  <div>
    <!-- Header with Cart Button -->
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <h1 class="navbar-brand">Store Shop</h1>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content custom-modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cartModalLabel">รายการตะกร้าสินค้า</h5>
            <button type="button" class="btn-close" @click="toggleCartModal"></button>
          </div>

          <div class="modal-body">
            <div v-if="cart.length === 0" class="text-center">
              <p>ตะกร้าของคุณว่างเปล่า</p>
            </div>
            <ul class="list-group" v-else>
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

// Compute total price of all items in cart
const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Format total price with commas
const totalPriceFormatted = computed(() => {
  return formatPrice(totalPrice.value);
});

// Compute total price of selected items for checkout
const selectedTotalPrice = computed(() => {
  return cart.value.filter(item => item.selectedForCheckout).reduce((total, item) => total + item.price * item.quantity, 0);
});

// Format selected total price
const selectedTotalPriceFormatted = computed(() => {
  return formatPrice(selectedTotalPrice.value);
});

// Helper function to format prices
const formatPrice = (price) => {
  return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
/* Style for the modal body */
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

/* Cart product image */
.cart-product-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

/* Button styling */
button {
  padding: 0.5rem 1rem;
}

/* Align product information */
.ms-1 h6, .ms-1 p {
  margin-bottom: 0 !important;
}

/* Make price bold */
p.fw-bold {
  font-weight: bold;
}

/* Modal footer styles */
.modal-footer {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

/* Adjust modal size */
.modal-dialog.modal-lg {
  max-width: 40%;
}

/* Background color for the modal */
.custom-modal-content {
  background-color: rgba(255, 255, 255, 0.95);
}

/* Modal backdrop styling */
.modal-backdrop.show {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Adjust spacing for the delete button */
.ms-2 {
  margin-left: 1rem;
}

/* Styling for flex layout in list items */
.list-group-item .d-flex {
  align-items: center;
}

.list-group-item {
  position: relative;
}

/* Position quantity buttons in bottom-right */
.list-group-item .d-flex .position-relative {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

/* Adjust button size */
.list-group-item .d-flex button {
  font-size: 1.2rem;
  padding: 0.2rem 0.6rem;
}

/* Spacing between price and quantity buttons */
.list-group-item .ms-2 p {
  margin-bottom: 0.5rem;
}

/* Align checkbox to the left */
.form-check-input {
  margin-left: 0;
}
</style>
