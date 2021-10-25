/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"sap/ui/test/Opa5",
		"sap/ui/demo/masterdetail/test/integration/arrangements/Startup",
		"sap/ui/demo/masterdetail/test/integration/NavigationJourney"
	], function (Opa5, Startup) {

		Opa5.extendConfig({
			arrangements: new Startup(),
			viewNamespace: "cna.pater.view.",
			autoWait: true
		});

		QUnit.start();
	});
});