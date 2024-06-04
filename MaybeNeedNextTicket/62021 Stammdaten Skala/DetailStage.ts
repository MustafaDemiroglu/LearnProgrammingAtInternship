import { Ext, Ibo } from '@web-nx/ibo-core';
import { BaseNavigation, BottomNavigation, Button, Component, DropDownButton, LoadingMask, Menu, MessageBox, ReferenceAnalysisButton, SideNavigation, Toolbar, Window } from "@web-nx/ibo-native-cmp";
import { t } from 'i18next';
import { CoreData } from "../CoreData";
import { PageKeys } from "../PageKeys";
import { TableKeys } from "../TableKeys";
import { LoadDetailAction } from "../action/detail/LoadDetailAction";
import { NewAndCreateDetailAction } from "../action/detail/NewAndCreateDetailAction";
import { NewDetailAction } from "../action/detail/NewDetailAction";
import { SaveAction } from "../action/detail/SaveAction";
import { ShowPagesResponse } from "../responses/ShowPagesResponse";
import { ValuesData } from "../responses/ValuesData";
import { NewEntryResponse } from "../responses/newEntryResponses/NewEntryResponse";
import './DetailStage.scss';
import { ElementBrickFilterPage } from './elementBrick/ElementBrickFilterPage';
import { ElementBrickTextPage } from './elementBrick/ElementBrickTextPage';
import { InfoModel } from "./model/InfoModel";
import { BasePage } from "./pages/BasePage";
import { BatchCfgDetailPage } from './pages/BatchCfgDetailPage';
import { CheckCatalogPage } from './pages/CheckCatalogPage';
import { EvalCritExpPage } from './pages/EvalCritExpPage';
import { FlowProfPage } from './pages/FlowProfPage';
import { FlowProfRightsPage } from './pages/FlowProfRightsPage';
import { LinkPage } from './pages/LinkPage';
import { MailListPage } from './pages/MailListPage';
import { SkalaAnfPage } from './pages/SkalaAnfPage';
import { SkalaElePage } from './pages/SkalaElePage';
import { TableBrickFilterPage } from './pages/TableBrickFilterPage';
import { TableBrickPage } from './pages/TableBrickPage';
import { TextBrickPage } from './pages/TextBrickPage';
import { WorkflowHistPage } from './pages/WorkflowHistPage';
import { ExecuteConfigurationPage } from "./pages/info/ExecuteConfigurationPage";
import { FlowProfInfoPage } from "./pages/info/FlowProfInfoPage";
import { ImagePage } from "./pages/info/ImagePage";
import { InfoPage } from "./pages/info/InfoPage";
import { MailTmplInfoPage } from './pages/info/MailTmplInfoPage';
import { RiskControlPage } from "./pages/info/RiskControlPage";
import { TableBrickInfoPage } from "./pages/info/TableBrickInfoPage";
import { TextBrickInfoPage } from "./pages/info/TextBrickInfoPage";
import { SaveAsDialog } from './window/SaveAsDialog';

export class DetailStage extends Component {

	pageList: BasePage[] = [];
	$pageContainer: JQuery | null = null;
	$viewContainer: JQuery | null = null;
	saveEntry: Button | null = null;
	saveAsEntryBtn: DropDownButton | null = null;
	newConfirmEntry: Button | null = null;
	newEntry: Button | null = null;
	navigation: BaseNavigation | null = null;
	toolbar: Toolbar | null = null;
	modelList: NewEntryResponse | null = null;

	/**
	 * Klasse für die Detail Stage
	 */
	constructor() {
		super(Component.create("div", "stage detailStage right flex"));
		this.$viewContainer = this.createDiv("viewContainer flex flexColumn flex1");
		this.append(this.$viewContainer);
	}

	load(id: string | null, callback: () => void): void {
		this.checkVisiblePages(() => {
			this.loadData(id, () => {
				this.createView();
				this.updateDataNameInNavbar();
				if (callback)
					callback();
			});
		});
	}

	checkVisiblePages(callback: () => void): void {
		CoreData.serverRequest("SdmManager_ShowPages", {
			tableName: CoreData.getTableOptionModel()?.getTableName()
		}).then((response: ShowPagesResponse) => {
			CoreData.getTableOptionModel()?.setLinkPageVisible(response.showLinkPage);
			CoreData.getTableOptionModel()?.setShowWorkflowHistoryPage(response.showWorkflowHistoryPage);
			CoreData.getTableOptionModel()?.setCheckCatalogPageVisible(response.showCheckCatalogPage);
			CoreData.getTableOptionModel()?.setMailListPageVisible(response.showMailListPage);
			CoreData.getTableOptionModel()?.setTextBrickPageVisible(response.showTextBrickPage);
			CoreData.getTableOptionModel()?.setTableBrickFldPageVisible(response.showTableBrickFldPage);
			CoreData.getTableOptionModel()?.setTableBrickFilterPageVisible(response.showTableBrickFilterPage);
			CoreData.getTableOptionModel()?.setFlowProfPageVisible(response.showFlowProfPage);
			CoreData.getTableOptionModel()?.setEvalCritExpPageVisible(response.showEvalCritExpPage);
			CoreData.getTableOptionModel()?.setShowBatchCfgDetailPage(response.showBatchCfgDetailPage);
			CoreData.getTableOptionModel()?.setShowElementBrickPages(response.showElementBrickPages);
			CoreData.getTableOptionModel()?.setShowSkalaPages(response.showSkalaPages);
			callback();
		});
	}

	private refreshView(data: NewEntryResponse) {
		this.modelList = data;
		this.createView();
		this.updateDataNameInNavbar();
	}

	updateDataNameInNavbar() {
		const navBar = CoreData.getNavbar();

		navBar.emptyContentArea();
		navBar.addLevel(CoreData.getTableCaption(CoreData.getTableOptionModel()?.getTableName()) ?? "", () => {
			CoreData.appRouter.navigate("search/"
				+ CoreData.getTableOptionModel()?.getTableName(), true);
		});
		navBar.addLevel((this.getPage(PageKeys.INFO) as InfoPage).getModel().getText(), () => { });

		const breadcrumbs = [
			{
				text: CoreData.getTableCaption(CoreData.getTableOptionModel()?.getTableName()) ?? "",
				callback: () => {
					CoreData.appRouter.navigate("search/"
						+ CoreData.getTableOptionModel()?.getTableName(), true);
				}
			}, {
				text: (this.getPage(PageKeys.INFO) as InfoPage).getModel().getText(),
				callback: () => { }
			}
		];
		CoreData.navbar.setBreadCrumbs(breadcrumbs);
	}

	private createView(): void {
		this.pageList = [];
		this.$viewContainer?.empty();
		if (this.navigation)
			this.navigation.remove();
		this.createNavigation();
		this.createPages();
		this.createToolbar();
	}

	private createNavigation(): void {
		if (CoreData.getIsMobile()) {
			this.navigation = new BottomNavigation();
			this.addClass("flexColumn");
			this.append(this.navigation.getEl());
		} else {
			this.navigation = new SideNavigation();
			this.prepend(this.navigation.getEl());
		}
	}

	private createPages(): void {
		const pageKeys = PageKeys;

		this.$pageContainer = this.create("div", "pageContainer flex flex1");

		this.createInfoPage();
		if (CoreData.getTableOptionModel()?.getLinkPageVisible()) {
			this.createPatternOfAdditionalPages(t("core-data:linkText"), LinkPage, PageKeys.LINK, "fas fa-link");
		}
		if (CoreData.getTableOptionModel()?.getShowWorkflowHistoryPage()) {
			this.createPatternOfAdditionalPages(t("core-data:workflowHistoryText"), WorkflowHistPage, PageKeys.WORKFLOWHIST, "fas fa-history");
		}
		if (CoreData.getTableOptionModel()?.getCheckCatalogPageVisible()) {
			this.createPatternOfAdditionalPages(t("core-data:putTogetherCut"), CheckCatalogPage, pageKeys.CHECKCATALOG, "fas fa-stream");
		}
		if (CoreData.getTableOptionModel()?.getMailListPageVisible()) {
			this.createPatternOfAdditionalPages(t("core-data:targetGroupText"), MailListPage, pageKeys.MAILLIST, "fas fa-envelope-open-text");
		}
		if (CoreData.getTableOptionModel()?.getTextBrickPageVisible())
			this.createPatternOfAdditionalPages(t("core-data:textPageText"), TextBrickPage, pageKeys.TEXTBRICK, "fas fa-file-code");
		if (CoreData.getTableOptionModel()?.getTableBrickFldPageVisible())
			this.createPatternOfAdditionalPages(t("core-data:fieldPageText"), TableBrickPage, pageKeys.TBLBRICK, "fas fa-table");
		if (CoreData.getTableOptionModel()?.getTableBrickFilterPageVisible())
			this.createPatternOfAdditionalPages(t("core-data:filterPageText"), TableBrickFilterPage, pageKeys.TBLBRICKFILTER, "fas fa-filter");
		if (CoreData.getTableOptionModel()?.getFlowProfPageVisible()) {
			this.createPatternOfAdditionalPages(t("core-data:flowProfOptions"), FlowProfPage, pageKeys.FLOWPROF, "fas fa-stream");
			this.createPatternOfAdditionalPages(t("core-data:flowProfRightsText"), FlowProfRightsPage, pageKeys.FLOWPROFRIGHTS, "fas fa-user-shield");
		}
		if (CoreData.getTableOptionModel()?.getEvalCritExpPageVisible())
			this.createPatternOfAdditionalPages(t("core-data:expression"), EvalCritExpPage, pageKeys.EVALCRITEXP, "fas fa-list");

		if (CoreData.getTableOptionModel()?.getShowBatchCfgDetailPage())
			this.createPatternOfAdditionalPages(t("core-data:fields"), BatchCfgDetailPage, pageKeys.BATCHCFGDETAIL, "fas fa-list");

		if (CoreData.getTableOptionModel()?.getShowElementBrickPages()) {
			this.createPatternOfAdditionalPages(t("core-data:template"), ElementBrickTextPage, pageKeys.ELEMENTBRICKTEXT, "fas fa-file-code");
			this.createPatternOfAdditionalPages(t("core-data:filterAndSortPageText"), ElementBrickFilterPage, pageKeys.ELEMENTBRICKFILTER, "fas fa-filter");
		}

		if (CoreData.getTableOptionModel()?.getShowSkalaPages()) {
			this.createPatternOfAdditionalPages(t("core-data:skalaEleTxt"), SkalaElePage, pageKeys.SKALAELEPAGE, "fas fa-list");
			this.createPatternOfAdditionalPages(t("core-data:skalaAnfTxt"), SkalaAnfPage, pageKeys.SKALAANFPAGE, "fas fa-drafting-compass");
		}

		this.$viewContainer?.append(this.$pageContainer);
	}

	private createPatternOfAdditionalPages(label: string, pageClass: any, key: string, icon: string): void {
		this.navigation?.addEntry(key, label, label, icon);
		if (this.getCurrentId()) {
			const page = new pageClass(this.modelList);
			if (page != null)
				this.appendPage(page);
		} else {
			this.navigation?.disableEntry(key, true);
		}
	}

	private createInfoPage(): void {
		if (this.modelList != null) {
			switch (CoreData.getTableOptionModel()?.getTableName()) {
				case TableKeys.BILD:
					this.appendPage(new ImagePage(this.modelList));
					break;
				case TableKeys.FINSTCFG:
					this.appendPage(new ExecuteConfigurationPage(this.modelList));
					break;
				case TableKeys.RISKCONTROL:
					this.appendPage(new RiskControlPage(this.modelList));
					break;
				case TableKeys.HTMLTXTBRICK:
					this.appendPage(new TextBrickInfoPage(this.modelList));
					break;
				case TableKeys.FLOWTBLBRICKS:
					this.appendPage(new TableBrickInfoPage(this.modelList));
					break;
				case TableKeys.FLOWPROF:
					this.appendPage(new FlowProfInfoPage(this.modelList));
					break;
				case TableKeys.MAILTMPL:
					this.appendPage(new MailTmplInfoPage(this.modelList));
					break;
				default:
					this.appendPage(new InfoPage(this.modelList));
			}
		}
		this.navigation?.addEntry(PageKeys.INFO, t("core-data:informationTxt"), t("core-data:informationTxt"), "fas fa-info");
	}

	private appendPage(page: BasePage): void {
		page.hide();
		this.pageList.push(page);
		this.$pageContainer?.append(page.getEl());
	}

	showPage(key: string): void {
		for (let i = 0; i < this.pageList.length; i++) {
			const page = this.pageList[i];
			if (page.getKey() === key) {
				page.show();
				this.navigation?.updateSelection(key);
				if (page.refresh)
					page.refresh();
				page.updateToolbar();
			} else {
				page.getEl().hide();
			}
		}
	}

	private loadData(id: string | null, callback: () => void): void {
		Ibo.actions.execute(new LoadDetailAction(), id, (modelList: NewEntryResponse) => {
			this.modelList = modelList;
			callback();
		});
	}

	private createToolbar(): void {
		const btnList: Button[] = [];
		const closeBtn = new Button(null, "fas fa-times", false);
		const toolbar = new Toolbar();
		const tableOptionModel = CoreData.getTableOptionModel();

		if (tableOptionModel != null) {
			const tableName = tableOptionModel.getTableName();
			const readOnly = CoreData.getRights().isTableReadOnly(tableName);

			closeBtn.title(t("core-data:closeBtnText"));

			this.toolbar = toolbar;
			if (CoreData.getRights().isHasEvaluationRole()) {
				if (CoreData.isReferenceAnalysisPossible(tableName ?? "")) {
					if (this.getCurrentId()) {
						this.createReferenceAnalysisBtn(btnList);
					}
				}
			}

			if (!readOnly) {
				if (this.getCurrentId()) {
					this.createSaveActionButton(btnList);
					this.createSaveAsEntryButton(btnList);
				} else {
					this.createNewActionButtons(btnList);
				}
			}

			closeBtn.bindClick(() => {
				let modelsModified = false;

				this.pageList.forEach((page) => {
					const saveInfo = page.getModelInfo();
					const additionalModel = page.getAdditionalModel();

					if ((saveInfo && (!$.isEmptyObject(saveInfo.model.getChangedValues()) || Array.isArray(saveInfo.model.getChangedValues())))
						|| (additionalModel && !$.isEmptyObject(additionalModel.getChangedValues()))) {
						modelsModified = true;
					}

					/*

					if (saveInfo != null) {
						const model = saveInfo.model;

						if (model instanceof SkalaModel) {

							if (model.modified)
								modelsModified = model.modified;
						}

					}

					*/

					/*
					if (saveInfo) {
						const skalaSaveInfo = new SkalaModel(saveInfo);
						if (skalaSaveInfo.modified) {
							modelsModified = true;
						}
					}

					if (additionalModel) {
						const skalaAdditionalModel = new SkalaModel(additionalModel);
						if (skalaAdditionalModel.modified) {
							modelsModified = true;
						}
					}
					*/

				});
				if (modelsModified) {
					MessageBox.yesNoCancel(t("core-data:saveBtnTxt"), t("core-data:askSave"), () => {
						this.saveModels(false, () => {
							this.navigateToSearchStage(tableName);
						});
					}, () => {
						this.navigateToSearchStage(tableName);
					}, () => { });
				} else {
					this.navigateToSearchStage(tableName);
				}
			});
			btnList.push(closeBtn);
			this.toolbar.fillRightContainer(btnList);
			this.$viewContainer?.prepend(toolbar.getEl());
		}
	}

	private createSaveAsEntryButton(btnList: Button[]): void {
		const saveAsEntryDropDown = new DropDownButton("", "", false, false);

		saveAsEntryDropDown.bindEvent("fillMenu", ($sender: JQuery, e: Event, window: Window) => {
			const menu = new Menu();
			const $saveAsEntry = menu.createMenuEntryWithClick(t("core-data:saveAsText"), "fas fa-save", () => {
				window.destroy();
				this.createSaveAsEntryDialog($saveAsEntry);
			});

			$saveAsEntry.attr("title", t("core-data:saveAsText"));
			window.append(menu);
		});

		btnList.push(saveAsEntryDropDown);
		this.saveAsEntryBtn = saveAsEntryDropDown;
	}

	private createSaveAsEntryDialog($entry: JQuery<HTMLElement>): void {
		const infoModel = this.getInfoModel();
		const callback = (): void => {
			(this.getPage(PageKeys.INFO) as InfoPage).onSaveAsNewDetail(infoModel.getId(), (data: NewEntryResponse) => {
				this.refreshView(data);
				CoreData.reloadSearchStageGrid();
				CoreData.appRouter.navigate(`entry/${CoreData.getTableOptionModel()?.getTableName()}/${this.getCurrentId()}/${PageKeys.INFO}`, true);
			});
		};

		new SaveAsDialog($entry, infoModel, callback);
	}

	saveExistingEntry(): void {
		this.saveModels(true, () => {
			CoreData.appRouter.navigate(Ext.util.History.getToken(), true);
		});
	}

	saveNewEntry(): void {
		(this.getPage(PageKeys.INFO) as InfoPage)?.onCreateNewDetail(new NewDetailAction(), (data: any) => {
			this.refreshView(data);
			CoreData.reloadSearchStageGrid();
			CoreData.appRouter.navigate(`entry/${CoreData.getTableOptionModel()?.getTableName()}/${this.getCurrentId()}/${PageKeys.INFO}`, true);
		});
	}

	private navigateToSearchStage(tableName: string | undefined): void {
		if (tableName === TableKeys.FIRMA)
			CoreData.appRouter.navigateToHome();
		else
			CoreData.appRouter.navigate(`search/${tableName}`, true);
	}

	private createSaveActionButton(btnList: Button[]): void {
		const saveBtn = new Button(null, "fas fa-save", false);

		saveBtn.title(t("core-data:saveBtnTxt"));
		saveBtn.bindClick(() => {
			this.saveExistingEntry();
		});
		btnList.push(saveBtn);
		this.saveEntry = saveBtn;
	}

	private createNewActionButtons(btnList: Button[]): void {
		const newBtn = new Button(t("core-data:saveBtnTxt"), "fas fa-save", false);
		const newConfirmBtn = new Button(t("core-data:createNewConfirm"), "fas fa-plus", false);

		newBtn.bindClick(() => {
			(this.getPage(PageKeys.INFO) as InfoPage)?.onCreateNewDetail(new NewDetailAction(), (data: NewEntryResponse) => {
				this.refreshView(data);
				CoreData.reloadSearchStageGrid();
				CoreData.appRouter.navigate(`entry/${CoreData.getTableOptionModel()?.getTableName()}/${this.getCurrentId()}/${PageKeys.INFO}`, true);
			});
		});
		btnList.push(newBtn);

		newConfirmBtn.bindClick(() => {
			(this.getPage(PageKeys.INFO) as InfoPage).onCreateNewDetail(new NewAndCreateDetailAction(), (data: NewEntryResponse) => {
				this.refreshView(data);
				CoreData.reloadSearchStageGrid();
				CoreData.appRouter.navigate(`entry/${CoreData.getTableOptionModel()?.getTableName()}/{0}/${PageKeys.INFO}`, true);
			});
		});
		btnList.push(newConfirmBtn);

		this.newEntry = newBtn;
		this.newConfirmEntry = newConfirmBtn;
	}

	/**
	 * Speichert alle Models, die über die Speichern-Schaltfläche gespeichert werden.
	 */
	private saveModels(refresh: boolean, callback: () => void): void {
		const values: ValuesData = {};
		let dataHasChanged = false;

		this.pageList.forEach((page) => {
			const saveInfo = page.getModelInfo(),
				additionalModel = page.getAdditionalModel();

			if (saveInfo)
				values[saveInfo.modelName] = saveInfo.model.getChangedValues();
			if (additionalModel)
				values["additionalValues"] = additionalModel.getChangedValues();
		});

		for (const model in values) {
			if (values[model] !== null) {
				if (Object.keys(values[model]).length > 0) {
					dataHasChanged = true;
				}
			}
		}
		if (dataHasChanged) {
			Ibo.actions.execute(new SaveAction(), values, (data: NewEntryResponse) => {
				if (refresh)
					this.refreshView(data);

				CoreData.reloadSearchStageGrid();
				CoreData.getSearchStage().updateItemLabel(this.getCurrentId(), this.getInfoModel().getText());

				if (callback)
					callback();
			});
		}
	}

	getPage(key: string) {
		for (let i = 0; i < this.pageList.length; i++) {
			const page = this.pageList[i];
			if (page.getKey() === key)
				return page;
		}
		return null;
	}

	getModelList(): NewEntryResponse | null {
		return this.modelList;
	}

	getCurrentId() {
		if (this.getPage(PageKeys.INFO)) {
			return this.getInfoModel()?.getId();
		} else {
			return null;
		}
	}

	getInfoModel<T extends InfoModel>(): T {
		return (this.getPage(PageKeys.INFO) as InfoPage).getModel() as T;
	}

	setLoadingMode(maskText: string) {
		this.disableNavButtons(true);
		return CoreData.createMask(this.$pageContainer, maskText);
	}

	unsetLoadingMode(mask: LoadingMask) {
		this.disableNavButtons(false);
		mask.remove();
	}

	disableNavButtons(disabled: boolean) {
		if (this.newEntry)
			this.newEntry.disabled(disabled);

		if (this.newConfirmEntry)
			this.newConfirmEntry.disabled(disabled);

		if (this.saveEntry)
			this.saveEntry.disabled(disabled);

		if (this.saveAsEntryBtn)
			this.saveAsEntryBtn.disabled(disabled);
	}

	getToolbar() {
		return this.toolbar;
	}

	cleanUpInfoModel() {
		if (this.getPage(PageKeys.INFO))
			this.getInfoModel().setData(null);
	}

	createReferenceAnalysisBtn(btnList: Button[]) {
		const tableName = CoreData.getTableOptionModel()?.getTableName(),
			refBtn = new ReferenceAnalysisButton((tableName ?? ""), () => {
				return this.getCurrentId();
			});
		btnList.push(refBtn);
	}
} 