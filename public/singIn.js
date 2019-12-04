$(function() {
  //buttons and inputs
  var sendForm = $('#sendFomr');
  sendForm.click(function() {
    var formData = JSON.stringify($('#myForm').serializeArray());
    console.log(formData);
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/api/auth/signup',
      data: formData,
      success: function() {},
      dataType: 'json',
      contentType: 'application/json',
    });
  });
});
