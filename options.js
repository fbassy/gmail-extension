// Saves options to localStorage.
function save_options() {
  // var hostValue = $('#host-field').val();
  var keyvalue = $('#key-field').val();
  var idvalue = $('#id-field').val();

			chrome.storage.local.set({
				'key_value': keyvalue,
        'id_value': idvalue        
			}, function () {
				$('#status').text('Your configuration is now saved!');

				$('#status').fadeIn(800, function () {
				  setTimeout(function () {
				    $('#status').fadeOut(400);
				  }, 2000);
				});
			});

}

// Restores select box state to saved value from localStorage.
function restore_options() {
  chrome.storage.local.get("key_value", function (fetchedData) {
    var keyvalue = fetchedData.key_value;
    $('#key-field').val(keyvalue);
  });

  chrome.storage.local.get("id_value", function (fetchedData) {
    var idvalue = fetchedData.id_value;
    $('#id-field').val(idvalue);
  });
}

$(document).ready(function () {
  document.querySelector('#save').addEventListener('click', save_options);
  restore_options();
})
