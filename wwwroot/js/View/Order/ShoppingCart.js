ns('MLM.Site.ShoppingCart.Index')
MLM.Site.ShoppingCart.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Ajax.AjaxGetTypePayments.submit();
        base.Function.clsNumberPagination();
        base.Function.clsAddNumber();
        base.Function.clsSubNumber();
        base.Function.clsUpdtToOrder();
        base.Function.clsDltToOrder();
        base.Control.slcTypePurchase().change(base.Event.slcTypePurchaseChange);
        base.Control.slcStore().change(base.Event.slcStoreChange);
        base.Control.slcTypePayment().change(base.Event.slcTypePaymentChange);
        base.Control.slcTypeDocumentReceipt().change(base.Event.slcTypeDocumentReceiptChange);
        base.Control.btnCompletedOrder().click(base.Event.btnCompletedOrderClick);
    };
    base.Parameters = {
        currentPage: 1,
        totalPages: 1,
        sizePagination: 5,
        productIdUpdate: 0,
        typePurchaseId: 0,
        countProducts: 0
    };
    base.Control = {
        divPagination: function () { return $('#pagination'); },
        groupProducts: function () { return $('#groupProducts'); },
        lblNetworkPoints: function () { return $('#lblNetworkPoints'); },
        lblRealPoints: function () { return $('#lblRealPoints'); },
        lblGrossAmount: function () { return $('#lblGrossAmount'); },
        lblNetAmount: function () { return $('#lblNetAmount'); },
        slcTypePurchase: function () { return $('#slcTypePurchase'); },
        slcStore: function () { return $('#slcStore'); },
        slcTypePayment: function () { return $('#slcTypePayment'); },
        slcTypeDocumentReceipt: function () { return $('#slcTypeDocumentReceipt'); },
        txtDocumentReceipt: function () { return $('#txtDocumentReceipt'); },
        btnCompletedOrder: function () { return $('#btnCompletedOrder'); },
    };
    base.Event = {
        AjaxGetTypePaymentsSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcTypePayment().empty();
                    base.Control.slcTypePayment().append($('<option>', {
                        value: 0,
                        text: 'Seleccione'
                    }));
                    $.each(data.data, function (key, value) {
                        base.Control.slcTypePayment().append($('<option>', {
                            value: value.description,
                            text: value.description
                        }));
                    });
                    base.Control.slcTypePayment().selectpicker('refresh');
                    base.Ajax.AjaxGetStores.submit();
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
                    base.Ajax.AjaxGetTypePurchases.submit();
                }
            }
        },
        AjaxGetTypePurchasesSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcTypePurchase().empty();
                    base.Control.slcTypePurchase().append($('<option>', {
                        value: 0,
                        text: 'Seleccione'
                    }));
                    $.each(data.data, function (key, value) {
                        base.Control.slcTypePurchase().append($('<option>', {
                            value: value.typePurchaseId,
                            text: value.nameTypePurchase
                        }));
                    });
                    base.Control.slcTypePurchase().selectpicker('refresh');
                    base.Function.GetOrder();
                }
            }
        },
        AjaxSetTypePurchaseSessionSuccess: function (data) {
            if (data) {
                if (data.data.isSuccess) {
                }
            }
        },
        AjaxSetStoreIdSessionSuccess: function (data) {
            if (data) {
                if (data.data.isSuccess) {
                }
            }
        },
        AjaxSetTypePaymentSessionSuccess: function (data) {
            if (data) {
                if (data.data.isSuccess) {
                }
            }
        },
        AjaxSetTypeDocumentReceiptSessionSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.txtDocumentReceipt().val(data.data);
                }
            }
        },
        AjaxSaveOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Function.ShowSwallSuccess("Pedido Realizado");
                }
                else {
                    if (!data.isSuccess && data.data != null) {
                        Swal.fire("Oops...", data.data.message, "error");
                    }
                    else {
                        Swal.fire("Oops...", data.message, "error");
                    }
                }
            }
        },
        AjaxGetOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = Math.ceil(data.data.quantity / base.Parameters.sizePagination);
                    base.Parameters.typePurchaseId = data.data.typePurchaseId;
                    base.Parameters.countProducts = data.data.quantity;
                    base.Control.lblNetworkPoints().text(data.data.promotionPoints);
                    base.Control.lblRealPoints().text(data.data.realPoints);
                    base.Control.lblGrossAmount().text(data.data.grossAmount);
                    base.Control.lblNetAmount().text(data.data.netAmount);
                    base.Control.slcTypePurchase().val(data.data.typePurchaseId);
                    base.Control.slcTypePurchase().selectpicker('refresh');
                    base.Control.slcStore().val(data.data.storeId);
                    base.Control.slcStore().selectpicker('refresh');
                    var typePaymentSelected = data.data.typePayment == null ? "0" : "Depósito";
                    base.Control.slcTypePayment().val(typePaymentSelected);
                    base.Control.slcTypePayment().selectpicker('refresh');
                    var typeDocumentReceipt = data.data.typeDocumentReceipt == null ? "0" : data.data.typeDocumentReceipt;
                    base.Control.slcTypeDocumentReceipt().val(typeDocumentReceipt);
                    base.Control.slcTypeDocumentReceipt().selectpicker('refresh');
                    base.Function.ListingProducts(data.data.purchaseDetail);
                }
            }
        },
        AjaxAddToOrderSuccess: function (data) {
            if (data) {
                if (data.data.isSuccess) {
                    //var productId = base.Parameters.productIdUpdate;
                    //$('#lblSubtotalNetAmount' + productId).text(data.data.newSubtotalAmount)
                    base.Control.lblNetworkPoints().text(data.data.orderData.promotionPoints);
                    base.Control.lblRealPoints().text(data.data.orderData.realPoints);
                    base.Control.lblGrossAmount().text(data.data.orderData.grossAmount);
                    base.Control.lblNetAmount().text(data.data.orderData.netAmount);
                    base.Control.slcTypePurchase().val(data.data.orderData.typePurchaseId);
                    base.Control.slcTypePurchase().selectpicker('refresh');
                    base.Control.slcStore().val(data.data.orderData.storeId);
                    base.Control.slcStore().selectpicker('refresh');
                    base.Function.ListingProducts(data.data.orderData.purchaseDetail);
                    Swal.fire("Excelente !!", "Pedido Actualizado", "success");
                }
                else {
                    Swal.fire("Oops...", data.data.message, "error");
                }
            }
        },
        AjaxRemoveFromOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = Math.ceil(data.data.quantity / base.Parameters.sizePagination);
                    base.Control.lblNetworkPoints().text(data.data.promotionPoints);
                    base.Control.lblRealPoints().text(data.data.realPoints);
                    base.Control.lblGrossAmount().text(data.data.grossAmount);
                    base.Control.lblNetAmount().text(data.data.netAmount);
                    base.Function.ListingProducts(data.data.purchaseDetail);
                    Swal.fire("Excelente !!", "Producto Eliminado", "success");
                    if (data.data.quantity == 0) {
                        window.location.href = MLM.Site.ShoppingCart.Actions.RedirectOrder;
                    }
                }
            }
        },
        btnCompletedOrderClick: function () {
            if (base.Parameters.countProducts == 0) {
                Swal.fire("Oops...", "Por favor, agregue productos al carrito", "error");
            }
            else if (base.Control.slcTypePurchase().val() == null || base.Control.slcTypePurchase().val() == "0") {
                Swal.fire("Oops...", "Por favor, seleccione un Tipo de Pedido", "error");
            }
            else if (base.Control.slcStore().val() == null || base.Control.slcStore().val() == "0") {
                Swal.fire("Oops...", "Por favor, seleccione una Tienda", "error");
            }
            else if (base.Control.slcTypePayment().val() == null || base.Control.slcTypePayment().val() == "0") {
                Swal.fire("Oops...", "Por favor, seleccione un Tipo de Pago", "error");
            }
            else if (base.Control.slcTypeDocumentReceipt().val() == null || base.Control.slcTypeDocumentReceipt().val() == "0") {
                Swal.fire("Oops...", "Por favor, seleccione un Tipo de Comprobante", "error");
            }
            else if (base.Control.txtDocumentReceipt().val() == null || base.Control.txtDocumentReceipt().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un Documento válido para su comprobante", "error");
            }
            else {
                base.Ajax.AjaxSaveOrder.data = {
                    receipt: base.Control.txtDocumentReceipt().val()
                };
                base.Ajax.AjaxSaveOrder.submit();
            }
        },
        slcTypePurchaseChange: function () {
            var name = $(this).find('option:selected').text();
            var typePurchaseId = $(this).val();
            base.Ajax.AjaxSetTypePurchaseSession.data = {
                typePurchaseName: name,
                typePurchaseId: typePurchaseId
            };
            base.Ajax.AjaxSetTypePurchaseSession.submit();
        },
        slcStoreChange: function () {
            var storeId = $(this).val();
            base.Ajax.AjaxSetStoreIdSession.data = {
                storeId: storeId
            };
            base.Ajax.AjaxSetStoreIdSession.submit();
        },
        slcTypePaymentChange: function () {
            var typePayment = $(this).val();
            base.Ajax.AjaxSetTypePaymentSession.data = {
                typePayment: typePayment
            };
            base.Ajax.AjaxSetTypePaymentSession.submit();
        },
        slcTypeDocumentReceiptChange: function () {
            var typeDocumentReceipt = $(this).val();
            base.Ajax.AjaxSetTypeDocumentReceiptSession.data = {
                typeDocumentReceipt: typeDocumentReceipt
            };
            base.Ajax.AjaxSetTypeDocumentReceiptSession.submit();
        },
    };
    base.Ajax = {
        AjaxGetTypePurchases: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.GetTypePurchases,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetTypePurchasesSuccess
        }),
        AjaxGetTypePayments: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.GetTypePayments,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetTypePaymentsSuccess
        }),
        AjaxGetStores: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.GetStores,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetStoresSuccess
        }),
        AjaxGetOrder: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.GetOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetOrderSuccess
        }),
        AjaxSetTypePurchaseSession: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.SetTypePurchaseSession,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSetTypePurchaseSessionSuccess
        }),
        AjaxSetStoreIdSession: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.SetStoreIdSession,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSetStoreIdSessionSuccess
        }),
        AjaxSetTypeDocumentReceiptSession: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.SetTypeDocumentReceiptSession,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSetTypeDocumentReceiptSessionSuccess
        }),
        AjaxSetTypePaymentSession: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.SetTypePaymentSession,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSetTypePaymentSessionSuccess
        }),
        AjaxSaveOrder: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.SaveOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSaveOrderSuccess
        }),
        AjaxAddToOrder: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.AddToOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxAddToOrderSuccess
        }),
        AjaxRemoveFromOrder: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.ShoppingCart.Actions.RemoveFromOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxRemoveFromOrderSuccess
        }),
    };
    base.Function = {
        ShowToastrError: function (message) {
            toastr.error("" + message + "", "Opps", {
                timeOut: 5e3,
                closeButton: !0,
                debug: !1,
                newestOnTop: !0,
                progressBar: !0,
                positionClass: "toast-top-right",
                preventDuplicates: !0,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                tapToDismiss: !1
            })
        },
        ShowToastr: function (message) {
            toastr.success("" + message + "", "Excelente", {
                timeOut: 5e3,
                closeButton: !0,
                debug: !1,
                newestOnTop: !0,
                progressBar: !0,
                positionClass: "toast-top-right",
                preventDuplicates: !0,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                tapToDismiss: !1
            })
        },
        ShowSwallSuccess: function (message) {
            Swal.fire("Excelente !!", message, "success").then((result) => {
                window.location.href = MLM.Site.ShoppingCart.Actions.RedirectOrder;
            });
        },
        ShowSwallConfirmAdditionalPurchase: function (message) {
            Swal.fire({
                title: message,
                text: "Esto no se puede revertir!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, generar adicional"
            }).then((result) => {
                if (result.isConfirmed) {
                    base.Ajax.AjaxAddToOrder.data = {
                        quantity: quantity,
                        productId: productId,
                        process: 'Edit',
                        typePurchaseId: base.Parameters.typePurchaseWholesaleId
                    };
                    base.Ajax.AjaxAddToOrder.submit();
                }
            });
        },
        clsNumberPagination: function () {
            var parentElement = $(document);
            parentElement.on('click', '.page-link', function () {
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
                base.Function.GetProducts();
            });
        },
        clsAddNumber: function () {
            var parentElement = $(document);
            parentElement.on('click', '.add-number', function () {
                var valueAdd = parseInt($(this).attr('value-hidden'));
                var newQuantity = parseInt($('#txtNumber' + valueAdd).val()) + 1;
                $('#txtNumber' + valueAdd).val(newQuantity)
            });
        },
        clsSubNumber: function () {
            var parentElement = $(document);
            parentElement.on('click', '.sub-number', function () {
                var valueAdd = parseInt($(this).attr('value-hidden'));
                var newQuantity = parseInt($('#txtNumber' + valueAdd).val()) - 1;
                if (newQuantity > 0) {
                    $('#txtNumber' + valueAdd).val(newQuantity)
                }
            });
        },
        clsUpdtToOrder: function () {
            var parentElement = $(document);
            parentElement.on('click', '.updtToOrder', function () {
                var productId = parseInt($(this).attr('value-hidden'));
                base.Parameters.productIdUpdate = productId;
                var quantity = parseInt($('#txtNumber' + productId).val());
                base.Ajax.AjaxAddToOrder.data = {
                    quantity: quantity,
                    productId: productId,
                    process: 'Edit'
                };
                base.Ajax.AjaxAddToOrder.submit();
            });
        },
        clsDltToOrder: function () {
            var parentElement = $(document);
            parentElement.on('click', '.dltToOrder', function () {
                var productId = parseInt($(this).attr('value-hidden'));
                base.Ajax.AjaxRemoveFromOrder.data = {
                    productId: productId,
                };
                base.Ajax.AjaxRemoveFromOrder.submit();
            });
        },
        GetOrder: function () {
            base.Ajax.AjaxGetOrder.submit();
        },
        UpdatePagination: function () {
            base.Control.divPagination().empty();
            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="prev">«</a></li>');

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
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link" href="#">1</a></li>');
                    if (startPage > 2) {
                        if (base.Parameters.currentPage != base.Parameters.totalPages) {
                            endPage--;
                        }
                        startPage++;
                        var valueHidden = startPage - 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link" href="#">..</a></li>');
                    }
                }

                for (var i = startPage; i <= endPage; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link" href="#">' + i + '</a></li>');
                }

                if (endPage < base.Parameters.totalPages) {
                    if (endPage < base.Parameters.totalPages - 1) {
                        var valueHidden = endPage + 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link" href="#">..</a></li>');
                    }
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link " href="#">' + base.Parameters.totalPages + '</a></li>');
                }
            }

            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="next">»</a></li>');
        },
        ListingProducts: function (productsOrder) {
            base.Control.groupProducts().empty();
            var $groupProducts = $('#groupProducts');
            productsOrder.forEach(function (product) {
                var productHtml = `
                <li class="list-group-item d-flex justify-content-center" style="flex-wrap: wrap;">
				    <div class="col-xl-3 col-sm-6" style="display: flex;justify-content: center; height: 100px;">
				    	<img class="img-fluid" src="https://api.soynexora.com/StaticFiles/ProductsImg/${product.imageName}" alt="">
				    </div>
				    <div class="col-xl-3 col-sm-6" style="display: flex;justify-content: center; align-items: center;padding-top: inherit;">
				    	<h5 class="my-0">${product.productName}</h5>
				    </div>
				    <div class="col-xl-3 col-sm-6" style="display: flex;justify-content: center; align-items: center;padding-top: inherit;">
				    	<button value-hidden="${product.productId}" class="btn btn-primary backgroundPurpleButtonMLM sharp sub-number" style="color:white;margin-right: 0.0rem;">-</button>
				    	<input type="text" id="txtNumber${product.productId}" value="${product.quantity}" class="form-control input-number" style="margin-left: 0.7rem; margin-right: 0.7rem;text-align: center;" />
				    	<button value-hidden="${product.productId}" class="btn btn-primary backgroundPurpleButtonMLM sharp add-number" style="color:white;margin-right: 0.0rem;">+</button>
                        <button value-hidden="${product.productId}" class="btn btn-primary backgroundYellowButtonMLM sharp updtToOrder" style="color:white;margin-left: 5px;"><i class="fa-solid fa-arrows-rotate"></i></button>
				    </div>
				    <div class="col-xl-2 col-sm-6" style="display: flex;justify-content: center; align-items: center;padding-right: inherit; padding-top: inherit;">
				    	<h5>S/<a id="lblSubtotalNetAmount${product.productId}">${product.subtotalNetAmount}</a></h5>
				    </div>
                    <div class="col-xl-1 col-sm-6" style="display: flex;justify-content: center; align-items: center;padding-top: inherit;">
                        <button value-hidden="${product.productId}" class="btn btn-primary backgroundRedButtonMLM sharp dltToOrder" style="color:white;margin-left: 5px;"><i class="fa-solid fa-trash"></i></button>
				    </div>
				</li>
                `;
                $groupProducts.append(productHtml);
            });
            base.Function.UpdatePagination();
        }
    };
};