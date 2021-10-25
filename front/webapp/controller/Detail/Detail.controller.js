sap.ui.define([
	"../BaseController",
	"sap/ui/model/json/JSONModel",
	"../../model/formatter",
	"sap/m/library",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/odata/v4/ODataUtils"
], function (BaseController, JSONModel, formatter, mobileLibrary, MessageBox, MessageToast, ODataUtils) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("cna.pater.controller.Detail.Detail", {

		formatter: formatter,
		nestedViewsControllers: [],

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();

			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel();

			this.setModel(oViewModel, "detailView");

			oEventBus.subscribe("CustomChannel", "NewNestedViewCreated", this.newNestedViewCreated, this);

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			let oView = this.getView();


			oView.addEventDelegate({
				onclick: function (e) {
					let bAlreadyProcessed = e.HeaderAlreadyProcessed || false;
					if (!bAlreadyProcessed) {

						oEventBus.publish("CustomChannel", "TurnToDisplayMode");
						//alert("clic sur la vue entière");
					}

				}

			});


		},



		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress: function () {
			var oViewModel = this.getModel("detailView");

			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished: function (oEvent) {
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel("UIConfig").setProperty("/showFooter", false);
			this.byId("draftIndicator").clearDraftState();

			var sActivityId = ODataUtils.formatLiteral(sObjectId, "Edm.String"),
				sObjectPath = "/" + encodeURIComponent("Activities(" + sActivityId + ")");

			this._bindView(sObjectPath);

			// ... And inform the nested views that a new binding has occurred
			this.getOwnerComponent().getEventBus().publish("CustomChannel", "ObjectPatternMatched");
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			// Reset the view to its in display mode
			this.getOwnerComponent().getEventBus().publish("CustomChannel", "TurnToDisplayMode");

			this.getView().bindElement({
				path: sObjectPath,
				/* 				parameters: {
									expand: ""
								}, */
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			oElementBinding.attachPatchSent(function () {
				var oDraftIndi = this.byId("draftIndicator");
				oDraftIndi.showDraftSaving();
			}, this);


			oElementBinding.attachPatchCompleted(function () {
				var oDraftIndi = this.byId("draftIndicator");
				oDraftIndi.showDraftSaved();
			}, this);

			var sPath = oElementBinding.getPath();
			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			/* 			let	oResourceBundle = this.getResourceBundle(),
							oObject = oView.getModel().getObject(sPath),
							sObjectId = oObject.ObjectID,
							sObjectName = oObject.Name,
							oViewModel = this.getModel("detailView");			
			
						oViewModel.setProperty("/shareSendEmailSubject",
							oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
						oViewModel.setProperty("/shareSendEmailMessage",
							oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href])); */
		},
		/*
				_onMetadataLoaded: function () {
					// Store original busy indicator delay for the detail view
					var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
						oViewModel = this.getModel("detailView"),
						oLineItemTable = this.byId("lineItemsList"),
						iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();
	
					// Make sure busy indicator is displayed immediately when
					// detail view is displayed for the first time
					oViewModel.setProperty("/delay", 0);
					oViewModel.setProperty("/lineItemTableDelay", 0);
	
					oLineItemTable.attachEventOnce("updateFinished", function () {
						// Restore original busy indicator delay for line item table
						oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
					});
	
					// Binding the view will set it to not busy - so the view is always busy if it is not bound
					oViewModel.setProperty("/busy", true);
					// Restore original busy indicator delay for the detail view
					oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
				},*/

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
			}
		},

		/**
		 * Callback routine executed when user pressed "Delete" button
		 */
		onDeletePress: function () {
			var oModel = this.getModel(),
				oCurrentBindingContext = this.getView().getBindingContext(),
				oMasterListBinding = this.getOwnerComponent().oListSelector._oList.getBinding("items");// Not really clean but works for now

			let oIntervenantsController = this.nestedViewsControllers.find(oCtrl => oCtrl.getMetadata().getName() === "cna.pater.controller.Detail.Intervenants");

			MessageBox.confirm("Voulez-vous vraiment supprimer cette activité ?", {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {

						oCurrentBindingContext.delete().then(function () {
							let aPartakersDeletePromises = oIntervenantsController.deleteAllPartakers();
							Promise.all(aPartakersDeletePromises).then(
								function () {
									oMasterListBinding.refresh();
								});

						});
					}
				}
			});
		},

		/*
		 * Routine appelée lorsqu'une vue imbriquée s'est déclarée par événément sap.ui.core.EventBus.
		 * Ajouter le contrôleur de cette vue dans le tableau nestedViewsControllers[]
		 * @function
		 */
		newNestedViewCreated: function (oChannel, oEventName, oNewViewController) {
			this.nestedViewsControllers.push(oNewViewController);
		},

		/**
		 * Callback routine executed when user pressed "Cancel" button (in order to cancel the changes made to the entire document)
		 */
		onCancelPress: function () {
			// 1 - reset the changes
			this.getModel().resetChanges();

			// 2 - switch back to display mode
			var oUIConfigModel = this.getModel("UIConfig");
			oUIConfigModel.setProperty("/editMode", false);
			this.getOwnerComponent().getEventBus().publish("CustomChannel", "EditModelChanged");
		},

		/**
		 * Callback routine executed when user pressed "Save" button (in order to save the entire document)
		 */
		onSavePress: function () {

			var oModel = this.getModel(),
				oUIConfigModel = this.getModel("UIConfig"),
				oEventBus = this.getOwnerComponent().getEventBus();
			let promiseSave = new Promise((resolve, reject) => {
				oModel.submitChanges({
					groupId: "changes",
					success: resolve,
					error: reject
				});
			});

			var oIntervenantsController = this.nestedViewsControllers.find(oController => oController.getMetadata().getName() ===
				"cna.pater.controller.Detail.Intervenants");

			if (oIntervenantsController) {
				oIntervenantsController.save("changes", "changeset");
			}

			promiseSave.then(function saveSuccess() {
				MessageToast.show("Activité sauvegardée");

				// Switch back to display mode
				oUIConfigModel.setProperty("/editMode", false);
				oEventBus.publish("CustomChannel", "EditModelChanged");

			}).catch(function saveError(oError) {

			});

		}
	});

});