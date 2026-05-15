sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Formats the status text with proper capitalization
		 * @param {string} sStatus - The status value
		 * @returns {string} Formatted status
		 */
		formatStatus: function (sStatus) {
			if (!sStatus) {
				return "";
			}
			return sStatus.charAt(0).toUpperCase() + sStatus.slice(1).toLowerCase();
		},

		/**
		 * Returns the status state for semantic coloring
		 * @param {string} sStatus - The status value
		 * @returns {string} Status state
		 */
		formatStatusState: function (sStatus) {
			if (!sStatus) {
				return "None";
			}
			var status = sStatus.toUpperCase();
			switch (status) {
				case "OPEN":
					return "Information";
				case "RELEASED":
					return "Success";
				case "CLOSED":
					return "None";
				default:
					return "None";
			}
		},

		/**
		 * Formats the delivery date and checks if overdue
		 * @param {Date} dDate - The delivery date
		 * @returns {string} Formatted date
		 */
		formatDeliveryDate: function (dDate) {
			if (!dDate) {
				return "";
			}
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});
			return oDateFormat.format(new Date(dDate));
		},

		/**
		 * Checks if delivery is overdue
		 * @param {Date} dDate - The delivery date
		 * @returns {boolean} True if overdue
		 */
		isOverdue: function (dDate) {
			if (!dDate) {
				return false;
			}
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			var deliveryDate = new Date(dDate);
			deliveryDate.setHours(0, 0, 0, 0);
			return deliveryDate < today;
		},

		/**
		 * Returns highlight state for overdue items
		 * @param {Date} dDate - The delivery date
		 * @returns {string} Highlight state
		 */
		formatOverdueHighlight: function (dDate) {
			if (!dDate) {
				return "None";
			}
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			var deliveryDate = new Date(dDate);
			deliveryDate.setHours(0, 0, 0, 0);
			return deliveryDate < today ? "Error" : "None";
		},

		/**
		 * Formats currency amount
		 * @param {number} nAmount - The amount
		 * @param {string} sCurrency - The currency code
		 * @returns {string} Formatted amount
		 */
		formatCurrency: function (nAmount, sCurrency) {
			if (nAmount === null || nAmount === undefined) {
				return "";
			}
			var oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
				currencyCode: false
			});
			return oCurrencyFormat.format(nAmount) + " " + (sCurrency || "");
		},

		/**
		 * Formats large numbers with K/M suffix
		 * @param {number} nValue - The number value
		 * @returns {string} Formatted number
		 */
		formatLargeNumber: function (nValue) {
			if (nValue === null || nValue === undefined) {
				return "0";
			}
			if (nValue >= 1000000) {
				return (nValue / 1000000).toFixed(1) + "M";
			} else if (nValue >= 1000) {
				return (nValue / 1000).toFixed(1) + "K";
			}
			return nValue.toString();
		},

		/**
		 * Formats percentage values
		 * @param {number} nValue - The percentage value
		 * @returns {string} Formatted percentage
		 */
		formatPercentage: function (nValue) {
			if (nValue === null || nValue === undefined) {
				return "0%";
			}
			return nValue.toFixed(1) + "%";
		},

		/**
		 * Returns icon for trend indicator
		 * @param {number} nTrend - The trend value (positive/negative)
		 * @returns {string} Icon URI
		 */
		formatTrendIcon: function (nTrend) {
			if (nTrend > 0) {
				return "sap-icon://trend-up";
			} else if (nTrend < 0) {
				return "sap-icon://trend-down";
			}
			return "sap-icon://horizontal-bar-chart";
		},

		/**
		 * Returns color for trend indicator
		 * @param {number} nTrend - The trend value
		 * @returns {string} Color value
		 */
		formatTrendColor: function (nTrend) {
			if (nTrend > 0) {
				return "Good";
			} else if (nTrend < 0) {
				return "Error";
			}
			return "Neutral";
		}
	};
});
