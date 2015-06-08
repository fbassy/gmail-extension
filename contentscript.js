var UNL_DEFAULT_HOST_NAME = "https://api.unleashedsoftware.com";
var CUSTOMER_RET = "/Customers";
console.log("~=Unleashed Extension Loaded=~");

/*
 * Update event binding after each http request.
 */
 chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "bindEvent":
    bindEventToGmail();
    break;
  }
});

/*
 * Bind mouse hover event to email labels to display unl information.
 */
 function bindEventToGmail() {
  // Check if there is opening email then hide ad right panel.
  var currentRightPanel = $('.Bu.y3')[0];
  if (!currentRightPanel) {
    return;
  }

  // Show unl customized right panel
  if (!document.getElementById('rightPanel')) {
    var rightPanel = createRightPanel();
    $(currentRightPanel).parent().children().last().after(rightPanel);
  }

  /** Show unl information when hover over unl email (eg: franck@unleashedsoftware) **/
  chrome.storage.local.get(function (fetchedData) { // Get key config
    var keyValue = fetchedData.key_value;
    var idValue = fetchedData.id_value;
    // console.log("Key:" + keyValue);
    // console.log("Id:" + idValue);

    bindEmailMouseOverEvent(keyValue, idValue);
    // bindPostActivity(keyValue);
  });
}

/*
 * Bind mouse hover event to email label
 */
 function bindEmailMouseOverEvent(keyValue, idValue) {
  var xhr;
  $("span[email]").unbind('mouseenter').unbind('mouseleave').hover(function () {
    var obj = $(this);

    // Get unl userId
    var email = obj.attr("email");
    var userId = email.substring(0, email.indexOf('@'));

    if ($('#rightPanel').text().indexOf(userId) != -1) return;

    // Get unl user information by RESTful Service and show on customized right panel.
    var param = "Email=" + email;
    console.log("Email is " + email);
    var url = UNL_DEFAULT_HOST_NAME + CUSTOMER_RET + "?" + param;
    console.log("Url API: " + url);
    

    obj.addClass('active');
    setTimeout(function () { // Only process hover handler if mouse over email 2 seconds. This avoid crazy mouse moving
      if (obj.hasClass('active')) {
        // Mark loading data
        $('#rightPanel').show().addClass("Loading").html("<div style='width:200px;color: #333;border: 1PX SOLID #D8D8D8; margin: 10PX 0 4PX 0; padding: 4px 6px 8px 10px; background: rgba(0, 0, 0, 0.06);'><img width='60px' height='60px' style='text-align:center;' src='http://design.unl.sh/guide/v1.1/img/load-grey-120.gif'></div>");
        var hash = CryptoJS.HmacSHA256(param, keyValue);
        console.log("Hash:" + hash)
        var hash64 = CryptoJS.enc.Base64.stringify(hash);
        console.log("Hash64:" + hash64)
        xhr =
        $.ajax({
          url: url,
          dataType: "json",
          headers: {
            'Accept':'application/json',
            'api-auth-id': idValue,
            'api-auth-signature' : 'u/XNihWoVZOWBxh6OuJVO02MTLN5L2BnRSmf+XKIvw0=',
            'Content-Type':'application/json'
          }
        }).done(function (data) {
         if (obj.hasClass('active')) {
          console.log("phase2");
              // JSON.parse('[object Object]');
              var member = data;
              console.log("member");
              $('#rightPanel').removeClass('Loading');
              $('#rightPanel').html("<table style='border: 1px solid #e1e7e9; border-radius:4px 4px 0 0;margin: 10PX 0 4PX 0; padding: 4px 6px 8px 10px; background: #fff;'><tr><td align='center' style='padding-bottom:5px;'><a onclick='document.getElementById(\"rightPanel\").style.display=\"none\";' style='float: right; color: #e11e39; cursor: pointer;'>x</a><div style width='180px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;color:#e11e39;' title='" + checkNullInfo(member.Items[0].CustomerName) + "'>" + checkNullInfo(member.Items[0].CustomerName)  + "</div>" + "</br></td></tr>" 
                + "<tr><td><div style='float:left; width: 80px; color: #363838;'>Code:</div><div style='float: left; width: 122px; word-wrap: break-word;color:#999;'>" + checkNullInfo(member.Items[0].CustomerCode) + "</div></br></td></tr>" 
                + "<tr><td><div style='float:left; width: 80px; color: #363838;'>Mail:</div><div style='float: left; width: 122px; word-wrap: break-word;color:#999;'>" + checkNullInfo(member.Items[0].Email) + "</div></br></td></tr>"
                + "<tr><td><div style='float:left; width: 80px; color: #363838;'>Phone Number: </div><div style='float: left; width: 122px; word-wrap: break-word;color:#999;'>" + checkNullInfo(member.Items[0].PhoneNumber) + "</div></br></td></tr>"
                + "<tr><td><div style='float:left; width: 80px; color: #363838;'>Type: </div><div style='float: left; width: 122px; word-wrap: break-word;color:#999;'>" + checkNullInfo(member.Items[0].CustomerType) + "</div></br></td></tr>");
                                    // + "<tr><td style='padding: 8px 0 0 ;'><img style='width: 200px; height: 200px' src='http://'></td></tr>");
              // $('#rightPanel').append("<table style='border: 1PX SOLID #D8D8D8; margin: 10PX 0 4PX 0; padding: 4px 6px 8px 10px; background: rgba(0, 0, 0, 0.06);'><tr><td><div style='float:left; width: 202px; color: #333;'>DO something</div></td></tr>"
                                      // + "<tr><td><div ><input id='postActivityId' style='width: 200px' type='text'></div></td></tr></table>");
}
}).fail(function (data, status, er) {
  console.log("error: " + data + " status: " + status + " er:" + er);
  $('#rightPanel').text("Can not get information");
});
}
}, 1500);
},
function () {
  $(this).removeClass('active');
  if ($('#rightPanel').hasClass('Loading')) {
    $('#rightPanel').text('');
    $('#rightPanel').removeClass('Loading');
    $('#rightPanel').hide();
  }
  if (xhr) {
    xhr.abort();
    xhr = null;
  }
});
}

// function bindPostActivity(unlHostName) {
  // $("#postActivityId").unbind('keypress').keypress(function (event) {
  //   if (event.which == 13) {
  //     event.preventDefault();

  //     // Get activity Title
  //     var activity = new Object();
  //     activity.title = $('#postActivityId').val();

  //     // Make post activity RET
  //     var url = "http://" + unlHostName + POST_ACTIVITY_RET;
  //     $.ajax({
  //       url: url,
  //       type: 'POST',
  //       dataType: 'json',
  //       data: JSON.stringify(activity),
  //       contentType: 'application/json',
  //       mimeType: 'application/json',

  //       success: function (data) {
  //         var parent = $('#postActivityId').parent();
  //         var inputActivityHtml = parent.html();
  //         parent.html(' Activity was posted successfully');
  //           setTimeout(function () {
  //             parent.html(inputActivityHtml);
  //           }, 3000);
  //       },
  //       error: function (data, status, er) {
  //         alert("error: " + data + " status: " + status + " er:" + er);
  //       }
  //     });
  //   }
  // });
// }

/*
 * Check
 */
 function checkNullInfo(value) {
  if (!value) {
    return "No Information";
  }
  return value;
}

/*
 * Create customized right panel.
 */
 function createRightPanel() {
  var rightPanel = '<td  class="Bu"><div id ="rightPanel" style="z-index:10; display:none; top: 47px; right: 30px; width: 240px; height: 350px; position: absolute; background-color:white;">';
  rightPanel += '</div></td>';
  return rightPanel;
}
