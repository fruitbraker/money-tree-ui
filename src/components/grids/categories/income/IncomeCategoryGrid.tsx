import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { getIncomeCategory, postIncomeCategory } from "../../../../services/CategoryService";
import { IncomeCategoryColumnDefinitions, IncomeCategoryDefaultColumnDefinition } from "./IncomeCategoryColumnDefinitions";
import { IncomeCategory } from "../../../../domain/entities/Category";
import { validateString } from "../../../../domain/Validator";


const IncomeCategoryGrid: React.FC = () => {
  let columnApi: ColumnApi

  interface NewIncomeCategoryValid {
    name: boolean
  }

  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)
  const [isBusy, setIsBusy] = useState<boolean>(false)

  const [addNewIncomeCategoryDialog, setAddNewIncomeCategoryDialog] = useState<boolean>(false)
  const [newIncomeCategory, setNewIncomeCategory] = useState<IncomeCategory>({
    id: undefined,
    name: ""
  })
  const [newIncomeCategoryValid, setNewIncomeDategoryValid] = useState<NewIncomeCategoryValid>({
    name: false
  })
  const [showTextFieldError, setShowTextFieldError] = useState<boolean>(false)

  useEffect(() => {
    getIncomeCategory()
      .then(incomeCategories => {
        setIncomeCategory(incomeCategories)
        setIsloading(false)
      })
  }, [])

  const onGridReady = (e: GridReadyEvent) => {
    columnApi = e.columnApi
    columnApi.autoSizeAllColumns()
    e.api.sizeColumnsToFit()
  }

  const handleNewIncomeCategorySubmit = async () => {
    setIsBusy(true)
    postIncomeCategory(newIncomeCategory).then((result) => {
      if (result) {
        setIsBusy(false)
        setIncomeCategory(
          [
            { ...newIncomeCategory, id: result },
            ...incomeCategory
          ]
        )
        setShowTextFieldError(false)
        setNewIncomeCategory({
          id: undefined,
          name: "",
        })
        setAddNewIncomeCategoryDialog(false)
      } else {
        setIsBusy(false)
        alert("FAILED")
      }
    })
  }

  const canSubmit = () => {
    return newIncomeCategoryValid.name
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
            open={addNewIncomeCategoryDialog}
            onClose={() => { setAddNewIncomeCategoryDialog(false) }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add new income category</DialogTitle>
            <DialogContent>
              <TextField
                required
                margin="dense"
                label="Name"
                fullWidth
                onChange={(event) => {
                  var value = event.target.value
                  setNewIncomeCategory({ ...newIncomeCategory, name: value })
                  setNewIncomeDategoryValid({ ...newIncomeCategoryValid, name: validateString(value) })
                }}
                error={showTextFieldError && !newIncomeCategoryValid.name}
              />
            </DialogContent>
            <DialogActions>
              {
                isBusy && <CircularProgress size={20} />
              }
              <Button
                onClick={() => {
                  if (canSubmit()) {
                    handleNewIncomeCategorySubmit()
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
              columnDefs={IncomeCategoryColumnDefinitions}
              defaultColDef={IncomeCategoryDefaultColumnDefinition}
              onGridReady={onGridReady}
              rowData={incomeCategory}
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
              onClick={() => { setAddNewIncomeCategoryDialog(true) }}
            >
              ADD NEW
            </Button>
          </div>
        </div>
      }
    </div>
  )
}

export default IncomeCategoryGrid