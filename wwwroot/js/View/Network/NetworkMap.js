ns('MLM.Site.NetworkMap.Index')
MLM.Site.NetworkMap.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Ajax.AjaxGetNetworkPeriodForMLM.submit();
        base.Control.btnFilter().click(base.Event.btnFilterClick);
        base.Function.clsRedUplineClick();
    };
    base.Parameters = {
        uplines: [],
        minimized: "",
        index: 0
    };
    base.Control = {
        btnFilter: function () { return $('#btnFilter'); },
        slcNetworkPeriod: function () { return $('#slcNetworkPeriod'); },
        tbodyData: function () { return $('#tbodyData'); },
        spnTE: function () { return $('#TE'); },
        spnAE: function () { return $('#AE'); },
        spnNE: function () { return $('#NE'); },
        spnIE: function () { return $('#IE'); },
    };
    base.Event = {
        AjaxGetNetworkPeriodForMLMSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcNetworkPeriod().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcNetworkPeriod().append($('<option>', {
                            value: value.networkPeriodId,
                            text: value.periodName
                        }));
                    });
                    base.Control.slcNetworkPeriod().selectpicker('refresh');
                    base.Function.GetUserNetworkMap();
                }
            }
        },
        AjaxGetUserNetworkSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.spnTE().text(data.data.networkFeed.totalEntrepreneurs);
                    base.Control.spnAE().text(data.data.networkFeed.activeEntrepreneurs);
                    base.Control.spnNE().text(data.data.networkFeed.newEntrepreneurs);
                    base.Control.spnIE().text(data.data.networkFeed.inactiveEntrepreneurs);
                    base.Function.FillDataUser(data.data.userNetwork);
                }
            }
        },
        AjaxGetPatronNetworkSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Function.FillDataRed(data.data);
                }
            }
        },
        btnFilterClick: function () {
            base.Parameters.minimized = "";
            base.Function.GetUserNetworkMap();
        },
    };
    base.Ajax = {
        AjaxGetNetworkPeriodForMLM: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.NetworkMap.Actions.GetNetworkPeriodForMLM,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetNetworkPeriodForMLMSuccess
        }),
        AjaxGetUserNetwork: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.NetworkMap.Actions.GetUserNetwork,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetUserNetworkSuccess
        }),
        AjaxGetPatronNetwork: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.NetworkMap.Actions.GetPatronNetwork,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetPatronNetworkSuccess
        }),
    };
    base.Function = {
        GetUserNetworkMap: function () {
            base.Ajax.AjaxGetUserNetwork.data = {
                userId: 0,
                networkPeriodId: base.Control.slcNetworkPeriod().val()
            };
            base.Ajax.AjaxGetUserNetwork.submit();
        },
        FillDataUser: function (data) {
            var display = "", color = "";

            if (data.pp < 100) {
                color = "--bs-table-color: red;";
            }
            if (data.networkQuantity == "0") {
                display = "display:none;";
            }
            var DatosArray = {};
            DatosArray['userId'] = data.userId;
            DatosArray['idUpline'] = data.patronId;
            base.Parameters.uplines.push(DatosArray);

            base.Control.tbodyData().empty();
            base.Control.tbodyData().append('' +
                '<tr id="tr' + data.userId + '" style="text-align: center; '+color+'">' +
                '<td style="text-align: left;">' + '<button style="outline: none; box-shadow: none" id="btn' + data.userId + '" style="' + display + '" value="' + data.userId + '" type="button" title="red" class="btn style-button-red btn-redU"><label style="cursor: pointer;" id="sig' + data.userId + '"/></button>&nbsp;<label id="lbl' + data.userId + '">0</label>' + '</td>' +
                '<td>' + data.userId + '</td>' +
                '<td>' + data.names + '</td>' +
                '<td>' + data.pp + '</td>' +
                '<td>' + data.elite + '</td>' +
                '<td>' + data.vp + '</td>' +
                '<td>' + data.vpa + '</td>' +
                '<td>' + data.vg + '</td>' +
                '<td>' + data.vq + '</td>' +
                '<td>' + data.range + '</td>' +
                '<td>' + data.maximumRange + '</td>' +
                '<td style="text-align: center;">' + data.phone + '</td>' +
                '</tr>');
            if (data.networkQuantity != "0") {
                $('#sig' + data.userId + '').text("▼");
            }
        },
        FillDataRed: function (listData) {
            var d = '', line = 0, myArray = [];

            listData.forEach(function (data) {
                var display = "", color = "", style = "";
                line = parseInt($('#lbl' + data.patronId + '').text()) + 1;

                if (data.pp < 100) {
                    color = "--bs-table-color: red;";
                }
                if (data.networkQuantity == "0") {
                    display = "display:none;";
                }
                if (data.networkQuantity == "0") {
                    display = "display:none;";
                    style = " margin-left:25px;";
                } else {
                    display = "margin-left: -9px;outline: none;box-shadow: none;";
                }

                d += '' +
                    '<tr id="tr' + data.userId + '" style="text-align: center;' + color + '">' +
                    '<td style="text-align: left;">' + '<button id="btn' + data.userId + '" style="' + display + '" value="' + data.userId + '" type="button" title="red" class="btn btn-ft style-button-red btn-redU"><label style="cursor: pointer" id="sig' + data.userId + '"/></button>&nbsp;<label style="' + style + '" id="lbl' + data.userId + '">' + line + '</label>' + '</td>' +
                    '<td>' + data.userId + '</td>' +
                    '<td>' + data.names + '</td>' +
                    '<td>' + data.pp + '</td>' +
                    '<td>' + data.elite + '</td>' +
                    '<td>' + data.vp + '</td>' +
                    '<td>' + data.vpa + '</td>' +
                    '<td>' + data.vg + '</td>' +
                    '<td>' + data.vq + '</td>' +
                    '<td>' + data.range + '</td>' +
                    '<td>' + data.maximumRange + '</td>' +
                    '<td style="text-align: center;">' + data.phone + '</td>' +
                    '</tr>';
                var arrayData = {};
                arrayData['userId'] = data.userId;
                arrayData['idUpline'] = data.patronId;
                myArray.push(arrayData);
                base.Parameters.uplines.push(arrayData);
            });

            //if (data.networkQuantity != "0") {
            //    $('#sig' + data.userId + '').text("▼");
            //}

            $('#tbodyData > tr').eq(base.Parameters.index).after(d);
            var upline = listData[0].patronId, bucle = [];

            while (upline != "") {
                var dataUpline = {};
                dataUpline['id'] = upline;
                bucle.push(dataUpline);
                upline = this.GetUpline(upline);
            }

            for (var i = 0; i < myArray.length; i++) {
                $('#sig' + myArray[i].userId + '').text("▼");
                var element = document.getElementById("tr" + myArray[i].userId + "");
                element.classList.add(myArray[i].idUpline);
                for (var d = 0; d < bucle.length; d++) {
                    element.classList.add(bucle[d].id);
                }
            }
        },
        GetUplineArray: function (userId) {
            var upline = base.Parameters.uplines.filter(function (e) {
                return e.idUpline == userId;
            });
            return upline;
        },
        GetUpline: function (userId) {
            var upline = base.Parameters.uplines.filter(function (e) {
                return e.userId == userId;
            });
            if (upline.length == 0) { return ""; }
            return upline[0].idUpline;
        },
        DisplayNetwork: function (userId) {
            base.Ajax.AjaxGetPatronNetwork.data = {
                patronId: userId,
                networkPeriodId: base.Control.slcNetworkPeriod().val()
            };
            base.Ajax.AjaxGetPatronNetwork.submit();
        },
        clsRedUplineClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.btn-redU', function () {
                var userId = $(this).attr('value');
                base.Parameters.index = $(this).parent().parent().index();
                var BtnTexto = $('#sig' + userId + '').text();
                if (BtnTexto == "▼") {
                    if (base.Parameters.minimized != userId) {
                        $('#sig' + userId + '').text("▲");
                        $('#lbl' + userId + '').val("0");
                        base.Function.DisplayNetwork(userId);
                    } else {
                        $('#sig' + userId + '').text("▲");
                        var showArray = base.Function.GetUplineArray(userId);
                        for (var i = 0; i < showArray.length; i++) {
                            $('#tr' + showArray[i].userId + '').show();
                            $('#sig' + showArray[i].userId + '').text("▼");
                        }
                    }
                } else {
                    $('#sig' + userId + '').text("▼");
                    $('.' + userId + '').hide();
                    base.Parameters.minimized = userId;
                }
            });
        },
    };
}



//var data, index = 0, tabla, combo = "0", uplines = [], minimisado = "";
//sendDataAjax();
//$("#btnFiltro").click(function (e) {
//    minimisado = "";
//    sendDataAjax();
//});

//$.ajax({
//    type: "POST",
//    url: "MapaDeRed.aspx/ListaPeriodos",
//    data: "{}",
//    contentType: "application/json; charset=utf-8",
//    dataType: "json",
//    async: false,
//    success: function (result) {
//        $("#cboPeriodo").empty();
//        $("#cboPeriodo").append("<option value='0'>Seleccione periodo</option>");
//        $.each(result.d, function (key, value) {
//            $("#cboPeriodo").append($("<option></option>").val(value.idPeriodo).html(value.nombre));
//        });
//    },
//    error: function (XMLHttpRequest, textStatus, errorThrown) {
//        alert(textStatus + ": " + XMLHttpRequest.responseText);
//    }
//});

//function sendDataAjax() {
//    var idperiodo = $('#cboPeriodo').val();
//    if (idperiodo == null) {
//        idperiodo = 0;
//    }
//    var obj = JSON.stringify({
//        idPeriodoS: idperiodo
//    });
//    $.ajax({
//        type: "POST",
//        url: "MapaRedSocios.aspx/ListarEstructuraPropio",
//        data: obj,
//        contentType: 'application/json; charset=utf-8',
//        error: function (xhr, ajaxOptions, throwError) {
//            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
//        },
//        success: function (data) {
//            $('#TS').text(data.d[0].TOTALSOCIOS);
//            $('#AS').text(data.d[0].ACTIVOS_SOCIOS);
//            $('#NS').text(data.d[0].NUEVOS_SOCIOS);
//            $('#IS').text(data.d[0].INACTIVOS_SOCIOS);
//            addRowDT(data.d);
//        }
//    });
//}

//function addRowDT(obj) {
//    $("#tbl_red tbody tr").remove();
//    var d = '';
//    for (var i = 0; i < obj.length; i++) {
//        var display = "", color = "";
//        if (obj[i].RED == "0") {
//            display = "display:none;";
//        }
//        if (parseFloat(obj[i].PP) < 30) {
//            color = "color: red;";
//        }
//        var DatosArray = {};
//        DatosArray['idSocio'] = obj[i].IDSOCIO;
//        DatosArray['idUpline'] = obj[i].IDUPLINE;
//        uplines.push(DatosArray);
//        d += '<tr id="tr' + obj[i].IDSOCIO + '" style="' + color + '">' +
//            '<td style="text-align: left;">' + '<button style="outline: none; box-shadow: none" id="btn' + obj[i].IDSOCIO + '" style="' + display + '" value="red" type="button" title="red" class="btn style-button-red btn-redU"><label style="cursor: pointer;" id="sig' + obj[i].IDSOCIO + '"/></button>&nbsp;<label id="lbl' + obj[i].IDSOCIO + '">0</label>' + '</td>' +
//            '<td>' + obj[i].USUARIO + '</td>' +
//            '<td>' + obj[i].NOMBRES + '</td>' +
//            '<td style ="display:none;">' + obj[i].CORAZONES + '</td>' +
//            '<td>' + obj[i].PP + '</td>' +
//            '<td>' + obj[i].VIP + '</td>' +
//            '<td>' + obj[i].VP_REAL + '</td>' +
//            '<td>' + obj[i].VP + '</td>' +
//            '<td>' + obj[i].VG + '</td>' +
//            '<td>' + obj[i].VQ + '</td>' +
//            '<td>' + obj[i].Rango + '</td>' +
//            '<td>' + obj[i].MAXIMORANGO + '</td>' +
//            '<td>' + obj[i].Telefono + '</td>' +
//            '<td>' + obj[i].Pais + '</td>' +
//            '<td style ="display:none;">' + obj[i].IDSOCIO + '</td>' +
//            '<td style ="display:none;">' + obj[i].IDUPLINE + '</td>' +
//            '</tr>';
//    }
//    $("#tbl_red").append(d);
//    $('#sig' + obj[0].IDSOCIO + '').text("▼");
//}

//////FUNCIONES PARA RED
//$(document).on('click', '.btn-redU', function (e) {
//    e.preventDefault();

//    var row = $(this).parent().parent()[0];
//    index = $(this).parent().parent().index();
//    var idSocio = row.cells[14].innerHTML;
//    var BtnTexto = $('#sig' + idSocio + '').text();
//    if (BtnTexto == "▼") {
//        if (minimisado != idSocio) {
//            $('#sig' + idSocio + '').text("▲");
//            $('#lbl' + idSocio + '').val("0");
//            IncrementaRed(idSocio);
//        } else {
//            $('#sig' + idSocio + '').text("▲");
//            var showArray = ObtenerArrayUpline(idSocio);
//            for (var i = 0; i < showArray.length; i++) {
//                $('#tr' + showArray[i].idSocio + '').show();
//                $('#sig' + showArray[i].idSocio + '').text("▼");
//            }
//        }
//    } else {
//        $('#sig' + idSocio + '').text("▼");
//        $('.' + idSocio + '').hide();
//        minimisado = idSocio;
//    }
//});

//function IncrementaRed(idcliente) {

//    var idperiodo = $('#cboPeriodo').val();
//    if (idperiodo == null) {
//        idperiodo = 0;
//    }
//    var obj = JSON.stringify({
//        idClienteS: idcliente, idPeriodoS: idperiodo
//    });
//    $.ajax({
//        type: "POST",
//        url: "MapaRedSocios.aspx/ListarEstructuraRed",
//        data: obj,
//        contentType: 'application/json; charset=utf-8',
//        error: function (xhr, ajaxOptions, throwError) {
//            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
//        },
//        success: function (data) {
//            addRowDTRed(data.d);
//        }
//    });
//}

//function addRowDTRed(obj) {
//    var d = '', linea = 0, myArray = [];
//    for (var i = 0; i < obj.length; i++) {
//        var display = "", style = "", color = "";
//        linea = parseInt($('#lbl' + obj[i].IDUPLINE + '').text()) + 1;
//        if (obj[i].RED == "0") {
//            display = "display:none;";
//            style = " margin-left:12.84px;";
//        } else {
//            display = "margin-left: -9px;outline: none;box-shadow: none;";
//        }
//        if (parseFloat(obj[i].PP) < 30) {
//            color = "color: red;";
//        }
//        d += '<tr id="tr' + obj[i].IDSOCIO + '" style="' + color + '">' +
//            '<td style="text-align: left;">' + '<button id="btn' + obj[i].IDSOCIO + '" style="' + display + '" value="red" type="button" title="red" class="btn btn-ft style-button-red btn-redU"><label style="cursor: pointer" id="sig' + obj[i].IDSOCIO + '"/></button>&nbsp;<label style="' + style + '" id="lbl' + obj[i].IDSOCIO + '">' + linea + '</label>' + '</td>' +
//            '<td>' + obj[i].USUARIO + '</td>' +
//            '<td>' + obj[i].NOMBRES + '</td>' +
//            '<td style ="display:none;">' + obj[i].CORAZONES + '</td>' +
//            '<td>' + obj[i].PP + '</td>' +
//            '<td>' + obj[i].VIP + '</td>' +
//            '<td>' + obj[i].VP_REAL + '</td>' +
//            '<td>' + obj[i].VP + '</td>' +
//            '<td>' + obj[i].VG + '</td>' +
//            '<td>' + obj[i].VQ + '</td>' +
//            '<td>' + obj[i].Rango + '</td>' +
//            '<td>' + obj[i].MAXIMORANGO + '</td>' +
//            '<td>' + obj[i].Telefono + '</td>' +
//            '<td>' + obj[i].Pais + '</td>' +
//            '<td style ="display:none;">' + obj[i].IDSOCIO + '</td>' +
//            '<td style ="display:none;">' + obj[i].IDUPLINE + '</td>' +
//            '</tr>';
//        var DatosArray = {};
//        DatosArray['idSocio'] = obj[i].IDSOCIO;
//        DatosArray['idUpline'] = obj[i].IDUPLINE;
//        myArray.push(DatosArray);
//        uplines.push(DatosArray);
//    }

//    $('#tbl_red > tbody > tr').eq(index).after(d);
//    var upline = obj[0].IDUPLINE, bucle = [];

//    while (upline != "") {
//        var Datos = {};
//        Datos['id'] = upline;
//        bucle.push(Datos);
//        upline = ObtenerUpline(upline);
//    }

//    for (var i = 0; i < myArray.length; i++) {
//        $('#sig' + myArray[i].idSocio + '').text("▼");
//        var element = document.getElementById("tr" + myArray[i].idSocio + "");
//        element.classList.add(myArray[i].idUpline);
//        for (var d = 0; d < bucle.length; d++) {
//            element.classList.add(bucle[d].id);
//        }
//    }
//}

//function ObtenerUpline(dato) {
//    var upline = uplines.filter(function (e) {
//        return e.idSocio == dato;
//    });
//    if (upline.length == 0) { return ""; }
//    return upline[0].idUpline;
//}

//function ObtenerArrayUpline(dato) {
//    var upline = uplines.filter(function (e) {
//        return e.idUpline == dato;
//    });
//    return upline;
//}