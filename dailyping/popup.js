document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save');
  const updateInput = document.getElementById('update');
  const errorDiv = document.getElementById('error');

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  function hideError() {
    errorDiv.style.display = 'none';
  }

  updateInput.addEventListener('input', hideError);

  saveButton.addEventListener('click', () => {
    const update = updateInput.value.trim();
    if (update) {
      const timestamp = new Date().toLocaleDateString();
      
      // Get existing updates from local storage
      chrome.storage.local.get({ dailyUpdates: [] }, (result) => {
        const updates = result.dailyUpdates;
        
        // Check if an update with the same timestamp already exists
        const existingUpdate = updates.find(entry => entry.timestamp === timestamp);
        
        if (!existingUpdate) {
          // Add the new update only if it doesn't exist
          updates.push({ update, timestamp });
          
          // Save the updates back to local storage
          chrome.storage.local.set({ dailyUpdates: updates }, () => {
            alert('Daily update saved!');
            window.close();
          });
        } else {
          showError('An update for this time already exists.');
        }
      });
    } else {
      showError('Please enter your update.');
    }
  });
});