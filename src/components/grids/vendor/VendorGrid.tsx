import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import Vendor from "../../../domain/entities/Vendor"
import { getVendor, postVendor } from "../../../services/VendorService"
import { VendorDefaultColumnDefinition, VendorColumnDefinitions } from "./VendorColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { validateString, validateNumber } from "../../../domain/Validator"
import { Alert } from "@material-ui/lab"


const VendorGrid: React.FC = () => {
  let columnApi: ColumnApi

  interface NewVendorValid {
    name: boolean
  }

  const [vendor, setVendor] = useState<Vendor[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)
  const [isBusy, setIsBusy] = useState<boolean>(false)

  const [addNewVendorDialog, setAddNewVendorDialog] = useState<boolean>(false)
  const [newVendor, setNewVendor] = useState<Vendor>({
    id: undefined,
    name: ""
  })
  const [newVendorValid, setNewVendorValid] = useState<NewVendorValid>({
    name: false
  })
  const [showTextFieldError, setShowTextFieldError] = useState<boolean>(false)
  const [showSnackbarSuccess, setShowSnackbarSuccess] = useState<boolean>(false)

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

  const handleNewVendorSubmit = async () => {
    setIsBusy(true)
    postVendor(newVendor).then((result) => {
      if (result) {
        setIsBusy(false)
        setShowSnackbarSuccess(true)
        setVendor(
          [
            { ...newVendor, id: result },
            ...vendor
          ]
        )
        setShowTextFieldError(false)
        setNewVendor({
          id: undefined,
          name: "",
        })
        setAddNewVendorDialog(false)
      } else {
        setIsBusy(false)
        alert("FAILED")
      }
    })
  }

  const canSubmit = () => {
    return newVendorValid.name
  }

  return (
    <div>
      {
        isLoading &&
        <div
          style={{ textAlign: "center" }}
        >
          <CircularProgress />
        </div>
      }
      {
        !isLoading &&
        <div>
          <Dialog
            open={addNewVendorDialog}
            onClose={() => { setAddNewVendorDialog(false) }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add new vendor</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                label="Name"
                fullWidth
                onChange={(event) => {
                  var value = event.target.value
                  setNewVendor({ ...newVendor, name: value })
                  setNewVendorValid({ ...newVendorValid, name: validateString(value) })
                }}
                error={showTextFieldError && !newVendorValid.name}
              />
            </DialogContent>
            <DialogActions>
              {
                isBusy && <CircularProgress size={20} />
              }
              <Button
                onClick={() => {
                  if (canSubmit()) {
                    handleNewVendorSubmit()
                  } else {
                    setShowTextFieldError(true)
                  }
                }}
                color="primary"
                variant="contained"
                disabled={isBusy}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
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
              onClick={() => { setAddNewVendorDialog(true) }}
            >
              ADD NEW
            </Button>
          </div>
          <Snackbar
            open={showSnackbarSuccess}
            onClose={() => { setShowSnackbarSuccess(false) }}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => { setShowSnackbarSuccess(false) }}
              severity="success"
            >
              Success
            </Alert>
          </Snackbar>
        </div>
      }
    </div>
  )
}

export default VendorGrid