sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {
		createDeviceModel : function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		initUIConfigCustomizing: function (oUIConfigModel, oComponent) { 
			oComponent.pInitCustomizingReady = new Promise(resolve => oUIConfigModel.attachRequestCompleted(function () { 
				oComponent.oDefaultCustomizing = JSON.parse(JSON.stringify(oUIConfigModel.getData()));
				resolve();
			}));
		}
	};
});