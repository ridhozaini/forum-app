import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import { asyncRegister } from '../../states/authUser/action';

const registerSchema = Yup.object({
  name: Yup.string().trim().min(3, 'Nama minimal 3 karakter').required('Nama wajib diisi'),
  email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
  password: Yup.string().min(6, 'Kata sandi minimal 6 karakter').required('Kata sandi wajib diisi'),
});

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSubmitting = useSelector((states) => states.loading.auth);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: registerSchema,
    onSubmit: async (values, { setStatus }) => {
      setStatus('');
      const result = await dispatch(asyncRegister(values));

      if (result.success) {
        navigate('/login');
      } else {
        setStatus(result.message || 'Gagal mendaftar. Coba gunakan email lain.');
      }
    },
  });

  return (
    <div className="form-card">
      <h1>Daftar akun</h1>
      <p className="form-subtitle">Buat akun untuk mulai ikut berdiskusi.</p>

      {formik.status && <div className="form-error">{formik.status}</div>}

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          id="name"
          label="Nama"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name ? formik.errors.name : ''}
          placeholder="Nama lengkap"
          required
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email ? formik.errors.email : ''}
          placeholder="nama@email.com"
          required
        />
        <TextField
          id="password"
          label="Kata sandi"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password ? formik.errors.password : ''}
          placeholder="Minimal 6 karakter"
          required
          minLength={6}
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Daftar'}
        </Button>
      </form>

      <p className="form-footnote">
        Sudah punya akun?
        {' '}
        <Link to="/login">Masuk di sini</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
