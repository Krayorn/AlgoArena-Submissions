document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save');
    const updateInput = document.getElementById('update');
    const errorDiv = document.getElementById('error');
    const clearButton = document.getElementById('clear-updates');

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
            const timestamp = new Date().toLocaleString();

            // Get existing updates from local storage
            chrome.storage.local.get({ dailyUpdates: [] }, (result) => {
                const updates = result.dailyUpdates;

                // Check if an update for today already exists
                const today = new Date().toDateString();
                const existingUpdate = updates.find(entry => new Date(entry.timestamp).toDateString() === today);

                if (!existingUpdate) {
                    // Add the new update
                    updates.push({ update, timestamp });

                    // Save the updates back to local storage
                    chrome.storage.local.set({ dailyUpdates: updates }, () => {
                        window.close();
                    });
                } else {
                    showError('An update for today already exists.');
                }
            });
        } else {
            showError('Please enter your update.');
        }
    });

    clearButton.addEventListener('click', () => {
        chrome.storage.local.set({ dailyUpdates: [] }, () => {
            updateInput.value = '';
        });
    });
});