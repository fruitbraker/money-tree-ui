import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import ExpenseSummary from "../../../domain/entities/ExpenseSummary"
import { getExpenseSummary } from "../../../services/ExpenseSummaryService"
import { ExpenseSummaryDefaultColumnDefinition, ExpenseSummaryColumnDefinitions } from "./ExpenseSummaryColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, CircularProgress } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';

const ExpenseSummaryGrid: React.FC = () => {
  let columnApi: ColumnApi

  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)

  useEffect(() => {
    getExpenseSummary()
      .then(expenseSummaries => {
        setExpenseSummary(expenseSummaries)
        setIsloading(false)
      })
  }, [])

  const onGridReady = (e: GridReadyEvent) => {
    columnApi = e.columnApi
    columnApi.autoSizeAllColumns()
    e.api.sizeColumnsToFit()
  }

  return (
    <div>
      {
        isLoading && 
        <div
          style={{textAlign: "center"}}
        >
          <CircularProgress />
        </div>
      }
      {
        !isLoading &&
        <div>
          <div className="ag-theme-alpine grid" >
            <AgGridReact
              columnDefs={ExpenseSummaryColumnDefinitions}
              defaultColDef={ExpenseSummaryDefaultColumnDefinition}
              onGridReady={onGridReady}
              rowData={expenseSummary}
              rowHeight={50}
              pagination={true}
              paginationAutoPageSize={true}
            />
          </div>
          <div style={{
            paddingTop: 10,
            textAlign: "right"
          }}>  
            <Button
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
            >
              ADD NEW
            </Button>
          </div>
        </div>
      }
    </div>
  )
}

export default ExpenseSummaryGrid