import { Globals } from "@web-nx/ibo-core";
import { Button, Checkbox, Component, DdFieldSetGeneratorJquery, DdFieldSetGeneratorProfile, Fieldset, MultiSelectEdit, Window } from "@web-nx/ibo-native-cmp";
import { t } from 'i18next';
import { CoreData } from "../../CoreData";
import { HyphenImportDialogModel } from "./HyphenImportDialogModel";
import './HyphenImportDialogWindow.scss';
import { HyphenImportTableMultiSelectFieldGroup } from "./HyphenImportTableMultiSelectFieldGroup";



export class HyphenImportDialogWindow extends Window {

	static saveCallback: (value: string, field: any) => void;
	gen!: DdFieldSetGeneratorJquery;
	model!: HyphenImportDialogModel;
	msfg!: HyphenImportTableMultiSelectFieldGroup;

	constructor(field: any) {
		super();
		this.addClass("hyphenImportDialogWindow");
		this.createHeader(t("core-data:showHyphenImportDialogHeader"));
		this.maskBackground();
		this.show(75, 50);
		this.load();
	}

	getDetailModel(): HyphenImportDialogModel {
		return this.model;
	}

	load(_data?: any): Promise<void> {
		this.createToolbar();
		this.createTableImportPanel();
		// this.msfg.createMultiSelectFieldGroup;
		// this.createMultiSelectFieldGroup();
		return Promise.resolve();
	}

	private createHeader(title: string): void {
		const $header = this.createLabel(title, "header");
		this.append($header);
	}

	private createToolbar() {
		const $toolbar = this.createDiv("toolbar flex0 flex");

		$toolbar.append(this.createTableChooseBtn());
		$toolbar.append(this.createSetAllCheckboxesFreeBtn());
		$toolbar.append(this.createChooseAllCheckboxesBtn());
		$toolbar.append(this.createCloseBtn());

		this.append($toolbar);
	}

	private createTableImportPanel() {
		Globals.request("SdmManager_getHyphenImportTables", {
		}).then((tables: any[]) => {
			this.gen = new DdFieldSetGeneratorJquery(this.changeTableListToFieldList(tables), null, new DdFieldSetGeneratorProfile(CoreData.getUserProfileStore(), "HyphenIdent"));
			this.append(this.gen.getEl());
			this.mapFields();
		});
	}

	private mapFields() {
		this.gen.mapFields((info: any, $field: JQuery, input: any) => {
			if (info.value) {
				return {
					rawValue: info.value.rawValue,
					displayValue: info.value.displayValue
				};
			}
			return undefined;
		});
	}

	private changeTableListToFieldList(tables: any[]): any[] {
		const fields = tables.map(table => ({
			ident: table.treeTable,
			visible: true,
			label: table.caption,
			important: false,
			size: 0,
			readOnly: false,
			editorType: "boolean",
			tableName: table.name,
			values: table.treeTable,
			caption: table.caption,
			name: table.name,
			referenceAnalysis: table.referenceAnalysis,
			treeTable: table.treeTable,
			unit: table.unit
		}));

		return [{
			txt: null,
			collapsible: false,
			collapsed: false,
			fields: fields
		}];
	}

	private loadHyphenTables() {
		const selectedTables = [];
		this.gen.eachField((info: any, field: any, input: any) => {
			if ((input as Checkbox).isChecked()) {
				selectedTables.push(info);
			}
		});
		console.log("Tabellen auswählen wurde gedrückt und diese Methode wurde gerufen");
	}

	private createTableChooseBtn(): JQuery {
		const tableChooseBtn = new Button(t("core-data:showHyphenImportDialogTitel"), "fa fa-cog");

		tableChooseBtn.addClass("customizeBtn");
		tableChooseBtn.bindClick(() => {
			this.loadHyphenTables();
		});
		return tableChooseBtn.getEl();
	}

	private createSetAllCheckboxesFreeBtn(): JQuery {
		const setAllCheckboxesFreeBtn = new Button("Auswahl entleeren", "fa fa-object-ungroup");

		setAllCheckboxesFreeBtn.addClass("customizeBtn");
		setAllCheckboxesFreeBtn.bindClick(() => {
			this.gen.clearFields();
		});
		return setAllCheckboxesFreeBtn.getEl();
	}

	private createChooseAllCheckboxesBtn(): JQuery {
		const chooseAllCheckboxesBtn = new Button("Alle auswählen", "fa fa-check-double");

		chooseAllCheckboxesBtn.addClass("customizeBtn");
		chooseAllCheckboxesBtn.bindClick(() => {
			this.gen.eachField((info: any, field: any, input: any) => {
				input.checked(true);
			});
		});
		return chooseAllCheckboxesBtn.getEl();
	}

	private createCloseBtn(): JQuery {
		const closeBtn = new Button(t("core-data:closeBtnText"), "fas fa-times");

		closeBtn.addClass("customizeBtn");
		closeBtn.bindClick(() => {
			console.log("closeBtn wurde ausgedrückt");
			this.destroy();
		});
		return closeBtn.getEl();
	}



	private createTableSelectContainer(text: string, cmp: JQuery | Component): JQuery {
		return Component.create("div", "hyphenImportDialogWindow", [
			Component.create("h4", "", [text]), cmp
		]);
	}

	private createMultiSelectFieldGroup(): Promise<JQuery> {
		return Globals.request("SdmManager_getHyphenImportTables", {})
			.then((tables: any[]) => {
				const multiSelectEdit = new MultiSelectEdit(tables.map(table => ({ key: `${table.name}`, label: `${table.caption}` })));
				multiSelectEdit.val(tables.map(table => [table.name, false]));

				const tableSelectContainer = this.createTableSelectContainer(t("core-data:showHyphenImportDialogTitel"), multiSelectEdit);
				const multiSelectFieldset = new Fieldset(t("core-data:showHyphenImportDialogTitel"), false, false, tableSelectContainer);
				this.append(multiSelectFieldset.getEl());
				return multiSelectFieldset.getEl();
			});
	}






}