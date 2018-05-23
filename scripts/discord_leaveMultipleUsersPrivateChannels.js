$(document).on("submit", "form[name=discord_leave-multiple-users-private-channels]", function(e) {
    e.preventDefault();

    showLoading();

    form = $("form[name=discord_leave-multiple-users-private-channels]");
    console.log(form);
    formData = {
        email: form.find("input[name=email]").val(),
        password: form.find("input[name=password]").val()
    }
    console.log(formData);

    $.ajax({
        type: "POST",
        url: form.attr('action'),
        data: formData,
        error: function(data) {
            showError(data);
        },
        success: function(data) {
            if (data && data.success) {
                showMessages(data.messages);
            }
            else if (data && !data.success) {
                showError(data.message);
            }
        }
    })
})

showLoading = function(show = true) {
    if (show)
        $("#messages").html("<i class='fa fa-refresh fa-spin'></i>");
    else
        $("#messages").html("");
}

showMessages = function(messages) {
    $("#messages").html(messages.join('\n'));
}

showError = function(data) {
    $("#messages").html(data);
}