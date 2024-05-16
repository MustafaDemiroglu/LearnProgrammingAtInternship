import { Grid, GridFilterType, Textfield } from '@web-nx/ibo-native-cmp';
import { TableKeys } from '../../TableKeys';
import { GridParamsData } from './GridParamsData';
import { HyphenGridColumn } from './HyphenGridColumn';
import { HyphenInterceptor } from './HyphenInterceptor';
import { HyphenModel } from './HyphenModel';

export class HyphenImportDialogGrid extends Grid {

	searchInput: Textfield;
	hyphenModel: HyphenModel;
	override interceptor: HyphenInterceptor | undefined;

	constructor(searchInput: Textfield, hyphenModel: HyphenModel) {
		super("SdmManager_GetTableGridData", "CoreData_Grid_HYPHEN");
		this.searchInput = searchInput;
		this.hyphenModel = hyphenModel;
	}

	reloadColumns(): void {
		this.updateColumns();
	}

	override newColumn(fieldName: string, displayLabel: string, width: number, typeInfo: string, sorting: string, allowSort: boolean, allowFilter: boolean, colindex: number): HyphenGridColumn {
		return new HyphenGridColumn(fieldName, displayLabel, width, typeInfo, sorting, allowSort, allowFilter, colindex, (text, hyphen) => {
			this.onChangeField(text, hyphen);
		});
	}

	private onChangeField(txt: string, wordhyp: string): void {
		const id = this.getSelectedIDs()[0];

		this.hyphenModel.updateData(id, txt, wordhyp);
		this.interceptor?.updateEntry(id, txt, wordhyp);
		this.fireEvent("onChangeField");
	}

	protected override cellKeyEventForArrowLeft(event: KeyboardEvent, cmp: JQuery): void {
		if (document.activeElement?.nodeName !== "INPUT") {
			event.preventDefault();
			cmp.prev().trigger("focus");
		}
		event.stopPropagation();
	}

	protected override cellKeyEventForArrowRight(event: KeyboardEvent, cmp: JQuery): void {
		if (document.activeElement?.nodeName !== "INPUT") {
			event.preventDefault();
			cmp.next().trigger("focus");
		}
		event.stopPropagation();
	}

	protected override cellKeyEventForEnterButton(event: KeyboardEvent, cmp: JQuery): void {
		event.preventDefault();
		event.stopPropagation();
		cmp.find("input").trigger("focus");
	}

	protected override cellKeyEventForEscapeButton(event: KeyboardEvent, cmp: JQuery): void {
		event.preventDefault();
		event.stopPropagation();
		cmp.trigger("focus");
	}

	override getRow(index: number): any {
		const row = this.hyphenModel.getChangedData().find(x => x.ID === this.data[index].ID);

		if (row)
			return row;
		return super.getRow(index);
	}

	override getTableName(): string {
		return TableKeys.HYPHEN;
	}

	override getRequestParams(start: number, limit: number): GridParamsData {
		const params = super.getRequestParams.call(this, start, limit);

		params.tableName = this.getTableName();

		return params;
	}

	getSearchString(): string {
		return this.searchInput.val();
	}

	override fillFilters(filter: GridFilterType[]): void {
		const searchString = this.getSearchString();

		if (searchString != null) {
			filter.push({
				property: "TXT",
				value: searchString
			});
		}
		super.fillFilters.call(this, filter);
	}

	disableDeletedRows(): void {
		const deletedRowIds = this.hyphenModel.getItemsToDelete();
		this.eachItemByIdList(deletedRowIds, "ID", (gridRow) => {
			gridRow.disabled(true);
			gridRow.getEl().find("input").prop("disabled", true);
		});
	}

	override recycleRows(): void {
		super.recycleRows();
		this.disableDeletedRows();
	}

	override allowAttachFilter(): boolean {
		return false;
	}
}