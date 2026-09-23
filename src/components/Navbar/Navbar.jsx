import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Avatar from '../Avatar/Avatar';
import { asyncUnsetAuthUser } from '../../states/authUser/action';
import './Navbar.css';

function Navbar() {
  const authUser = useSelector((states) => states.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(asyncUnsetAuthUser());
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          Ruang Diskusi
        </Link>

        <nav className="navbar__links">
          <Link to="/">Thread</Link>
          <Link to="/leaderboards">Peringkat</Link>
        </nav>

        <div className="navbar__auth">
          {authUser ? (
            <>
              <Link to="/threads/new" className="navbar__cta">
                Buat thread
              </Link>
              <div className="navbar__profile">
                <Avatar name={authUser.name} image={authUser.avatar} size="small" />
                <span>{authUser.name}</span>
              </div>
              <button type="button" className="navbar__logout" onClick={onLogout}>
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Masuk</Link>
              <Link to="/register" className="navbar__cta">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
