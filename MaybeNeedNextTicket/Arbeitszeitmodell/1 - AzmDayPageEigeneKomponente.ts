import { Button, MessageBox, Toast, TogglePanel } from "@web-nx/ibo-native-cmp";
import { t } from "i18next";
import { CoreData } from "../../CoreData";
import { PageKeys } from "../../PageKeys";
import { AzmDayModelData } from "../../responses/AzmDayModelData";
import { TableKeys } from "../../TableKeys";
import { AzmDayModel } from "../model/AzmDayModel";
import './AzmDayPage.scss';
import { BasePage } from "./BasePage";
import { ModelData } from "./ModelData";

export class AzmDayPage extends BasePage {
	model!: AzmDayModel;
	scrollContainer: JQuery<HTMLElement> | null = null;
	selectedDayIndex = -1;
	weekCount = 1;

	/**
	  * Klasse für die Arbeitszeit-Seite
	  */
	constructor(data: AzmDayModelData) {
		super(PageKeys.AZMDAYPAGE);
		this.addClass("azmDayPage flex1 flex");
		this.scrollContainer = this.createDiv("scrollContainer flex1");
		this.append(this.scrollContainer);
		this.load(data);
	}

	override load(data: AzmDayModelData): void {
		this.model = new AzmDayModel(data);
		this.update();
	}

	update(): void {
		this.scrollContainer?.empty();

		const table = $("<table>").addClass("azmDayTable");
		const thead = $("<thead>").appendTo(table);

		const headerRow = $("<tr>").appendTo(thead);
		$("<th>").text("Kategorien").appendTo(headerRow);
		for (let week = 0; week < this.weekCount; week++) {
			["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].forEach((day, index) => {
				const th = $("<th>").text(day).appendTo(headerRow);
				th.on("click", () => this.selectDay(week * 7 + index));
			});
		}
		
		const tbody = $("<tbody>").appendTo(table);
		
        this.createSection(tbody,"Arbeitszeit", ["Arbeitszeit Von", "Arbeitszeit Bis"]);
		this.createSection(tbody, "Pausenkorridore", ["Pause 1 Von", "Pause 1 Bis", "Min. Pausenzeit 1", "Pause 2 Von", "Pause 2 Bis", "Min Pausenzeit 2", "Pause 3 Von", "Pause 3 Bis", "Min Pausenzeit 3"]);

		this.scrollContainer?.append(table);
	}


	createSection(tbody: JQuery<HTMLElement>, title: string, fields: string[]): void {
		const sectionRow = $("<tr>").addClass("section-row");
		const titleCell = $("<td>").text(title).appendTo(sectionRow);
		const toggleButton = $("<button>").text("▼").addClass("toggle-button").appendTo(titleCell);
		toggleButton.on("click", () => this.toggleSection(sectionRow));
		tbody.append(sectionRow);

		fields.forEach(field => {
			const fieldRow = $("<tr>").addClass("field-row");
			$("<td>").text(field).appendTo(fieldRow);
			this.model.data.forEach((day, dayIndex) => {
				const cell = $("<td>").appendTo(fieldRow);
				const input = this.createTimeInput(dayIndex, field);
				cell.append(input);
				cell.on("click", (e) => {
					e.stopPropagation();
					this.selectDay(dayIndex);
					this.selectInput(input);
				});
			});
			tbody.append(fieldRow);
		});
	}

	createTimeInput(dayIndex: number, field: string): JQuery {
		const day = this.model.data[dayIndex];
		const fieldValue = day && (day as any)[field] ? this.formatTime((day as any)[field]) : '';
		const input = $("<input>").attr({
			type: "time",
			value: fieldValue,
			class: `timeInput ${field}`
		});
		input.on("change", (e) => {
			const newValue = this.parseTime((e.target as HTMLInputElement).value);
			this.model.updateDay(dayIndex, field, newValue);
			this.update();
		});
		return input;
	}

	formatTime(time: string | undefined): string {
		if (!time) return '';
		const [hours, minutes] = time.split(':');
		if (!hours || !minutes) return '';
		return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
	}

	parseTime(time: string): string {
		if (!time) return '';
		const [hours, minutes] = time.split(':');
		if (!hours || !minutes) return '';
		return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
	}

	toggleSection(sectionRow: JQuery<HTMLElement>): void {
		const fieldRows = sectionRow.nextUntil(".section-row");
		fieldRows.toggleClass("hidden");
		sectionRow.find(".toggle-button").text(fieldRows.first().hasClass("hidden") ? "▼" : "▲");
	}

	selectDay(dayIndex: number): void {
		this.selectedDayIndex = dayIndex;
		this.scrollContainer?.find("td").removeClass("selected");
		this.scrollContainer?.find(`td:nth-child(${dayIndex + 2})`).addClass("selected");
	}

	selectInput(input: JQuery): void {
		this.scrollContainer?.find("input").removeClass("selected");
		input.addClass("selected");
	}

	override getModelInfo(): ModelData {
		return {
			model: this.model,
			modelName: "azmDayModel"
		};
	}

	override updateToolbar(): void {
		const toolbar = CoreData.getDetailStage().getToolbar();
		toolbar?.emptyLeftContainer();
		toolbar?.fillHeadlineContainer(this.getCaption());

		if (!CoreData.getRights().isTableReadOnly(TableKeys.AZMDAY)) {
			const resetDayBtn = new Button(t("core-data:resetDay"), "fas fa-undo", false);
			resetDayBtn.bindClick(() => this.resetSelectedDay());

			const copyDayBtn = new Button(t("core-data:copyDay"), "fas fa-copy", false);
			copyDayBtn.bindClick(() => this.copySelectedDayToAllDays());

			toolbar?.addAdditionalButtonsLeft([resetDayBtn.getEl(), copyDayBtn.getEl()]);
		}
	}

	resetSelectedDay(): void {
		if (this.selectedDayIndex !== -1) {
			MessageBox.yesNo(t("core-data:resetBtnTxt"), t("core-data:resetDayTxt"), () => {
				this.model.resetDay(this.selectedDayIndex);
				this.update();
			});
		} else {
			Toast.showInfoToast(t("core-data:selectDayFirst"));
		}
	}

	copySelectedDayToAllDays(): void {
		if (this.selectedDayIndex !== -1) {
			MessageBox.yesNo(t("core-data:copyBtnTxt"), t("core-data:copyDayTxt"), () => {
				this.model.copyDay(this.selectedDayIndex);
				this.update();
			});
		} else {
			Toast.showInfoToast(t("core-data:selectDayFirst"));
		}
	}

	override getCaption(): string {
		return t("core-data:azmDay");
	}
}