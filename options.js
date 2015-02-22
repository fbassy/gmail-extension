// Saves options to localStorage.
function save_options() {
  var hostValue = $('#host-field').val();

  
			chrome.storage.local.set({
				'unlsh_host': hostValue
			}, function () {
				$('#status').text('Config saved!');

				$('#status').fadeIn(800, function () {
				  setTimeout(function () {
				    $('#status').fadeOut(400);
				  }, 2000);
				});
			});

}

// Restores select box state to saved value from localStorage.
function restore_options() {
  chrome.storage.local.get("unlsh_host", function (fetchedData) {
    var hostValue = fetchedData.unlsh_host;
    if (!hostValue) {
      return;
    } else {
      chrome.storage.local.set({'unlsh_host': 'api.unleashedsoftware.com'});
    }

    $('#host-field').val(hostValue);
  });
}

$(document).ready(function () {
  document.querySelector('#save').addEventListener('click', save_options);
  restore_options();
})
