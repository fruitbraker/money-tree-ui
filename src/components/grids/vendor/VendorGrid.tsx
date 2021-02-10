import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import Vendor from "../../../domain/entities/Vendor"
import { getVendor } from "../../../services/VendorService"
import { VendorDefaultColumnDefinition, VendorColumnDefinitions } from "./VendorColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, CircularProgress } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';


const VendorGrid: React.FC = () => {
  let columnApi: ColumnApi

  const [vendor, setVendor] = useState<Vendor[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)

  useEffect(() => {
    getVendor()
      .then(vendors => {
        setVendor(vendors)
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
              columnDefs={VendorColumnDefinitions}
              defaultColDef={VendorDefaultColumnDefinition}
              onGridReady={onGridReady}
              rowData={vendor}
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

export default VendorGrid