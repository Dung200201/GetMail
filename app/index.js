import { useState } from 'react';

export default function Home() {
  const [limit, setLimit] = useState(10);

  const handleDownload = () => {
    if (!limit || limit <= 0) {
      alert("Vui lòng nhập số dòng hợp lệ.");
      return;
    }
    // Redirect về backend API
    window.location.href = `http://localhost:3000/api/emails/excel?limit=${limit}`;
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Xuất File Excel Dữ Liệu Email</h2>
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        placeholder="Nhập số dòng mới nhất cần lấy"
        style={{ padding: 10, fontSize: 16, marginRight: 10 }}
      />
      <button onClick={handleDownload} style={{ padding: 10, fontSize: 16 }}>
        Tải Excel
      </button>
    </div>
  );
}
