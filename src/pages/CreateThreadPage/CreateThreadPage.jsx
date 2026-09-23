import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import { asyncAddThread } from '../../states/threads/action';

const createThreadSchema = Yup.object({
  title: Yup.string().trim().min(5, 'Judul minimal 5 karakter').required('Judul wajib diisi'),
  category: Yup.string().trim().required('Kategori wajib diisi'),
  body: Yup.string().trim().min(10, 'Isi thread minimal 10 karakter')
    .required('Isi thread wajib diisi'),
});

function CreateThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSubmitting = useSelector((states) => states.loading.submitThread);

  const formik = useFormik({
    initialValues: { title: '', category: '', body: '' },
    validationSchema: createThreadSchema,
    onSubmit: async (values, { setStatus }) => {
      setStatus('');
      const result = await dispatch(asyncAddThread(values));

      if (result.success) {
        navigate(`/threads/${result.thread.id}`);
      } else {
        setStatus(result.message || 'Gagal membuat thread.');
      }
    },
  });

  return (
    <div>
      <div className="page-heading">
        <h1>Buat thread baru</h1>
        <p>Bagikan pertanyaan atau topik diskusi ke komunitas.</p>
      </div>

      {formik.status && <div className="form-error">{formik.status}</div>}

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          id="title"
          label="Judul"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title ? formik.errors.title : ''}
          placeholder="Judul thread yang jelas dan spesifik"
          required
        />
        <TextField
          id="category"
          label="Kategori"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.category ? formik.errors.category : ''}
          placeholder="Misal: React, Redux, Karier"
          required
        />
        <TextField
          id="body"
          label="Isi thread"
          as="textarea"
          rows={8}
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.body ? formik.errors.body : ''}
          placeholder="Jelaskan pertanyaan atau topikmu secara detail..."
          required
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Publikasikan thread'}
        </Button>
      </form>
    </div>
  );
}

export default CreateThreadPage;
