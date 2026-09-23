import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import VoteButtons from './VoteButtons';

/**
 * Skenario pengujian VoteButtons:
 * - should render the up-vote and down-vote counts
 * - should call onUpVote when the up-vote button is clicked
 * - should call onDownVote when the down-vote button is clicked
 * - should mark the up-vote button as pressed when isUpVoted is true
 * - should disable both buttons and not call the handlers when disabled is true
 */
describe('VoteButtons component', () => {
  const defaultProps = {
    upVotesCount: 3,
    downVotesCount: 1,
    isUpVoted: false,
    isDownVoted: false,
    onUpVote: jest.fn(),
    onDownVote: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the up-vote and down-vote counts', () => {
    render(<VoteButtons {...defaultProps} />);

    expect(screen.getByLabelText('Upvote')).toHaveTextContent('3');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('1');
  });

  it('should call onUpVote when the up-vote button is clicked', async () => {
    const user = userEvent.setup();
    render(<VoteButtons {...defaultProps} />);

    await user.click(screen.getByLabelText('Upvote'));

    expect(defaultProps.onUpVote).toHaveBeenCalledTimes(1);
  });

  it('should call onDownVote when the down-vote button is clicked', async () => {
    const user = userEvent.setup();
    render(<VoteButtons {...defaultProps} />);

    await user.click(screen.getByLabelText('Downvote'));

    expect(defaultProps.onDownVote).toHaveBeenCalledTimes(1);
  });

  it('should mark the up-vote button as pressed when isUpVoted is true', () => {
    render(<VoteButtons {...defaultProps} isUpVoted />);

    expect(screen.getByLabelText('Upvote')).toHaveAttribute('aria-pressed', 'true');
  });

  it('should disable both buttons and not call the handlers when disabled is true', async () => {
    const user = userEvent.setup();
    render(<VoteButtons {...defaultProps} disabled />);

    const upButton = screen.getByLabelText('Upvote');
    const downButton = screen.getByLabelText('Downvote');

    expect(upButton).toBeDisabled();
    expect(downButton).toBeDisabled();

    await user.click(upButton);
    await user.click(downButton);

    expect(defaultProps.onUpVote).not.toHaveBeenCalled();
    expect(defaultProps.onDownVote).not.toHaveBeenCalled();
  });
});
