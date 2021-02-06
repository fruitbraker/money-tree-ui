import { ColumnApi, GridReadyEvent, SelectionChangedEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import ExpenseSummary from "../../domain/entities/ExpenseSummary"
import { getExpenseSummary } from "../../services/ExpenseSummaryService"
import { DefaultColumnDefinition, ExpenseCategoryColumnDefinitions } from "./ExpenseSummaryColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const ExpenseSummaryGrid: React.FC = () => {
  let columnApi: ColumnApi

  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary[]>([])
  const [selectedExpenseSummary, setSelectedExpenseSummary] = useState<ExpenseSummary[]>([])

  useEffect(() => {
    getExpenseSummary()
    .then(expenseSummaries => {
      setExpenseSummary(expenseSummaries)
    })
  }, [])

  const onGridReady = (e: GridReadyEvent) => {
    columnApi = e.columnApi
    columnApi.autoSizeAllColumns()
    e.api.sizeColumnsToFit()
  }

  return (
    <div>
      <div className="ag-theme-alpine grid" >
        <AgGridReact
          columnDefs={ExpenseCategoryColumnDefinitions}
          defaultColDef={DefaultColumnDefinition}
          onGridReady={onGridReady}
          onSelectionChanged={(event: SelectionChangedEvent) => {
            setSelectedExpenseSummary(event.api.getSelectedRows())
          }}
          rowData={expenseSummary}
          rowHeight={50}
          rowSelection={"multiple"}
          rowMultiSelectWithClick={true}
          pagination={true}
          paginationAutoPageSize={true}
        />
      </div>
    </div>
  )
}

export default ExpenseSummaryGrid