import React, { useState, useEffect } from 'react';
import './index.css';

// Simulação de dados do backend
const initialEnergyData = {
  today: {
    generated: 42.5, // kWh
    consumed: 28.3, // kWh
    exported: 14.2, // kWh
    savings: 38.2, // Reais
    efficiency: 92, // %
    co2Saved: 25.4 // kg
  },
  thisMonth: {
    generated: 1250.8, // kWh
    consumed: 890.5, // kWh
    exported: 360.3, // kWh
    savings: 1120.7, // Reais
    efficiency: 94, // %
    co2Saved: 748.2 // kg
  },
  thisYear: {
    generated: 14850.3, // kWh
    consumed: 10560.7, // kWh
    exported: 4289.6, // kWh
    savings: 13320.4, // Reais
    efficiency: 95, // %
    co2Saved: 8920.1 // kg
  },
  dailyData: [
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
  systemInfo: {
    installedPower: 7.5, // kWp
    panelsCount: 20,
    installationDate: '2022-05-15',
    inverterEfficiency: 97.5, // %
    estimatedPayback: 4.5 // anos
  }
};

const SolarMonitoring = () => {
  const [energyData, setEnergyData] = useState(initialEnergyData);
  const [timeRange, setTimeRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [newGeneration, setNewGeneration] = useState('');

  // Simula atualização dos dados a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      updateEnergyData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Atualiza os dados de energia simulando leituras do sistema
  const updateEnergyData = () => {
    setLoading(true);
    
    setTimeout(() => {
      const updatedData = { ...energyData };
      const randomFactor = 0.95 + Math.random() * 0.1;
      
      // Atualiza dados de hoje
      updatedData.today.generated = parseFloat((updatedData.today.generated * randomFactor).toFixed(1));
      updatedData.today.consumed = parseFloat((updatedData.today.consumed * (0.98 + Math.random() * 0.04)).toFixed(1));
      updatedData.today.exported = parseFloat((updatedData.today.generated - updatedData.today.consumed).toFixed(1));
      updatedData.today.savings = parseFloat((updatedData.today.generated * 0.9).toFixed(1));
      updatedData.today.co2Saved = parseFloat((updatedData.today.generated * 0.6).toFixed(1));
      
      // Adiciona novo dado diário
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + updatedData.dailyData.length);
      const formattedDate = newDate.toISOString().split('T')[0];
      
      updatedData.dailyData.push({
        date: formattedDate,
        generated: parseFloat((40 + Math.random() * 8).toFixed(1)),
        consumed: parseFloat((25 + Math.random() * 6).toFixed(1)),
        exported: parseFloat((10 + Math.random() * 6).toFixed(1))
      });
      
      // Mantém apenas os últimos 30 dias
      if (updatedData.dailyData.length > 30) {
        updatedData.dailyData.shift();
      }
      
      setEnergyData(updatedData);
      setLoading(false);
    }, 500);
  };

  // Adiciona geração manual (simulação de entrada do usuário)
  const addManualGeneration = () => {
    if (!newGeneration || isNaN(parseFloat(newGeneration))) return;
    
    const updatedData = { ...energyData };
    const value = parseFloat(newGeneration);
    
    updatedData.today.generated += value;
    updatedData.today.exported = parseFloat((updatedData.today.generated - updatedData.today.consumed).toFixed(1));
    updatedData.today.savings += parseFloat((value * 0.9).toFixed(1));
    updatedData.today.co2Saved += parseFloat((value * 0.6).toFixed(1));
    
    setEnergyData(updatedData);
    setNewGeneration('');
    
    // Atualiza dados mensais e anuais também
    updatedData.thisMonth.generated += value;
    updatedData.thisMonth.exported = parseFloat((updatedData.thisMonth.generated - updatedData.thisMonth.consumed).toFixed(1));
    updatedData.thisMonth.savings += parseFloat((value * 0.9).toFixed(1));
    updatedData.thisMonth.co2Saved += parseFloat((value * 0.6).toFixed(1));
    
    updatedData.thisYear.generated += value;
    updatedData.thisYear.exported = parseFloat((updatedData.thisYear.generated - updatedData.thisYear.consumed).toFixed(1));
    updatedData.thisYear.savings += parseFloat((value * 0.9).toFixed(1));
    updatedData.thisYear.co2Saved += parseFloat((value * 0.6).toFixed(1));
  };

  // Retorna os dados com base no período selecionado
  const getCurrentData = () => {
    return energyData[timeRange];
  };

  // Calcula porcentagem de autoconsumo
  const calculateSelfConsumption = () => {
    const data = getCurrentData();
    return data.generated > 0 ? ((data.consumed / data.generated) * 100).toFixed(1) : 0;
  };

  // Renderiza gráfico simples de barras para dados diários
  const renderDailyChart = () => {
    const lastSevenDays = energyData.dailyData.slice(-7);
    
    return (
      <div className="daily-chart">
        <h3>Geração dos Últimos 7 Dias (kWh)</h3>
        <div className="chart-bars">
          {lastSevenDays.map((day, index) => (
            <div key={index} className="chart-bar-container">
              <div className="chart-bar-label">{new Date(day.date).getDate()}/{new Date(day.date).getMonth()+1}</div>
              <div className="chart-bar">
                <div 
                  className="bar-generated" 
                  style={{ height: `${(day.generated / 50) * 100}%` }}
                  title={`Gerado: ${day.generated} kWh`}
                ></div>
                <div 
                  className="bar-consumed" 
                  style={{ height: `${(day.consumed / 50) * 100}%` }}
                  title={`Consumido: ${day.consumed} kWh`}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color generated"></div>
            <span>Energia Gerada</span>
          </div>
          <div className="legend-item">
            <div className="legend-color consumed"></div>
            <span>Energia Consumida</span>
          </div>
        </div>
      </div>
    );
  };

  const currentData = getCurrentData();

  return (
    <div className="solar-monitoring">
      <header className="monitoring-header">
        <h1>Monitoramento de Energia Solar</h1>
        <p className="subtitle">Acompanhe em tempo real a geração e economia do seu sistema fotovoltaico</p>
      </header>

      <div className="time-range-selector">
        <button 
          className={`time-btn ${timeRange === 'today' ? 'active' : ''}`}
          onClick={() => setTimeRange('today')}
        >
          Hoje
        </button>
        <button 
          className={`time-btn ${timeRange === 'thisMonth' ? 'active' : ''}`}
          onClick={() => setTimeRange('thisMonth')}
        >
          Este Mês
        </button>
        <button 
          className={`time-btn ${timeRange === 'thisYear' ? 'active' : ''}`}
          onClick={() => setTimeRange('thisYear')}
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
              {timeRange === 'today' ? 'Até o momento' : 
               timeRange === 'thisMonth' ? 'Total do mês' : 'Total do ano'}
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
              <span className="detail-label">Autoconsumo:</span>
              <span className="detail-value">{calculateSelfConsumption()}%</span>
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
              <span className="detail-value">{energyData.systemInfo.installedPower} kWp</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Número de Painéis:</span>
              <span className="detail-value">{energyData.systemInfo.panelsCount}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Eficiência do Inversor:</span>
              <span className="detail-value">{energyData.systemInfo.inverterEfficiency}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Retorno do Investimento:</span>
              <span className="detail-value">{energyData.systemInfo.estimatedPayback} anos</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          {renderDailyChart()}
        </div>

        <div className="controls">
          <div className="manual-input">
            <h3>Simular Geração (para testes)</h3>
            <div className="input-group">
              <input 
                type="number" 
                placeholder="Adicionar geração em kWh"
                value={newGeneration}
                onChange={(e) => setNewGeneration(e.target.value)}
                min="0"
                step="0.1"
              />
              <button onClick={addManualGeneration} className="add-btn">
                Adicionar
              </button>
            </div>
            <p className="input-help">
              Use este campo para simular a geração de energia adicional
            </p>
          </div>

          <div className="system-controls">
            <button 
              className={`update-btn ${loading ? 'loading' : ''}`}
              onClick={updateEnergyData}
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
          <h3>Resumo de Impacto</h3>
          <p>
            Seu sistema solar já gerou <strong>{energyData.thisYear.generated} kWh</strong> este ano, 
            economizando <strong>R$ {energyData.thisYear.savings}</strong> e evitando a emissão de 
            <strong> {energyData.thisYear.co2Saved} kg</strong> de CO₂ na atmosfera.
            Isso equivale a {Math.round(energyData.thisYear.co2Saved / 20)} árvores plantadas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolarMonitoring;