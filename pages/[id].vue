<template>
    <div>
      <Head>
        <Title>Store Shop | {{ product.title }}</Title>
        <Meta name="description" :content="product.description" />
      </Head>
      <div class="container my-5">
        <div class="row">
          <!-- Product Image -->
          <div class="col-12 col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
            <img :src="product.thumbnail" alt="Product Image" class="img-fluid rounded shadow-lg">
          </div>
  
          <!-- Product Details -->
          <div class="col-12 col-md-6">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <h1 class="card-title text-center text-sm-start">{{ product.title }}</h1>
                <p class="card-text fw-bold text-primary fs-3 text-center text-sm-start">ราคา: ${{ product.price }}</p>
                <p class="card-text"><strong>หมวดหมู่:</strong> {{ product.category }}</p>
                <p class="card-text"><strong>ยี่ห้อ:</strong> {{ product.brand }}</p>
                <p class="card-text"><strong>ข้อมูลพื้นฐาน:</strong> {{ product.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    const { id } = useRoute().params
    const { data: product } = await useFetch('https://dummyjson.com/products/' + id)
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .card-title {
    font-size: 2rem;
    font-weight: bold;
  }
  
  .card-text {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .card-text strong {
    font-weight: bold;
  }
  
  /* เพิ่มระยะห่างบนมือถือ */
  @media (max-width: 767px) {
    .card-body {
      padding: 1rem;
    }
  
    .card-title {
      font-size: 1.5rem;
    }
  
    .card-text {
      font-size: 1rem;
    }
  }
  </style>
  