import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ThreadItem from './ThreadItem';

const baseThread = {
  id: 'thread-1',
  title: 'Cara belajar React yang efektif',
  body: 'Aku pemula, mohon saran belajar React step by step ya teman-teman...',
  category: 'React',
  createdAt: new Date().toISOString(),
  totalComments: 5,
  owner: { name: 'Budi Santoso', avatar: '' },
  upVotesBy: ['user-2'],
  downVotesBy: [],
};

function renderThreadItem(props = {}) {
  const onUpVote = jest.fn();
  const onDownVote = jest.fn();

  render(
    <MemoryRouter>
      <ThreadItem
        thread={baseThread}
        onUpVote={onUpVote}
        onDownVote={onDownVote}
        {...props}
      />
    </MemoryRouter>,
  );

  return { onUpVote, onDownVote };
}

/**
 * Skenario pengujian ThreadItem:
 * - should render the thread title, category, and owner name
 * - should render the up-vote count taken from upVotesBy
 * - should call onUpVote with the thread id when the up-vote button is clicked
 * - should mark the vote as active when currentUserId is included in upVotesBy
 * - should disable voting when there is no currentUserId (not logged in)
 */
describe('ThreadItem component', () => {
  it('should render the thread title, category, and owner name', () => {
    renderThreadItem();

    expect(screen.getByText('Cara belajar React yang efektif')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
  });

  it('should render the up-vote count taken from upVotesBy', () => {
    renderThreadItem();

    expect(screen.getByLabelText('Upvote')).toHaveTextContent('1');
  });

  it('should call onUpVote with the thread id when the up-vote button is clicked', async () => {
    const user = userEvent.setup();
    const { onUpVote } = renderThreadItem({ currentUserId: 'user-1' });

    await user.click(screen.getByLabelText('Upvote'));

    expect(onUpVote).toHaveBeenCalledWith('thread-1');
  });

  it('should mark the vote as active when currentUserId is included in upVotesBy', () => {
    renderThreadItem({ currentUserId: 'user-2' });

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'true');
  });

  it('should disable voting when there is no currentUserId (not logged in)', () => {
    renderThreadItem({ currentUserId: null });

    expect(screen.getByLabelText('Upvote')).toBeDisabled();
  });
});
