chrome.runtime.onInstalled.addListener(function(details){
  if (details.reason == "install"){
    chrome.storage.sync.set({
      'min': 60
    }, function() {});
  }
});


chrome.storage.onChanged.addListener(function(changes, area) {
  if (area == 'sync' & (changes.min.oldValue != changes.min.newValue)) {
    setupAlarm();
  }
});

function notification(title, message){
  var notif = new Notification(title, {
    body: message,
    tag: "standup",
    icon: "notification.png"
  });
}
function showNotification(title, message) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
    notification(title,message)
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        notification(title,message)
      }
    });
  }
  
}

function setupAlarm() {
  chrome.storage.sync.get(
    {
      'min': 60
    },
    function(items) {
      chrome.alarms.create("standup", {
        when: Date.now() + items.min*60*1000,
        periodInMinutes: parseInt(items.min)
      });
    }
  );
}
setupAlarm();

function clearAlarms() {
  chrome.alarms.clearAll();
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "standup") {
    chrome.storage.sync.get(
    {
      'min': 60
    },
    function(items) {
      showNotification("Developer Health —  SickSeek", 'It`s been ' + items.min + ' minutes since you stood up , Time To Stand Up & Take Small Break');
    }
  );
  }
});