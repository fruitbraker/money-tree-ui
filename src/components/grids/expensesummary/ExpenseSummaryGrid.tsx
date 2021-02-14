import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import { ExpenseSummary, Expense } from "../../../domain/entities/Expense"
import { getExpenseSummary, postExpense } from "../../../services/ExpenseSummaryService"
import { ExpenseSummaryDefaultColumnDefinition, ExpenseSummaryColumnDefinitions } from "./ExpenseSummaryColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import Vendor from "../../../domain/entities/Vendor"
import { getVendor } from "../../../services/VendorService"
import { Autocomplete } from "@material-ui/lab"
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
  const [newExpense, setNewExpense] = useState<Expense>({
    id: undefined,
    transactionDate: "",
    transactionAmount: 0.00,
    vendor: "",
    expenseCategory: "",
    notes: "",
    hide: false
  })
  const [newExpenseValid, setNewExpenseValid] = useState<NewExpenseValid>({
    transactionDate: false,
    transactionAmount: false,
    vendor: false,
    expenseCategory: false
  })

  useEffect(() => {
    loadExpenseSummary()
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
    postExpense(newExpense).then((result) => {
      if (result) {
        loadExpenseSummary()
        setAddNewExpenseSummaryDialog(false)
        setIsBusy(false)
        console.log("success")
      } else {
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
  
  const loadExpenseSummary = () => {
    getExpenseSummary()
      .then(expenseSummaries => {
        setExpenseSummary(expenseSummaries)
      })
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
                    required
                    placeholder="YYYY-MM-DD"
                    margin="dense"
                    label="Transaction Date"
                    onChange={(event) => {
                      var value = event.target.value
                      setNewExpense({ ...newExpense, transactionDate: value })
                      setNewExpenseValid({ ...newExpenseValid, transactionDate: validateDate(value) })
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    margin="dense"
                    label="Transaction Amount"
                    onChange={(event) => {
                      var value = event.target.value
                      setNewExpense({ ...newExpense, transactionAmount: Number(event.target.value) })
                      setNewExpenseValid({ ...newExpenseValid, transactionAmount: validateNumber(value) })
                    }}
                  />
                </Grid>
              </Grid>
              <Autocomplete
                id="addExpenseAutoCompleteVendor"
                options={vendor}
                getOptionLabel={(it) => it.name}
                renderInput={(params) => <TextField {...params} label="Vendor" margin="dense" />}
                clearOnEscape
                onChange={(event, value, reason) => {
                  var vendor = value as Vendor | null
                  if (vendor) {
                    setNewExpense({ ...newExpense, vendor: vendor.id })
                    setNewExpenseValid({ ...newExpenseValid, vendor: true })
                  } else {
                    setNewExpense({ ...newExpense, vendor: "" })
                    setNewExpenseValid({ ...newExpenseValid, vendor: false })
                  }
                }}
              />
              <Autocomplete
                id="addExpenseAutoCompleteExpenseCategory"
                options={expenseCategory}
                getOptionLabel={(it) => it.name}
                renderInput={(params) => <TextField {...params} label="Expense Category" margin="dense" />}
                clearOnEscape
                onChange={(event, value, reason) => {
                  var expenseCategory = value as ExpenseCategory | null
                  if (expenseCategory) {
                    setNewExpense({ ...newExpense, expenseCategory: expenseCategory.id })
                    setNewExpenseValid({ ...newExpenseValid, expenseCategory: true })
                  } else {
                    setNewExpense({ ...newExpense, expenseCategory: "" })
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
                    alert("check ur inputs")
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
        </div>
      }
    </div>
  )
}

export default ExpenseSummaryGrid
