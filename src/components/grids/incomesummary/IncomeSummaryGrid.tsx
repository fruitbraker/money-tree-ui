import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useState, useEffect } from "react"
import { Income, IncomeSummary } from "../../../domain/entities/Income"
import { getIncomeSummary, postIncome } from "../../../services/IncomeSummaryService"
import { IncomeSummaryColumnDefinitions, IncomeSummaryDefaultColumnDefinition } from "./IncomeSummaryColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Snackbar, TextField } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { IncomeCategory } from "../../../domain/entities/Category"
import { getIncomeCategory } from "../../../services/CategoryService"
import { Alert, Autocomplete } from "@material-ui/lab"
import Vendor from "../../../domain/entities/Vendor"
import { validateDate, validateNumber, validateString } from "../../../domain/Validator"

const IncomeSummaryGrid: React.FC = () => {
  let columnApi: ColumnApi

  interface NewIncomeValid {
    source: boolean,
    incomeCategory: boolean,
    transactionDate: boolean,
    transactionAmount: boolean
  }

  const [incomeSummary, setIncomeSummary] = useState<IncomeSummary[]>([])
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)
  const [isBusy, setIsBusy] = useState<boolean>(false)

  const [addNewIncomeSummaryDialog, setAddNewIncomeSummaryDialog] = useState<boolean>(false)
  const [newIncome, setNewIncome] = useState<IncomeSummary>({
    id: undefined,
    source: "",
    incomeCategoryId: "",
    incomeCategoryName: "",
    transactionDate: "",
    transactionAmount: NaN,
    notes: "",
    hide: false
  })
  const [newIncomeValid, setNewIncomeValid] = useState<NewIncomeValid>({
    source: false,
    incomeCategory: false,
    transactionDate: false,
    transactionAmount: false
  })
  const [showTextFieldError, setShowTextFieldError] = useState<boolean>(false)
  const [showSnackbarSuccess, setShowSnackbarSuccess] = useState<boolean>(false)

  useEffect(() => {
    getIncomeSummary()
      .then(incomeSummaries => {
        setIncomeSummary(incomeSummaries)
      })
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

  const handleNewIncomeSubmit = async () => {
    setIsBusy(true)
    postIncome({
      source: newIncome.source,
      incomeCategory: newIncome.incomeCategoryId,
      transactionDate: newIncome.transactionDate,
      transactionAmount: newIncome.transactionAmount,
      notes: newIncome.notes,
      hide: newIncome.hide
    } as Income).then((result) => {
      if (result) {
        setIsBusy(false)
        setShowSnackbarSuccess(true)
        setIncomeSummary(
          [
            { ...newIncome, id: result },
            ...incomeSummary
          ]
        )
        setShowTextFieldError(false)
        setNewIncome({
          id: undefined,
          source: "",
          incomeCategoryId: "",
          incomeCategoryName: "",
          transactionDate: "",
          transactionAmount: NaN,
          notes: "",
          hide: false
        })
        setAddNewIncomeSummaryDialog(false)
      } else {
        setIsBusy(false)
        alert("failed")
      }
    })
  }

  const canSubmit = () => {
    return (newIncomeValid.source &&
      newIncomeValid.incomeCategory &&
      newIncomeValid.transactionAmount &&
      newIncomeValid.transactionDate)
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
            open={addNewIncomeSummaryDialog}
            onClose={() => { setAddNewIncomeSummaryDialog(false) }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add new income</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoFocus
                    required
                    placeholder="YYYY-MM-DD"
                    margin="dense"
                    label="Transaction Date"
                    onChange={(event) => {
                      var value = event.target.value
                      setNewIncome({ ...newIncome, transactionDate: value })
                      setNewIncomeValid({ ...newIncomeValid, transactionDate: validateDate(value) })
                    }}
                    error={showTextFieldError && !newIncomeValid.transactionDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    margin="dense"
                    label="Transaction Amount"
                    onChange={(event) => {
                      var value = event.target.value
                      setNewIncome({ ...newIncome, transactionAmount: Number(value) })
                      setNewIncomeValid({ ...newIncomeValid, transactionAmount: validateNumber(value) })
                    }}
                    error={showTextFieldError && !newIncomeValid.transactionAmount}
                  />
                </Grid>
              </Grid>
              <TextField
                margin="dense"
                label="Source"
                fullWidth
                multiline
                onChange={(event) => {
                  var value = event.target.value
                  setNewIncome({ ...newIncome, source: value })
                  setNewIncomeValid({ ...newIncomeValid, source: validateString(value) })
                }}
                error={showTextFieldError && !newIncomeValid.source}
              />
              <Autocomplete
                id="addIncomeAutoCompleteIncomeCategoryr"
                options={incomeCategory}
                getOptionLabel={(it) => it.name}
                renderInput={(params) =>
                  <TextField {...params}
                    label="Income Category"
                    margin="dense"
                    error={showTextFieldError && !newIncomeValid.incomeCategory}
                  />
                }
                autoSelect
                onChange={(event, value, reason) => {
                  var incomeCategory = value as IncomeCategory | null
                  if (incomeCategory && incomeCategory.id) {
                    setNewIncome({ ...newIncome, incomeCategoryId: incomeCategory.id, incomeCategoryName: incomeCategory.name })
                    setNewIncomeValid({ ...newIncomeValid, incomeCategory: true })
                  } else {
                    setNewIncome({ ...newIncome, incomeCategoryId: "", incomeCategoryName: "" })
                    setNewIncomeValid({ ...newIncomeValid, incomeCategory: false })
                  }
                }}
              />
              <TextField
                margin="dense"
                label="Notes"
                fullWidth
                multiline
                onChange={(event) => {
                  setNewIncome({ ...newIncome, notes: event.target.value })
                }}
              />
              <FormControlLabel
                value="Hide"
                control={<Checkbox color="primary" />}
                label="Hide"
                labelPlacement="end"
                onChange={(event: any) => {
                  setNewIncome({ ...newIncome, hide: event.target.checked })
                }}
              />
            </DialogContent>
            <DialogActions>
              {
                isBusy && <CircularProgress size={20} />
              }
              <Button
                onClick={() => {
                  if (canSubmit()) {
                    handleNewIncomeSubmit()
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
              onClick={() => { setAddNewIncomeSummaryDialog(true) }}
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

export default IncomeSummaryGrid