document.addEventListener('DOMContentLoaded', () => {
  // Get updates from local storage
  chrome.storage.local.get({ dailyUpdates: [] }, (result) => {
    const updatesDiv = document.getElementById('updates');
    const updates = result.dailyUpdates;

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