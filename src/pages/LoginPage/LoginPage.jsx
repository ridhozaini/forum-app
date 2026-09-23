import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import { asyncLogin } from '../../states/authUser/action';

const loginSchema = Yup.object({
  email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
  password: Yup.string().min(6, 'Kata sandi minimal 6 karakter').required('Kata sandi wajib diisi'),
});

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSubmitting = useSelector((states) => states.loading.auth);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus }) => {
      setStatus('');
      const result = await dispatch(asyncLogin(values));

      if (result.success) {
        navigate('/');
      } else {
        setStatus(result.message || 'Gagal masuk. Periksa kembali email dan kata sandimu.');
      }
    },
  });

  return (
    <div className="form-card">
      <h1>Masuk</h1>
      <p className="form-subtitle">Masuk untuk membuat thread, berkomentar, dan memberi vote.</p>

      {formik.status && <div className="form-error">{formik.status}</div>}

      <form onSubmit={formik.handleSubmit} noValidate>
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
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>

      <p className="form-footnote">
        Belum punya akun?
        {' '}
        <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
}

export default LoginPage;
