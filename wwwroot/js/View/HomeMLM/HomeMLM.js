ns('MLM.Site.HomeMLM.Index')
MLM.Site.HomeMLM.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetHomeData();
    };
    base.Parameters = {
    };
    base.Control = {
        spnNames: function () { return $('#spnNames'); },
        spnPeriodName: function () { return $('#spnPeriodName'); },
        spnRangeName: function () { return $('#spnRangeName'); },
        spnPackName: function () { return $('#spnPackName'); },
        currentPP: function () { return $('#currentPP'); },
        spnPP_Different: function () { return $('#spnPP_Different'); },
        currentVP: function () { return $('#currentVP'); },
        spnVP_Different: function () { return $('#spnVP_Different'); },
        currentVG: function () { return $('#currentVG'); },
        spnVG_Different: function () { return $('#spnVG_Different'); },
        currentVQ: function () { return $('#currentVQ'); },
        spnVQ_Different: function () { return $('#spnVQ_Different'); },
        divCommissionHistory: function () { return $('#divCommissionHistory'); },
        spnPatronBonus: function () { return $('#spnPatronBonus'); },
        spnRetirementBonus: function () { return $('#spnRetirementBonus'); },
        spnAcceleratorBonus: function () { return $('#spnAcceleratorBonus'); },
        spnCommissionActual: function () { return $('#spnCommissionActual'); },
        divNextPeriodName: function () { return $('#divNextPeriodName'); },
        spnTotalEntrepreneurs: function () { return $('#spnTotalEntrepreneurs'); },
        spnNewEntrepreneurs: function () { return $('#spnNewEntrepreneurs'); },
        spnActiveEntrepreneurs: function () { return $('#spnActiveEntrepreneurs'); },
        spnInactiveEntrepreneurs: function () { return $('#spnInactiveEntrepreneurs'); },
        spnPercentagePP: function () { return $('#spnPercentagePP'); },
        divProgressPP: function () { return $('#divProgressPP'); },
        divRequiredPP: function () { return $('#divRequiredPP'); },
        spnPercentageVQ: function () { return $('#spnPercentageVQ'); },
        divProgressVQ: function () { return $('#divProgressVQ'); },
        divRequiredVQ: function () { return $('#divRequiredVQ'); },
        spnPercentageDirects: function () { return $('#spnPercentageDirects'); },
        divProgressDirects: function () { return $('#divProgressDirects'); },
        divRequiredDirects: function () { return $('#divRequiredDirects'); },
        spnRangeSuperado: function () { return $('#spnRangeSuperado'); },
        spnVQRequiredSuperado: function () { return $('#spnVQRequiredSuperado'); },
        spnRangeActual: function () { return $('#spnRangeActual'); },
        spnVQRequiredActual: function () { return $('#spnVQRequiredActual'); },
        spnRangeSiguiente: function () { return $('#spnRangeSiguiente'); },
        spnVQRequiredSiguiente: function () { return $('#spnVQRequiredSiguiente'); },
        spnRangeBloqueado: function () { return $('#spnRangeBloqueado'); },
        spnVQRequiredBloqueado: function () { return $('#spnVQRequiredBloqueado'); },
        spnRangeRed: function () { return $('#spnRangeRed'); },
        spnAbreviatureNameRed: function () { return $('#spnAbreviatureNameRed'); },
        divNivelStep: function () { return $('#divNivelStep'); },
    };
    base.Event = {
        AjaxGetHomeDataSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    var homeData = data.data;
                    console.log(homeData);
                    base.Control.spnNames().text(homeData.homeDataUser.names + ' ' + homeData.homeDataUser.lastName);
                    base.Control.spnPeriodName().text(homeData.homeDataPeriod.activePeriodName);
                    base.Control.spnRangeName().text(homeData.homeDataPoints.rangeName);
                    base.Control.spnPackName().text(homeData.homeDataUser.namePackage);
                    base.Control.currentPP().text(homeData.homeDataPoints.pp);
                    var ppDifferent = (homeData.homeDataPoints.pP_Different >= 0 ? "▲ +" : "▼ -") + homeData.homeDataPoints.pP_Different;
                    base.Control.spnPP_Different().text(ppDifferent);
                    base.Control.spnPP_Different().addClass(
                        homeData.homeDataPoints.pP_Different >= 0 ? "delta-up" : "delta-dn"
                    );
                    base.Control.currentVP().text(homeData.homeDataPoints.vp);
                    var vpDifferent = (homeData.homeDataPoints.vP_Different >= 0 ? "▲ +" : "▼ -") + homeData.homeDataPoints.vP_Different;
                    base.Control.spnVP_Different().text(vpDifferent);
                    base.Control.spnVP_Different().addClass(
                        homeData.homeDataPoints.vP_Different >= 0 ? "delta-up" : "delta-dn"
                    );
                    base.Control.currentVG().text(homeData.homeDataPoints.vg);
                    var vgDifferent = (homeData.homeDataPoints.vG_Different >= 0 ? "▲ +" : "▼ -") + homeData.homeDataPoints.vG_Different;
                    base.Control.spnVG_Different().text(vgDifferent);
                    base.Control.spnVG_Different().addClass(
                        homeData.homeDataPoints.vG_Different >= 0 ? "delta-up" : "delta-dn"
                    );
                    base.Control.currentVQ().text(homeData.homeDataPoints.vq);
                    var vqDifferent = (homeData.homeDataPoints.vQ_Different >= 0 ? "▲ +" : "▼ -") + homeData.homeDataPoints.vQ_Different;
                    base.Control.spnVQ_Different().text(vqDifferent);
                    base.Control.spnVQ_Different().addClass(
                        homeData.homeDataPoints.vQ_Different >= 0 ? "delta-up" : "delta-dn"
                    );
                    base.Control.divCommissionHistory().text("S/. " + homeData.homeDataHistoryCommission.historyCommission);
                    base.Control.spnPatronBonus().text("S/. " + homeData.homeDataDetailCommission.patronBonus);
                    base.Control.spnRetirementBonus().text("S/. " + homeData.homeDataDetailCommission.retirementBonus);
                    base.Control.spnAcceleratorBonus().text("S/. " + homeData.homeDataDetailCommission.acceleratorBonus);
                    base.Control.spnCommissionActual().text("S/. " + homeData.homeDataDetailCommission.commissionActual);

                    if (homeData.listHomeDataCommissionTop5?.length) {
                        const list = homeData.listHomeDataCommissionTop5;
                        const months6 = list.map(x => x.periodName);
                        const values = list.map(x => x.commissionTotal);

                        base.Function.renderChartComisiones(months6, values);
                    }

                    const endDate = new Date(homeData.homeDataPeriod.activePeriodEndDate);
                    base.Function.startCountdown(endDate);

                    base.Control.divNextPeriodName().text(homeData.homeDataPeriod.nextPeriodName);

                    if (homeData.homeDataNetworkFeed) {

                        const feed = homeData.homeDataNetworkFeed;
                        let values = [
                            feed.activeEntrepreneurs,
                            feed.newEntrepreneurs,
                            feed.inactiveEntrepreneurs,
                        ];

                        //const hasData = values.some(v => v > 0);
                        //if (!hasData) {
                        //    values = [1, 1, 1];
                        //}

                        base.Function.renderChartDonut(values);
                    }

                    if (homeData.listHomeDataRankingRed?.length) {
                        base.Function.renderRanking(homeData.listHomeDataRankingRed);
                    }

                    base.Control.spnTotalEntrepreneurs().text("Total red: " + homeData.homeDataNetworkFeed.totalEntrepreneurs);
                    base.Control.spnNewEntrepreneurs().text("Nuevos: " + homeData.homeDataNetworkFeed.newEntrepreneurs);
                    base.Control.spnActiveEntrepreneurs().text("Activos: " + homeData.homeDataNetworkFeed.activeEntrepreneurs);
                    base.Control.spnInactiveEntrepreneurs().text("Inactivos: " + homeData.homeDataNetworkFeed.inactiveEntrepreneurs);

                    if (homeData.listHomeDataPurchases?.length) {

                        const list = homeData.listHomeDataPurchases;

                        const labels = list.map(x => x.periodName);
                        const afiliaciones = list.map(x => x.affiliation);
                        const compras = list.map(x => x.consumption);

                        base.Function.renderChartRed(labels, afiliaciones, compras);
                    }

                    var percentagePP = Math.round((homeData.homeDataUserNetwork.pp / homeData.homeDataUserNetwork.nextPP) * 100);
                    percentagePP = percentagePP > 100 ? 100 : percentagePP;
                    base.Control.spnPercentagePP().text(percentagePP + "%");
                    base.Control.divProgressPP().css("width", percentagePP + "%");
                    base.Control.divRequiredPP().text(homeData.homeDataUserNetwork.pp + " / " + homeData.homeDataUserNetwork.nextPP + " PP requeridos");

                    var percentageVQ = homeData.homeDataUserNetwork.nextVQ > 0 ? Math.round((homeData.homeDataUserNetwork.vq / homeData.homeDataUserNetwork.nextVQ) * 100) : 100;
                    percentageVQ = percentageVQ > 100 ? 100 : percentageVQ;
                    base.Control.spnPercentageVQ().text(percentageVQ + "%");
                    base.Control.divProgressVQ().css("width", percentageVQ + "%");
                    base.Control.divRequiredVQ().text(homeData.homeDataUserNetwork.vq + " / " + homeData.homeDataUserNetwork.nextVQ + " VQ requeridos");

                    var percentageDirectAssets = homeData.homeDataUserNetwork.nextDirectAssets > 0 ? Math.round((homeData.homeDataUserNetwork.directAssets / homeData.homeDataUserNetwork.nextDirectAssets) * 100) : 100;
                    percentageDirectAssets = percentageDirectAssets > 100 ? 100 : percentageDirectAssets;
                    base.Control.spnPercentageDirects().text(percentageDirectAssets + "%");
                    base.Control.divProgressDirects().css("width", percentageDirectAssets + "%");
                    base.Control.divRequiredDirects().text(homeData.homeDataUserNetwork.directAssets + " / " + homeData.homeDataUserNetwork.nextDirectAssets + " Directos Activos requeridos");

                    base.Control.spnRangeSuperado().text(homeData.listHomeDataRangeNetwork[0].rangeName);
                    base.Control.spnVQRequiredSuperado().text(homeData.listHomeDataRangeNetwork[0].vq + " VQ");

                    base.Control.spnRangeActual().text(homeData.listHomeDataRangeNetwork[1].rangeName);
                    base.Control.spnVQRequiredActual().text(homeData.listHomeDataRangeNetwork[1].vq + " VQ");

                    base.Control.spnRangeSiguiente().text(homeData.listHomeDataRangeNetwork[2].rangeName);
                    base.Control.spnVQRequiredSiguiente().text(homeData.listHomeDataRangeNetwork[2].vq + " VQ");

                    if (homeData.listHomeDataRangeNetwork[0].rangeName != "NO ACTIVO") {
                        base.Control.divNivelStep().show();
                        base.Control.spnRangeBloqueado().text(homeData.listHomeDataRangeNetwork[3].rangeName);
                        base.Control.spnVQRequiredBloqueado().text(homeData.listHomeDataRangeNetwork[3].vq + " VQ");
                    }

                    if (homeData.listHomeDataHistoryVG?.length) {

                        const list = homeData.listHomeDataHistoryVG;

                        let labels = list.map(x => x.periodName ?? x.PeriodName);
                        let vg = list.map(x => x.vg ?? x.VG ?? 0);

                        const vgScaled = vg.map(v => v / 10);

                        if (vg.length === 1) {
                            labels = ['', labels[0]];
                            vg = [0, vg[0]];
                        }

                        base.Function.renderChartEvo(labels, vg, vgScaled);
                    }

                    base.Control.spnRangeRed().text(homeData.homeDataPoints.rangeName);
                    const names = homeData.homeDataUser.names || '';
                    const lastName = homeData.homeDataUser.lastName || '';
                    const initials = ((names.split(' ')[0]?.[0] || '') + (lastName.split(' ')[0]?.[0] || '')).toUpperCase();
                    base.Control.spnAbreviatureNameRed().text(initials);

                    if (homeData.listHomeDataTop5DirectAssets?.length) {
                        base.Function.renderDirects(homeData.listHomeDataTop5DirectAssets);
                    }
                }
            }
        },
    };
    base.Ajax = {
        AjaxGetHomeData: new MLM.Site.UI.Web.Components.Ajax({
            action: MLM.Site.HomeMLM.Actions.GetHomeData,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetHomeDataSuccess
        }),
    };
    base.Function = {
        GetHomeData: function () {
            base.Ajax.AjaxGetHomeData.submit();
        },
        chartComisiones: null,
        renderChartComisiones: function (labels, data) {
            const ctx = document.getElementById('chartComisiones');

            if (this.chartComisiones) {
                this.chartComisiones.destroy();
            }

            this.chartComisiones = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: labels.map((_, i) =>
                            i === labels.length - 1
                                ? '#7F77DD'
                                : 'rgba(127,119,221,0.35)'
                        ),
                        borderRadius: 4,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }, tooltip: {
                            callbacks: { label: ctx => ' S/. ' + ctx.parsed.y.toLocaleString() }
                        }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                        y: {
                            grid: { color: gridColor }, ticks: {
                                callback: v => {
                                    if (v >= 1_000_000) {
                                        return 'S/. ' + (v / 1_000_000).toFixed(1) + 'M';
                                    }
                                    if (v >= 1000) {
                                        return 'S/. ' + (v / 1000).toFixed(1) + 'K';
                                    }
                                    return 'S/. ' + v;
                                }
                            }
                        }
                    }
                }
            });
        },
        countdownInterval: null,
        startCountdown: function (endDate) {

            function tick() {
                let diff = Math.max(0, endDate - new Date());

                const d = Math.floor(diff / 86400000); diff -= d * 86400000;
                const h = Math.floor(diff / 3600000); diff -= h * 3600000;
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);

                const cdEl = document.getElementById('cd');
                if (!cdEl) return;

                // Crear estructura solo una vez
                if (!cdEl.children.length) {
                    ['días', 'horas', 'min', 'seg'].forEach(l => {
                        const b = document.createElement('div');
                        b.className = 'cd-box';
                        b.innerHTML = `<div class="cd-num">00</div><div class="cd-lbl">${l}</div>`;
                        cdEl.appendChild(b);
                    });
                }

                [d, h, m, s].forEach((v, i) => {
                    cdEl.children[i].querySelector('.cd-num').textContent =
                        String(v).padStart(2, '0');
                });
            }

            // limpiar interval anterior si existe
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
            }

            tick();
            this.countdownInterval = setInterval(tick, 1000);
        },
        chartDonut: null,
        renderChartDonut: function (values) {

            const ctx = document.getElementById('chartDonut');
            if (!ctx) return;

            if (this.chartDonut) {
                this.chartDonut.destroy();
            }

            this.chartDonut = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Activos', 'Nuevos', 'Inactivos'],
                    datasets: [{
                        data: values,
                        backgroundColor: ['#7F77DD', '#1D9E75', '#D3D1C7'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '68%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 10,
                                padding: 10,
                                font: { size: 15 }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: ctx => {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const value = ctx.parsed;
                                    const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                                    return ` ${ctx.label}: ${value} (${percent}%)`;
                                }
                            }
                        }
                    }
                }
            });
        },
        renderRanking: function (list) {

            const rankEl = document.getElementById('ranking');
            if (!rankEl) return;

            // limpiar antes de renderizar
            rankEl.innerHTML = '';

            if (!list?.length) return;

            list.forEach(r => {

                // manejar camelCase / PascalCase
                const pos = r.rowNum;
                const name = r.names;
                const init = r.abbreviationUser;
                const vg = r.vg;
                const range = r.rangeName;

                // colores dinámicos (puedes mejorar esto)
                let bg = '#F1EFE8';
                let tc = '#444441';

                if (pos === 1 || pos === 2) {
                    bg = '#FAEEDA'; tc = '#633806';
                } else if (pos === 3) {
                    bg = '#E1F5EE'; tc = '#085041';
                } else if (pos === 4) {
                    bg = '#EEEDFE'; tc = '#3C3489';
                }

                const row = document.createElement('div');
                row.className = 'rank-row';

                row.innerHTML = `
                <span class="rank-pos">#${pos}</span>
                <div class="rank-av" style="background:${bg};color:${tc}">
                    ${init}
                </div>
                <div style="flex:1">
                    <div class="rank-name">${name}</div>
                    <div class="rank-vol">VG: ${vg.toLocaleString()}</div>
                </div>
                <span class="rank-pts">${range}</span>
            `;

                rankEl.appendChild(row);
            });
        },
        chartRed: null,
        renderChartRed: function (labels, afiliaciones, compras) {
            const ctx = document.getElementById('chartRed');
            if (!ctx) return;

            if (this.chartRed) {
                this.chartRed.destroy();
            }

            this.chartRed = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Afiliaciones nuevas',
                            data: afiliaciones,
                            backgroundColor: '#7F77DD',
                            borderRadius: 3,
                            borderSkipped: false
                        },
                        {
                            label: 'Compras activas',
                            data: compras,
                            backgroundColor: 'rgba(29,158,117,0.5)',
                            borderRadius: 3,
                            borderSkipped: false,
                            yAxisID: 'y2'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { boxWidth: 10, padding: 12 }
                        },
                        tooltip: {
                            callbacks: {
                                label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y ?? 0}`
                            }
                        }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: {
                            grid: { color: gridColor },
                            position: 'left',
                            ticks: { font: { size: 10 } },
                            title: { display: true, text: 'Afil.', font: { size: 10 } }
                        },
                        y2: {
                            grid: { display: false },
                            position: 'right',
                            ticks: { font: { size: 10 } },
                            title: { display: true, text: 'Compras', font: { size: 10 } }
                        }
                    }
                }
            });
        },
        chartEvo: null,
        renderChartEvo: function (labels, comisiones, vgScaled) {

            const ctx = document.getElementById('chartEvo');
            if (!ctx) return;

            if (this.chartEvo) {
                this.chartEvo.destroy();
            }

            this.chartEvo = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Vol. grupal',
                            data: comisiones,
                            borderColor: '#7F77DD',
                            backgroundColor: 'rgba(127,119,221,0.12)',
                            borderWidth: 2,
                            pointRadius: 3,
                            pointHoverRadius: 5,
                            fill: true,
                            tension: 0.35
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { boxWidth: 10, padding: 12 }
                        },
                        tooltip: {
                            callbacks: {
                                label: ctx => ' ' + (ctx.parsed.y ?? 0).toLocaleString() + ' VG'
                            }
                        }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: {
                            grid: { color: gridColor },
                            ticks: {
                                callback: v => {
                                    if (v >= 1000) {
                                        return (v / 1000).toFixed(1) + ' K VG';
                                    }
                                    return v + ' VG';
                                },
                                font: { size: 10 }
                            }
                        }
                    }
                }
            });
        },
        renderDirects: function (list) {
            const container = document.querySelector('.branch-children');
            if (!container) return;

            container.innerHTML = '';

            if (!list?.length) return;

            const maxVisible = 5;
            const visibles = list.slice(0, maxVisible);
            const extra = list.length - maxVisible;

            visibles.forEach(item => {

                const init = item.abbreviationUser;
                const name = item.names;
                const range = item.abbreviationRange;

                const isActive = range && range !== 'Inf.';
                const bg = isActive ? 'var(--teal-l)' : 'var(--gray-l)';
                const tc = isActive ? 'var(--teal)' : 'var(--gray-d)';

                const node = document.createElement('div');
                node.className = 'branch-node';

                node.innerHTML = `
                    <div class="t-av" style="width:34px;height:34px;background:${bg};color:${tc}">
                        ${init}
                    </div>
                    <div class="t-name">${name}</div>
                    <div class="t-lvl">${range || '—'}</div>
                `;

                container.appendChild(node);
            });

            if (extra > 0) {

                const node = document.createElement('div');
                node.className = 'branch-node';

                node.innerHTML = `
                    <div class="t-av" style="width:34px;height:34px;background:var(--gray-l);color:var(--gray-d)">
                        +${extra}
                    </div>
                    <div class="t-name">otros</div>
                    <div class="t-lvl">—</div>
                `;

                container.appendChild(node);
            }
        },
    };
}