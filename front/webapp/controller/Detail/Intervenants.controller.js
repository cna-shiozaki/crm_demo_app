sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../../model/formatter",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, formatter, Fragment, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("cna.pater.controller.Detail.Intervenants", {

		formatter: formatter,

		/**
		 * Called when the Intervenant controller is instantiated. 
		 * @public
		 */
		onInit: function () {
			// 1 - déclarer ce contrôleur à un contrôleur parent
			var eventBus = this.getOwnerComponent().getEventBus();
			eventBus.publish("CustomChannel", "NewNestedViewCreated", this);

			// 2 - initialiser une subscription à l'événement EditModelChanged
			eventBus.subscribe("CustomChannel", "ObjectPatternMatched", this.onObjectPatternMatched, this);

			// 3 - initialiser un modèle JSON pour contenir les intervenants en cours d'éditions
			var oEditIntervenantsModel = new JSONModel([]);
			this.getView().setModel(oEditIntervenantsModel, "EditIntervenants");


		},


		onObjectPatternMatched: function () {
			let oView = this.getView(),
				fnOnPartakerFullNameClicked = this.onPartakerFullNameClicked,
				fnLabel = this.formatter.partnerFunctionLabel,
				fnIcon = this.formatter.partnerFunctionIcon;

			/* Update the binding to the new Activity'partakers*/

			oView.getBindingContext().requestObject().then(function (oOb) {
				let oPartakersTable = oView.byId("partakersDisplayTable");

				var oItemTemplate = new sap.m.ColumnListItem({
					cells: [
						new sap.m.ObjectListItem({
							title: { path: 'PartakerFunction', formatter: fnLabel },
							icon: { path: 'PartakerFunction', formatter: fnIcon }
						}),
						new sap.m.ObjectIdentifier({ title: "{UserFullName}", titleActive: true, titlePress: fnOnPartakerFullNameClicked }),

					]
				});
				var oFilter1 = new Filter("ActivityId", FilterOperator.EQ, oOb.Id);
				oPartakersTable.bindAggregation("items", { path: '/Partakers', template: oItemTemplate, filters: [oFilter1] });

			});




		},

		onPartakerFullNameClicked: function () {

		},
		/**
		 * Callback when the edit/display mode has been switched 
		 * @public
		 */
		editModelHasBeenChanged: function () {
			var oView = this.getView(),
				bEdit = oView.getModel("UIConfig").getProperty("/editMode");

			var oPartakersDisplayTable = oView.byId("partakersDisplayTable"),
				oDisplayContainer = oView.byId("displayContainer"),
				fragmentId = this.getView().createId("noteEditFragmentId"),
				editContainer = Fragment.byId(fragmentId, "editContainer");

			if (bEdit) {
				// LET'S GO TO EDIT MODE 
				oPartakersDisplayTable.setVisible(false);

				if (!editContainer) { // load and instantiate the edit panel lazily
					// Le fragment d'édition n'existe pas encore : le charger et le rendre visible
					Fragment.load({
						id: fragmentId,
						name: "cna.pater.view.Detail.fragment.IntervenantsEdit",
						controller: this
					}).then(function (oFragment) {
						oDisplayContainer.insertContent(oFragment, 0);
					});
				} else {
					// Le fragment d'édition existe déjà : juste le rendre visible
					editContainer.setVisible(true);
				}

				/* Transformer les données du oDataModel v2 en JSONModel */
				var array = [];
				for (var i = 0; i < oView.byId("partakersDisplayTable").getItems().length; i++) {
					var contextPath = oView.byId("partakersDisplayTable").getItems()[i].getBindingContextPath(),
						contextPathBP = contextPath + "/ToBP",
						contextPathAdresse = contextPath + "/ToAdresse",
						contextPathContact = contextPath + "/ToContact";
					var object = oView.getModel().getObject(contextPath);
					/*					objectBP = oView.getModel().getObject(contextPathBP),
						objectAdresse = oView.getModel().getObject(contextPathAdresse),
						objectContact = oView.getModel().getObject(contextPathContact);

					object.ToBP.Nom1 = objectBP.Nom1;
					object.ToBP.Nom2 = objectBP.Nom2;
					object.ToBP.PartnerRole = objectBP.PartnerRole;
					object.ToBP.Type = objectBP.Type;

					object.ToAdresse = objectAdresse;

					object.ToContact.TelPortable = objectContact.TelPortable;
					object.ToContact.TelFix = objectContact.TelFix;
					object.ToContact.Email1 = objectContact.Email1;
					object.ToContact.Email2 = objectContact.Email2;
*/
					array.push(object);
				}
				oView.getModel("EditIntervenants").setData(array);

			} else {
				// LET'S GO TO DISPLAY MODE
				editContainer.setVisible(false);
				oPartakersDisplayTable.setVisible(true);
			}
		},

		/**
		 * Save the edited values of the Intervenants section 
		 * @public
		 */
		save: function (vBatchGroup, vChangeSet) {

			var isDirty = false,
				oODataModel = this.getView().getModel();

			/* Collecter l'image originale des intervenants (issu du OData Modèle sans nom) */
			var intervenantsItems = this.byId("partakersDisplayTable").getItems(),
				oDataModelElements = [];

			for (var i = 0; i < intervenantsItems.length; i++) {
				var item = oODataModel.getObject(intervenantsItems[i].getBindingContextPath());
				item.bindingContextPath = intervenantsItems[i].getBindingContextPath();
				oDataModelElements.push(item);
			}

			/* Collecter l'image modifiée des intervenants (issu du JSON Modèle 'EditIntervenants' */
			var aDirtyIntervenants = this.getView().getModel("EditIntervenants").getData();

			/* Détection des CREATIONS et des UPDATES */
			for (var j = 0; j < aDirtyIntervenants.length; j++) {
				var oIntervenantODataModel = oDataModelElements.find(function (oEl) {
					return oEl.PartnerFct === aDirtyIntervenants[j].PartnerFct && oEl.PartnerId === aDirtyIntervenants[j].PartnerId;
				});

				if (!oIntervenantODataModel) {
					/*  Création d'un nouvel intervenant */
					oODataModel.create("/Intervenants", {
						Index: "new",
						PartnerFct: aDirtyIntervenants[j].PartnerFct,
						PartnerId: aDirtyIntervenants[j].PartnerId
					}, {
						groupId: vBatchGroup,
						changeSetId: vChangeSet
					});
					isDirty = true;
				}
			}

			/* Détection des SUPPRESSIONS */
			for (var k = 0; k < oDataModelElements.length; k++) {
				var oIntervenantDirtyModel = aDirtyIntervenants.find(function (oEl) {
					return (oEl.PartnerFct === oDataModelElements[k].PartnerFct && oEl.PartnerId === oDataModelElements[k].PartnerId);
				});
				if (!oIntervenantDirtyModel) {
					// L'intervenant du oDataModel n'a pas été trouvée dans le dirty model => il s'agit d'une suppression
					var strSuppIntervenantPath = oDataModelElements[k].bindingContextPath;
					oODataModel.remove(strSuppIntervenantPath, {
						context: this.getView().getBindingContext(),
						groupId: vBatchGroup,
						changeSetId: vChangeSet
					});
					isDirty = true;
				}
			}
			return isDirty;

		},

		/*
		* When deleting an Activity, this function deleteAllPartakers() takes care of deleting all the partakers with a delete() from sap.ui.model.odata.v4.Context 
		* Return an array of Promises, each of one responsible for the deletion of a single Partaker
		*/
		deleteAllPartakers: function () {
			var aPartakersTableItems = this.getView().byId("partakersDisplayTable").getItems(),
				aDeletePromises = [];

			for (var i = 0; i < aPartakersTableItems.length; i++) {
				aDeletePromises.push(aPartakersTableItems[i].getBindingContext().delete());
			}
			return aDeletePromises;
		},


		onListUpdateFinished: function () {

		},

	});

});