import React from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

interface OverlayPanelComponentProps {
  overlayPanelRef: React.RefObject<OverlayPanel>;
  numRowsToSelect: number;
  setNumRowsToSelect: (value: number) => void;
  handleOverlaySubmit: () => void;
}

const OverlayPanelComponent: React.FC<OverlayPanelComponentProps> = ({
  overlayPanelRef,
  numRowsToSelect,
  setNumRowsToSelect,
  handleOverlaySubmit
}) => {
  return (
    <OverlayPanel ref={overlayPanelRef}>
      <div className="p-field">
        <InputNumber
          id="numRows"
          value={numRowsToSelect}
          onValueChange={(e) => setNumRowsToSelect(e.value ?? 0)}
        />
      </div>
      <Button label="Submit" onClick={handleOverlaySubmit} className='flex flex-row justify-end' id='buttonSubmit'/>
    </OverlayPanel>
  );
};

export default OverlayPanelComponent;