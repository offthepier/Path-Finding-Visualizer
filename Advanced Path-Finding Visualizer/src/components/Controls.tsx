import React from 'react';
import { Algorithm, VisualizationSettings } from '../types/grid';
import { Play, Pause, RotateCcw, Settings, Dices } from 'lucide-react';

interface ControlsProps {
  selectedAlgorithm: Algorithm;
  settings: VisualizationSettings;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onSettingsChange: (settings: Partial<VisualizationSettings>) => void;
  onVisualize: () => void;
  onClear: () => void;
  onGenerateMaze: () => void;
  isVisualizing: boolean;
}

const ALGORITHM_NAMES: Record<Algorithm, string> = {
  'weighted-astar': 'Weighted A*',
  'dijkstra': 'Dijkstra\'s Algorithm',
  'bfs': 'Breadth-First Search',
  'dfs': 'Depth-First Search',
  'greedy-best-first': 'Greedy Best-First Search',
  'bidirectional': 'Bidirectional Search',
  'jump-point': 'Jump Point Search'
};

const Controls: React.FC<ControlsProps> = ({
  selectedAlgorithm,
  settings,
  onAlgorithmChange,
  onSettingsChange,
  onVisualize,
  onClear,
  onGenerateMaze,
  isVisualizing,
}) => {
  const handleAlgorithmSelection = (algorithm: Algorithm) => {
    if (settings.compareMode) {
      const newSelectedAlgorithms = settings.selectedAlgorithms.includes(algorithm)
        ? settings.selectedAlgorithms.filter(a => a !== algorithm)
        : [...settings.selectedAlgorithms, algorithm];
      onSettingsChange({ selectedAlgorithms: newSelectedAlgorithms });
    } else {
      onAlgorithmChange(algorithm);
    }
  };

  const toggleCompareMode = (enabled: boolean) => {
    onSettingsChange({ 
      compareMode: enabled,
      selectedAlgorithms: enabled ? [selectedAlgorithm] : []
    });
  };

  return (
    <div className="bg-white shadow-md p-4 mb-4 rounded-lg">
      <div className="flex flex-wrap items-center gap-4">
        {!settings.compareMode ? (
          <select
            value={selectedAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isVisualizing}
          >
            {Object.entries(ALGORITHM_NAMES).map(([value, name]) => (
              <option key={value} value={value}>{name}</option>
            ))}
          </select>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(ALGORITHM_NAMES).map(([value, name]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.selectedAlgorithms.includes(value as Algorithm)}
                  onChange={() => handleAlgorithmSelection(value as Algorithm)}
                  className="rounded"
                  disabled={isVisualizing}
                />
                <span className="text-sm">{name}</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={onVisualize}
            disabled={isVisualizing || (settings.compareMode && settings.selectedAlgorithms.length === 0)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            <Play size={20} />
            Visualize
          </button>

          <button
            onClick={onClear}
            disabled={isVisualizing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
          >
            <RotateCcw size={20} />
            Clear
          </button>

          <button
            onClick={onGenerateMaze}
            disabled={isVisualizing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
          >
            <Dices size={20} />
            Random Maze
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <input
              type="range"
              min="1"
              max="5"
              value={settings.speed}
              onChange={(e) => onSettingsChange({ speed: Number(e.target.value) })}
              className="w-24"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.allowDiagonal}
              onChange={(e) => onSettingsChange({ allowDiagonal: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Allow Diagonal</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.weightedNodes}
              onChange={(e) => onSettingsChange({ weightedNodes: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Weighted Nodes</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.compareMode}
              onChange={(e) => toggleCompareMode(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Compare Mode</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Controls;