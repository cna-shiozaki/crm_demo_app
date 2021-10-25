sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../../model/formatter",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, formatter, Fragment) {
	"use strict";

	return Controller.extend("cna.pater.controller.Detail.Header", {

		formatter: formatter,

		onInit: function () {
			// 1 - déclarer ce contrôleur à un contrôleur parent
			var eventBus = this.getOwnerComponent().getEventBus();
			eventBus.publish("CustomChannel", "NewNestedViewCreated", this);

			// 2 - initialiser une subscription à l'événement TurnToDisplayMode
			eventBus.subscribe("CustomChannel", "TurnToDisplayMode", this.setDisplayMode, this);

			var oViewModel = new JSONModel({ editMode: false});
			this.getView().setModel(oViewModel, "detailView");

			// 3 - rendre le clic sur le container déclencheur du passage en mode édition
			let oVerticalLayoutContainer = this.byId("displayContainer"),
				that = this;

			oVerticalLayoutContainer.addEventDelegate({
				onclick: function (e) {
					that.getOwnerComponent().getModel("UIConfig").setProperty("/showFooter",true);
					that.setEditMode();
					e.HeaderAlreadyProcessed = true;
				}
			});
		},


		setEditMode: function() {
			var oView = this.getView();
			oView.getModel("detailView").setProperty("/editMode",true);
			this.switchDisplayEditMode();
		},

		setDisplayMode: function() {
			var oView = this.getView();
			oView.getModel("detailView").setProperty("/editMode",false);
			this.switchDisplayEditMode();
		},		

		switchDisplayEditMode: function () {
			var oView = this.getView(),
				bEdit = oView.getModel("detailView").getProperty("/editMode");

			var oHeaderFormDisplay = oView.byId("headerFormDisplay"),
				oDisplayContainer = oView.byId("displayContainer"),
				fragmentId = this.getView().createId("headerEditFragmentId"),
				editContainer = Fragment.byId(fragmentId, "editContainer");

			if (bEdit) {
				// LET'S GO TO EDIT MODE 
				oHeaderFormDisplay.setVisible(false);

				if (!editContainer) { // load and instantiate the edit panel lazily
					// Le fragment d'édition n'existe pas encore : le charger et le rendre visible
					Fragment.load({
						id: fragmentId,
						name: "cna.pater.view.Detail.fragment.HeaderEdit",
						controller: this
					}).then(function (oFragment) {
						oDisplayContainer.insertContent(oFragment, 0);
					});
				} else {
					// Le fragment d'édition existe déjà : juste le rendre visible
					editContainer.setVisible(true);
				}
			} else {
				// LET'S GO TO DISPLAY MODE
				if (editContainer) editContainer.setVisible(false);
				oHeaderFormDisplay.setVisible(true); 
			}
		}


	});

});