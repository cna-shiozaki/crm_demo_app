sap.ui.define(["sap/ui/model/resource/ResourceModel"], function (ResourceModel) {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		typeIcon: function (sType) {
			switch (sType) {
				case "Tâche à Faire":
					return "sap-icon://activity-2";
				case "Appel Sortant":
					return "sap-icon://outgoing-call";
				case "Email Sortant":
					return "sap-icon://email";
				case "Visite":
					return "sap-icon://visits";
				case "Investigation":
					return "sap-icon://bbyd-active-sales";
				default:
					return "sap-icon://business-one";
			}
		},



		statusText: function (sStatus) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "AFAI":
					return oBundle.getText("statusAFAI");
				case "ENCO":
					return oBundle.getText("statusENCO");
				case "FAIT":
					return oBundle.getText("statusFAIT");
				default:
					return oBundle.getText("statusANOM");
			}

		},

		statusState: function (sStatus) {
			switch (sStatus) {
				case "AFAI":
					return "Error";
				case "ENCO":
					return "Warning";
				case "FAIT":
					return "Success";
				default:
					return "None";
			}

		},

		statusIcon: function (sStatus) {
			switch (sStatus) {
				case "AFAI":
					return "sap-icon://message-warning";
				case "ENCO":
					return "sap-icon://paper-plane";
				case "FAIT":
					return "sap-icon://message-success";
				default:
					return "None";
			}

		},

		partnerFunctionLabel: function (sPartnerFunction) {
			switch (sPartnerFunction) {
				case "ZCREATOR":
					return "Créateur";
				case "ZTITU":
					return "Titulaire";
				case "ZSOLDTO":
					return "Payeur";
				case "ZRECEP":
					return "Réceptionnaire";
				case "ZDECIDE":
					return "Décideur";
				case "ZDEMDEUR":
					return "Demandeur";
				case "ZOBSERVER":
					return "Observateur";
				case "ZAGENT":
					return "Agent Administratif";
				default:
					return "Autre";

			}
		},

		partnerFunctionIcon: function (sPartnerFunction) {
			switch (sPartnerFunction) {
				case "ZCREATOR":
					return "sap-icon://doctor";
				case "ZTITU":
					return "sap-icon://employee-pane";
				case "ZSOLDTO":
					return "sap-icon://money-bills";
				case "ZRECEP":
					return "sap-icon://customer-and-supplier";
				case "ZDECIDE":
					return "sap-icon://customer-financial-fact-sheet";
				case "ZDEMDEUR":
					return "sap-icon://activity-individual";
				case "ZOBSERVER":
					return "sap-icon://show";
				case "ZAGENT":
					return "sap-icon://cancel-maintenance";
				default:
					return "sap-icon://question-mark";

			}

		}
	};
});