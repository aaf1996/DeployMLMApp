ns('MLM.Site.HomePublic.Index')
MLM.Site.HomePublic.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetProductForPublicIndex();
    };
    base.Parameters = {
    };
    base.Control = {
        spnNames: function () { return $('#spnNames'); },
    };
    base.Event = {
        AjaxGetProductForPublicIndexSuccess: function (data) {
            if (data && data.isSuccess) {
                var list = data.data || [];
                base.Function.RenderProducts(list, 'prodGrid');
            }
        },
    };
    base.Ajax = {
        AjaxGetProductForPublicIndex: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.HomePublic.Actions.GetProductForPublicIndex,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetProductForPublicIndexSuccess
        }),
    };
    base.Function = {
        GetProductForPublicIndex: function () {
            base.Ajax.AjaxGetProductForPublicIndex.submit();
        },
        RenderProducts: function (list, containerId) {
            var grid = document.getElementById(containerId);
            if (!grid) return;

            grid.innerHTML = '';

            list.forEach(function (p) {
                var imgUrl = p.imageName
                    ? 'https://api.soynexora.com/StaticFiles/ProductsImg/' + p.imageName
                    : null;

                var imgHtml = imgUrl
                    ? `<img src="${imgUrl}" alt="${p.productName}" loading="lazy">`
                    : `<div class="prod-noimg">Sin imagen</div>`;

                var card = document.createElement('div');
                card.className = 'prod-card';

                card.innerHTML = `
                <div class="prod-img">${imgHtml}</div>
                <div class="prod-body">
                    <div class="prod-name">${p.productName}</div>
                    <div class="prod-price-row">
                        <span class="prod-price">S/. ${p.price.toFixed(2)}</span>
                        <span class="prod-pts">+${p.activationPoints} pts</span>
                    </div>
                </div>
            `;

                grid.appendChild(card);
            });
        }
    };
}