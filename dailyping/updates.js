document.addEventListener('DOMContentLoaded', () => {
  // Get updates from local storage
  chrome.storage.local.get({ dailyUpdates: [] }, (result) => {
    const updatesDiv = document.getElementById('updates');
    const contributionBoard = document.getElementById('contribution-board');
    const streaksDiv = document.getElementById('streaks');
    const updates = result.dailyUpdates;

    // Calculate streaks
    const { currentStreak, bestStreak } = calculateStreaks(updates);

    // Display streaks
    streaksDiv.innerHTML = `
      <div class="streak current-streak">
        <div class="streak-label">Current Streak</div>
        <div class="streak-value">${currentStreak} <span class="fire-emoji">${getFireEmoji(currentStreak)}</span></div>
      </div>
      <div class="streak best-streak">
        <div class="streak-label">Best Streak</div>
        <div class="streak-value">${bestStreak}</div>
      </div>
    `;

    // Create contribution board
    createContributionBoard(updates, contributionBoard);

    // Display each update
    if (updates.length === 0) {
      updatesDiv.innerHTML = '<p class="no-updates">No updates recorded yet. Start sharing your daily thoughts!</p>';
    } else {
      // Sort updates in reverse chronological order
      updates.sort((a, b) => b.timestamp - a.timestamp);

      updates.forEach((entry) => {
        const updateDiv = document.createElement('div');
        updateDiv.className = 'update';

        const moodEmoji = document.createElement('span');
        moodEmoji.className = 'update-mood';
        moodEmoji.textContent = getMoodEmoji(entry.mood);

        const updateText = document.createElement('p');
        updateText.textContent = entry.update;

        const timestamp = document.createElement('p');
        timestamp.className = 'timestamp';
        const date = new Date(entry.timestamp);
        timestamp.textContent = date.toLocaleString();

        updateDiv.appendChild(moodEmoji);
        updateDiv.appendChild(updateText);
        updateDiv.appendChild(timestamp);
        updatesDiv.appendChild(updateDiv);
      });
    }
  });
});

function getFireEmoji(streak) {
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 14) return '🔥🔥';
  if (streak >= 7) return '🔥';
  return '';
}

function createContributionBoard(updates, container) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const grid = document.createElement('div');
  grid.className = 'contribution-grid';

  while (startOfYear.getDay() !== 0) {
    startOfYear.setDate(startOfYear.getDate() - 1);
  }

  const totalWeeks = 53;

  for (let w = 0; w < totalWeeks; w++) {
    const column = document.createElement('div');
    column.className = 'contribution-column';

    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div');
      cell.className = 'contribution-cell';
      
      const currentDate = new Date(startOfYear);
      currentDate.setDate(startOfYear.getDate() + (w * 7) + d);
      currentDate.setHours(0, 0, 0, 0);
      
      if (currentDate > today) {
        cell.classList.add('future-date');
      } else {
        const updateForDay = updates.find(update => {
          const updateDate = new Date(update.timestamp);
          return updateDate.setHours(0, 0, 0, 0) === currentDate.getTime();
        });
        
        if (updateForDay) {
          cell.classList.add(`mood-${updateForDay.mood}`);
          cell.title = `${currentDate.toDateString()}: ${updateForDay.update}`;
        } else {
          cell.title = currentDate.toDateString();
        }
      }

      column.appendChild(cell);
    }

    grid.appendChild(column);
  }

  container.appendChild(grid);
}

function calculateStreaks(updates) {
  const sortedUpdates = updates.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let lastDate = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  sortedUpdates.forEach((update, index) => {
    const currentDate = new Date(update.timestamp);
    currentDate.setHours(0, 0, 0, 0);

    if (lastDate) {
      const dayDifference = (currentDate - lastDate) / (1000 * 60 * 60 * 24);
      if (dayDifference === 1 || dayDifference === 0) {
        tempStreak++;
      } else {
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    lastDate = currentDate;

    if (index === sortedUpdates.length - 1) {
      const daysSinceLastUpdate = (today - currentDate) / (1000 * 60 * 60 * 24);

      if (daysSinceLastUpdate <= 1) {
        currentStreak = tempStreak;
      } else {
        currentStreak = 0;
      }
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    }
  });

  return { currentStreak, bestStreak };
}

function getMoodEmoji(mood) {
  switch (mood) {
    case 'good':
      return '😊';
    case 'okay':
      return '😐';
    case 'bad':
      return '😞';
    default:
      return '';
  }
}