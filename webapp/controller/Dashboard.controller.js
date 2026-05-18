sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"procurement/dashboard/model/formatter",
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/library"
], function (Controller, JSONModel, Filter, FilterOperator, Sorter, MessageToast, MessageBox, formatter, Spreadsheet, exportLibrary) {
	"use strict";

	var EdmType = exportLibrary.EdmType;

	return Controller.extend("procurement.dashboard.controller.Dashboard", {

		formatter: formatter,

		onInit: function () {
			this.getView().setModel(this.getOwnerComponent().getModel("view"), "view");
			this._oRouter = this.getOwnerComponent().getRouter();
			
			// Load initial data
			this._loadData();
		},

		/**
		 * Load data from OData service and calculate KPIs
		 * @private
		 */
		_loadData: function () {
			var oViewModel = this.getView().getModel("view");
			oViewModel.setProperty("/busy", true);

			var oModel = this.getOwnerComponent().getModel();
			
			if (!oModel) {
				oViewModel.setProperty("/busy", false);
				MessageBox.error("Unable to load data. The OData service might be unreachable or require authentication.");
				return;
			}

			// Read purchase orders
			oModel.read("/PurchaseOrders", {
				success: function (oData) {
					this._calculateKPIs(oData.results);
					this._prepareChartData(oData.results);
					oViewModel.setProperty("/purchaseOrders", oData.results);
					oViewModel.setProperty("/busy", false);
				}.bind(this),
				error: function (oError) {
					oViewModel.setProperty("/busy", false);
					MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("errorText"));
				}.bind(this)
			});
		},

		/**
		 * Calculate KPI values from purchase orders data
		 * @param {Array} aData - Purchase orders data
		 * @private
		 */
		_calculateKPIs: function (aData) {
			var oViewModel = this.getView().getModel("view");
			var oKPIData = {
				totalPOs: aData.length,
				openPOs: 0,
				releasedPOs: 0,
				delayedDeliveries: 0,
				totalAmount: 0,
				currency: "USD"
			};

			var today = new Date();
			today.setHours(0, 0, 0, 0);

			aData.forEach(function (oItem) {
				// Count by status
				if (oItem.Status === "OPEN") {
					oKPIData.openPOs++;
				} else if (oItem.Status === "RELEASED") {
					oKPIData.releasedPOs++;
				}

				// Count delayed deliveries
				if (oItem.DeliveryDate) {
					var deliveryDate = new Date(oItem.DeliveryDate);
					deliveryDate.setHours(0, 0, 0, 0);
					if (deliveryDate < today) {
						oKPIData.delayedDeliveries++;
					}
				}

				// Sum total amount
				if (oItem.NetAmount) {
					oKPIData.totalAmount += parseFloat(oItem.NetAmount);
				}

				// Get currency from first item
				if (oItem.Currency && !oKPIData.currency) {
					oKPIData.currency = oItem.Currency;
				}
			});

			oViewModel.setProperty("/kpiData", oKPIData);
		},

		/**
		 * Prepare chart data from purchase orders
		 * @param {Array} aData - Purchase orders data
		 * @private
		 */
		_prepareChartData: function (aData) {
			var oViewModel = this.getView().getModel("view");
			
			// Status Distribution
			var oStatusCount = {};
			aData.forEach(function (oItem) {
				var status = oItem.Status || "Unknown";
				oStatusCount[status] = (oStatusCount[status] || 0) + 1;
			});
			
			var aStatusData = Object.keys(oStatusCount).map(function (sKey) {
				return {
					status: sKey,
					count: oStatusCount[sKey]
				};
			});
			
			// Monthly Procurement (last 6 months)
			var oMonthlyData = {};
			aData.forEach(function (oItem) {
				if (oItem.CreatedOn) {
					var date = new Date(oItem.CreatedOn);
					var monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
					if (!oMonthlyData[monthKey]) {
						oMonthlyData[monthKey] = 0;
					}
					oMonthlyData[monthKey] += parseFloat(oItem.NetAmount || 0);
				}
			});
			
			var aMonthlyData = Object.keys(oMonthlyData).map(function (sKey) {
				return {
					month: sKey,
					amount: oMonthlyData[sKey]
				};
			}).slice(-6); // Last 6 months
			
			// Vendor Analysis (top 10)
			var oVendorCount = {};
			aData.forEach(function (oItem) {
				var vendor = oItem.VendorName || "Unknown";
				oVendorCount[vendor] = (oVendorCount[vendor] || 0) + 1;
			});
			
			var aVendorData = Object.keys(oVendorCount).map(function (sKey) {
				return {
					vendor: sKey,
					count: oVendorCount[sKey]
				};
			}).sort(function (a, b) {
				return b.count - a.count;
			}).slice(0, 10); // Top 10 vendors
			
			// Company Code Distribution
			var oCompanyCodeCount = {};
			aData.forEach(function (oItem) {
				var companyCode = oItem.CompanyCode || "Unknown";
				oCompanyCodeCount[companyCode] = (oCompanyCodeCount[companyCode] || 0) + 1;
			});
			
			var aCompanyCodeData = Object.keys(oCompanyCodeCount).map(function (sKey) {
				return {
					companyCode: sKey,
					count: oCompanyCodeCount[sKey]
				};
			});
			
			oViewModel.setProperty("/chartData", {
				statusDistribution: aStatusData,
				monthlyProcurement: aMonthlyData,
				vendorAnalysis: aVendorData,
				companyCodeDistribution: aCompanyCodeData
			});
		},

		/**
		 * Handle KPI card press to filter table
		 * @param {sap.ui.base.Event} oEvent - Press event
		 */
		onKPICardPress: function (oEvent) {
			var sFilter = "All";
			if (oEvent && oEvent.getSource()) {
				var oCustomData = oEvent.getSource().data("filter");
				if (oCustomData) {
					sFilter = oCustomData;
				}
			}
			
			var oViewModel = this.getView().getModel("view");
			var oTable = this.byId("poTable");
			var oBinding = oTable.getBinding("rows");
			var aFilters = [];

			if (sFilter !== "All") {
				if (sFilter === "Overdue") {
					// Filter for overdue deliveries
					var today = new Date();
					today.setHours(0, 0, 0, 0);
					aFilters.push(new Filter("DeliveryDate", FilterOperator.LT, today));
				} else {
					// Filter by status
					aFilters.push(new Filter("Status", FilterOperator.EQ, sFilter.toUpperCase()));
				}
			}

			oBinding.filter(aFilters);
			
			// Store selected filter in view model
			oViewModel.setProperty("/selectedFilter", sFilter);
			
			// Scroll to table
			var oPage = this.byId("dashboardPage");
			oPage.scrollToElement(this.byId("poTable"));
			
			MessageToast.show("Filtered by: " + sFilter);
		},

		/**
		 * Handle search in table
		 * @param {sap.ui.base.Event} oEvent - Search event
		 */
		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
			var oTable = this.byId("poTable");
			var oBinding = oTable.getBinding("rows");
			var aFilters = [];

			if (sQuery && sQuery.length > 0) {
				aFilters.push(new Filter({
					filters: [
						new Filter("PONumber", FilterOperator.Contains, sQuery),
						new Filter("VendorName", FilterOperator.Contains, sQuery),
						new Filter("CompanyCode", FilterOperator.Contains, sQuery),
						new Filter("Status", FilterOperator.Contains, sQuery)
					],
					and: false
				}));
			}

			oBinding.filter(aFilters);
		},

		/**
		 * Clear all filters from the table
		 */
		onClearFilter: function () {
			var oViewModel = this.getView().getModel("view");
			var oTable = this.byId("poTable");
			var oBinding = oTable.getBinding("rows");
			
			// Clear filters
			oBinding.filter([]);
			
			// Reset selected filter
			oViewModel.setProperty("/selectedFilter", "All");
			
			// Clear search field
			var oSearchField = this.byId("searchField");
			if (oSearchField) {
				oSearchField.setValue("");
			}
			
			MessageToast.show("Filters cleared");
		},

		/**
		 * Open filter dialog
		 */
		onOpenFilterDialog: function () {
			MessageToast.show("Filter dialog - To be implemented with specific filter criteria");
			// TODO: Implement filter dialog with status, company code, vendor, date range filters
		},

		/**
		 * Open sort dialog
		 */
		onOpenSortDialog: function () {
			if (!this._oSortDialog) {
				this._oSortDialog = sap.ui.xmlfragment("procurement.dashboard.view.SortDialog", this);
				this.getView().addDependent(this._oSortDialog);
			}
			this._oSortDialog.open();
		},

		/**
		 * Handle sort dialog confirm
		 * @param {sap.ui.base.Event} oEvent - Confirm event
		 */
		onSortDialogConfirm: function (oEvent) {
			var mParams = oEvent.getParameters();
			var sSortPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;

			var oTable = this.byId("poTable");
			var oBinding = oTable.getBinding("rows");
			var oSorter = new Sorter(sSortPath, bDescending);

			oBinding.sort(oSorter);
			
			var sSortOrder = bDescending ? "descending" : "ascending";
			MessageToast.show("Sorted by " + mParams.sortItem.getText() + " (" + sSortOrder + ")");
		},

		/**
		 * Export table data to Excel
		 */
		onExport: function () {
			var oTable = this.byId("poTable");
			var oBinding = oTable.getBinding("items");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var aCols = [
				{
					label: oResourceBundle.getText("tablePONumber"),
					property: "PONumber",
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("tableVendorName"),
					property: "VendorName",
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("tableCompanyCode"),
					property: "CompanyCode",
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("tableNetAmount"),
					property: "NetAmount",
					type: EdmType.Number,
					scale: 2
				},
				{
					label: oResourceBundle.getText("tableCurrency"),
					property: "Currency",
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("tableDeliveryDate"),
					property: "DeliveryDate",
					type: EdmType.Date
				},
				{
					label: oResourceBundle.getText("tableStatus"),
					property: "Status",
					type: EdmType.String
				}
			];

			var oSettings = {
				workbook: {
					columns: aCols,
					context: {
						sheetName: "Purchase Orders"
					}
				},
				dataSource: oBinding,
				fileName: "PurchaseOrders_" + new Date().getTime() + ".xlsx"
			};

			var oSpreadsheet = new Spreadsheet(oSettings);
			oSpreadsheet.build()
				.then(function () {
					MessageToast.show(oResourceBundle.getText("successExport"));
				})
				.catch(function (oError) {
					MessageBox.error("Error exporting data: " + oError.message);
				});
		},

		/**
		 * Refresh data
		 */
		onRefresh: function () {
			this._loadData();
			MessageToast.show("Data refreshed");
		},

		/**
		 * Handle table selection change
		 * @param {sap.ui.base.Event} oEvent - Selection change event
		 */
		onSelectionChange: function (oEvent) {
			var oContext = oEvent.getParameter("rowContext");
			if (!oContext) {
				var iRowIndex = oEvent.getParameter("rowIndex");
				if (iRowIndex !== undefined && iRowIndex > -1) {
					var oTable = oEvent.getSource();
					oContext = oTable.getContextByIndex(iRowIndex);
				}
			}
			if (oContext) {
				var sPONumber = oContext.getProperty("PONumber");
				this._oRouter.navTo("RouteDetail", {
					poNumber: sPONumber
				});
			}
		}
	});
});
