chrome.runtime.onInstalled.addListener(() => {
    // Create an alarm to trigger a few seconds after installation for testing
    chrome.alarms.create('dailyReminder', {
        when: getNext6PM(),
        //  when: Date.now() + 1 * 1000,  // 10 seconds from now
      periodInMinutes: 1440  // 24 hours (keep this unchanged for regular use)
    });

      // Add a context menu item
  chrome.contextMenus.create({
    id: "viewUpdates",
    title: "View Daily Updates",
    contexts: ["action"]  // Show this option in the extension's icon context menu
  });
});


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReminder') {
    chrome.action.openPopup();  // Open the pop-up window
  }
});

function getNext6PM() {
  const now = new Date();
  const sixPM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0);
  if (now > sixPM) {
    sixPM.setDate(sixPM.getDate() + 1);  // If it's past 6 PM today, schedule for tomorrow
  }
  return sixPM.getTime();
}
