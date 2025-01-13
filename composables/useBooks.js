// composables/useBooks.js
import { ref, onMounted } from 'vue';
import axios from 'axios';

export const useBooks = () => {
  const books = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const fetchBooks = async () => {
    try {
      const apiUrl = 'https://dummyjson.com/products';
      const response = await axios.get(apiUrl);
      if (response.data.code === 200) {
        books.value = response.data.data;  // บันทึกข้อมูลหนังสือใน books
      } else {
        error.value = 'ไม่สามารถดึงข้อมูลได้';
      }
    } catch (err) {
      error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      console.error('Error fetching data:', err);
    } finally {
      loading.value = false;
    }
  };

  // เรียกใช้ฟังก์ชันเมื่อคอมโพเนนต์ถูกเมานต์
  onMounted(fetchBooks);

  return { books, loading, error };
};
