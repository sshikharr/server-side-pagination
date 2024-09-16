import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import './App.css';
import axios from 'axios';
import image from './assets/down-chevron-svgrepo-com.svg';

interface RowData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const DataTableComponent: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [numRowsToSelect, setNumRowsToSelect] = useState(0);
  const rowsPerPage = 12;
  const overlayPanelRef = useRef<OverlayPanel>(null);

  const fetchData = async (page: number) => {
    try {
      const result = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`);

      const items = result.data.data || [];
      const mappedData = items.map((item: RowData) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }));
      setData(mappedData);
      setTotalRecords(result.data.pagination.total || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalRecords(0);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const onRowSelectChange = (e: DataTableSelectionMultipleChangeEvent<RowData[]>) => {
    setSelectedRows(e.value);
  };

  const persistRowSelection = (row: RowData) => {
    return selectedRows.some(selectedRow => selectedRow.id === row.id);
  };

  const rowClassName = (row: RowData) => {
    return persistRowSelection(row) ? 'selected-row' : '';
  };

  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    overlayPanelRef.current?.toggle(event);
  };

  const handleOverlaySubmit = async () => {
    const totalRowsToSelect = numRowsToSelect;
    const newSelectedRows = [...selectedRows];

    let page = currentPage;
    let remainingRowsToSelect = totalRowsToSelect;

    while (remainingRowsToSelect > 0) {
      const result = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`);
      const items = result.data.data || [];
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

  const selectionHeaderTemplate = () => {
    return (
      <div className="flex items-center">
        <button onClick={handleIconClick} className='button1'>
          <img src={image} className='image'/>
        </button>
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
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="shadow-lg rounded-lg overflow-hidden border border-gray-200 bg-white">
        <DataTable
          value={data}
          paginator
          rows={rowsPerPage}
          totalRecords={totalRecords}
          lazy
          first={(currentPage - 1) * rowsPerPage}
          onPage={(e) => setCurrentPage((e.page ?? 0) + 1)}
          selectionMode="multiple"
          selection={selectedRows}
          onSelectionChange={onRowSelectChange}
          dataKey="id"
          rowClassName={rowClassName}
          className="w-full"
          tableStyle={{ paddingInline: 10 }}
          showGridlines
        >
          <Column
            selectionMode="multiple"
            header={selectionHeaderTemplate}
            headerStyle={{ width: '3rem', textAlign: 'center' }}
          />
          <Column
            field="title"
            header="Title"
            className="text-center p-2 border-b border-gray-200"
            headerClassName="bg-gray-100 text-gray-700 font-semibold text-sm p-2"
            bodyStyle={{ textAlign: 'center' }}
          />
          <Column
            field="place_of_origin"
            header="Place of Origin"
            className="text-left p-2 border-b border-gray-200"
            headerClassName="bg-gray-100 text-gray-700 font-semibold text-sm p-2"
            bodyStyle={{ textAlign: 'center' }}
          />
          <Column
            field="artist_display"
            header="Artist Display"
            className="text-left p-2 border-b border-gray-200"
            headerClassName="bg-gray-100 text-gray-700 font-semibold text-sm p-2"
            bodyStyle={{ textAlign: 'center' }}
          />
          <Column
            field="inscriptions"
            header="Inscriptions"
            className="text-left p-2 border-b border-gray-200"
            headerClassName="bg-gray-100 text-gray-700 font-semibold text-sm p-2"
            bodyStyle={{ textAlign: 'center' }}
          />
          <Column
            field="date_start"
            header="Date Start"
            className="text-left p-2 border-b border-gray-200"
            headerClassName="bg-gray-100 text-gray-700 font-semibold text-sm p-2"
            bodyStyle={{ textAlign: 'center' }}
          />
          <Column
            field="date_end"
            header="Date End"
            className="text-left p-2 border-b border-gray-200"
            headerClassName="bg-gray-100 text-gray-700 font-semibold text-sm p-2"
            bodyStyle={{ textAlign: 'center' }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default DataTableComponent;