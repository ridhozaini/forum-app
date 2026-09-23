import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage/CreateThreadPage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { asyncPreloadAuthUser } from './states/authUser/action';

function App() {
  const dispatch = useDispatch();
  const isPreloading = useSelector((states) => states.loading.preload);

  useEffect(() => {
    dispatch(asyncPreloadAuthUser());
  }, [dispatch]);

  if (isPreloading) {
    return (
      <div className="app-shell">
        <div className="app-main">
          <LoadingIndicator label="Menyiapkan aplikasi..." />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
          <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
          <Route
            path="/threads/new"
            element={(
              <ProtectedRoute>
                <CreateThreadPage />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
