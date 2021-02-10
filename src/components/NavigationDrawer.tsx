import { AppBar, Container, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';
import PeopleIcon from '@material-ui/icons/People';
import clsx from "clsx";
import React, { useState } from "react";
import ExpenseSummaryGrid from "./grids/expensesummary/ExpenseSummaryGrid";
import { AccountBalance, CreditCard } from "@material-ui/icons";
import IncomeSummaryGrid from "./grids/incomesummary/IncomeSummaryGrid";
import VendorGrid from "./grids/vendor/VendorGrid";
import Dashboard from "./grids/dashboard/Dashboard";
import ExpenseCategoryGrid from "./grids/categories/expense/ExpenseCategoryGrid";
import IncomeCategoryGrid from "./grids/categories/income/IncomeCategoryGrid";

const NavigationDrawer: React.FC = () => {

  enum DrawerTabs {
    dashboard = "Dashboard",
    expenseSummary = "Expense Summary",
    incomeSummary = "Income Summary",
    vendors = "Vendors",
    categories = "Expense/Income Categories"
  }

  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSelectedName, setDrawerSelectedName] = useState<DrawerTabs>(DrawerTabs.expenseSummary)
  const [drawerSelectedTab, setDrawerSelectedTab] = useState({
    dashboard: false,
    expenseSummary: true,
    incomeSummary: false,
    vendor: false,
    categories: false
  })

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {drawerSelectedName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem 
            button
            onClick={() => {
              setDrawerSelectedTab({
                dashboard: true,
                expenseSummary: false,
                incomeSummary: false,
                vendor: false,
                categories: false
              })
              setDrawerSelectedName(DrawerTabs.dashboard)
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={DrawerTabs.dashboard} />
          </ListItem>
          <ListItem 
            button
            onClick={() => {
              setDrawerSelectedTab({
                dashboard: false,
                expenseSummary: true,
                incomeSummary: false,
                vendor: false,
                categories: false
              })
              setDrawerSelectedName(DrawerTabs.expenseSummary)
            }}
          >
            <ListItemIcon>
              <CreditCard />
            </ListItemIcon>
            <ListItemText primary={DrawerTabs.expenseSummary} />
          </ListItem>
          <ListItem 
            button
            onClick={() => {
              setDrawerSelectedTab({
                dashboard: false,
                expenseSummary: false,
                incomeSummary: true,
                vendor: false,
                categories: false
              })
              setDrawerSelectedName(DrawerTabs.incomeSummary)
            }}
          >
            <ListItemIcon>
              <AccountBalance />
            </ListItemIcon>
            <ListItemText primary={DrawerTabs.incomeSummary} />
          </ListItem>
          <ListItem 
            button
            onClick={() => {
              setDrawerSelectedTab({
                dashboard: false,
                expenseSummary: false,
                incomeSummary: false,
                vendor: true,
                categories: false
              })
              setDrawerSelectedName(DrawerTabs.vendors)
            }}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={DrawerTabs.vendors} />
          </ListItem>
        </List>
        <Divider />
        <List>
        <ListItem 
            button
            onClick={() => {
              setDrawerSelectedTab({
                dashboard: false,
                expenseSummary: false,
                incomeSummary: false,
                vendor: false,
                categories: true
              })
              setDrawerSelectedName(DrawerTabs.categories)
            }}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary={DrawerTabs.categories} />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth={false} className={classes.container}>
          {
            drawerSelectedTab.dashboard && <Dashboard />
          }
          {
            drawerSelectedTab.expenseSummary && <ExpenseSummaryGrid />
          }
          {
            drawerSelectedTab.incomeSummary && <IncomeSummaryGrid />
          }
          {
            drawerSelectedTab.vendor && <VendorGrid />
          }
          {
            drawerSelectedTab.categories && 
            <div>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <ExpenseCategoryGrid />
                </Grid>
                <Grid item xs={6}>
                  <IncomeCategoryGrid />
                </Grid>
              </Grid>
            </div>
          }
        </Container>
      </main>
    </div>
  )
}

export default NavigationDrawer

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));
