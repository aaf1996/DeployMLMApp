ns('MLM.Site.Network.Index')
MLM.Site.Network.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Ajax.AjaxGetLogin.submit();
        base.Ajax.AjaxGetDepartment.submit();
        base.Ajax.AjaxGetStores.submit();
        base.Control.slcDepartment().change(base.Event.slcDepartmentChange);
        base.Control.slcProvince().change(base.Event.slcProvinceChange);
        base.Control.btnSave().click(base.Event.btnSaveClick);
        base.Control.btnGenerateURLRegister().click(base.Event.btnGenerateURLRegisterClick);
    };
    base.Parameters = {
        fullNameUrl: "",
        userIdUrl: 0
    };
    base.Control = {
        txtPassword: function () { return $('#txtPassword'); },
        txtUserName: function () { return $('#txtUserName'); },
        txtName: function () { return $('#txtName'); },
        txtLastName: function () { return $('#txtLastName'); },
        slcTypeDocument: function () { return $('#slcTypeDocument'); },
        txtDocument: function () { return $('#txtDocument'); },
        //slcArm: function () { return $('#slcArm'); },
        txtEmail: function () { return $('#txtEmail'); },
        txtBirthDate: function () { return $('#txtBirthDate'); },
        txtRecognitionName: function () { return $('#txtRecognitionName'); },
        slcStore: function () { return $('#slcStore'); },
        slcCountry: function () { return $('#slcCountry'); },
        slcDepartment: function () { return $('#slcDepartment'); },
        slcProvince: function () { return $('#slcProvince'); },
        slcDistrict: function () { return $('#slcDistrict'); },
        txtAddress: function () { return $('#txtAddress'); },
        txtPhone: function () { return $('#txtPhone'); },
        txtUbigeo: function () { return $('#txtUbigeo'); },
        btnSave: function () { return $('#btnSave'); },
        hdnUserIdUrl: function () { return $('#hdnUserIdUrl'); },
        btnGenerateURLRegister: function () { return $('#btnGenerateURLRegister'); },
    };
    base.Event = {
        AjaxGetDepartmentSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcDepartment().empty();
                    base.Control.slcDepartment().append($('<option>', {
                        value: 0,
                        text: 'Seleccione'
                    }));
                    $.each(data.data, function (key, value) {
                        base.Control.slcDepartment().append($('<option>', {
                            value: value.departmentId,
                            text: value.description
                        }));
                    });
                    base.Control.slcDepartment().selectpicker('refresh');
                }
            }
        },
        AjaxGetProvinceSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcProvince().empty();
                    base.Control.slcProvince().append($('<option>', {
                        value: 0,
                        text: 'Seleccione'
                    }));
                    $.each(data.data, function (key, value) {
                        base.Control.slcProvince().append($('<option>', {
                            value: value.provinceId,
                            text: value.description
                        }));
                    });
                    base.Control.slcProvince().selectpicker('refresh');
                }
            }
        },
        AjaxGetDistrictSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcDistrict().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcDistrict().append($('<option>', {
                            value: value.districtId,
                            text: value.description
                        }));
                    });
                    base.Control.slcDistrict().selectpicker('refresh');
                }
            }
        },
        AjaxGetStoresSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcStore().empty();
                    base.Control.slcStore().append($('<option>', {
                        value: 0,
                        text: 'Seleccione'
                    }));
                    $.each(data.data, function (key, value) {
                        base.Control.slcStore().append($('<option>', {
                            value: value.storeId,
                            text: value.storeName
                        }));
                    });
                    base.Control.slcStore().selectpicker('refresh');
                }
            }
        },
        AjaxGetLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.fullNameUrl = data.data.names + data.data.lastName;
                    base.Parameters.userIdUrl = data.data.userId;
                }
            }
        },
        AjaxRegisterUserSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    if (data.data.status) {
                        base.Function.CleanFields();
                        Swal.fire("Excelente !!", "Usuario Registrado !!", "success").then((result) => {
                            if (base.Parameters.userIdUrl == 0) {
                                window.location.href = MLM.Site.Network.Actions.RedirectLogin;
                            }
                        });
                        
                    }
                    else {
                        Swal.fire("Oops...", data.data.message, "error")
                    }
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                }
            }
        },
        slcDepartmentChange: function () {
            base.Control.slcDistrict().empty();
            base.Control.slcDistrict().append($('<option>', {
                value: 0,
                text: 'Seleccione'
            }));
            base.Control.slcDistrict().selectpicker('refresh');

            var departmentId = base.Control.slcDepartment().val();
            base.Ajax.AjaxGetProvince.data = {
                locationId: departmentId
            };
            base.Ajax.AjaxGetProvince.submit();
        },
        slcProvinceChange: function () {
            var provinceId = base.Control.slcProvince().val();
            base.Ajax.AjaxGetDistrict.data = {
                locationId: provinceId
            };
            base.Ajax.AjaxGetDistrict.submit();
        },
        btnSaveClick: function () {
            const birthDate = moment(base.Control.txtBirthDate().val(), 'DD/MM/YYYY');
            const hoy = moment();
            const age = hoy.diff(birthDate, 'years');
            var storeid = base.Control.slcStore().val() == 0 ? null : base.Control.slcStore().val();
            var birthDateData = base.Function.SetBirthDate(base.Control.txtBirthDate().val());
            if (base.Control.txtDocument().val() == "" || base.Control.txtDocument().val().length < 8) {
                Swal.fire("Oops...", "Por favor, ingrese un documento válido", "error");
            }
            else if (base.Control.txtUserName().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un usuario válido", "error");
            }
            else if (base.Control.txtPassword().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese una contraseña válida", "error");
            }
            else if (base.Control.txtPassword().val().length < 5) {
                Swal.fire("Oops...", "La contraseña debe tener un minimo de 5 caracteres", "error");
            }
            else if (base.Control.txtName().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un nombre válido", "error");
            }
            else if (base.Control.txtLastName().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un apellido válido", "error");
            }
            else if (base.Control.txtEmail().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un correo válido", "error");
            }
            else if (base.Control.txtPhone().val() == "" || base.Control.txtPhone().val().length < 9) {
                Swal.fire("Oops...", "Por favor, ingrese un celular válido", "error");
            }
            else if (base.Control.slcProvince().val() == null || base.Control.slcProvince().val() == "0") {
                Swal.fire("Oops...", "Por favor, ingrese una provincia válida", "error");
            }
            else if (base.Control.slcDistrict().val() == null || base.Control.slcDistrict().val() == "0") {
                Swal.fire("Oops...", "Por favor, ingrese un distrito válido", "error");
            }
            else if (age < 18) {
                Swal.fire("Oops...", "Su fecha de nacimiento debe ser mayor a 18 años", "error");
            }
            else {
                var hdnUserIdUrl = base.Control.hdnUserIdUrl().val();
                var patronId = hdnUserIdUrl == null || hdnUserIdUrl == '' ? 0 : hdnUserIdUrl;
                base.Ajax.AjaxRegisterUser.data = {
                    userName: base.Control.txtUserName().val(),
                    typeDocument: base.Control.slcTypeDocument().val(),
                    document: base.Control.txtDocument().val(),
                    names: base.Control.txtName().val(),
                    lastName: base.Control.txtLastName().val(),
                    password: base.Control.txtPassword().val(),
                    mail: base.Control.txtEmail().val(),
                    address: base.Control.txtAddress().val(),
                    countryId: base.Control.slcCountry().val(),
                    departmentId: base.Control.slcDepartment().val(),
                    provinceId: base.Control.slcProvince().val(),
                    districtId: base.Control.slcDistrict().val(),
                    phone: base.Control.txtPhone().val(),
                    ubigeo: base.Control.txtUbigeo().val(),
                    birthDate: birthDateData,
                    profilePicture: "",
                    recognitionName: base.Control.txtRecognitionName().val(),
                    storeId: storeid,
                    patron: patronId,
                    arm: 0,
                };
                base.Ajax.AjaxRegisterUser.submit();
            }
        },
        btnGenerateURLRegisterClick: function () {
            const currentUrl = window.location.href + '/' + base.Parameters.fullNameUrl + '/' + base.Parameters.userIdUrl;
            navigator.clipboard.writeText(currentUrl)
                .then(function () {
                    Swal.fire("Excelente !!", "URL copiada !!", "success")
                })
                .catch(function (err) {
                    console.error('Error al copiar:', err);
                });
        },
    };
    base.Ajax = {
        AjaxGetLogin: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Network.Actions.GetLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetLoginSuccess
        }),
        AjaxRegisterUser: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Network.Actions.RegisterUser,
            autoSubmit: false,
            onSuccess: base.Event.AjaxRegisterUserSuccess
        }),
        AjaxGetDepartment: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Network.Actions.GetDepartment,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDepartmentSuccess
        }),
        AjaxGetProvince: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Network.Actions.GetProvince,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetProvinceSuccess
        }),
        AjaxGetDistrict: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Network.Actions.GetDistrict,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDistrictSuccess
        }),
        AjaxGetStores: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Network.Actions.GetStores,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetStoresSuccess
        }),
    };
    base.Function = {
        SetBirthDate: function (birthDate) {
            const parts = birthDate.split('/');
            if (parts.length === 3) {
                const isoDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
                return isoDate.toISOString(); 
            }
            return null;
        },
        CleanFields: function () {
            base.Control.txtUserName().val("");
            base.Control.slcTypeDocument().val("DNI");
            base.Control.txtDocument().val("");
            base.Control.txtName().val("");
            base.Control.txtLastName().val("");
            base.Control.txtPassword().val("");
            base.Control.txtEmail().val("");
            base.Control.txtAddress().val("");
            base.Control.slcCountry().val("1");
            base.Ajax.AjaxGetDepartment.submit();
            base.Control.slcProvince().empty();
            base.Control.slcProvince().append($('<option>', {
                value: 0,
                text: 'Seleccione'
            }));
            base.Control.slcProvince().selectpicker('refresh');
            base.Control.slcDistrict().empty();
            base.Control.slcDistrict().append($('<option>', {
                value: 0,
                text: 'Seleccione'
            }));
            base.Control.slcDistrict().selectpicker('refresh');
            base.Control.txtPhone().val("");
            base.Control.txtUbigeo().val("");
            base.Control.txtRecognitionName().val("");
            //base.Control.slcArm().val("0");
            base.Control.slcStore().val("0");
            base.Control.txtBirthDate().datepicker("setDate", new Date());
        },
    };
}