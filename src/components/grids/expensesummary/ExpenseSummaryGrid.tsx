import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import { ExpenseSummary, Expense } from "../../../domain/entities/Expense"
import { getExpenseSummary, postExpense } from "../../../services/ExpenseSummaryService"
import { ExpenseSummaryDefaultColumnDefinition, ExpenseSummaryColumnDefinitions } from "./ExpenseSummaryColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Snackbar, TextField } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import Vendor from "../../../domain/entities/Vendor"
import { getVendor } from "../../../services/VendorService"
import { Alert, Autocomplete } from "@material-ui/lab"
import { ExpenseCategory } from "../../../domain/entities/Category"
import { getExpenseCategory } from "../../../services/CategoryService"
import { validateDate, validateNumber } from "../../../domain/Validator"

const ExpenseSummaryGrid: React.FC = () => {
  let columnApi: ColumnApi

  interface NewExpenseValid {
    transactionDate: boolean,
    transactionAmount: boolean,
    vendor: boolean,
    expenseCategory: boolean
  }

  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary[]>([])
  const [vendor, setVendor] = useState<Vendor[]>([])
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)
  const [isBusy, setIsBusy] = useState<boolean>(false)

  const [addNewExpenseSummaryDialog, setAddNewExpenseSummaryDialog] = useState<boolean>(false)
  const [newExpense, setNewExpense] = useState<ExpenseSummary>({
    id: undefined,
    transactionDate: "",
    transactionAmount: NaN,
    vendorId: "",
    vendorName: "",
    expenseCategoryId: "",
    expenseCategoryName: "",
    notes: "",
    hide: false
  })
  const [newExpenseValid, setNewExpenseValid] = useState<NewExpenseValid>({
    transactionDate: false,
    transactionAmount: false,
    vendor: false,
    expenseCategory: false
  })
  const [showTextFieldError, setShowTextFieldError] = useState<boolean>(false)
  const [showSnackbarSuccess, setShowSnackbarSuccess] = useState<boolean>(false)

  useEffect(() => {
    getExpenseSummary()
      .then(expenseSummaries => {
        setExpenseSummary(expenseSummaries)
      })
    getVendor()
      .then(vendors => {
        setVendor(vendors)
      })
    getExpenseCategory()
      .then(expenseCategories => {
        setExpenseCategory(expenseCategories)
        setIsloading(false)
      })
  }, [])

  const onGridReady = (e: GridReadyEvent) => {
    columnApi = e.columnApi
    columnApi.autoSizeAllColumns()
    e.api.sizeColumnsToFit()
  }

  const handleNewExpenseSubmit = async () => {
    setIsBusy(true)
    postExpense({
      transactionDate: newExpense.transactionDate,
      transactionAmount: newExpense.transactionAmount,
      vendor: newExpense.vendorId,
      expenseCategory: newExpense.expenseCategoryId,
      notes: newExpense.notes,
      hide: newExpense.hide
    } as Expense).then((result) => {
      if (result) {
        setIsBusy(false)
        setShowSnackbarSuccess(true)
        setExpenseSummary(
          [
            { ...newExpense, id: result },
            ...expenseSummary
          ]
        )
        setShowTextFieldError(false)
        setNewExpense({
          id: undefined,
          transactionDate: "",
          transactionAmount: NaN,
          vendorId: "",
          vendorName: "",
          expenseCategoryId: "",
          expenseCategoryName: "",
          notes: "",
          hide: false
        })
        setAddNewExpenseSummaryDialog(false)
      } else {
        setIsBusy(false)
        alert("FAILED")
      }
    })
  }

  const canSubmit = () => {
    return (newExpenseValid.transactionDate &&
      newExpenseValid.transactionAmount &&
      newExpenseValid.vendor &&
      newExpenseValid.expenseCategory)
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
            open={addNewExpenseSummaryDialog}
            onClose={() => { setAddNewExpenseSummaryDialog(false) }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add new expense</DialogTitle>
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
                      setNewExpense({ ...newExpense, transactionDate: value })
                      setNewExpenseValid({ ...newExpenseValid, transactionDate: validateDate(value) })
                    }}
                    error={showTextFieldError && !newExpenseValid.transactionDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    margin="dense"
                    label="Transaction Amount"
                    onChange={(event) => {
                      var value = event.target.value
                      setNewExpense({ ...newExpense, transactionAmount: Number(value) })
                      setNewExpenseValid({ ...newExpenseValid, transactionAmount: validateNumber(value) })
                    }}
                    error={showTextFieldError && !newExpenseValid.transactionAmount}
                  />
                </Grid>
              </Grid>
              <Autocomplete
                id="addExpenseAutoCompleteVendor"
                options={vendor}
                getOptionLabel={(it) => it.name}
                renderInput={(params) =>
                  <TextField {...params}
                    label="Vendor"
                    margin="dense"
                    error={showTextFieldError && !newExpenseValid.vendor}
                  />
                }
                autoSelect
                onChange={(event, value, reason) => {
                  var vendor = value as Vendor | null
                  if (vendor && vendor.id) {
                    setNewExpense({ ...newExpense, vendorId: vendor.id, vendorName: vendor.name })
                    setNewExpenseValid({ ...newExpenseValid, vendor: true })
                  } else {
                    setNewExpense({ ...newExpense, vendorId: "", vendorName: "" })
                    setNewExpenseValid({ ...newExpenseValid, vendor: false })
                  }
                }}
              />
              <Autocomplete
                id="addExpenseAutoCompleteExpenseCategory"
                options={expenseCategory}
                getOptionLabel={(it) => it.name}
                renderInput={(params) =>
                  <TextField {...params}
                    label="Expense Category"
                    margin="dense"
                    error={showTextFieldError && !newExpenseValid.expenseCategory}
                  />
                }
                autoSelect
                onChange={(event, value, reason) => {
                  var expenseCategory = value as ExpenseCategory | null
                  if (expenseCategory && expenseCategory.id) {
                    setNewExpense({ ...newExpense, expenseCategoryId: expenseCategory.id, expenseCategoryName: expenseCategory.name })
                    setNewExpenseValid({ ...newExpenseValid, expenseCategory: true })
                  } else {
                    setNewExpense({ ...newExpense, expenseCategoryId: "", expenseCategoryName: "" })
                    setNewExpenseValid({ ...newExpenseValid, expenseCategory: false })
                  }
                }}
              />
              <TextField
                margin="dense"
                label="Notes"
                fullWidth
                multiline
                onChange={(event) => {
                  setNewExpense({ ...newExpense, notes: event.target.value })
                }}
              />
              <FormControlLabel
                value="Hide"
                control={<Checkbox color="primary" />}
                label="Hide"
                labelPlacement="end"
                onChange={(event: any) => {
                  setNewExpense({ ...newExpense, hide: event.target.checked })
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
                    handleNewExpenseSubmit()
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
              startIcon={<AddIcon />}
              onClick={() => { setAddNewExpenseSummaryDialog(true) }}
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

export default ExpenseSummaryGrid
