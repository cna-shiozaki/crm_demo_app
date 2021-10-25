sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("cna.pater.controller.Detail.Create", {

		/*
		 * Initialize the Creation View
		 */
		onInit: function () {
			var oView = this.getView();

			oView.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");

			var oCreaModel = new JSONModel();
			oView.setModel(oCreaModel, "crea");
			this.resetCreaModel();
		},

		/*
		 * Reset the content of the "Create new activity" JSON model
		 */
		resetCreaModel: function () {
			var oDefaultDataForCreate = {
				Id: "",
				Type: "Appel Sortant",
				Description: "",
				Motif: "",
				Note: "",
				Statut: "AFAI",
				Partakers: [{
					partnerFunction: "ZCREATOR",
					partnerFullName: "Hjalmar Söderberg"
				}, {
					partnerFunction: "ZTITU",
					partnerFullName: "Amoako Boafo"
				}, {
					partnerFunction: "ZSOLDTO",
					partnerFullName: "Steve Kornacki"
				}, {
					partnerFunction: "ZRECEP",
					partnerFullName: "Guo Ningning"
				}, {
					partnerFunction: "ZDECIDE",
					partnerFullName: "Ayana Elizabeth Johnson"
				}, {
					partnerFunction: "ZDEMDEUR",
					partnerFullName: "Julian Brave Noisecat"
				}, {
					partnerFunction: "ZOBSERVER",
					partnerFullName: "John Jumper"
				}]
			};

			var oModel = this.getView().getModel("crea");
			oModel.setData(oDefaultDataForCreate);
		},

		/*
		 * Callback executed when the user press "Save new activity"
		 */
		onSavePress: function () {
			var oOwnerComponent = this.getOwnerComponent(),
				oMasterODataListBinding = this.oMasterODataListBinding,
				oCreaModel = this.getModel("crea"),
				that = this;


			let strDownloadUrl = oMasterODataListBinding.getDownloadUrl(),
				strRootUrl = window.location.protocol + "//" + window.location.host + strDownloadUrl.slice(0, strDownloadUrl.indexOf("/Activities"));

			var p1 = new Promise(function (resolve, reject) {
				$.get({
					url: strRootUrl + "/Activities?$orderby=Id desc&$top=1",
					success: function (data) {
						let newId = Number.parseInt(data.value[0].Id) + 1;
						resolve(newId.toString());
					},
					error: function (error) {
						// TODO I should catch an error here
					}
				});
			});



			p1.then(function (sNewId) {
				let oContext = oMasterODataListBinding.create({
					"Id": sNewId,
					"Type": oCreaModel.getProperty("/Type"),
					"Description": oCreaModel.getProperty("/Description"),
					"Motif": oCreaModel.getProperty("/Motif"),
					"Note": oCreaModel.getProperty("/Note"),
					"Statut": "AFAI"
				});

				oContext.created().then(function () {
					// Document successfully created
					oOwnerComponent.oCreationDialog.close();
				}, function (oError) {
					// handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted 
				});


				// Extract the partakers to create
				let oODataListBinding = new sap.ui.model.odata.v4.ODataListBinding(oOwnerComponent.getModel(), "/Partakers");
				for (let i = 0; i < oCreaModel.getData().Partakers.length; i++) {
					oODataListBinding.create({
						"ActivityId": sNewId,
						"UserId": that.getPartakerId(oCreaModel.getData().Partakers[i].partnerFullName),
						"UserFullName": oCreaModel.getData().Partakers[i].partnerFullName,
						"PartakerFunction": oCreaModel.getData().Partakers[i].partnerFunction
					});
				}

			});

			return;




			debugger;
			/* 		var p1 = new Promise(function (resolve, reject) {
						oModel.create("/Activities", {
							Description: "toto",
							Motif: "say whaaaat"
						}, {
							success: resolve,
							error: reject,
							groupId: "ActCreateGroupId",
							changeSetId: "ActCreateChangeSetId"
						});
					}); */

			/* 			var p2 = new Promise(function (resolve, reject) {
							oModel.create("/ActiviteNotes", {
								Note: "toto"
							}, {
								success: resolve,
								error: reject,
								groupId: "ActCreateGroupId",
								changeSetId: "ActCreateChangeSetId"
							});
						}); */

			Promise.all([p1]).then(function () {
				oOwnerComponent.oCreationDialog.close();
			}).catch(function () {
				// creation error
			});

		},

		/*
		 * Callback executed when the user press "Cancel"
		 */
		onCancelPress: function () {
			this.getOwnerComponent().oCreationDialog.close();
		},

		/**
		 * Get the partaker's ID from its FullName
		 */
		getPartakerId: function (sPartakerFullName) {
			let str = sPartakerFullName.toLowerCase().trim(),
				aStr = str.split(' ');

			if (aStr.length > 1) {
				return aStr[0].charAt(0) + aStr[1].substring(0, 4);
			}
			else {
				return aStr[0].substring(0, 5);
			}
		}
	});
});