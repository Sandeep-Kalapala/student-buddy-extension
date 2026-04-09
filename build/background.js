chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("⏰ ALARM TRIGGERED:", alarm.name);

  chrome.notifications.create(
    alarm.name,
    {
      type: "basic",
      iconUrl: "logo512.png",
      title: "Student Buddy Reminder",
      message: `Task due: ${alarm.name}`,
      priority: 2
    },
    (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error("NOTIFICATION ERROR:", chrome.runtime.lastError.message);
      } else {
        console.log("Notification shown:", notificationId);
      }
    }
  );
});