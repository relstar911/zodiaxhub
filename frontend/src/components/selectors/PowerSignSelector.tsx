import React from 'react';
import { PowerSign } from '../../types/card';
import { powerSignRelationships } from '../../utils/cardUtils';

interface PowerSignSelectorProps {
  value: PowerSign;
  onChange: (value: PowerSign) => void;
  showDetails?: boolean;
}

const PowerSignSelector: React.FC<PowerSignSelectorProps> = ({
  value,
  onChange,
  showDetails = true
}) => {
  const currentPowerSign = powerSignRelationships[value];

  return (
    <div className="space-y-2">
      <select
        className="w-full bg-gray-700 rounded-md px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value as PowerSign)}
      >
        {Object.keys(powerSignRelationships).map((sign) => (
          <option key={sign} value={sign}>
            {sign}
          </option>
        ))}
      </select>

      {showDetails && currentPowerSign && (
        <div className="bg-gray-700 p-3 rounded-md text-sm">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Strong Against: </span>
              <span className="text-green-400">
                {currentPowerSign.strongAgainst.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Weak Against: </span>
              <span className="text-red-400">
                {currentPowerSign.weakAgainst.join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerSignSelector;
