import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page-heading" style={{ textAlign: 'center', marginTop: 48 }}>
      <h1>Halaman tidak ditemukan</h1>
      <p>
        Halaman yang kamu cari tidak tersedia.
        {' '}
        <Link to="/">Kembali ke daftar thread</Link>
        .
      </p>
    </div>
  );
}

export default NotFoundPage;
