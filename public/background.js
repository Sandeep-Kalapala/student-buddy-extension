chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.notifications.create(alarm.name, {
    type: "basic",
    iconUrl: "logo192.png",
    title: "Student Buddy Reminder",
    message: `Task due: ${alarm.name}`,
    priority: 2
  });
});
