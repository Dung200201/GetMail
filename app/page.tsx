'use client';

import { useState } from 'react';
import styles from './page.module.css'; // Import CSS module

export default function Home() {
  const [limit, setLimit] = useState<number>(10);

  const handleDownload = () => {
    if (!limit || limit <= 0) {
      alert("Vui lòng nhập số dòng hợp lệ.");
      return;
    }
    window.location.href = `http://localhost:3000/api/emails/excel?limit=${limit}`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Xuất File Excel Dữ Liệu Email</h2>
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        placeholder="Nhập số dòng mới nhất cần lấy"
        className={styles.input}
      />
      <button onClick={handleDownload} className={styles.button}>
        Tải Excel
      </button>
    </div>
  );
}
