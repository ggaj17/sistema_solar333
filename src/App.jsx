import React, { useState, useEffect } from 'react';
import './index.css';
import GraficoDiario from './componentes/GraficoDiario';

const energiaInicial = {
  hoje: {
    generated: 42.5,
    consumed: 28.3,
    exported: 14.2,
    savings: 38.2,
    efficiency: 92,
    co2Saved: 25.4
  },
  esteMes: {
    generated: 1250.8, 
    consumed: 890.5,
    exported: 360.3, 
    savings: 1120.7,
    efficiency: 94, 
    co2Saved: 748.2 
  },
  esteAno: {
    generated: 14850.3, 
    consumed: 10560.7, 
    exported: 4289.6, 
    savings: 13320.4, 
    efficiency: 95, 
    co2Saved: 8920.1 
  },
  dadosDiarios: [
    { date: '2023-10-01', generated: 40.2, consumed: 26.8, exported: 13.4 },
    { date: '2023-10-02', generated: 38.7, consumed: 25.9, exported: 12.8 },
    { date: '2023-10-03', generated: 41.5, consumed: 27.3, exported: 14.2 },
    { date: '2023-10-04', generated: 39.8, consumed: 26.2, exported: 13.6 },
    { date: '2023-10-05', generated: 42.1, consumed: 28.5, exported: 13.6 },
    { date: '2023-10-06', generated: 35.6, consumed: 22.4, exported: 13.2 },
    { date: '2023-10-07', generated: 43.2, consumed: 29.1, exported: 14.1 },
    { date: '2023-10-08', generated: 44.5, consumed: 30.2, exported: 14.3 },
    { date: '2023-10-09', generated: 41.8, consumed: 27.8, exported: 14.0 },
    { date: '2023-10-10', generated: 39.5, consumed: 26.5, exported: 13.0 },
  ],
  infoSistema: {
    installedPower: 7.5,
    panelsCount: 20,
    installationDate: '2022-05-15',
    inverterEfficiency: 97.5,
    estimatedPayback: 4.5
  }
};

const Monitoramento = () => {
  const [energyData, setEnergyData] = useState(energiaInicial);
  const [timeRange, setTimeRange] = useState('hoje');
  const [loading, setLoading] = useState(false);
  const [newGeneration, setNewGeneration] = useState('');

  
  useEffect(() => {
    const interval = setInterval(() => {
      atualizaConsumoEnergia();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const atualizaConsumoEnergia = () => {
    setLoading(true);
    
    setTimeout(() => {
      const updatedData = { ...energyData };
      const randomFactor = 0.95 + Math.random() * 0.1;
      
      updatedData.hoje.generated = parseFloat((updatedData.hoje.generated * randomFactor).toFixed(1));
      updatedData.hoje.consumed = parseFloat((updatedData.hoje.consumed * (0.98 + Math.random() * 0.04)).toFixed(1));
      updatedData.hoje.exported = parseFloat((updatedData.hoje.generated - updatedData.hoje.consumed).toFixed(1));
      updatedData.hoje.savings = parseFloat((updatedData.hoje.generated * 0.9).toFixed(1));
      updatedData.hoje.co2Saved = parseFloat((updatedData.hoje.generated * 0.6).toFixed(1));
      
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + updatedData.dadosDiarios.length);
      const formattedDate = newDate.toISOString().split('T')[0];
      
      updatedData.dadosDiarios.push({
        date: formattedDate,
        generated: parseFloat((40 + Math.random() * 8).toFixed(1)),
        consumed: parseFloat((25 + Math.random() * 6).toFixed(1)),
        exported: parseFloat((10 + Math.random() * 6).toFixed(1))
      });
      
      if (updatedData.dadosDiarios.length > 30) {
        updatedData.dadosDiarios.shift();
      }
      
      setEnergyData(updatedData);
      setLoading(false);
    }, 500);
  };

  const addGeracaoManual = () => {
    if (!newGeneration || isNaN(parseFloat(newGeneration))) return;
    
    const updatedData = { ...energyData };
    const value = parseFloat(newGeneration);
    
    updatedData.hoje.generated += value;
    updatedData.hoje.exported = parseFloat((updatedData.hoje.generated - updatedData.hoje.consumed).toFixed(1));
    updatedData.hoje.savings += parseFloat((value * 0.9).toFixed(1));
    updatedData.hoje.co2Saved += parseFloat((value * 0.6).toFixed(1));
    
    setEnergyData(updatedData);
    setNewGeneration('');
    
    updatedData.esteMes.generated += value;
    updatedData.esteMes.exported = parseFloat((updatedData.esteMes.generated - updatedData.esteMes.consumed).toFixed(1));
    updatedData.esteMes.savings += parseFloat((value * 0.9).toFixed(1));
    updatedData.esteMes.co2Saved += parseFloat((value * 0.6).toFixed(1));
    
    updatedData.esteAno.generated += value;
    updatedData.esteAno.exported = parseFloat((updatedData.esteAno.generated - updatedData.esteAno.consumed).toFixed(1));
    updatedData.esteAno.savings += parseFloat((value * 0.9).toFixed(1));
    updatedData.esteAno.co2Saved += parseFloat((value * 0.6).toFixed(1));
  };

  const getDataAtual = () => {
    return energyData[timeRange];
  };

  const CalculaConsumo = () => {
    const data = getDataAtual();
    return data.generated > 0 ? ((data.consumed / data.generated) * 100).toFixed(1) : 0;
  };

  const currentData = getDataAtual();

  return (
    <div className="solar-monitoring">
      <header className="monitoring-header">
        <h1>Monitoramento de Energia Fotovoltaica - Solar333</h1>
        <p className="subtitle">Acompanhe em tempo real a geração e economia do seu sistema fotovoltaico</p>
      </header>

      <div className="time-range-selector">
        <button 
          className={`time-btn ${timeRange === 'hoje' ? 'active' : ''}`}
          onClick={() => setTimeRange('hoje')}
        >
          Hoje
        </button>
        <button 
          className={`time-btn ${timeRange === 'esteMes' ? 'active' : ''}`}
          onClick={() => setTimeRange('esteMes')}
        >
          Este Mês
        </button>
        <button 
          className={`time-btn ${timeRange === 'esteAno' ? 'active' : ''}`}
          onClick={() => setTimeRange('esteAno')}
        >
          Este Ano
        </button>
      </div>

      <div className="dashboard">
        <div className="main-stats">
          <div className="stat-card primary">
            <h3>Energia Gerada</h3>
            <div className="stat-value">{currentData.generated} kWh</div>
            <div className="stat-subtitle">
              {timeRange === 'hoje' ? 'Até o momento' : 
               timeRange === 'esteMes' ? 'Total do mês' : 'Total do ano'}
            </div>
          </div>

          <div className="stat-card secondary">
            <h3>Economia</h3>
            <div className="stat-value">R$ {currentData.savings}</div>
            <div className="stat-subtitle">Valor economizado na conta de luz</div>
          </div>

          <div className="stat-card success">
            <h3>CO₂ Evitado</h3>
            <div className="stat-value">{currentData.co2Saved} kg</div>
            <div className="stat-subtitle">Emissões de carbono evitadas</div>
          </div>

          <div className="stat-card info">
            <h3>Eficiência do Sistema</h3>
            <div className="stat-value">{currentData.efficiency}%</div>
            <div className="stat-subtitle">Performance do sistema fotovoltaico</div>
          </div>
        </div>

        <div className="detailed-stats">
          <div className="detail-card">
            <h3>Detalhes da Energia</h3>
            <div className="detail-item">
              <span className="detail-label">Energia Consumida:</span>
              <span className="detail-value">{currentData.consumed} kWh</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Energia Exportada:</span>
              <span className="detail-value">{currentData.exported} kWh</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Economia:</span>
              <span className="detail-value">{CalculaConsumo()}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tarifa Média:</span>
              <span className="detail-value">R$ 0,90/kWh</span>
            </div>
          </div>

          <div className="detail-card">
            <h3>Informações do Sistema</h3>
            <div className="detail-item">
              <span className="detail-label">Potência Instalada:</span>
              <span className="detail-value">{energyData.infoSistema.installedPower} kWp</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Número de Painéis:</span>
              <span className="detail-value">{energyData.infoSistema.panelsCount}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Eficiência do Inversor:</span>
              <span className="detail-value">{energyData.infoSistema.inverterEfficiency}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Retorno do Investimento:</span>
              <span className="detail-value">{energyData.infoSistema.estimatedPayback} anos</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <GraficoDiario dadosDiarios={energyData.dadosDiarios} />
        </div>

        <div className="controls">
          <div className="manual-input">
            <h3>Adicione Dados extras</h3>
            <div className="input-group">
              <input 
                type="number" 
                placeholder="Adicionar geração em kWh"
                value={newGeneration}
                onChange={(e) => setNewGeneration(e.target.value)}
                min="0"
                step="0.1"
              />
              <button onClick={addGeracaoManual} className="add-btn">
                Adicionar
              </button>
            </div>
            <p className="input-help">
              Use este campo para a a geração de energia adicional para casos em que houve uma pequena queda de energia e impediu a coleta dos dados.
            </p>
          </div>

          <div className="system-controls">
            <h2>Forçar Atualização</h2>
            <button 
              className={`update-btn ${loading ? 'loading' : ''}`}
              onClick={atualizaConsumoEnergia}
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar Dados'}
            </button>
            <div className="last-update">
              Última atualização: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="summary">
          <h3>Impacto no meio ambiente:</h3>
          <p>
            Seu sistema solar já gerou <strong>{energyData.esteAno.generated} kWh</strong> este ano, 
            economizando <strong>R$ {energyData.esteAno.savings}</strong> e evitando a emissão de 
            <strong> {energyData.esteAno.co2Saved} kg</strong> de CO₂ na atmosfera.
            Isso equivale a <strong>{Math.round(energyData.esteAno.co2Saved / 20)} árvores plantadas.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Monitoramento;