moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);

function saveMinutes(){
  var value = document.getElementById('min').value;
  chrome.storage.sync.set({'min': value}, function() {});
}

function refreshNew() {
  chrome.alarms.get('standup', function (alarm) {
    document.getElementById('next').innerHTML = countdown(new Date(alarm.scheduledTime)).toString();
    document.getElementById('time').innerHTML = moment(alarm.scheduledTime).format('h:mm:ss a');
  });
}

function init(){
  chrome.storage.sync.get(
    {
      'min': 60
    },
    function(items) {
      document.getElementById('min').value = items.min;
    }
  );
  refreshNew();
  setInterval(refreshNew, 1000);
}

function reset() {
  chrome.extension.getBackgroundPage().setupAlarm();
}
function on() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("infoPanel").style.display = "flex";
  document.getElementById("infoPanel").style.flexDirection = "column";
  document.getElementById("infoPanel").style.alignItems = "center";
}

function off() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("infoPanel").style.display = "none";
}
document.addEventListener('DOMContentLoaded', init);
document.getElementById('min').addEventListener('change', saveMinutes);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('info').addEventListener('click', on);
document.getElementById('overlay').addEventListener('click', off);
document.getElementById('closeinfoPanel').addEventListener('click', off);