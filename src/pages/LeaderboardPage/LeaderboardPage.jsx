import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '../../components/Avatar/Avatar';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import EmptyState from '../../components/EmptyState/EmptyState';
import { asyncReceiveLeaderboards } from '../../states/leaderboards/action';
import './LeaderboardPage.css';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector((states) => states.leaderboards);
  const isLoading = useSelector((states) => states.loading.leaderboards);

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  return (
    <div>
      <div className="page-heading">
        <h1>Peringkat kontributor</h1>
        <p>Anggota paling aktif berdasarkan skor kontribusi di forum.</p>
      </div>

      {isLoading && <LoadingIndicator label="Memuat peringkat..." />}

      {!isLoading && leaderboards.length === 0 && (
        <EmptyState title="Belum ada data peringkat" />
      )}

      {!isLoading && leaderboards.length > 0 && (
        <ol className="leaderboard-list">
          {leaderboards.map((entry, index) => (
            <li key={entry.user.id} className="leaderboard-list__item">
              <span className="leaderboard-list__rank">{index + 1}</span>
              <Avatar name={entry.user.name} image={entry.user.avatar} />
              <span className="leaderboard-list__name">{entry.user.name}</span>
              <span className="leaderboard-list__score">
                {entry.score}
                {' '}
                poin
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default LeaderboardPage;
