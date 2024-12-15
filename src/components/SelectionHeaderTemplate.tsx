import React from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import OverlayPanelComponent from './OverlayPanelComponent';
import image from '../assets/down-chevron-svgrepo-com.svg';
import { RowData } from '../types/RowData';
import { fetchData } from '../services/api';

interface SelectionHeaderTemplateProps {
  overlayPanelRef: React.RefObject<OverlayPanel>;
  numRowsToSelect: number;
  setNumRowsToSelect: (value: number) => void;
  selectedRows: RowData[];
  setSelectedRows: (rows: RowData[]) => void;
  currentPage: number;
  rowsPerPage: number;
}

// SelectionHeaderTemplate is a component for displaying the header template with an overlay panel
const SelectionHeaderTemplate: React.FC<SelectionHeaderTemplateProps> = ({
  overlayPanelRef,
  numRowsToSelect,
  setNumRowsToSelect,
  selectedRows,
  setSelectedRows,
  currentPage,
  rowsPerPage
}) => {
  // Handle icon click to toggle the overlay panel
  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    overlayPanelRef.current?.toggle(event);
  };

  // Handle overlay submit to fetch and select rows
  const handleOverlaySubmit = async () => {
    const totalRowsToSelect = numRowsToSelect;
    const newSelectedRows = [...selectedRows];

    let page = currentPage;
    let remainingRowsToSelect = totalRowsToSelect;

    while (remainingRowsToSelect > 0) {
      const result = await fetchData(page, rowsPerPage);
      const items = result.data || [];
      const mappedData = items.map((item: RowData) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }));

      const rowsToSelect = mappedData.slice(0, remainingRowsToSelect);
      newSelectedRows.push(...rowsToSelect);
      remainingRowsToSelect -= rowsToSelect.length;
      page += 1;
    }

    setSelectedRows(newSelectedRows);
    overlayPanelRef.current?.hide();
    setNumRowsToSelect(0);
  };

  return (
    <div className="flex items-center">
      <button onClick={handleIconClick} className='button1'>
        <img src={image} className='image'/>
      </button>
      <OverlayPanelComponent
        overlayPanelRef={overlayPanelRef}
        numRowsToSelect={numRowsToSelect}
        setNumRowsToSelect={setNumRowsToSelect}
        handleOverlaySubmit={handleOverlaySubmit}
      />
    </div>
  );
};

export default SelectionHeaderTemplate;