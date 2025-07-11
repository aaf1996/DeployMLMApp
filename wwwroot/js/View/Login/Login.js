ns('MLM.Site.Login.PageLogin')
MLM.Site.Login.PageLogin.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Control.btnLogin().click(base.Event.btnLoginClick);
    };
    base.Parameters = {
    };
    base.Control = {
        txtUserId: function () { return $('#txtUserId'); },
        txtPassword: function () { return $('#txtPassword'); },
        btnLogin: function () { return $('#btnLogin'); }
    };
    base.Event = {
        btnLoginClick: function () {
            base.Ajax.AjaxValidateLogin.data = {
                UserId: base.Control.txtUserId().val(),
                Password: base.Control.txtPassword().val()
            };
            base.Ajax.AjaxValidateLogin.submit();
        },
        AjaxValidateLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    window.location.href = MLM.Site.Login.Actions.RedirectIndexAdmin;
                }
                else {
                    Swal.fire("Oops...", data.message, "error") 
                }
            }
        }
    };
    base.Ajax = {
        AjaxValidateLogin: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Login.Actions.ValidateLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxValidateLoginSuccess
        })
    };
    base.Function = {

    };
}