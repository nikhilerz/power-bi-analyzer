import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Database, FileText, BarChart2, LayoutTemplate, Filter, Download, Activity, MessageSquare } from 'lucide-react';
import PlotComponentRaw from 'react-plotly.js';
import CopilotChat from '../components/CopilotChat';
const Plot = PlotComponentRaw.default || PlotComponentRaw;

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          {children}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(location.state?.data || null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    if (!data) {
       navigate('/upload');
    }
  }, [data, navigate]);

  const handleDownloadDax = () => {
    if (!data || !data.kpis) return;
    
    let daxText = "--- Power BI DAX Measures ---\n\n";
    data.kpis.forEach(kpi => {
      daxText += `// ${kpi.name}\n`;
      daxText += `// ${kpi.desc}\n`;
      daxText += `${kpi.formula}\n\n`;
    });
    
    const blob = new Blob([daxText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PowerBI_DAX_Measures.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!data) return <div className="p-12 text-center text-slate-500">Redirecting to upload...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-primary-600" /> Dataset Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl p-6 text-slate-900 text-center shadow-md">
            <div className="text-4xl font-bold mb-1">{data.overview.rows}</div>
            <div className="text-slate-800 text-sm font-medium">Total Rows</div>
          </div>
          <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl p-6 text-slate-900 text-center shadow-md">
            <div className="text-4xl font-bold mb-1">{data.overview.columns}</div>
            <div className="text-slate-800 text-sm font-medium">Total Columns</div>
          </div>
          <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl p-6 text-slate-900 text-center shadow-md">
            <div className="text-4xl font-bold mb-1">{data.overview.memory}</div>
            <div className="text-slate-800 text-sm font-medium">Memory Usage</div>
          </div>
        </div>
      </div>

      <Accordion title="Column Analysis" icon={FileText} defaultOpen={true}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500 border-b border-slate-200">
              <tr>
                <th className="pb-3 font-semibold">Column Name</th>
                <th className="pb-3 font-semibold">Data Type</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Unique Values</th>
                <th className="pb-3 font-semibold">Null Count</th>
                <th className="pb-3 font-semibold">Sample Values</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.columns.map((col, idx) => (
                <tr key={idx} className="text-slate-700">
                  <td className="py-4 font-medium">{col.name}</td>
                  <td className="py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">{col.type}</span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      col.category.includes('Dimension') ? 'bg-emerald-100 text-emerald-700' :
                      col.category.includes('Date') ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {col.category}
                    </span>
                  </td>
                  <td className="py-4">{col.unique}</td>
                  <td className="py-4">{col.nulls}</td>
                  <td className="py-4 text-slate-500 truncate max-w-xs">{col.sample}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>

      <Accordion title="KPI Recommendations" icon={Activity}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-primary-300 transition-colors">
              <div className="font-bold text-slate-800 mb-1 flex justify-between items-start">
                <span>{kpi.name}</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">{kpi.desc}</p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <code className="text-xs text-primary-700 font-mono break-words">
                  {kpi.formula}
                </code>
              </div>
              <div className="mt-3">
                <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                  Visual: {kpi.visual}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Chart Recommendations (Live Previews)" icon={BarChart2} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.charts.map((chart, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">{chart.title}</h3>
                <span className="bg-primary-500 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">
                  {chart.type}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4">{chart.desc}</p>
              
              {chart.plot_json ? (
                <div className="w-full bg-white rounded-lg border border-slate-100 overflow-hidden mb-4 h-64 relative">
                  <Plot 
                    data={chart.plot_json.data} 
                    layout={{
                      ...chart.plot_json.layout, 
                      autosize: true, 
                      margin: {l: 30, r: 10, t: 10, b: 30},
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      plot_bgcolor: 'rgba(0,0,0,0)'
                    }} 
                    useResizeHandler={true}
                    style={{width: '100%', height: '100%'}}
                    config={{displayModeBar: false, responsive: true}}
                  />
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm border border-slate-100 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">X-Axis:</span>
                    <span className="font-mono text-slate-800">{chart.x}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Y-Axis:</span>
                    <span className="font-mono text-slate-800">{chart.y}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Aggregation:</span>
                    <span className="font-mono text-slate-800">{chart.agg}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Dashboard Layout Recommendations" icon={LayoutTemplate}>
        <div className="space-y-4">
          {data.layout.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">{item.section}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-xs text-slate-500 font-medium">Visuals:</span>
                  {item.visuals.map((v, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs border border-slate-200">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-primary-600 text-sm font-medium bg-primary-50 px-3 py-1 rounded-lg">
                  {item.position}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Recommended Filters & Slicers" icon={Filter}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.filters?.map((filter, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 mb-2">{filter.field}</h3>
              <div className="space-y-1 text-sm mb-3">
                <div className="text-slate-500">Type: <span className="text-slate-800">{filter.type}</span></div>
                <div className="text-slate-500">Style: <span className="text-slate-800">{filter.style}</span></div>
              </div>
              <p className="text-xs text-slate-400 border-t border-slate-100 pt-2">{filter.desc}</p>
            </div>
          ))}
        </div>
      </Accordion>

      <div className="flex justify-center gap-4 mt-8 mb-12">
        <button 
          onClick={handleDownloadDax}
          className="bg-gradient-to-r from-primary-400 to-primary-600 text-slate-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:from-primary-500 hover:to-primary-700 transition-all flex items-center gap-2"
        >
          <Download className="h-5 w-5" />
          Download DAX Measures
        </button>
        <button 
          onClick={() => navigate('/upload')}
          className="bg-white text-primary-600 border border-primary-200 font-bold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Analyze Another Dataset
        </button>
      </div>
      
      {/* Copilot FAB and Chat */}
      {!isCopilotOpen && (
        <button 
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 bg-slate-900 text-primary-400 p-4 rounded-full shadow-2xl hover:bg-slate-800 hover:scale-110 transition-all z-50 flex items-center justify-center border border-slate-700"
        >
          <MessageSquare className="h-8 w-8" />
        </button>
      )}
      
      {isCopilotOpen && (
        <CopilotChat datasetId={data.dataset_id} onClose={() => setIsCopilotOpen(false)} />
      )}

    </div>
  );
};

export default Dashboard;
