import { Action, AppHelper, Ibo } from '@web-nx/ibo-core';
import { Button, Combo, DdFieldSetGeneratorJquery, DdFieldSetGeneratorProfile, DdTableInfos } from "@web-nx/ibo-native-cmp";
import { t } from 'i18next';
import { CoreData } from "../../../CoreData";
import { PageKeys } from "../../../PageKeys";
import { SaveAsEntryAction } from '../../../action/detail/SaveAsEntryAction';
import { FieldInfoData } from "../../../responses/FieldInfoData";
import { InfoModelData } from "../../../responses/InfoModelData";
import { ValuesData } from "../../../responses/ValuesData";
import { NewEntryResponse } from "../../../responses/newEntryResponses/NewEntryResponse";
import { CustomPanel } from "../../CustomPanel";
import { InfoModel } from "../../model/InfoModel";
import { BasePage } from "../BasePage";
import { ModelData } from "../ModelData";
import { ModelObject } from "../ModelObject";
import './InfoPage.scss';

export class InfoPage extends BasePage {

	customPanel: CustomPanel | undefined;
	$fieldContainer: JQuery | null = null;
	infoModel!: InfoModel;

	/**
	 * Basisklasse für die Informationsseite
	 */
	constructor(modelList: NewEntryResponse) {
		super(PageKeys.INFO);
		this.addClass("infoPage flex1 flex");
		this.$fieldContainer = this.createDiv("detailFieldsetContainer  flex1");
		const $infoContainer = this.createDiv("infoContainer flex1 flex flexColumn");
		if (CoreData.getRights().isAllowDataBaseOption()) {
			$infoContainer.append(this.createToolbar());
			this.createCustomPanel();
		}
		$infoContainer.append(this.$fieldContainer);
		this.append($infoContainer);
		this.load(modelList.infoModel);
	}

	/**
	 * Lädt Feldinformationen
	 */
	override load(data: InfoModelData) {
		this.infoModel = new InfoModel(data);
		this.createFieldSet(() => {
			this.loadData();
		});
	}

	onSaveAsNewDetail(id: string, callback: (newEntry: NewEntryResponse) => void): void {
		const changedValues = this.infoModel?.getChangedValues();
		const additionalModel = this.getAdditionalModel();
		const additionalChangesValues: ValuesData = additionalModel ? additionalModel.getChangedValues() : {};
		const tableName = CoreData.getTableOptionModel()?.getTableName();

		Ibo.actions.execute(new SaveAsEntryAction(),
			tableName,
			changedValues,
			additionalChangesValues,
			id,
			(data: NewEntryResponse) => {
				callback(data);
			}
		);
	}

	onCreateNewDetail(action: Action, callback: (newEntry: NewEntryResponse) => void): void {
		const changedValues = this.infoModel?.getChangedValues();
		const additionalModel = this.getAdditionalModel();
		const additionalChangesValues: ValuesData = additionalModel ? additionalModel.getChangedValues() : {};
		const tableName = CoreData.getTableOptionModel()?.getTableName();

		Ibo.actions.execute(action,
			tableName,
			changedValues,
			additionalChangesValues,
			(data: NewEntryResponse) => {
				callback(data);
			}
		);
	}

	/**
	 * Wenn Speichern-Schalfläche gedrückt wird.
	 * @abstract
	 */
	onSaveCustomPanel() {
		this.createFieldSet(() => {
			this.loadData();
		});
	}

	/**
	 * Erstellt eine Toolbar
	 */
	private createToolbar() {
		const toolbar = this.create("div", "toolbar flex0 flex");
		toolbar.append(this.createCustomizeBtn());
		return toolbar;
	}

	/**
	 * Erstellt Schaltfläche zum anpassen von Feldern
	 */
	private createCustomizeBtn() {
		const customizeBtn = new Button(t("core-data:customizeBtnText"), "fa fa-cog");

		customizeBtn.addClass("customizeBtn");
		customizeBtn.bindClick(() => {
			this.customPanel?.refresh();
			this.showCustomPanel();
		});
		return customizeBtn.getEl();
	}

	/**
	 * Erstellt Panel zum editieren von Feldern.
	 */
	private createCustomPanel() {
		const customPanel = new CustomPanel();

		customPanel.setIdent(`CoreData_${CoreData.getTableOptionModel()?.getTableName()}`);
		this.customPanel = customPanel;
		customPanel.addClass("right");
		customPanel.addClass("flex flexColumn");
		customPanel.getEl().on("close", () => {
			this.hideCustomPanel();
		});
		customPanel.getEl().on("save", () => {
			this.onSaveCustomPanel();
			this.hideCustomPanel();
		});
		this.append(this.customPanel);
	}

	/**
	 * Zeigt das Custom-Panel an.
	 */
	private showCustomPanel() {
		this.customPanel?.removeClass("right");
	}

	/**
	 * Versteckt das Custom-Panel.
	 */
	private hideCustomPanel() {
		this.customPanel?.addClass("right");
	}

	/**
	 * Erstellt Felder
	 */
	createFieldSet(callback: () => void) {
		const mainView = CoreData,
			mask = mainView.createMask(this, t("core-data:loadFieldSettingsMaskText")),
			ident = `CoreData_${mainView.getTableOptionModel()?.getTableName()}`;

		return DdTableInfos.getFieldSettingByIdent(ident, true).then((settings) => {
			this.gen = new DdFieldSetGeneratorJquery(settings, (info: FieldInfoData) => {
				return this.isFieldReadOnly(info.ident);
			}, new DdFieldSetGeneratorProfile(AppHelper.getUserProfileStore(), ident));

			this.setFieldFilter();
			this.gen.bindChangeFunc((value: string, fld: FieldInfoData) => {
				this.infoModel?.setValue(value, fld);
			});
			if (!this.isFieldReadOnly())
				this.createAlternativeInputElements();

			this.$fieldContainer?.empty();
			this.$fieldContainer?.append(this.gen.getEl());
			if (callback)
				callback();
			return null;
		}).finally(() => {
			mask.remove();
		});
	}

	/**
	 * Lädt Daten
	 */
	loadData() {
		const data = this.infoModel.getData(),
			mainRec = this.infoModel.getMainRec(),
			textRec = this.infoModel.getMainTextRec();

		this.gen?.mapFields((info: FieldInfoData, $field: JQuery, input: any) => {
			const key = info.ident.toLowerCase();

			if ((data as any)[info.source] && (data as any)[info.source][key]) {
				const field = (data as any)[info.source][key];
				return {
					rawValue: field.rawValue,
					displayValue: field.displayValue
				};
			} else {
				if (this.isCombo(info) && !this.isFieldReadOnly()) {
					input.select(mainRec[key]);
					return null;
				}
				return {
					rawValue: mainRec[key],
					displayValue: textRec[key]
				};

			}
		});
	}

	/**
	 * Filter für Felder setzen.
	 * @virtual
	 */
	protected setFieldFilter() {
		return;
	}

	protected isCombo(info: FieldInfoData) {
		return false;
	}

	protected createAlternativeInputElements() {
		return;
	}

	protected isFieldReadOnly(ident?: string) {
		const model = CoreData.getTableOptionModel();

		if (model == null) {
			return true;
		}

		return CoreData.getRights().isTableReadOnly(model.getTableName());
	}

	protected createFieldSetCombo(info: FieldInfoData) {
		const combo = new Combo();

		combo.removeClass("inlineFlex");
		combo.addClass("flex");
		combo.bindLiveEvents((value: string) => {
			this.infoModel?.setValue(value, info);
		});
		return combo;
	}

	override getModelInfo(): ModelData {
		return {
			modelName: "infoModel",
			model: this.infoModel
		};
	}

	override getModel() {
		return this.infoModel;
	}

	/**
	 * Gibt zusätzliches Model zurück
	 * @virtual
	 */
	override getAdditionalModel(): null | ModelObject {
		return null;
	}

	protected override getCaption(): string {
		return t("core-data:informationTxt");
	}
}