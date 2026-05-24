function atualizarUsuario() {
    var b_usuario = document.getElementById("b_usuario");
    b_usuario.innerHTML = sessionStorage.NOME_USUARIO || "usuário";
}

function obterStatusTemperatura() {
    if ( === null ||  === undefined) {
        return { label: "Sem dados", classe: "status-dados" };
    }

    if ( >= 23) {
        return { label: "Perigo quente", classe: "status-perigo" };
    }
    if ( >= 22) {
        return { label: "Alerta quente", classe: "status-alerta" };
    }
    if ( > 10) {
        return { label: "Ideal", classe: "status-ideal" };
    }
    if ( > 5) {
        return { label: "Alerta frio", classe: "status-alerta" };
    }
    return { label: "Perigo frio", classe: "status-perigo" };
}

async function buscarMedidaAtual(idUsuario) {
    try {
        const resposta = await fetch(`/medidas/tempo-real/${idUsuario}`, { cache: 'no-store' });
        if (!resposta.ok) {
            return null;
        }
        const dados = await resposta.json();
        return dados[0] || null;
    } catch (erro) {
        console.error(`Erro fetching medida para aquário ${idUsuario}: ${erro.message}`);
        return null;
    }
}

function calcularMediaTemperatura(registros) {
    const temperaturas = registros
        .map(item => item.medida && item.medida.temperatura)
        .filter(temp => temp !== null && temp !== undefined);

    if (!temperaturas.length) {
        return null;
    }

    return temperaturas.reduce((acc, valor) => acc + valor, 0) / temperaturas.length;
}

function montarCardKpi(titulo, valor, detalhe) {
    return `
        <div class="kpi-card">
            <h3>${titulo}</h3>
            <p class="kpi-value">${valor}</p>
            <small>${detalhe}</small>
        </div>
    `;
}

function mostrarKpis(dados) {
    const container = document.getElementById("kpiGrid");
    const totalAquarios = dados.length;
    const mediaTemperatura = calcularMediaTemperatura(dados);
    const aquariosAlerta = dados.filter(item => {
        const status = obterStatusTemperatura(item.medida && item.medida.temperatura);
        return status.label.includes("Alerta") || status.label.includes("Perigo");
    }).length;
    const aquariosIdeais = dados.filter(item => obterStatusTemperatura(item.medida && item.medida.temperatura).label === "Ideal").length;

    container.innerHTML = '';
    container.innerHTML += montarCardKpi("Total de aquários", totalAquarios, "Número de aquários conectados");
    container.innerHTML += montarCardKpi("Temperatura média", mediaTemperatura !== null ? mediaTemperatura.toFixed(1) + "°C" : "N/A", "Média das temperaturas atuais");
    container.innerHTML += montarCardKpi("Aquários em alerta", aquariosAlerta, "Quantidade de aquários fora da faixa ideal");
    container.innerHTML += montarCardKpi("Aquários ideais", aquariosIdeais, "Quantidade de aquários na faixa ideal");
}

function montarListaAquarios(dados) {
    const container = document.getElementById("kpiList");
    container.innerHTML = `<h2>Detalhes por aquário</h2>`;

    dados.forEach(item => {
        const temp = item.medida ? `${item.medida.temperatura.toFixed(1)}°C` : "Sem dados";
        const momento = item.medida ? item.medida.momento_grafico : "-";
        const status = obterStatusTemperatura(item.medida && item.medida.temperatura);

        container.innerHTML += `
            <div class="kpi-detail-card">
                <div>
                    <h3>${item.aquario.descricao}</h3>
                    <p>Temperatura: <strong>${temp}</strong></p>
                    <p>Última leitura: <strong>${momento}</strong></p>
                </div>
                <span class="status-pill ${status.classe}">${status.label}</span>
            </div>
        `;
    });
}

function montarGrafico(dados) {
    const ctx = document.getElementById("kpiChart").getContext("2d");
    const labels = dados.map(item => item.aquario.descricao);
    const valores = dados.map(item => item.medida ? item.medida.temperatura : 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperatura atual (°C)',
                data: valores,
                backgroundColor: valores.map(temperatura => temperatura >= 23 || temperatura <= 5 ? '#ff7043' : temperatura >= 22 || temperatura <= 10 ? '#ffee58' : '#9ccc65'),
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

async function exibirDashboardKpi() {
    validarSessao();
    atualizarUsuario();

    const aquarios = JSON.parse(sessionStorage.AQUARIOS || '[]');
    if (!aquarios.length) {
        document.getElementById("kpiGrid").innerHTML = `<div class="kpi-empty">Nenhum aquário encontrado na sessão.</div>`;
        return;
    }

    const dados = await Promise.all(aquarios.map(async aquario => {
        const medida = await buscarMedidaAtual(aquario.id);
        return { aquario, medida };
    }));

    mostrarKpis(dados);
    montarListaAquarios(dados);
    montarGrafico(dados);
}

window.addEventListener('DOMContentLoaded', exibirDashboardKpi);
