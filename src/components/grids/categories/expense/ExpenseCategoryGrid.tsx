import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { getExpenseCategory, postExpenseCategory } from "../../../../services/CategoryService";
import { ExpenseCategoryColumnDefinitions, ExpenseCategoryDefaultColumnDefinitions } from "./ExpenseCategoryColumnDefinitions";
import { ExpenseCategory } from "../../../../domain/entities/Category";
import { validateNumber, validateString } from "../../../../domain/Validator";
import { TramRounded } from "@material-ui/icons";


const ExpenseCategoryGrid: React.FC = () => {
  let columnApi: ColumnApi

  interface NewExpenseCategoryValid {
    name: boolean,
    targetAmount: boolean
  }

  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)
  const [isBusy, setIsBusy] = useState<boolean>(false)

  const [addNewExpenseCategoryDialog, setAddNewExpenseCategoryDialog] = useState<boolean>(false)
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseCategory>({
    id: undefined,
    name: "",
    targetAmount: NaN
  })
  const [newExpenseCategoryValid, setNewExpenseCategoryValid] = useState<NewExpenseCategoryValid>({
    name: false,
    targetAmount: false
  })
  const [showTextFieldError, setShowTextFieldError] = useState<boolean>(false)

  useEffect(() => {
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

  const handleNewExpenseCategorySubmit = async () => {
    setIsBusy(true)
    postExpenseCategory(newExpenseCategory).then((result) => {
      if (result) {
        setIsBusy(false)
        setExpenseCategory(
          [
            { ...newExpenseCategory, id: result },
            ...expenseCategory
          ]
        )
        setShowTextFieldError(false)
        setNewExpenseCategory({
          id: undefined,
          name: "",
          targetAmount: NaN
        })
        setAddNewExpenseCategoryDialog(false)
      } else {
        setIsBusy(false)
        alert("FAILED")
      }
    })
  }

  const canSubmit = () => {
    return (newExpenseCategoryValid.name && newExpenseCategoryValid.targetAmount)
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
          <Dialog
            open={addNewExpenseCategoryDialog}
            onClose={() => { setAddNewExpenseCategoryDialog(false) }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add new expense category</DialogTitle>
            <DialogContent>
              <TextField
                required
                margin="dense"
                label="Name"
                fullWidth
                onChange={(event) => {
                  var value = event.target.value
                  setNewExpenseCategory({ ...newExpenseCategory, name: value })
                  setNewExpenseCategoryValid({ ...newExpenseCategoryValid, name: validateString(value) })
                }}
                error={showTextFieldError && !newExpenseCategoryValid.name}
              />
              <br />
              <TextField
                required
                margin="dense"
                label="Target Amount"
                fullWidth
                onChange={(event) => {
                  var value = event.target.value
                  setNewExpenseCategory({ ...newExpenseCategory, targetAmount: Number(value) })
                  setNewExpenseCategoryValid({ ...newExpenseCategoryValid, targetAmount: validateNumber(value) })
                }}
                error={showTextFieldError && !newExpenseCategoryValid.targetAmount}
              />
            </DialogContent>
            <DialogActions>
              {
                isBusy && <CircularProgress size={20} />
              }
              <Button
                onClick={() => {
                  if (canSubmit()) {
                    handleNewExpenseCategorySubmit()
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
              columnDefs={ExpenseCategoryColumnDefinitions}
              defaultColDef={ExpenseCategoryDefaultColumnDefinitions}
              onGridReady={onGridReady}
              rowData={expenseCategory}
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
              onClick={() => { setAddNewExpenseCategoryDialog(true) }}
            >
              ADD NEW
            </Button>
          </div>
        </div>
      }
    </div>
  )
}

export default ExpenseCategoryGrid