document.addEventListener('DOMContentLoaded', () => {
  // Get updates from local storage
  chrome.storage.local.get({ dailyUpdates: [] }, (result) => {
    const updatesDiv = document.getElementById('updates');
    const contributionBoard = document.getElementById('contribution-board');
    const updates = result.dailyUpdates;

    // Calculate streaks
    const { currentStreak, bestStreak } = calculateStreaks(updates);

    // Display streaks
    const streaksDiv = document.createElement('div');
    streaksDiv.innerHTML = `
      <p>Current Streak: ${currentStreak} days</p>
      <p>Best Streak: ${bestStreak} days</p>
    `;
    document.body.insertBefore(streaksDiv, contributionBoard);

    // Create contribution board
    createContributionBoard(updates, contributionBoard);

    // Display each update
    if (updates.length === 0) {
      updatesDiv.innerHTML = '<p class="no-updates">No updates recorded yet. Start sharing your daily thoughts!</p>';
    } else {
      updates.forEach((entry) => {
        const updateDiv = document.createElement('div');
        updateDiv.className = 'update';

        const updateText = document.createElement('p');
        updateText.textContent = entry.update;

        const timestamp = document.createElement('p');
        timestamp.className = 'timestamp';
        timestamp.textContent = entry.timestamp;

        updateDiv.appendChild(updateText);
        updateDiv.appendChild(timestamp);
        updatesDiv.appendChild(updateDiv);
      });
    }
  });
});

function createContributionBoard(updates, container) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0); // Set to start of day
  const grid = document.createElement('div');
  grid.className = 'contribution-grid';

  // Adjust start date to previous Sunday
  while (startOfYear.getDay() !== 0) {
    startOfYear.setDate(startOfYear.getDate() - 1);
  }

  const totalWeeks = 53; // Fixed number of columns

  for (let w = 0; w < totalWeeks; w++) {
    const column = document.createElement('div');
    column.className = 'contribution-column';

    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div');
      cell.className = 'contribution-cell';
      
      const currentDate = new Date(startOfYear);
      currentDate.setDate(startOfYear.getDate() + (w * 7) + d);
      currentDate.setHours(0, 0, 0, 0); // Set to start of day
      
      if (currentDate <= today) {
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        const updateForDay = updates.find(update => {
          const updateDate = new Date(update.timestamp);
          const updateDateString = `${updateDate.getFullYear()}-${String(updateDate.getMonth() + 1).padStart(2, '0')}-${String(updateDate.getDate()).padStart(2, '0')}`;
          return updateDateString === dateString;
        });
        
        if (updateForDay) {
          cell.setAttribute('data-level', '1');
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
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  sortedUpdates.forEach((update, index) => {
    const currentDate = new Date(update.timestamp);
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

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