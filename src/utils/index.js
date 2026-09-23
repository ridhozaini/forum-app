export function showFormattedDate(date) {
  const parsed = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return parsed.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export function truncateText(text = '', maxLength = 160) {
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}...`;
}

/**
 * Toggle up/down/neutral vote inside a pair of vote-id arrays, returning a
 * brand-new pair. Voting the same direction twice cancels back to neutral.
 */
export function applyVoteToggle({
  upVotesBy, downVotesBy, userId, type,
}) {
  const isUpVoted = upVotesBy.includes(userId);
  const isDownVoted = downVotesBy.includes(userId);

  if (type === 'up') {
    return {
      upVotesBy: isUpVoted
        ? upVotesBy.filter((id) => id !== userId)
        : [...upVotesBy, userId],
      downVotesBy: downVotesBy.filter((id) => id !== userId),
    };
  }

  if (type === 'down') {
    return {
      upVotesBy: upVotesBy.filter((id) => id !== userId),
      downVotesBy: isDownVoted
        ? downVotesBy.filter((id) => id !== userId)
        : [...downVotesBy, userId],
    };
  }

  return {
    upVotesBy: upVotesBy.filter((id) => id !== userId),
    downVotesBy: downVotesBy.filter((id) => id !== userId),
  };
}

export function deriveCategories(threads) {
  const categories = new Set(threads.map((thread) => thread.category).filter(Boolean));
  return ['Semua', ...Array.from(categories)];
}
