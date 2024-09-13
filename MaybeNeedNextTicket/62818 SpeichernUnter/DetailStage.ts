import { Ext, Ibo } from '@web-nx/ibo-core';
import { BaseNavigation, BottomNavigation, Button, Component, DropDownButton, GetRemarkDialog, LoadingMask, Menu, MessageBox, ReferenceAnalysisButton, SideNavigation, Toolbar, Window } from "@web-nx/ibo-native-cmp";
import { t } from 'i18next';
import { CoreData } from "../CoreData";
import { PageKeys } from "../PageKeys";
import { TableKeys } from "../TableKeys";
import { LoadDetailAction } from "../action/detail/LoadDetailAction";
import { NewAndCreateDetailAction } from "../action/detail/NewAndCreateDetailAction";
import { NewDetailAction } from "../action/detail/NewDetailAction";
import { SaveAction } from "../action/detail/SaveAction";
import { SaveAsEntryAction } from '../action/detail/SaveAsEntryAction';
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
import { UserCalcFieldPage } from './pages/UserCalcFieldPage';
import { WorkflowHistPage } from './pages/WorkflowHistPage';
import { ExecuteConfigurationPage } from "./pages/info/ExecuteConfigurationPage";
import { FlowProfInfoPage } from "./pages/info/FlowProfInfoPage";
import { ImagePage } from "./pages/info/ImagePage";
import { InfoPage } from "./pages/info/InfoPage";
import { MailTmplInfoPage } from './pages/info/MailTmplInfoPage';
import { RiskControlPage } from "./pages/info/RiskControlPage";
import { TableBrickInfoPage } from "./pages/info/TableBrickInfoPage";
import { TextBrickInfoPage } from "./pages/info/TextBrickInfoPage";
import { UserCalcFieldInfoPage } from './pages/info/UserCalcFieldInfoPage';

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
	currentPageKey?: string;

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
			CoreData.getTableOptionModel()?.setShowUserCalcFieldPage(response.showUserCalcFieldPage);
			callback();
		});
	}

	private refreshView(data: NewEntryResponse): void {
		this.modelList = data;
		this.createView();
		this.updateDataNameInNavbar();
	}

	updateDataNameInNavbar(): void {
		const navBar = CoreData.getNavbar();

		navBar.emptyContentArea();
		navBar.addLevel(CoreData.getTableCaption(CoreData.getTableOptionModel()?.getTableName()) ?? "", () => {
			CoreData.appRouter.navigate("search/"
				+ CoreData.getTableOptionModel()?.getTableName(), true);
		});

		const infoPage = this.getPage(PageKeys.INFO) as InfoPage;
		navBar.addLevel(infoPage.getModel()?.getText() ?? "", () => { });

		const breadcrumbs = [
			{
				text: CoreData.getTableCaption(CoreData.getTableOptionModel()?.getTableName()) ?? "",
				callback: (): void => {
					CoreData.appRouter.navigate("search/"
						+ CoreData.getTableOptionModel()?.getTableName(), true);
				}
			}, {
				text: infoPage.getModel()?.getText() ?? "",
				callback: (): void => { }
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
		this.$pageContainer = this.create("div", "pageContainer flex flex1");

		this.createInfoPage();
		if (CoreData.getTableOptionModel()?.getLinkPageVisible()) {
			this.createPatternOfAdditionalPages(t("core-data:linkText"), LinkPage, PageKeys.LINK, "fas fa-link");
		}
		if (CoreData.getTableOptionModel()?.getShowWorkflowHistoryPage()) {
			this.createPatternOfAdditionalPages(t("core-data:workflowHistoryText"), WorkflowHistPage, PageKeys.WORKFLOWHIST, "fas fa-history");
		}
		if (CoreData.getTableOptionModel()?.getCheckCatalogPageVisible()) {
			this.createPatternOfAdditionalPages(t("core-data:putTogetherCut"), CheckCatalogPage, PageKeys.CHECKCATALOG, "fas fa-stream");
		}
		if (CoreData.getTableOptionModel()?.getMailListPageVisible()) {
			this.createPatternOfAdditionalPages(t("core-data:targetGroupText"), MailListPage, PageKeys.MAILLIST, "fas fa-envelope-open-text");
		}
		if (CoreData.getTableOptionModel()?.getTextBrickPageVisible())
			this.createPatternOfAdditionalPages(t("core-data:textPageText"), TextBrickPage, PageKeys.TEXTBRICK, "fas fa-file-code");
		if (CoreData.getTableOptionModel()?.getTableBrickFldPageVisible())
			this.createPatternOfAdditionalPages(t("core-data:fieldPageText"), TableBrickPage, PageKeys.TBLBRICK, "fas fa-table");
		if (CoreData.getTableOptionModel()?.getTableBrickFilterPageVisible())
			this.createPatternOfAdditionalPages(t("core-data:filterPageText"), TableBrickFilterPage, PageKeys.TBLBRICKFILTER, "fas fa-filter");
		if (CoreData.getTableOptionModel()?.getFlowProfPageVisible()) {
			this.createPatternOfAdditionalPages(t("core-data:flowProfOptions"), FlowProfPage, PageKeys.FLOWPROF, "fas fa-stream");
			this.createPatternOfAdditionalPages(t("core-data:flowProfRightsText"), FlowProfRightsPage, PageKeys.FLOWPROFRIGHTS, "fas fa-user-shield");
		}
		if (CoreData.getTableOptionModel()?.getEvalCritExpPageVisible())
			this.createPatternOfAdditionalPages(t("core-data:expression"), EvalCritExpPage, PageKeys.EVALCRITEXP, "fas fa-list");

		if (CoreData.getTableOptionModel()?.getShowBatchCfgDetailPage())
			this.createPatternOfAdditionalPages(t("core-data:fields"), BatchCfgDetailPage, PageKeys.BATCHCFGDETAIL, "fas fa-list");

		if (CoreData.getTableOptionModel()?.getShowElementBrickPages()) {
			this.createPatternOfAdditionalPages(t("core-data:template"), ElementBrickTextPage, PageKeys.ELEMENTBRICKTEXT, "fas fa-file-code");
			this.createPatternOfAdditionalPages(t("core-data:filterAndSortPageText"), ElementBrickFilterPage, PageKeys.ELEMENTBRICKFILTER, "fas fa-filter");
		}

		if (CoreData.getTableOptionModel()?.getShowSkalaPages()) {
			this.createPatternOfAdditionalPages(t("core-data:skalaEleTxt"), SkalaElePage, PageKeys.SKALAELEPAGE, "fas fa-list");
			this.createPatternOfAdditionalPages(t("core-data:skalaAnfTxt"), SkalaAnfPage, PageKeys.SKALAANFPAGE, "fas fa-drafting-compass");
		}

		if (CoreData.getTableOptionModel()?.getShowUserCalcFieldPage())
			this.createPatternOfAdditionalPages(t("core-data:userCalcFieldTxt"), UserCalcFieldPage, PageKeys.USERCALCFIELD, "fas fa-calculator");

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
				case TableKeys.USERCALCFIELD:
					this.appendPage(new UserCalcFieldInfoPage(this.modelList));
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

	showPage(key: string, extraParam?: string): void {
		this.currentPageKey = key;
		for (let i = 0; i < this.pageList.length; i++) {
			const page = this.pageList[i];
			if (page.getKey() === key) {
				page.show();
				this.navigation?.updateSelection(key);
				if (page.refresh)
					page.refresh(extraParam);
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
		const btnList: (Button | JQuery)[] = [];
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
						btnList.push(toolbar.createSeperator());
					}
				}
			}

			if (!readOnly) {
				if (this.getCurrentId()) {
					this.createSaveActionButton(btnList);
					if (!this.invalidTableNamesToUseSaveAs.has(tableName)) {
						this.createSaveAsEntryButton(btnList);
					}
				} else {
					this.createNewActionButtons(btnList);
				}
			}

			closeBtn.bindClick(() => {
				const [modelsModified] = this.checkPageChanges();
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

	private invalidTableNamesToUseSaveAs: Set<string> = new Set<string>([
		"FKTTYP",
		"ORGATTR",
		"PBALTST",
		"PBATTR",
		"PBINSTITUTE",
		"PBKSTST",
		"PBTREIBER",
		"FKTBIV",
		"GVPIV",
		"STBIV",
		"MA"
	]);

	private createSaveAsEntryButton(btnList: (Button | JQuery)[]): void {
		const saveAsEntryDropDown = new DropDownButton("", "", false, false);
		saveAsEntryDropDown.getEl().addClass("saveAsEntryButton");

		saveAsEntryDropDown.bindEvent("fillMenu", ($sender: JQuery, e: Event, window: Window) => {
			const menu = new Menu();
			const $saveAsEntry = menu.createMenuEntryWithClick(t("core-data:saveAsText"), "fas fa-save", () => {
				window.destroy();
				this.createSaveAsEntryDialog();
			});

			$saveAsEntry.attr("title", t("core-data:saveAsText"));
			window.append(menu);
		});

		btnList.push(saveAsEntryDropDown);
		this.saveAsEntryBtn = saveAsEntryDropDown;
	}

	private createSaveAsEntryDialog(): void {
		const infoModel = this.getInfoModel();
		const originalName = infoModel.getText();
		let defaultName = originalName;

		const changedValues = infoModel.getChangedValues();
		if (changedValues && changedValues['txt'] && changedValues['txt'] !== originalName) {
			defaultName = changedValues['txt'];
		} else {
			defaultName += t("core-data:copySuffix");
		}

		const callback = (newName: string): void => {
			infoModel.setChangeValue('txt', newName);
			this.onSaveAsNewDetail(this.getInfoModel().getId(), (data: NewEntryResponse) => {
				this.refreshView(data);
				CoreData.reloadSearchStageGrid();
				CoreData.appRouter.navigate(`entry/${CoreData.getTableOptionModel()?.getTableName()}/${this.getCurrentId()}/${PageKeys.INFO}`, true);
			});
		};
		new GetRemarkDialog(t("core-data:saveAsText"), t("res-native-cmp-dialog:caption"), callback, defaultName, false);
	}

	onSaveAsNewDetail(id: string | null, callback: (newEntry: NewEntryResponse) => void): void {
		const tableName = CoreData.getTableOptionModel()?.getTableName();
		const [, values] = this.checkPageChanges();

		Ibo.actions.execute(new SaveAsEntryAction(),
			tableName,
			values,
			id,
			(data: NewEntryResponse) => {
				callback(data);
			}
		);
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

	private createSaveActionButton(btnList: (Button | JQuery)[]): void {
		const saveBtn = new Button(null, "fas fa-save", false);

		saveBtn.title(t("core-data:saveBtnTxt"));
		saveBtn.bindClick(() => {
			this.saveExistingEntry();
		});
		btnList.push(saveBtn);
		this.saveEntry = saveBtn;
	}

	private createNewActionButtons(btnList: (Button | JQuery)[]): void {
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
		const [dataHasChanged, values] = this.checkPageChanges();
		if (dataHasChanged) {
			Ibo.actions.execute(new SaveAction(), values, (data: NewEntryResponse) => {
				if (refresh)
					this.refreshView(data);

				CoreData.reloadSearchStageGrid();
				CoreData.getTreeStage().updateItemLabel(this.getCurrentId(), this.getInfoModel().getText());

				if (callback)
					callback();
			});
		}
	}

	checkPageChanges(): [boolean, ValuesData] {
		const values: ValuesData = {};
		let dataHasChanged = false;

		this.pageList.forEach((page) => {
			const saveInfo = page.getModelInfo(),
				additionalModel = page.getAdditionalModel();

			if (saveInfo) {
				values[saveInfo.modelName] = saveInfo.model?.getChangedValues();
			}
			if (additionalModel) {
				values["additionalValues"] = additionalModel.getChangedValues();
			}
		});

		for (const model in values) {
			// Wenn es keine Änderungen gibt, ist das Model null. An den Server muss dennoch ein leeres Object übertragen werden
			if (values[model] != null) {
				dataHasChanged = true;
			} else {
				values[model] = {};
			}
		}

		return [dataHasChanged, values];
	}

	getPage(key: string): BasePage | null {
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

	getCurrentId(): string | null {
		if (this.getPage(PageKeys.INFO)) {
			return this.getInfoModel()?.getId();
		} else {
			return null;
		}
	}

	getInfoModel<T extends InfoModel>(): T {
		return (this.getPage(PageKeys.INFO) as InfoPage).getModel() as T;
	}

	setLoadingMode(maskText: string): LoadingMask {
		this.disableNavButtons(true);
		return CoreData.createMask(this.$pageContainer, maskText);
	}

	unsetLoadingMode(mask: LoadingMask): void {
		this.disableNavButtons(false);
		mask.remove();
	}

	disableNavButtons(disabled: boolean): void {
		if (this.newEntry)
			this.newEntry.disabled(disabled);

		if (this.newConfirmEntry)
			this.newConfirmEntry.disabled(disabled);

		if (this.saveEntry)
			this.saveEntry.disabled(disabled);

		if (this.saveAsEntryBtn)
			this.saveAsEntryBtn.disabled(disabled);
	}

	getToolbar(): Toolbar | null {
		return this.toolbar;
	}

	cleanUpInfoModel(): void {
		const infoPage = this.getPage(PageKeys.INFO) as InfoPage;
		if (infoPage)
			infoPage.clearModel();
	}

	createReferenceAnalysisBtn(btnList: (Button | JQuery)[]): void {
		const tableName = CoreData.getTableOptionModel()?.getTableName(),
			refBtn = new ReferenceAnalysisButton((tableName ?? ""), () => {
				return this.getCurrentId();
			});
		btnList.push(refBtn);
	}
}