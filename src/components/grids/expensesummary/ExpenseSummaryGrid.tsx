import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import ExpenseSummary from "../../../domain/entities/ExpenseSummary"
import { getExpenseSummary } from "../../../services/ExpenseSummaryService"
import { ExpenseSummaryDefaultColumnDefinition, ExpenseSummaryColumnDefinitions } from "./ExpenseSummaryColumnDefinitions"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, CircularProgress, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, TextField, Theme } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import Vendor from "../../../domain/entities/Vendor"
import { getVendor } from "../../../services/VendorService"
import { Autocomplete } from "@material-ui/lab"
import { ExpenseCategory } from "../../../domain/entities/Category"
import { getExpenseCategory } from "../../../services/CategoryService"

const ExpenseSummaryGrid: React.FC = () => {
  let columnApi: ColumnApi

  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary[]>([])
  const [vendor, setVendor] = useState<Vendor[]>([])
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)

  const [addNewExpenseSummaryDialog, setAddNewExpenseSummaryDialog] = useState<boolean>(false)

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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    margin="dense"
                    label="Transaction Amount"
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
                  console.log("value", value)
                }}
              />
              <Autocomplete
                id="addExpenseAutoCompleteExpenseCategory"
                options={expenseCategory}
                getOptionLabel={(it) => it.name}
                renderInput={(params) => <TextField {...params} label="Expense Category" margin="dense" />}
                clearOnEscape
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => { setAddNewExpenseSummaryDialog(false) }}
                color="primary"
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
              endIcon={<AddIcon />}
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
