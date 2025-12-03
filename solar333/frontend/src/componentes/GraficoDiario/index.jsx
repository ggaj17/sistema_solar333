const GraficoDiario = ({ dadosDiarios }) => {
  const ultimosSetesDias = dadosDiarios.slice(-7);
  
  return (
    <div className="daily-chart">
      <h3>Geração dos Últimos 7 Dias (kWh)</h3>
      <div className="chart-bars">
        {ultimosSetesDias.map((day, index) => (
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
          <span>Energia Economizada</span>
        </div>
      </div>
    </div>
  );
};

export default GraficoDiario;