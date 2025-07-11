ns('MLM.Site.HistoricalOrder.Index')
MLM.Site.HistoricalOrder.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Ajax.AjaxGetTypePayments.submit();
        base.Function.clsNumberPagination();
        base.Control.btnSearch().click(base.Event.btnSearchClick);
        base.Control.btnSavePayment().click(base.Event.btnSavePaymentClick);
        base.Function.clsShowPaymentClick();
        base.Function.clsDetailOrderClick();
        base.Function.clsDeleteOrderClick();
        base.Function.clsNumberPaginationModal();
    };
    base.Parameters = {
        storeId: 0,
        purchaseId: 0,
        currentPage: 1,
        currentPageModal: 1,
        totalPages: 1,
        totalPagesModal: 1,
        sizePagination: 10,
        sizePaginationModal: 4
    };
    base.Control = {
        btnClear: function () { return $('#btnClear'); },
        btnSearch: function () { return $('#btnSearch'); },
        tbodyTable: function () { return $('#tbodyOrder'); },
        divPagination: function () { return $('#pagination'); },
        divPaginationModal: function () { return $('#paginationModal'); },
        tbodyDetailOrder: function () { return $('#tbodyDetailOrder'); },
        txtStartDate: function () { return $('#txtStartDate'); },
        txtEndDate: function () { return $('#txtEndDate'); },
        txtAmountPay: function () { return $('#txtAmountPay'); },
        txtVoucher: function () { return $('#txtVoucher'); },
        slcBank: function () { return $('#slcBank'); },
        txtOperationNumber: function () { return $('#txtOperationNumber'); },
        txtPaymentDate: function () { return $('#txtPaymentDate'); },
        btnSavePayment: function () { return $('#btnSavePayment'); },
        modalUpdate: function () { return $('#modalUpdate'); },
        modalPayment: function () { return $('#modalPayment'); },
        slcTypePayment: function () { return $('#slcTypePayment'); },
        slcStatusPurchase: function () { return $('#slcStatusPurchase'); },
    };
    base.Event = {
        AjaxGetTypePaymentsSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcTypePayment().empty();
                    base.Control.slcTypePayment().append($('<option>', {
                        value: '0',
                        text: 'Todos'
                    }));
                    $.each(data.data, function (key, value) {
                        base.Control.slcTypePayment().append($('<option>', {
                            value: value.description,
                            text: value.description
                        }));
                    });
                    base.Control.slcTypePayment().selectpicker('refresh');
                    base.Function.GetHistoricalOrder();
                }
            }
        },
        AjaxGetPurchasesByUserSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.FillData(data.data.purchasesByUsers);
                }
            }
        },
        btnSearchClick: function () {
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetPurchasesByUser.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                userId: 0,
                storeId: 0,
                typePayment: base.Control.slcTypePayment().val(),
                statusPurchase: base.Control.slcStatusPurchase().val()
            };
            base.Ajax.AjaxGetPurchasesByUser.submit();
        },
        btnSavePaymentClick: function () {
            var fileInput = $('#txtVoucher')[0].files[0];
            if (base.Control.txtOperationNumber().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un Número de Operación válido", "error")
            }
            else if (!fileInput) {
                Swal.fire("Oops...", "Por favor, adjunto un archivo válido", "error")
            }
            else {
                var formData = new FormData();
                formData.append('file', fileInput);
                formData.append('imageUrl', "");
                formData.append('purchaseId', base.Parameters.purchaseId);
                formData.append('bank', base.Control.slcBank().val());
                formData.append('operatingNumber', base.Control.txtOperationNumber().val());
                formData.append('paymentDate', base.Control.txtPaymentDate().val());

                $.ajax({
                    url: MLM.Site.HistoricalOrder.Actions.SavePaymentDeposit,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                base.Control.txtVoucher().val('');
                                Swal.fire("Excelente !!", "El pago ha sido enviado !!", "success")
                                base.Control.modalPayment().modal('hide');
                                base.Function.GetHistoricalOrder();
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
        AjaxGetDetailPurchasesByPurchaseSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPagesModal = data.data.totalPages;
                    base.Function.FillDataDetailOrderIntoModal(data.data.detailPurchaseByPurchases);
                    base.Control.modalUpdate().modal('show');
                }
            }
        },
        AjaxDeletePurchaseSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Function.GetHistoricalOrder();
                    Swal.fire("Excelente !!", "El pedido fue eliminado !!", "success")
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                }
            }
        },
    };
    base.Ajax = {
        AjaxGetTypePayments: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.HistoricalOrder.Actions.GetTypePayments,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetTypePaymentsSuccess
        }),
        AjaxGetPurchasesByUser: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.HistoricalOrder.Actions.GetPurchasesByUser,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetPurchasesByUserSuccess
        }),
        AjaxGetDetailPurchasesByPurchase: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.HistoricalOrder.Actions.GetDetailPurchasesByPurchase,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDetailPurchasesByPurchaseSuccess
        }),
        AjaxDeletePurchase: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.HistoricalOrder.Actions.DeletePurchase,
            autoSubmit: false,
            onSuccess: base.Event.AjaxDeletePurchaseSuccess
        }),
    };
    base.Function = {
        GetHistoricalOrder: function () {
            base.Ajax.AjaxGetPurchasesByUser.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                userId: 0,
                storeId: 0,
                typePayment: base.Control.slcTypePayment().val(),
                statusPurchase: base.Control.slcStatusPurchase().val()
            };
            base.Ajax.AjaxGetPurchasesByUser.submit();
        },
        clsNumberPagination: function () {
            var parentElement = $(document);
            parentElement.on('click', '.number-page', function () {
                var page = $(this).text();
                if (page === '«') {
                    if (base.Parameters.currentPage > 1) {
                        base.Parameters.currentPage--;
                    }
                } else if (page === '»') {
                    if (base.Parameters.currentPage < base.Parameters.totalPages) {
                        base.Parameters.currentPage++;
                    }
                } else if (page === '..') {
                    base.Parameters.currentPage = parseInt($(this).attr('value-hidden'));
                } else {
                    base.Parameters.currentPage = parseInt(page);
                }
                base.Function.GetHistoricalOrder();
            });
        },
        FillData: function (listData) {
            base.Control.tbodyTable().empty();
            listData.forEach(function (data) {
                var urlVoucher = 'https://api.soynexora.com/StaticFiles/PaymentImg/' + data.imageUrl;
                var styleVoucher = data.imageUrl == '' || data.imageUrl == null ? "display:none;" : "";
                var styleStatus = data.statusPurchase == 'Validada' ? "display:none;" : "";
                var dateFormat = moment(data.creationTime).format('DD/MM/YYYY HH:mm:ss');
                base.Control.tbodyTable().append('<tr style="text-align: center;">' +
                    '<td>' +
                    '<div class="dropdown" style="position: static;">' +
                    '<button type="button" class="btn btn-success light sharp" data-bs-toggle="dropdown">' +
                    '<svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">' +
                    '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
                    '<rect x="0" y="0" width="24" height="24" /><circle fill="#000000" cx="5" cy="12" r="2" /><circle fill="#000000" cx="12" cy="12" r="2" /><circle fill="#000000" cx="19" cy="12" r="2" />' +
                    '</g>' +
                    '</svg>' +
                    '</button>' +
                    '<div class="dropdown-menu">' +
                    '<a class="dropdown-item updateData" value="' + data.purchaseId + '" href="#">Detalle</a>' +
                    '<a class="dropdown-item detailPayment" style="' + styleStatus + '" value="' + data.purchaseId + '" href="#">Adjuntar Pago</a>' +
                    '<a class="dropdown-item deleteData" style="' + styleStatus + '" value="' + data.purchaseId + '" href="#">Eliminar</a>' +
                    '</div>' +
                    '</div></td>' +
                    '<td><strong>' + data.purchaseId + '</strong></td>' +
                    '<td id="tdAmount' + data.purchaseId + '" >' + data.netAmount + '</td>' +
                    '<td>' + data.realPoints + '</td>' +
                    '<td>' + data.promotionPoints + '</td>' +
                    '<td>' + data.statusPurchase + '</td>' +
                    '<td>' + dateFormat + '</td>' +
                    '<td>' + data.storeName + '</td>' +
                    '<td>' + data.typePurchase + '</td>' +
                    '<td>' + data.typePayment + '</td>' +
                    '<td>' + data.typeDocumentReceipt + '</td>' +
                    '<td>' + data.receipt + '</td>' +
                    '<td>' +
                    '<div style="' + styleVoucher + '">' +
                    '<a href = "' + urlVoucher + '" class= "btn btn-primary shadow btn-s sharp me-1" target="_blank">' +
                    '<i class="fa-solid fa-ticket"></i>' +
                    '</a>' +
                    '</div></td>' +
                    '</tr>');
            });
            base.Function.UpdatePagination();
        },
        UpdatePagination: function () {
            base.Control.divPagination().empty();
            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link number-page" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPages <= 5) {
                for (var i = 1; i <= base.Parameters.totalPages; i++) {
                    var classBackground = (i === base.Parameters.currentPage) ? 'backgroundPurpleButtonMLM' : '';
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link ' + classBackground + '" href="#">' + i + '</a></li>');
                }
            } else {
                var startPage = Math.max(1, base.Parameters.currentPage - 2);
                var endPage = Math.min(base.Parameters.totalPages, base.Parameters.currentPage + 2);

                if (base.Parameters.currentPage >= base.Parameters.totalPages - 2) {
                    startPage = base.Parameters.totalPages - 4;
                }

                if (startPage > 1) {
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link number-page" href="#">1</a></li>');
                    if (startPage > 2) {
                        if (base.Parameters.currentPage != base.Parameters.totalPages) {
                            endPage--;
                        }
                        startPage++;
                        var valueHidden = startPage - 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link number-page" href="#">..</a></li>');
                    }
                }

                for (var i = startPage; i <= endPage; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link number-page" href="#">' + i + '</a></li>');
                }

                if (endPage < base.Parameters.totalPages) {
                    if (endPage < base.Parameters.totalPages - 1) {
                        var valueHidden = endPage + 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link number-page" href="#">..</a></li>');
                    }
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link number-page" href="#">' + base.Parameters.totalPages + '</a></li>');
                }
            }

            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link number-page" href="#" id="next">»</a></li>');
        },
        clsDetailOrderClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.updateData', function () {
                base.Parameters.currentPageModal = 1;
                var purchaseId = $(this).attr('value');
                base.Parameters.purchaseId = purchaseId;
                base.Function.FillDataOrderDetailIntoModal(purchaseId);
            });
        },
        clsDeleteOrderClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.deleteData', function () {
                var purchaseId = $(this).attr('value');
                Swal.fire({
                    title: "Estás segur@ de eliminar el pedido?",
                    text: "Esto no se puede revertir!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, eliminar!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        base.Ajax.AjaxDeletePurchase.data = {
                            purchaseId: purchaseId
                        };
                        base.Ajax.AjaxDeletePurchase.submit();
                    }
                });
            });
        },
        clsShowPaymentClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.detailPayment', function () {
                var purchaseId = $(this).attr('value');
                base.Parameters.purchaseId = purchaseId;
                var amountPay = $("#tdAmount" + purchaseId).text();
                base.Control.txtAmountPay().val(amountPay);
                base.Control.txtPaymentDate().datepicker("setDate", new Date());
                base.Control.modalPayment().modal('show');
            });
        },
        FillDataOrderDetailIntoModal: function (purchaseId) {
            base.Ajax.AjaxGetDetailPurchasesByPurchase.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                purchaseId: purchaseId
            };
            base.Ajax.AjaxGetDetailPurchasesByPurchase.submit();
        },
        FillDataDetailOrderIntoModal: function (listDetail) {
            base.Control.tbodyDetailOrder().empty();
            listDetail.forEach(function (data) {
                base.Control.tbodyDetailOrder().append('<tr style="text-align: center;">' +
                    '<td>' + data.productName + '</td>' +
                    '<td><img src="https://api.soynexora.com/StaticFiles/ProductsImg/' + data.imageName + '" style="height: 80px"></td>' +
                    '<td>' + data.quantity + '</td>' +
                    '<td>' + data.subtotalNetAmount + '</td>' +
                    '<td>' + data.subtotalPoints + '</td>' +
                    '<td style="text-align: center;">' + data.subtotalPointsNetwork + '</td>' +
                    '</tr>');
            });
            base.Function.UpdatePaginationModal();
        },
        UpdatePaginationModal: function () {
            base.Control.divPaginationModal().empty();
            base.Control.divPaginationModal().append('<li class="page-item page-indicator"><a class="page-link number-page-modal" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPagesModal <= 5) {
                for (var i = 1; i <= base.Parameters.totalPagesModal; i++) {
                    base.Control.divPaginationModal().append('<li class="page-item ' + (i === base.Parameters.currentPageModal ? 'active' : '') + '"><a class="page-link number-page-modal" href="#">' + i + '</a></li>');
                }
            } else {
                var startPage = Math.max(1, base.Parameters.currentPageModal - 2);
                var endPage = Math.min(base.Parameters.totalPagesModal, base.Parameters.currentPageModal + 2);

                if (base.Parameters.currentPageModal >= base.Parameters.totalPagesModal - 2) {
                    startPage = base.Parameters.totalPagesModal - 4;
                }

                if (startPage > 1) {
                    base.Control.divPaginationModal().append('<li class="page-item"><a class="page-link number-page-modal" href="#">1</a></li>');
                    if (startPage > 2) {
                        if (base.Parameters.currentPageModal != base.Parameters.totalPagesModal) {
                            endPage--;
                        }
                        startPage++;
                        var valueHidden = startPage - 1;
                        base.Control.divPaginationModal().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link number-page-modal" href="#">..</a></li>');
                    }
                }

                for (var i = startPage; i <= endPage; i++) {
                    base.Control.divPaginationModal().append('<li class="page-item ' + (i === base.Parameters.currentPageModal ? 'active' : '') + '"><a class="page-link number-page-modal" href="#">' + i + '</a></li>');
                }

                if (endPage < base.Parameters.totalPagesModal) {
                    if (endPage < base.Parameters.totalPagesModal - 1) {
                        var valueHidden = endPage + 1;
                        base.Control.divPaginationModal().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link number-page-modal" href="#">..</a></li>');
                    }
                    base.Control.divPaginationModal().append('<li class="page-item"><a class="page-link number-page-modal" href="#">' + base.Parameters.totalPagesModal + '</a></li>');
                }
            }

            base.Control.divPaginationModal().append('<li class="page-item page-indicator"><a class="page-link number-page-modal" href="#" id="next">»</a></li>');
        },
        clsNumberPaginationModal: function () {
            var parentElement = $(document);
            parentElement.on('click', '.number-page-modal', function () {
                var page = $(this).text();
                if (page === '«') {
                    if (base.Parameters.currentPageModal > 1) {
                        base.Parameters.currentPageModal--;
                    }
                } else if (page === '»') {
                    if (base.Parameters.currentPageModal < base.Parameters.totalPagesModal) {
                        base.Parameters.currentPageModal++;
                    }
                } else if (page === '..') {
                    base.Parameters.currentPageModal = parseInt($(this).attr('value-hidden'));
                } else {
                    base.Parameters.currentPageModal = parseInt(page);
                }
                base.Function.GetDetailPurchasesUser();
            });
        },
        GetDetailPurchasesUser: function () {
            base.Ajax.AjaxGetDetailPurchasesByPurchase.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                purchaseId: purchaseId
            };
            base.Ajax.AjaxGetDetailPurchasesByPurchase.submit();
        },
        
    };
}