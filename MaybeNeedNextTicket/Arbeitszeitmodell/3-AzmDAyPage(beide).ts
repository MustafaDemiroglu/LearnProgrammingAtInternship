import { DurationFormatter } from "@web-nx/ibo-core";
import { Button, DayTimefield, Hourfield, MessageBox, Timefield, Toast } from "@web-nx/ibo-native-cmp";
import { t } from "i18next";
import { CoreData } from "../../CoreData";
import { PageKeys } from "../../PageKeys";
import { AzmDayModelData } from "../../responses/AzmDayModelData";
import { TableKeys } from "../../TableKeys";
import { AzmDayModel } from "../model/AzmDayModel";
import './AzmDayPage.scss';
import { BasePage } from "./BasePage";
import { ModelData } from "./ModelData";

/**
  * Klasse für die Arbeitszeit-Seite
  */

export class AzmDayPage extends BasePage {
	model!: AzmDayModel;
	scrollContainer: JQuery<HTMLElement> | null = null;
	selectedDayIndex = -1;
	weekCount = 1;

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
		$("<th>").text("Tag").appendTo(headerRow);
		for (let week = 0; week < this.weekCount; week++) {
			["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].forEach((day, index) => {
				const th = $("<th>").text(day).appendTo(headerRow);
				th.on("click", () => this.selectDay(week * 7 + index));
			});
		}

		const tbody = $("<tbody>").appendTo(table);

		this.createSection(tbody, "Arbeitszeit", ["AZVON", "AZBIS"]);
		this.createSection(tbody, "Pausenkorridore", ["PAUSE1VON", "PAUSE1BIS", "PAUSE1MIN", "PAUSE2VON", "PAUSE2BIS", "PAUSE2MIN", "PAUSE3VON", "PAUSE3BIS", "PAUSE3MIN"]);

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
			$("<td>").text(this.getFieldLabel(field)).appendTo(fieldRow);
			this.model.data.forEach((day, dayIndex) => {
				const cell = $("<td>").appendTo(fieldRow);
				const input = this.createInput(dayIndex, field);
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

	createInput(dayIndex: number, field: string): JQuery {
		const day = this.model.data[dayIndex];
		const fieldValue = day && (day as any)[field] !== undefined ? (day as any)[field] : '';
		let input = new Timefield();

		if (field.endsWith('MIN')) {
			input = new Hourfield();
			input.valueToUnit = (value: any) => {
				return DurationFormatter.valueToHour(value, "hh:mm");
			};
			input.unitToValue = (value: any) => {
				return DurationFormatter.hourToValue(value, false);
			};
			input.val(fieldValue);
		} else {
			input = new DayTimefield();
			if (fieldValue !== null)
				input.val(new Date(fieldValue));
		}
		input.bindLiveEvents((newValue: any) => {
			this.model.updateDay(dayIndex, field, newValue);
		});
		return input.getEl();
	}

	/*
	// To-Do
	// sollte die Uhrzeit zeiger 
	// auch  alle Felder richtig gesehen und bearbeitet  werden
	createInput(dayIndex: number, field: string): JQuery {
		const day = this.model.data[dayIndex];
		const fieldValue = day && (day as any)[field] !== undefined ? (day as any)[field] : '';

		let input: JQuery;

		if (field.endsWith('Min')) {
			input = $("<input>").attr({
				type: "time",
				value: this.formatSecondsToTime(fieldValue),
				class: `timeInput ${field}`
			});

			input.on("change", (e) => {
				const newValue = this.parseTimeToSeconds((e.target as HTMLInputElement).value);
				this.model.updateDay(dayIndex, field, newValue);
			});
		} else {
			input = $("<input>").attr({
				type: "time",
				value: this.formatTime(fieldValue),
				class: `timeInput ${field}`
			});
			input.on("change", (e) => {
				const newValue = this.parseTime((e.target as HTMLInputElement).value);
				this.model.updateDay(dayIndex, field, newValue);
			});
		}

		return input;
	}

	formatTime(time: string): string {
		if (!time) return '';
		const date = new Date(time);
		return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
	}

	parseTime(time: string): string {
		if (!time) return '';
		const [hours, minutes] = time.split(':');
		const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
		return date.toISOString();
	}

	formatSecondsToTime(seconds: string): string {
		if (!seconds) return '';
		const totalSeconds = parseInt(seconds);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}

	parseTimeToSeconds(time: string): string {
		if (!time) return '';
		const [hours, minutes] = time.split(':');
		const totalSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60);
		return totalSeconds.toString();
	}
*/


	getFieldLabel(field: string): string {
		const labels: { [key: string]: string; } = {
			AZVON: "Arbeitszeit Von",
			AZBIS: "Arbeitszeit Bis",
			PAUSE1VON: "Pause 1 Von",
			PAUSE1BIS: "Pause 1 Bis",
			PAUSE1MIN: "Min. Pausenzeit 1",
			PAUSE2VON: "Pause 2 Von",
			PAUSE2BIS: "Pause 2 Bis",
			PAUSE2MIN: "Min Pausenzeit 2",
			PAUSE3VON: "Pause 3 Von",
			PAUSE3BIS: "Pause 3 Bis",
			PAUSE3MIN: "Min Pausenzeit 3"
		};
		return labels[field] || field;
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
		return t("core-data:azmDayPageCaption");
	}
}