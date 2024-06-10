import { Globals, Ibo } from '@web-nx/ibo-core';
import { Button, Component, MessageBox, MultiSelectEdit, MultiSelectWindow, Textfield, ToggleButton, Toolbar } from '@web-nx/ibo-native-cmp';
import { t } from 'i18next';
import { PageKeys } from '../../PageKeys';
import { SaveHyphenAction } from '../../action/hyphen/SaveHyphenAction';
import { SinglePage } from '../SinglePage';
import { SinglePageStage } from '../SinglePageStage';
import { HyphenGrid } from './HyphenGrid';
import { HyphenInterceptor } from './HyphenInterceptor';
import { HyphenModel } from './HyphenModel';
import styles from "./HyphenPage.module.scss";

export class HyphenPage extends SinglePage {

	searchField!: Textfield;
	tableName = "HYPHEN";
	grid!: HyphenGrid;
	toolbar!: Toolbar;
	hyphenModel!: HyphenModel;
	$counter!: JQuery;
	stage: SinglePageStage;
	saveButton: Button | null = null;
	deleteButton: Button | null = null;
	newButton: Button | null = null;
	private filterNoHyphenButton: ToggleButton | null = null;
	private showDuplicatesButton: ToggleButton | null = null;
	private showHyphenImportDialogButton: Button | null = null;
	private showHyphenImportDialog = false;
	private showDuplicates = false;
	private showNoHyphenValues = false;
	private $duplicatesText: JQuery | null = null;
	interceptor: HyphenInterceptor | null = null;

	constructor(stage: SinglePageStage) {
		super(Component.createDiv("page flex flexColumn flex1 hyphenPage"));
		this.stage = stage;
	}

	async load(): Promise<void> {
		const data = await Globals.request("SdmManager_GetFullTableGridData", {
			filter: [],
			tableName: this.tableName
		});

		this.interceptor = new HyphenInterceptor(data);
		this.grid.setInterceptor(this.interceptor);

		this.grid.initialLoad();
	}

	afterAdded(): void {
		// Empty Implementation
	}

	update(): void {
		this.load();
	}

	checkLayout(key: string): void {
		this.saveButton?.disabled(!this.hyphenModel.hasChangedData());
		this.deleteButton?.disabled(this.grid.getSelectedIDs().length < 1);
		this.updateFilterState();
		this.checkForDuplicates();
	}

	getCaption(): string {
		return t("core-data:informationTxt");
	}
	getNavBarCaption(): string {
		return this.getCaption();
	}

	getKey(): string {
		return PageKeys.INFO;
	}

	getTabIcon(): string {
		return "fas fa-info";
	}

	onPageShown(): void {
		this.hyphenModel = new HyphenModel(() => this.checkLayout(this.getKey()));
		this.createSearchRow();
		this.createSearchGrid();

		this.createRightActionButtons();
		this.createLeftActionButtons();
		this.checkLayout(this.getKey());
	}

	createLeftActionButtons(): void {
		const deleteButton = new Button(t("res-native-cmp-searchStage:deleteRecord"), "fas fa-trash", false),
			newButton = new Button(t("res-native-cmp-searchStage:addRecord"), "fas fa-plus-circle", false);

		deleteButton.title(t("core-data:deleteBtnTxt"));
		deleteButton.bindClick(() => {
			MessageBox.yesNo(t("core-data:deleteRecord"), t("core-data:deleteBoxTxt"), () => {
				const selectedIds = this.grid.getSelectedIDs();
				this.hyphenModel.setItemsToDelete(selectedIds);
				this.grid.disableDeletedRows();
				this.checkLayout(this.getKey());
				this.grid.clearSelectedRows();
			});
		});

		newButton.title(t("core-data:createNew"));
		newButton.bindClick(() => {
			this.newEmptyRow();
		});

		this.deleteButton = deleteButton;
		this.newButton = newButton;
		this.stage.toolbar?.fillHeadlineContainer(this.getCaption());
		this.stage.toolbar?.addAdditionalButtonsLeft([newButton, deleteButton]);
	}

	createRightActionButtons(): void {
		const saveBtn = new Button(null, "fas fa-save", false);

		saveBtn.title(t("core-data:saveBtnTxt"));
		saveBtn.bindClick(() => {
			this.saveChanges();
		});

		this.saveButton = saveBtn;
		this.stage.toolbar?.addAdditionalButtonsRight([saveBtn]);
	}

	saveChanges(): void {
		if (this.hyphenModel.hasChangedData()) {
			Ibo.actions.execute(new SaveHyphenAction(), [
				this.hyphenModel.getChangedData(),
				this.hyphenModel.getItemsToDelete(),
				(): void => {
					this.hyphenModel.clear();
					this.load();
				}
			]);
		}
	}

	private createSearchRow(): void {
		this.stage.toolbar?.addAdditionalButtonsRight([this.createDuplicatesText(), this.createCounter(), this.createShowDuplicatesButton(), this.createFilterNoHyphenButton(), this.createShowHyphenImportDialogButton(), this.createSearchInput()]);
	}

	private createSearchInput(): JQuery {
		const searchField = new Textfield("", "fa fa-search");

		searchField.placeholder(t("core-data:searchTxt"));
		searchField.addClass("searchField flex flex0");

		searchField.bindLiveEvents(() => {
			this.reloadGrid();
		});
		this.searchField = searchField;
		return searchField.getEl();
	}

	private createCounter(): JQuery {
		const $counter = this.createDiv("counter");
		this.$counter = $counter;
		return $counter;
	}

	createDuplicatesText(): JQuery {
		const $label = this.createLabel(t("core-data:duplicateWarning"), styles.duplicatesText);
		this.$duplicatesText = $label;
		return $label;
	}

	private createFilterNoHyphenButton(): JQuery {
		const filterButton = new ToggleButton(null, "fas fa-filter", false);
		filterButton.title(t("core-data:filterNoHyphenButtonTitle"));

		filterButton.bindClick(() => {
			const pressed = filterButton.isPressed();
			this.showNoHyphenValues = pressed;
			this.showDuplicates = false;
			this.updateFilterState();
			this.reloadGrid();
		});

		this.filterNoHyphenButton = filterButton;
		return filterButton.getEl();
	}

	private createShowDuplicatesButton(): JQuery {
		const showDuplicatesButton = new ToggleButton(null, "fas fa-clone", false);
		showDuplicatesButton.title(t("core-data:showDuplicatesButtonTitle"));

		showDuplicatesButton.bindClick(() => {
			const pressed = showDuplicatesButton.isPressed();
			this.showDuplicates = pressed;
			this.showNoHyphenValues = false;
			this.updateFilterState();
			this.reloadGrid();
		});

		this.showDuplicatesButton = showDuplicatesButton;
		return showDuplicatesButton.getEl();
	}

	private createShowHyphenImportDialogButton(): JQuery {
		const showHyphenImportDialogButton = new Button(null, "fa fa-book", false);
		showHyphenImportDialogButton.title(t("core-data:showHyphenImportDialogButton"));

		showHyphenImportDialogButton.bindClick(() => {
			//const hyphenImportDialog = new HyphenImportDialogWindow("Hyphen Import Dialog Window");
			//hyphenImportDialog.show();
			//this.createMultiSelectFieldGroup();
			this.createHyphenTablesMultiSelectWindow();
		});

		this.showHyphenImportDialogButton = showHyphenImportDialogButton;
		return showHyphenImportDialogButton.getEl();
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

				//const tableSelectContainer = this.createTableSelectContainer(t("core-data:showHyphenImportDialogTitel"), multiSelectEdit);
				//const multiSelectFieldset = new Fieldset(t("core-data:showHyphenImportDialogTitel"), false, false, tableSelectContainer);
				this.append(multiSelectEdit.getEl());
				return multiSelectEdit.getEl();
			});
	}

	private createHyphenTablesMultiSelectWindow(): Promise<JQuery> {
		return Globals.request("SdmManager_getHyphenImportTables", {})
			.then((tables: any[]) => {
				const window = new MultiSelectWindow(
					t("core-data:showHyphenImportDialogTitel"),
					new Map(tables.map(table => [table.name, table.caption])),
					new Map(tables.map(table => [table.name, false])),
					(newValue) => {
						this.loadNewHyphenFields(Array.from(newValue).filter(([tableName, isSelected]) => isSelected).map(([tableName, isSelected]) => tableName));
					}
				);

				window.disableAutoDestroy();
				window.maskBackground();
				window.showCenter();

				this.append(window.getEl());

				return window.getEl();
			});
	}

	private loadNewHyphenFields(selectedTables: string[]) {
		console.log(selectedTables);
		console.log("hier sollte eine methode geschrieben werden");
	}



	updateFilterState(): void {
		this.filterNoHyphenButton?.pressed(this.showNoHyphenValues);
		this.interceptor?.setShowNoHyphenValues(this.showNoHyphenValues);
		this.showDuplicatesButton?.pressed(this.showDuplicates);
		this.interceptor?.setShowDuplicates(this.showDuplicates);
	}

	checkForDuplicates(): void {
		if (this.interceptor?.hasDuplicates())
			this.$duplicatesText?.show();
		else
			this.$duplicatesText?.hide();
	}

	private async createSearchGrid(): Promise<void> {
		const grid = new HyphenGrid(this.searchField, this.hyphenModel);
		this.grid = grid;

		grid.bindEvent("totalCountChanged", (cmp: JQuery, event: Event, count: number) => {
			const text = count === 1 ? t("core-data:dataRowSingular") : t("core-data:dataRowPlural");

			this.$counter.text(count + " " + text);
		});

		grid.bindEvent("selectionchanged", () => {
			this.checkLayout(this.getKey());
		});

		grid.bindEvent("onChangeField", () => {
			this.checkLayout(this.getKey());
		});

		this.append(grid);
	}

	reloadGrid(): void {
		if (this.grid) {
			this.grid.load();
		}
	}

	override checkBeforeLeave(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			if (this.hyphenModel.hasChangedData()) {
				MessageBox.yesNoCancel(t("core-data:saveBtnTxt"), t("core-data:askSave"),
					() => {
						this.saveChanges();
						resolve(true);
					}, () => {
						this.hyphenModel.clear();
						resolve(true);
					}, () => {
						resolve(false);
					});
			} else
				resolve(true);
		});
	}

	newEmptyRow(): void {
		this.interceptor?.insertNewDataRow(this.hyphenModel.createNewRowData());
		this.reloadGrid();
	}
}