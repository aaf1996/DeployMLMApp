ns('MLM.Site.Login.PageLogin')
MLM.Site.Login.PageLogin.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Control.btnLogin().click(base.Event.btnLoginClick);
        base.Control.btnRecoverPassword().click(base.Event.btnRecoverPasswordClick);
        base.Control.btnSendToken().click(base.Event.btnSendTokenClick);
    };
    base.Parameters = {
    };
    base.Control = {
        txtUserId: function () { return $('#txtUserId'); },
        txtPassword: function () { return $('#txtPassword'); },
        txtUserForRecoverPassword: function () { return $('#txtUserForRecoverPassword'); },
        modalSave: function () { return $('#modalSave'); },
        btnLogin: function () { return $('#btnLogin'); },
        btnSendToken: function () { return $('#btnSendToken'); },
        btnRecoverPassword: function () { return $('.btn-link'); }
    };
    base.Event = {
        btnRecoverPasswordClick: function () { 
            base.Control.modalSave().modal('show');
        },
        btnLoginClick: function () {
            base.Ajax.AjaxValidateLogin.data = {
                UserId: base.Control.txtUserId().val(),
                Password: base.Control.txtPassword().val()
            };
            base.Ajax.AjaxValidateLogin.submit();
        },
        btnSendTokenClick: function () {
            base.Ajax.AjaxGenerateTokenRecoverPassword.data = {
                userName: base.Control.txtUserForRecoverPassword().val(),
            };
            base.Ajax.AjaxGenerateTokenRecoverPassword.submit();
        },
        AjaxValidateLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    var redirect = data.data.packageId === 4 ? MLM.Site.Login.Actions.RedirectOrderAdmin : MLM.Site.Login.Actions.RedirectIndexAdmin;
                    window.location.href = redirect;
                }
                else {
                    Swal.fire("Oops...", data.message, "error") 
                }
            }
        },
        AjaxGenerateTokenRecoverPasswordSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "El token ha sido enviado a su correo", "success");
                    base.Control.modalSave().modal('hide');
                }
                else {
                    Swal.fire("Oops...", data.message, "error");
                }
            }
        },
    };
    base.Ajax = {
        AjaxValidateLogin: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Login.Actions.ValidateLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxValidateLoginSuccess
        }),
        AjaxGenerateTokenRecoverPassword: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Login.Actions.GenerateTokenRecoverPassword,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGenerateTokenRecoverPasswordSuccess
        }),
    };
    base.Function = {

    };
}