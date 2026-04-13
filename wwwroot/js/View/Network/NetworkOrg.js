$(document).ready(function () {
    const userId = 123;
    const networkPeriodId = 3;
    const $chartContainer = $('#chart-container');
    let oc = null; // 👈 aquí guardaremos la instancia real del OrgChart

    function loadRootNode() {
        $.ajax({
            url: '/Network/GetNetworkOrganizationChart',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                UserId: userId,
                NetworkPeriodId: networkPeriodId
            }),
            success: function (rootNodeResponse) {
                const nodeData = rootNodeResponse?.data;
                if (!nodeData || typeof nodeData !== 'object') {
                    console.error('Respuesta inválida del servidor:', rootNodeResponse);
                    return;
                }

                const rootFormatted = formatNode(nodeData, true);
                rootFormatted.relationship = '001';
                rootFormatted.children = [];

                // ✅ guardamos la instancia que retorna orgchart
                oc = $chartContainer.orgchart({
                    data: rootFormatted,
                    nodeContent: 'title',
                    pan: true,
                    zoom: true,
                    exportButton: true,
                    exportFilename: 'MiOrganigrama',
                    exportFileextension: 'png',
                    createNode: customizeNode,
                    initCompleted: function ($chartInstance) {
                        const $container = $('#chart-container');
                        $container.scrollLeft(
                            ($container[0].scrollWidth - $container.width()) / 2
                        );
                        $('.oc-export-btn').text('Exportar');
                    }
                });

                console.log('Instancia orgchart:', oc);
            },
            error: function (xhr) {
                console.error('Error cargando nodo raíz:', xhr.responseText);
            }
        });
    }

    function loadNodeChildren(patronId, parentNode) {
        $.ajax({
            url: '/Network/GetNetworkOrganizationChartUpline',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                PatronId: patronId,
                NetworkPeriodId: networkPeriodId
            }),
            success: function (nodesResponse) {
                const rawNodes = nodesResponse.data;
                if (!Array.isArray(rawNodes) || rawNodes.length === 0) return;

                const formattedChildren = rawNodes.map(n => formatNode(n, false));

                // 🔹 Actualiza el parent para marcarlo como que tiene hijos
                const parentData = $(parentNode).data('nodeData');
                if (parentData) parentData.relationship = '111';

                // 🔹 Agrega los hijos al gráfico
                if (oc && typeof oc.addChildren === 'function') {
                    console.log('✅ Añadiendo hijos:', formattedChildren);
                    oc.addChildren($(parentNode), formattedChildren);
                } else {
                    console.error('❌ No se encontró método addChildren en la instancia orgchart:', oc);
                }
            },
            error: function (xhr) {
                console.error('Error cargando hijos:', xhr.responseText);
            }
        });
    }

    function formatNode(data, isRoot) {
        const hasChildren = parseInt(data.networkQuantity ?? 0) > 0;
        return {
            id: data.id,
            name: data.name,
            title: data.title,
            rank: data.range,
            maxRange: data.maximumRange,
            pp: data.pp,
            vp: data.vp,
            relationship: isRoot
                ? '001'
                : hasChildren
                    ? '111'
                    : '110',
            children: []
        };
    }

    function customizeNode($node, data) {
        $node.find('.content').html(`
            <div style="text-align:left; padding-left:4px;">
                <div>Rango: ${data.rank ?? '-'}</div>
                <div>Máx. Rango: ${data.maxRange ?? '-'}</div>
                <div>P. Real: ${data.pp ?? 0} &nbsp;&nbsp; P. Red: ${data.vp ?? 0}</div>
            </div>
        `);
    }

    $chartContainer.on('click', '.node', function () {
        const $this = $(this);
        if ($this.data('clicked')) return;

        $this.data('clicked', true);
        const nodeData = $this.data('nodeData');
        if (!nodeData || $this.closest('li').find('ul').length > 0) return;
        loadNodeChildren(nodeData.id, $this);
    });

    loadRootNode();
});
