import { useState, useEffect } from 'react';
import { Circuit, CircuitFormData } from './lib/types';
import { CircuitEngine } from './lib/circuitEngine';
import { CircuitStorage } from './lib/storage';
import { ExportUtils } from './lib/exportUtils';
import { CITIES } from './lib/data';
import { Dashboard } from './components/Dashboard';
import { CreateCircuit } from './components/CreateCircuit';
import { CircuitResults } from './components/CircuitResults';
import { CircuitDetail } from './components/CircuitDetail';
import { CircuitCustomize } from './components/CircuitCustomize';
import { ExportPanel } from './components/ExportPanel';

type View = 'dashboard' | 'create' | 'results' | 'detail' | 'customize';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [generatedCircuits, setGeneratedCircuits] = useState<Circuit[]>([]);
  const [currentCircuit, setCurrentCircuit] = useState<Circuit | null>(null);
  const [currentFormData, setCurrentFormData] = useState<CircuitFormData | null>(null);
  const [showExportPanel, setShowExportPanel] = useState(false);

  useEffect(() => {
    loadCircuits();
    checkForSharedCircuit();
  }, []);

  const loadCircuits = () => {
    const loaded = CircuitStorage.getAllCircuits();
    setCircuits(loaded);
  };

  const checkForSharedCircuit = () => {
    const params = new URLSearchParams(window.location.search);
    const circuitParam = params.get('circuit');
    
    if (circuitParam) {
      try {
        const circuitId = atob(circuitParam);
        const circuit = CircuitStorage.getCircuit(circuitId);
        if (circuit) {
          setCurrentCircuit(circuit);
          setView('detail');
        }
      } catch (error) {
        console.error('Invalid shared circuit link');
      }
    }
  };

  const handleCreateNew = () => {
    setView('create');
  };

  const handleGenerate = (formData: CircuitFormData) => {
    if (!formData.academic_year) return;

    setCurrentFormData(formData);

    const candidates = CircuitEngine.generateCircuits(
      formData.academic_year,
      formData.duration,
      formData.learning_goals,
      formData.constraints,
      formData.starting_city
    );

    const circuits: Circuit[] = candidates.map((candidate, index) => {
      const cityNames = candidate.cities
        .map(c => c.city)
        .slice(0, 3)
        .join('-');
      
      const circuitId = `circuit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const dayPlan = CircuitEngine.generateDayPlan(
        candidate.cities,
        formData.learning_goals,
        formData.academic_year
      );

      return {
        id: circuitId,
        name: `${cityNames} Circuit ${index + 1}`,
        academic_year: formData.academic_year,
        semester: formData.semester,
        duration: formData.duration,
        learning_goals: formData.learning_goals,
        cities: candidate.cities.map(c => c.id),
        day_plan: dayPlan,
        academic_justification: candidate.academic_justification,
        status: 'Draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        starting_city: formData.starting_city,
        constraints: formData.constraints,
        score: candidate.score
      };
    });

    setGeneratedCircuits(circuits);
    setView('results');
  };

  const handleSelectCircuit = (circuit: Circuit) => {
    setCurrentCircuit(circuit);
    setView('detail');
  };

  const handleViewCircuit = (id: string) => {
    const circuit = CircuitStorage.getCircuit(id);
    if (circuit) {
      setCurrentCircuit(circuit);
      setView('detail');
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicated = CircuitStorage.duplicateCircuit(id);
    if (duplicated) {
      loadCircuits();
    }
  };

  const handleDelete = (id: string) => {
    CircuitStorage.deleteCircuit(id);
    loadCircuits();
  };

  const handleSaveCircuit = (circuit: Circuit) => {
    CircuitStorage.saveCircuit(circuit);
    loadCircuits();
    setCurrentCircuit(circuit);
    alert('Circuit saved successfully');
  };

  const handleUpdateCircuit = (updatedCircuit: Circuit) => {
    // Regenerate day plan to reflect any changes in cities or order
    const cityObjects = updatedCircuit.cities
      .map(id => CITIES.find(c => c.id === id))
      .filter((c): c is typeof CITIES[0] => !!c);

    const newDayPlan = CircuitEngine.generateDayPlan(
      cityObjects,
      updatedCircuit.learning_goals,
      updatedCircuit.academic_year
    );

    const finalCircuit = {
      ...updatedCircuit,
      day_plan: newDayPlan
    };

    CircuitStorage.saveCircuit(finalCircuit);
    loadCircuits();
    setCurrentCircuit(finalCircuit);
    setView('detail');
    alert('Circuit updated successfully');
  };

  const handleShare = () => {
    if (!currentCircuit) return;
    
    if (currentCircuit.status === 'Draft') {
      CircuitStorage.saveCircuit({
        ...currentCircuit,
        status: 'Approved'
      });
      loadCircuits();
    }
    
    setShowExportPanel(true);
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setCurrentCircuit(null);
    setGeneratedCircuits([]);
    setCurrentFormData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {view === 'dashboard' && (
        <Dashboard
          circuits={circuits}
          onCreateNew={handleCreateNew}
          onViewCircuit={handleViewCircuit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}

      {view === 'create' && (
        <CreateCircuit
          onGenerate={handleGenerate}
          onCancel={handleBackToDashboard}
        />
      )}

      {view === 'results' && (
        <CircuitResults
          circuits={generatedCircuits}
          onSelectCircuit={handleSelectCircuit}
          onSaveCircuit={handleSaveCircuit}
          onBack={() => setView('create')}
        />
      )}

      {view === 'detail' && currentCircuit && (
        <CircuitDetail
          circuit={currentCircuit}
          onBack={handleBackToDashboard}
          onCustomize={() => setView('customize')}
          onExport={() => setShowExportPanel(true)}
          onShare={handleShare}
        />
      )}

      {view === 'customize' && currentCircuit && (
        <CircuitCustomize
          circuit={currentCircuit}
          onBack={() => setView('detail')}
          onSave={handleUpdateCircuit}
        />
      )}

      {showExportPanel && currentCircuit && (
        <ExportPanel
          circuit={currentCircuit}
          onClose={() => setShowExportPanel(false)}
        />
      )}
    </div>
  );
}