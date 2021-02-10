import { ColumnApi, GridReadyEvent } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import React, { useEffect, useState } from "react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Button, CircularProgress } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { getExpenseCategory } from "../../../../services/CategoryService";
import { ExpenseCategoryColumnDefinitions, ExpenseCategoryDefaultColumnDefinitions } from "./ExpenseCategoryColumnDefinitions";
import { ExpenseCategory } from "../../../../domain/entities/Category";


const ExpenseCategoryGrid: React.FC = () => {
  let columnApi: ColumnApi

  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory[]>([])
  const [isLoading, setIsloading] = useState<boolean>(true)

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