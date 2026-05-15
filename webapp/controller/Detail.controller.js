sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"procurement/dashboard/model/formatter"
], function (Controller, History, formatter) {
	"use strict";

	return Controller.extend("procurement.dashboard.controller.Detail", {

		formatter: formatter,

		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
		},

		/**
		 * Binds the view to the object path
		 * @param {sap.ui.base.Event} oEvent - Pattern matched event
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sPONumber = oEvent.getParameter("arguments").poNumber;
			var oModel = this.getView().getModel();
			
			// Bind the view to the purchase order
			this.getView().bindElement({
				path: "/PurchaseOrders('" + sPONumber + "')",
				parameters: {
					expand: "to_Items"
				},
				events: {
					dataRequested: function () {
						this.getView().setBusy(true);
					}.bind(this),
					dataReceived: function () {
						this.getView().setBusy(false);
					}.bind(this)
				}
			});
		},

		/**
		 * Navigate back to dashboard
		 */
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("RouteDashboard", {}, true);
			}
		}
	});
});
