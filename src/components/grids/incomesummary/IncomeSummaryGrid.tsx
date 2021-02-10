import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useState, useEffect } from "react"
import IncomeSummary from "../../../domain/entities/IncomeSummary"
import { getIncomeSummary } from "../../../services/IncomeSummaryService"
import { IncomeSummaryColumnDefinitions, IncomeSummaryDefaultColumnDefinition } from "./IncomeSummaryColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, CircularProgress } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';

const IncomeSummaryGrid: React.FC = () => {
  let columnApi: ColumnApi

  const [incomeSummary, setIncomeSummary] = useState<IncomeSummary[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)

  useEffect(() => {
    getIncomeSummary()
      .then(incomeSummaries => {
        setIncomeSummary(incomeSummaries)
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
              columnDefs={IncomeSummaryColumnDefinitions}
              defaultColDef={IncomeSummaryDefaultColumnDefinition}
              onGridReady={onGridReady}
              rowData={incomeSummary}
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

export default IncomeSummaryGrid