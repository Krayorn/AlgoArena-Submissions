document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save');
    const updateInput = document.getElementById('update');
    const errorDiv = document.getElementById('error');
    const emojiOptions = document.querySelectorAll('.emoji-option');

    let selectedMood = null;

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    function hideError() {
        errorDiv.style.display = 'none';
    }

    function saveUpdate(update, timestamp, mood) {
        chrome.storage.local.get({ dailyUpdates: [] }, (result) => {
            const updates = result.dailyUpdates;
            
            const updateDate = new Date(timestamp).setHours(0, 0, 0, 0);
            const existingUpdate = updates.find(entry => new Date(entry.timestamp).setHours(0, 0, 0, 0) === updateDate);
            
            if (!existingUpdate) {
                updates.push({ update, timestamp, mood });

                chrome.storage.local.set({ dailyUpdates: updates }, () => {
                    updateInput.value = '';
                    resetMoodSelection();
                });
            } else {
                showError('An update for this date already exists.');
            }
        });
    }

    function resetMoodSelection() {
        emojiOptions.forEach(option => option.classList.remove('selected'));
        selectedMood = null;
    }

    updateInput.addEventListener('input', hideError);

    emojiOptions.forEach(option => {
        option.addEventListener('click', () => {
            resetMoodSelection();
            option.classList.add('selected');
            selectedMood = option.dataset.mood;
        });
    });

    saveButton.addEventListener('click', () => {
        const update = updateInput.value.trim();
        if (update && selectedMood) {
            saveUpdate(update, Date.now(), selectedMood);
        } else {
            showError('Please enter your update and select a mood.');
        }
    });
});