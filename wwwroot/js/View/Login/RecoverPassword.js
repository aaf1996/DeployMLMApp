ns('MLM.Site.RecoverPassword.Index')
MLM.Site.RecoverPassword.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Control.btnResetPassword().click(base.Event.btnResetPasswordClick);
        base.Control.txtToken().val(base.Control.hdnTokenUrl().val());
    };
    base.Parameters = {
    };
    base.Control = {
        txtToken: function () { return $('#txtToken'); },
        txtPassword: function () { return $('#txtPassword'); },
        txtPassword2: function () { return $('#txtPassword2'); },
        hdnTokenUrl: function () { return $('#hdnTokenUrl'); },
        hdnUserIdUrl: function () { return $('#hdnUserIdUrl'); },
        btnResetPassword: function () { return $('#btnResetPassword'); },
    };
    base.Event = {
        btnResetPasswordClick: function () {
            if (base.Control.txtToken().val() === "") {
                Swal.fire("Oops...", "El Token ingresado es inválido", "error");
            }
            if (base.Control.hdnUserIdUrl().val() === "") {
                Swal.fire("Oops...", "La URL de recuperación de contraseña es inválida", "error");
            }
            else if (base.Control.txtPassword().val() === "" || base.Control.txtPassword().val().length <= 4) {
                Swal.fire("Oops...", "La contraseña ingresada es inválida", "error");
            }
            else if (base.Control.txtPassword().val() !== base.Control.txtPassword2().val()) {
                Swal.fire("Oops...", "Las contraseñas no coinciden", "error");
            }
            else {
                base.Function.ResetPassword();
            }
            
        },
        AjaxProcessResetPasswordSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire(
                        "Excelente !!",
                        "La contraseña ha sido actualizada",
                        "success"
                    ).then(() => {
                        window.location.href = '/Login/PageLogin';
                    });
                }
                else {
                    Swal.fire("Oops...", data.message, "error");
                }
            }
        },
    };
    base.Ajax = {
        AjaxProcessResetPassword: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.RecoverPassword.Actions.ProcessResetPassword,
            autoSubmit: false,
            onSuccess: base.Event.AjaxProcessResetPasswordSuccess
        }),
    };
    base.Function = {
        ResetPassword: function () {
            base.Ajax.AjaxProcessResetPassword.data = {
                UserId: base.Control.hdnUserIdUrl().val(),
                Token: base.Control.txtToken().val(),
                Password: base.Control.txtPassword().val()
            };
            base.Ajax.AjaxProcessResetPassword.submit();
        },
    };
}