sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"../model/formatter"
], function (BaseController, JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, Fragment, MessageBox, formatter) {
	"use strict";

	return BaseController.extend("cna.pater.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function () {
			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			// set i18n model on view

			this.getView().setModel(this.getOwnerComponent().getModel("i18n"), "i18n");

			this._oGroupFunctions = {
				UnitNumber: function (oContext) {
					var iNumber = oContext.getProperty('Statut'),
						key, text;
					if (iNumber <= 20) {
						key = "LE20";
						text = this.getResourceBundle().getText("masterGroup1Header1");
					} else {
						key = "GT20";
						text = this.getResourceBundle().getText("masterGroup1Header2");
					}
					return {
						key: key,
						text: text
					};
				}.bind(this)
			};

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};


			this._oList.attachEvent()

			this.setModel(oViewModel, "masterView");
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oList.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			
			
			/* Attach an error in case of server error*/
			this._oList.attachModelContextChange(function () {
				oList.getBinding("items").attachDataReceived(function (oStuff) {
					let error = oStuff.getParameter("error");
					if (error) MessageBox.error(error.toString());
				});
			})

			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		onSearch: function (oEvent) {
			var oModel = this.getModel();
			/* 			oModel.pReadyForRequest.then(function () {
							debugger;
							console.log("reaaaady");
							oModel.read("/Activities", {
								success: function (oSuccess) {
									debugger;
									var oMetadata = oModel.getMetadata();
								}
							});
						}); */



			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			var oFilters = this.getView().getModel("masterView").getProperty("/filters");
			this._oListFilterState.aSearch = [];

			if (oFilters.id) {
				this._oListFilterState.aSearch.push(new Filter("Id", FilterOperator.EQ, oFilters.id));
			}

			if (oFilters.status) {
				this._oListFilterState.aSearch.push(new Filter("Statut", FilterOperator.EQ, oFilters.status));
			}

			this._applyFilterSearch();

			/*			var sQuery = oEvent.getParameter("query");

						if (sQuery) {
							this._oListFilterState.aSearch = [new Filter("Name", FilterOperator.Contains, sQuery)];
						} else {
							this._oListFilterState.aSearch = [];
						}*/

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the filter, sort and group buttons to open the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onOpenViewSettings: function (oEvent) {
			var sDialogTab = "filter";
			if (oEvent.getSource().isA("sap.m.Button")) {
				var sButtonId = oEvent.getSource().getId();
				if (sButtonId.match("sort")) {
					sDialogTab = "sort";
				} else if (sButtonId.match("group")) {
					sDialogTab = "group";
				}
			}
			// load asynchronous XML fragment
			if (!this._pViewSettingsDialog) {
				this._pViewSettingsDialog = Fragment.load({
					id: this.getView().getId(),
					name: "cna.pater.view.ViewSettingsDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					this.getView().addDependent(oDialog);
					oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					return oDialog;
				}.bind(this));
			}
			this._pViewSettingsDialog.then(function (oDialog) {
				oDialog.open(sDialogTab);
			});
		},

		/**
		 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
		 * has been closed with 'OK'. In the case, the currently chosen filters, sorters or groupers
		 * are applied to the master list, which can also mean that they
		 * are removed from the master list, in case they are
		 * removed in the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @public
		 */
		onConfirmViewSettingsDialog: function (oEvent) {
			var aFilterItems = oEvent.getParameters().filterItems,
				aFilters = [],
				aCaptions = [];

			/*	// update filter state:
				// combine the filter array and the filter string
				aFilterItems.forEach(function (oItem) {
					switch (oItem.getKey()) {
					case "Filter1":
						aFilters.push(new Filter("Statut", FilterOperator.EQ, "AFAI"));
						break;
					case "Filter2":
						aFilters.push(new Filter("Statut", FilterOperator.EQ, "ENCO"));
						break;
					default:
						break;
					}
					aCaptions.push(oItem.getText());
				});*/

			this._oListFilterState.aFilter = aFilters;
			this._updateFilterBar(aCaptions.join(", "));
			this._applyFilterSearch();
			this._applySortGroup(oEvent);
		},

		/**
		 * Apply the chosen sorter and grouper to the master list
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @private
		 */
		_applySortGroup: function (oEvent) {
			var mParams = oEvent.getParameters(),
				sPath,
				bDescending,
				aSorters = [];
			// apply sorter to binding
			// (grouping comes before sorting)
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				var vGroup = this._oGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			this._oList.getBinding("items").sort(aSorters);
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function (oEvent) {
			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function () {
			this._oList.removeSelections(true);
		},

		/**
		 * Callback executed when user press "Create new Activity"
		 * @public
		 */
		onCreateNewActivity: function () {
			var oOwnerComponent = this.getOwnerComponent();
			var oContext = this.getView().byId("list").getBinding("items");

			if (!oOwnerComponent.oCreationDialog) {
				oOwnerComponent.runAsOwner(function () {
					sap.ui.core.mvc.XMLView.create({
						viewName: "cna.pater.view.Detail.Create",
						width: "100%"
					}).then(function (oView) {
						var oCreationDialog = new sap.m.Dialog("createActivityDialog", {
							stretch: false,
							contentWidth: "auto",
							title: "Cr??er une nouvelle activit??"
						});


						oCreationDialog.insertContent(oView, 0);
						oOwnerComponent.oCreationDialog = oCreationDialog;
						oView.getController().oMasterODataListBinding = oContext;
						oCreationDialog.open();
					});
				});
			} else {
				oOwnerComponent.oCreationDialog.getContent()[0].getController().resetCreaModel();
				oOwnerComponent.oCreationDialog.open();
			}

		},

		/**
		 * Used to create GroupHeaders with non-capitalized caption.
		 * These headers are inserted into the master list to
		 * group the master list's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
		createGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function () {
			// eslint-disable-next-line sap-no-history-manipulation
			history.go(-1);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				titleBusy: false,
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Id",
				groupBy: "None",
				filters: {
					id: "",
					status: ""
				}

			});
		},

		_onMasterMatched: function () {
			//Set the layout property of the FCL control to 'OneColumn'
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			// set the layout property of FCL control to show two columns
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("_id")
			}, bReplace);
		},

		/**
		 * Sets the item count on the master list header
		 * @param {int} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount: function (iTotalItems) {
			var sTitle,
				oResourceBundle = this.getResourceBundle(),
				oMasterViewModel = this.getModel("masterView");
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = oResourceBundle.getText("masterTitleCount", [iTotalItems]);
				oMasterViewModel.setProperty("/title", sTitle);
			} else {
				// let's count the total number of items!
				var oModel = this.getModel();
				oMasterViewModel.setProperty("/titleBusy", true);
				oModel.read(this._oList.getBinding("items").getPath() + "/$count", {
					filters: this._oList.getBinding("items").aApplicationFilters,
					success: function (vCountResult) {
						vCountResult = sap.ui.core.format.NumberFormat.getFloatInstance({}).format(parseInt(vCountResult));
						sTitle = oResourceBundle.getText("masterTitleCount", [vCountResult]);
						oMasterViewModel.setProperty("/title", sTitle);
						oMasterViewModel.setProperty("/titleBusy", false);
					},
					error: function () {
						oMasterViewModel.setProperty("/titleBusy", false);
					}
				});
			}
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		}

	});

});