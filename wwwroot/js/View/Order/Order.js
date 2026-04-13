function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};
ns('MLM.Site.Order.Index')
MLM.Site.Order.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Ajax.AjaxGetTypePurchases.submit();
        base.Ajax.AjaxGetStores.submit();
        base.Function.clsAddNumber();
        base.Function.clsSubNumber();
        base.Function.clsNumberPagination();
        base.Function.clsAddToOrder();
        base.Control.btnShoppingCart().click(base.Event.btnShoppingCartClick);
        base.Control.txtProduct().keyup(base.Event.txtProductKeyUp);
        base.Control.slcTypePurchase().change(base.Event.slcTypePurchaseChange);
        base.Control.slcStore().change(base.Event.slcStoreChange);
    };
    base.Parameters = {
        currentPage: 1,
        totalPages: 1,
        sizePagination: 12,
        countProducts: 0,
        productIdSelected: 0,
    };
    base.Control = {
        divPagination: function () { return $('#pagination'); },
        productContainer : function () { return $('#product-container'); },
        lblNetAmount: function () { return $('#lblNetAmount'); },
        lblNetworkPoint: function () { return $('#lblNetworkPoint'); },
        lblRealPoints: function () { return $('#lblRealPoints'); },
        btnShoppingCart: function () { return $('#btnShoppingCart'); },
        txtProduct: function () { return $('#txtProduct'); },
        slcTypePurchase: function () { return $('#slcTypePurchase'); },
        slcStore: function () { return $('#slcStore'); },
    };
    base.Event = {
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
                    base.Function.GetProducts();
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
        AjaxGetProductsForOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.ListingProducts(data.data.productStore);
                    base.Function.GetOrder();
                }
            }
        },
        AjaxGetOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.lblRealPoints().text(data.data.realPoints);
                    base.Control.lblNetworkPoint().text(data.data.promotionPoints);
                    base.Control.lblNetAmount().text(data.data.netAmount);
                    base.Parameters.countProducts = data.data.quantity;
                    base.Control.slcTypePurchase().val(data.data.typePurchaseId);
                    base.Control.slcTypePurchase().selectpicker('refresh');
                    base.Control.slcStore().val(data.data.storeId);
                    base.Control.slcStore().selectpicker('refresh');
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
        AjaxAddToOrderSuccess: function (data) {
            if (data) {
                if (data.data.isSuccess) {
                    base.Control.lblRealPoints().text(data.data.orderData.realPoints);
                    base.Control.lblNetworkPoint().text(data.data.orderData.promotionPoints);
                    base.Control.lblNetAmount().text(data.data.orderData.netAmount);
                    base.Parameters.countProducts = data.data.orderData.quantity;
                    $('#txtNumber' + base.Parameters.productIdSelected).val("1");
                    Swal.fire("Excelente !!", "Producto Agregado!", "success");
                }
                else {
                    Swal.fire("Oops...", data.data.message, "error");
                }
            }
        },
        btnShoppingCartClick: function () {
            if (base.Parameters.countProducts > 0) {
                window.location.href = MLM.Site.Order.Actions.RedirectShoppingCart;
            }
            else {
                Swal.fire("Oops...", "Por favor, agregue productos al carrito", "error");
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
        txtProductKeyUp: debounce(function () {
            var productName = this.value;
            if (productName == '' || productName.length >= 3) {
                base.Ajax.AjaxGetProductsForOrder.data = {
                    number: base.Parameters.currentPage,
                    size: base.Parameters.sizePagination,
                    productName: productName
                };
                base.Ajax.AjaxGetProductsForOrder.submit();
            }
        }, 300),
    };
    base.Ajax = {
        AjaxGetTypePurchases: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Order.Actions.GetTypePurchases,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetTypePurchasesSuccess
        }),
        AjaxGetStores: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Order.Actions.GetStores,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetStoresSuccess
        }),
        AjaxGetProductsForOrder: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Order.Actions.GetProductsForOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetProductsForOrderSuccess
        }),
        AjaxGetOrder: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Order.Actions.GetOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetOrderSuccess
        }),
        AjaxSetTypePurchaseSession: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Order.Actions.SetTypePurchaseSession,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSetTypePurchaseSessionSuccess
        }),
        AjaxSetStoreIdSession: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Order.Actions.SetStoreIdSession,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSetStoreIdSessionSuccess
        }),
        AjaxAddToOrder: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.Order.Actions.AddToOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxAddToOrderSuccess
        }),
    };
    base.Function = {
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
                    base.Control.slcTypePurchase().val(4);
                    base.Control.slcTypePurchase().selectpicker('refresh');

                    var productId = base.Parameters.productIdSelected;
                    var quantity = parseInt($('#txtNumber' + productId).val());

                    base.Ajax.AjaxAddToOrder.data = {
                        quantity: quantity,
                        productId: productId,
                        process: 'Addition',
                        typePurchaseId: base.Control.slcTypePurchase().val(),
                        typePurchaseName: base.Control.slcTypePurchase().find('option:selected').text()
                    };
                    base.Ajax.AjaxAddToOrder.submit();
                }
            });
        },
        UpdatePagination: function () {
            base.Control.divPagination().empty();
            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPages <= 5) {
                for (var i = 1; i <= base.Parameters.totalPages; i++) {
                    var classBackground = (i === base.Parameters.currentPage) ? 'backgroundPurpleButtonMLM': '';
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link '+classBackground+'" href="#">' + i + '</a></li>');
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
        clsAddNumber : function () {
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
        GetOrder: function () {
            base.Ajax.AjaxGetOrder.submit();
        },
        clsAddToOrder: function () {
            var parentElement = $(document);
            parentElement.on('click', '.addToOrder', function () {
                var productId = parseInt($(this).attr('value-hidden'));
                var quantity = parseInt($('#txtNumber' + productId).val());
                base.Parameters.productIdSelected = productId;
                if (base.Control.slcTypePurchase().val() == 0) {
                    Swal.fire("Oops...", "Por favor, seleccione la Tienda", "error");
                    return;
                }
                if (base.Control.slcStore().val() == 0) {
                    Swal.fire("Oops...", "Por favor, seleccione Tipo de Pedido", "error");
                    return;
                }
                base.Ajax.AjaxAddToOrder.data = {
                    quantity: quantity,
                    productId: productId,
                    process: 'Addition'
                };
                base.Ajax.AjaxAddToOrder.submit();
            });
        },
        GetProducts: function () {
            base.Ajax.AjaxGetProductsForOrder.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                productName: '',
                userId: 0
            };
            base.Ajax.AjaxGetProductsForOrder.submit();
        },
        ListingProducts: function (productStore) {
            base.Control.productContainer().empty();
            var $productContainer = $('#product-container');
            productStore.forEach(function (product) {
                var productHtml = `
                    <div class="col-xl-3 col-xxl-3 col-lg-4 col-sm-6">
                        <div class="card">
                            <div class="card-body product-grid-card">
                                <div class="new-arrival-product">
                                    <div style="display: flex;justify-content: center; height: 250px;">
                                        <img class="img-fluid" src="https://api.soynexora.com/StaticFiles/ProductsImg/${product.imageName}" alt="">
                                    </div>
                                    <div class="new-arrival-content text-center mt-3">
                                        <h4><a>${product.productName}</a></h4>
                                        <span class="price colorPurplelLabelMLM">S/${product.price}</span>
                                        <div style="display: flex; justify-content: center;">
                                            <button value-hidden="${product.productId}" class="btn btn-primary backgroundPurpleButtonMLM sharp sharp-lg sub-number" style="color:white;margin-right: 0.0rem;">-</button>
                                            <input id="txtNumber${product.productId}" type="text" value="1" class="form-control input-number" style="margin-left: 0.7rem; margin-right: 0.7rem;text-align: center;" />
                                            <button value-hidden="${product.productId}" class="btn btn-primary backgroundPurpleButtonMLM sharp sharp-lg add-number" style="color:white;margin-right: 0.0rem;">+</button>
                                            <button value-hidden="${product.productId}" class="btn btn-primary backgroundYellowButtonMLM addToOrder" style="color:white;margin-left: 5px;"><i class="fa fa-shopping-basket"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $productContainer.append(productHtml);
            });
            base.Function.UpdatePagination();
        },
    };
}