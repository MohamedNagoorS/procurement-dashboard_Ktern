sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {
		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createViewModel: function () {
			var oModel = new JSONModel({
				busy: false,
				delay: 0,
				selectedFilter: "All",
				kpiData: {
					totalPOs: 0,
					openPOs: 0,
					releasedPOs: 0,
					delayedDeliveries: 0,
					totalAmount: 0,
					currency: "USD"
				},
				chartData: {
					statusDistribution: [],
					monthlyProcurement: [],
					vendorAnalysis: [],
					companyCodeDistribution: []
				}
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}
	};
});
