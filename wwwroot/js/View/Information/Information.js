ns('MLM.Site.Information.Index')
MLM.Site.Information.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Ajax.AjaxGetDepartment.submit();
        base.Ajax.AjaxGetStores.submit();
        base.Function.GetLogin();
        base.Control.slcDepartment().change(base.Event.slcDepartmentChange);
        base.Control.slcProvince().change(base.Event.slcProvinceChange);
        base.Control.btnUpdateUser().click(base.Event.btnUpdateUserClick);
        base.Control.btnUpdatePassword().click(base.Event.btnUpdatePasswordClick);
    };
    base.Parameters = {
        userId: 0,
        slcProvinceId: 0,
        slcDistrictId: 0,
        dontSetValueDropDown: false,
        imageProfile: "",
    };
    base.Control = {
        hName: function () { return $('#hName'); },
        txtCurrentPassword: function () { return $('#txtCurrentPassword'); },
        txtNewPassword: function () { return $('#txtNewPassword'); },
        btnUpdatePassword: function () { return $('#btnUpdatePassword'); },
        txtUserName: function () { return $('#txtUserName'); },
        txtName: function () { return $('#txtName'); },
        txtLastName: function () { return $('#txtLastName'); },
        slcTypeDocument: function () { return $('#slcTypeDocument'); },
        txtDocument: function () { return $('#txtDocument'); },
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
        txtRuc: function () { return $('#txtRuc'); },
        txtHolderName: function () { return $('#txtHolderName'); },
        txtBank: function () { return $('#txtBank'); },
        txtBankAccount: function () { return $('#txtBankAccount'); },
        txtInterbankAccount: function () { return $('#txtInterbankAccount'); },
        txtDrawOffCount: function () { return $('#txtDrawOffCount'); },
        txtImageName: function () { return $('#txtImageName'); },
        btnUpdateUser: function () { return $('#btnUpdateUser'); },
    };
    base.Event = {
        AjaxGetLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.userId = data.data.userId;
                    base.Function.GetInformationUser();
                }
            }
        },
        AjaxGetDepartmentSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcDepartment().empty();
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
                    $.each(data.data, function (key, value) {
                        base.Control.slcProvince().append($('<option>', {
                            value: value.provinceId,
                            text: value.description
                        }));
                    });
                    if (!base.Parameters.dontSetValueDropDown) {
                        base.Control.slcProvince().val(base.Parameters.slcProvinceId);
                    }
                    base.Control.slcProvince().selectpicker('refresh');
                    base.Parameters.dontSetValueDropDown = false;
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
                    if (!base.Parameters.dontSetValueDropDown) {
                        base.Control.slcDistrict().val(base.Parameters.slcDistrictId);
                    }
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
        AjaxGetUserProfileSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    var storeId = data.data.storeId == null || data.data.storeId == '' ? 0 : data.data.storeId;
                    base.Control.hName().text(data.data.names + ' ' + data.data.lastName);
                    base.Control.txtUserName().val(data.data.userName);
                    base.Control.txtName().val(data.data.names);
                    base.Control.txtLastName().val(data.data.lastName);
                    base.Control.slcTypeDocument().val(data.data.typeDocument);
                    base.Control.txtDocument().val(data.data.document);
                    base.Control.txtEmail().val(data.data.mail);
                    var dateString = data.data.birthDateString.split(' ')[0];
                    base.Control.txtBirthDate().datepicker({
                        autoclose: true
                    }).datepicker("setDate", dateString);
                    base.Control.txtBirthDate().val(dateString);
                    base.Control.txtRecognitionName().val(data.data.recognitionName);
                    base.Control.slcStore().val(storeId);
                    base.Control.slcStore().selectpicker('refresh');
                    base.Control.slcCountry().val(data.data.countryId);
                    base.Control.slcDepartment().val(data.data.departmentId);
                    base.Control.slcDepartment().selectpicker('refresh');
                    base.Parameters.slcProvinceId = data.data.provinceId;
                    base.Parameters.slcDistrictId = data.data.districtId;
                    base.Ajax.AjaxGetProvince.data = {
                        locationId: data.data.departmentId
                    };
                    base.Ajax.AjaxGetProvince.submit();
                    base.Ajax.AjaxGetDistrict.data = {
                        locationId: data.data.provinceId
                    };
                    base.Ajax.AjaxGetDistrict.submit();
                    base.Control.txtAddress().val(data.data.address);
                    base.Control.txtPhone().val(data.data.phone);
                    base.Control.txtUbigeo().val(data.data.ubigeo);
                    base.Control.txtRuc().val(data.data.ruc);
                    base.Control.txtHolderName().val(data.data.holderName);
                    base.Control.txtBank().val(data.data.bank);
                    base.Control.txtBankAccount().val(data.data.bankAccount);
                    base.Control.txtInterbankAccount().val(data.data.interbankAccount);
                    base.Control.txtDrawOffCount().val(data.data.drawOffCount);
                    base.Parameters.imageProfile = data.data.profilePicture;
                    if (base.Parameters.imageProfile != null && base.Parameters.imageProfile != "") {
                        $('#imgProfile').attr('src', "https://api.soynexora.com/StaticFiles/ProfileImg/" + base.Parameters.imageProfile);
                    }
                }
            }
        },
        AjaxUpdatePasswordSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "Su contraseña ha sido actualizada !!", "success")
                }
                else {
                    Swal.fire("Oops...", data.data, "error")
                }
            }
        },
        slcDepartmentChange: function () {
            var departmentId = base.Control.slcDepartment().val();
            base.Parameters.dontSetValueDropDown = true;
            base.Ajax.AjaxGetProvince.data = {
                locationId: departmentId
            };
            base.Ajax.AjaxGetProvince.submit();
        },
        slcProvinceChange: function () {
            var provinceId = base.Control.slcProvince().val();
            base.Parameters.dontSetValueDropDown = true;
            base.Ajax.AjaxGetDistrict.data = {
                locationId: provinceId
            };
            base.Ajax.AjaxGetDistrict.submit();
        },
        btnUpdateUserClick: function () {
            const birthDate = moment(base.Control.txtBirthDate().val(), 'DD/MM/YYYY');
            const hoy = moment();
            const age = hoy.diff(birthDate, 'years');

            if (base.Control.txtDocument().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un documento válido", "error");
            }
            else if (base.Control.txtUserName().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un usuario válido", "error");
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
            else if (base.Control.txtPhone().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un celular válido", "error");
            }
            else if (age < 18) {
                Swal.fire("Oops...", "Su fecha de nacimiento debe ser mayor a 18 años", "error");
            }
            else {

                var formData = new FormData();
                var fileNameProfile = "";
                var fileInput = $('#txtImageName')[0].files[0];
                if (fileInput) {
                    formData.append('file', fileInput);
                    fileNameProfile = fileInput.name;
                }
                else {
                    fileNameProfile = base.Parameters.imageProfile;
                }
                var storeid = base.Control.slcStore().val() == 0 ? null : base.Control.slcStore().val();
                formData.append('TypeDocument', base.Control.slcTypeDocument().val());
                formData.append('Document', base.Control.txtDocument().val());
                formData.append('UserName', base.Control.txtUserName().val());
                formData.append('Names', base.Control.txtName().val());
                formData.append('LastName', base.Control.txtLastName().val());
                formData.append('Mail', base.Control.txtEmail().val());
                formData.append('Address', base.Control.txtAddress().val());
                formData.append('CountryId', base.Control.slcCountry().val());
                formData.append('DepartmentId', base.Control.slcDepartment().val());
                formData.append('ProvinceId', base.Control.slcProvince().val());
                formData.append('DistrictId', base.Control.slcDistrict().val());
                formData.append('Phone', base.Control.txtPhone().val());
                formData.append('Ubigeo', base.Control.txtUbigeo().val());
                formData.append('BirthDate', base.Control.txtBirthDate().val());
                formData.append('RecognitionName', base.Control.txtRecognitionName().val());
                formData.append('Bank', base.Control.txtBank().val());
                formData.append('BankAccount', base.Control.txtBankAccount().val());
                formData.append('InterbankAccount', base.Control.txtInterbankAccount().val());
                formData.append('DrawOffCount', base.Control.txtDrawOffCount().val());
                formData.append('Ruc', base.Control.txtRuc().val());
                formData.append('HolderName', base.Control.txtHolderName().val());
                formData.append('StoreId', storeid);
                formData.append('ProfilePicture', fileNameProfile);

                $.ajax({
                    url: MLM.Site.Information.Actions.UpdateUser,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                if (data.data.status) {
                                    base.Control.txtImageName().val('');
                                    Swal.fire("Excelente !!", "Sus datos han sido actualizados !!", "success")
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
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Upload failed:', textStatus, errorThrown);
                    }
                });
            }
        },
        btnUpdatePasswordClick: function () {
            if (base.Control.txtNewPassword().val().length < 5) {
                Swal.fire("Oops...", "La nueva contraseña debe tener un minimo de 5 caracteres", "error");
            }
            else {
                base.Ajax.AjaxUpdatePassword.data = {
                    userName: base.Control.txtUserName().val(),
                    currentPassword: base.Control.txtCurrentPassword().val(),
                    newPassword: base.Control.txtNewPassword().val(),
                };
                base.Ajax.AjaxUpdatePassword.submit();
            }
        },
    };
    base.Ajax = {
        AjaxGetLogin: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Information.Actions.GetLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetLoginSuccess
        }),
        AjaxGetUserProfile: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Information.Actions.GetUserProfile,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetUserProfileSuccess
        }),
        AjaxUpdateUser: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Information.Actions.UpdateUser,
            autoSubmit: false,
            onSuccess: base.Event.AjaxUpdateUserSuccess
        }),
        AjaxUpdatePassword: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Information.Actions.UpdatePassword,
            autoSubmit: false,
            onSuccess: base.Event.AjaxUpdatePasswordSuccess
        }),
        AjaxGetDepartment: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Information.Actions.GetDepartment,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDepartmentSuccess
        }),
        AjaxGetProvince: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Information.Actions.GetProvince,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetProvinceSuccess
        }),
        AjaxGetDistrict: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Information.Actions.GetDistrict,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDistrictSuccess
        }),
        AjaxGetStores: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Information.Actions.GetStores,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetStoresSuccess
        }),
    };
    base.Function = {
        GetLogin: function () {
            base.Ajax.AjaxGetLogin.submit();
        },
        GetInformationUser: function () {
            base.Ajax.AjaxGetUserProfile.data = {
                userId: base.Parameters.userId
            };
            base.Ajax.AjaxGetUserProfile.submit();
        },
    };
}