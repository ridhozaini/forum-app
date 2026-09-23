import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ThreadList from '../../components/ThreadList/ThreadList';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import { asyncReceiveThreads, asyncToggleVoteThread } from '../../states/threads/action';
import { deriveCategories } from '../../utils';

function HomePage() {
  const dispatch = useDispatch();
  const threads = useSelector((states) => states.threads);
  const authUser = useSelector((states) => states.authUser);
  const isLoading = useSelector((states) => states.loading.threads);

  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    dispatch(asyncReceiveThreads());
  }, [dispatch]);

  const categories = useMemo(() => deriveCategories(threads), [threads]);

  const visibleThreads = useMemo(() => {
    if (activeCategory === 'Semua') return threads;
    return threads.filter((thread) => thread.category === activeCategory);
  }, [threads, activeCategory]);

  const onUpVote = (threadId) => dispatch(asyncToggleVoteThread({ threadId, type: 'up' }));
  const onDownVote = (threadId) => dispatch(asyncToggleVoteThread({ threadId, type: 'down' }));

  return (
    <div>
      <div className="page-heading">
        <h1>Thread diskusi</h1>
        <p>Kumpulan pertanyaan dan obrolan seputar belajar coding dari komunitas.</p>
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {isLoading && <LoadingIndicator label="Memuat thread..." />}

      {!isLoading && (
        <ThreadList
          threads={visibleThreads}
          currentUserId={authUser ? authUser.id : null}
          onUpVote={onUpVote}
          onDownVote={onDownVote}
        />
      )}
    </div>
  );
}

export default HomePage;
