import { Globals } from "@web-nx/ibo-core";
import { Component, Fieldset, MultiSelectEdit } from "@web-nx/ibo-native-cmp";

export class HyphenImportTableMultiSelectFieldGroup extends Component {

	constructor() {
		super(Component.create("div"));
		this.createMultiSelectFieldGroup();
	}

	private createTableSelectContainer(text: string, cmp: JQuery | Component): JQuery {
		return Component.create("div", "hyphenImportDialogWindow", [
			Component.create("h4", "", [text]), cmp
		]);
	}

	createMultiSelectFieldGroup(): Promise<JQuery> {
		return Globals.request("SdmManager_getHyphenImportTables", {})
			.then((tables: any[]) => {
				const multiSelectEdit = new MultiSelectEdit(tables.map(table => ({ key: `${table.name}`, label: `${table.caption}` })));
				multiSelectEdit.val(tables.map(table => [table.name, false]));

				const tableSelectContainer = this.createTableSelectContainer("Mehrfachauswahl", multiSelectEdit);
				const multiSelectFieldset = new Fieldset(undefined, false, false, tableSelectContainer);
				return multiSelectFieldset.getEl();
			});
	}
}
