import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { fetchData } from '../services/api';
import { RowData } from '../types/RowData';
import SelectionHeaderTemplate from './selectionHeaderTemplate';

const DataTableComponent: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [numRowsToSelect, setNumRowsToSelect] = useState(0);
  const rowsPerPage = 12;
  const overlayPanelRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, setData, setTotalRecords);
  }, [currentPage]);

  const onRowSelectChange = (e: DataTableSelectionMultipleChangeEvent<RowData[]>) => {
    setSelectedRows(e.value);
  };

  const rowClassName = (row: RowData) => {
    return selectedRows.some(selectedRow => selectedRow.id === row.id) ? 'selected-row' : '';
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
            header={<SelectionHeaderTemplate 
                      overlayPanelRef={overlayPanelRef} 
                      numRowsToSelect={numRowsToSelect} 
                      setNumRowsToSelect={setNumRowsToSelect} 
                      selectedRows={selectedRows} 
                      setSelectedRows={setSelectedRows} 
                      currentPage={currentPage} 
                      rowsPerPage={rowsPerPage} 
                    />}
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