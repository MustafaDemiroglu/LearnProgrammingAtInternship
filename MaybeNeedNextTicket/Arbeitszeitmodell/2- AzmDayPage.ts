
/**
  * Klasse für die Arbeitszeit-Seite
  */

/*
import { Button, DayTimefield, Hourfield, MessageBox, Toast, TogglePanel } from "@web-nx/ibo-native-cmp";
import { t } from "i18next";
import { Timefield } from "libs/ibo-native-cmp/src/lib/component/Timefield";
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
	panel!: TogglePanel;
	panelContainer: JQuery | null = null;
	selectedDayIndex = -1;
	weekCount = 1;


	constructor(data: AzmDayModelData) {
		super(PageKeys.AZMDAYPAGE);
		this.addClass("azmDayPage flex1 flex");
		this.panelContainer = this.createDiv("panelContainer flex1");
		this.append(this.panelContainer);
		this.load(data);
	}

	override load(data: AzmDayModelData): void {
		this.model = new AzmDayModel(data);
		this.update();
	}

	update(): void {
		this.panelContainer?.empty();

		const table = $("<table>").addClass("azmDayTable");

		const panelHeader = new TogglePanel("");
		panelHeader.removeHeader();
		const thead = $("<thead>");
		const headerRow = $("<tr>").appendTo(thead);
		$("<th>").text("Tag").appendTo(headerRow);
		for (let week = 0; week < this.weekCount; week++) {
			["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].forEach((day, index) => {
				const th = $("<th>").text(day).appendTo(headerRow);
				th.on("click", () => this.selectDay(week * 7 + index));
			});
		}
		panelHeader.setContent(thead);

		const tbody1 = $("<tbody>");
		const panel1 = new TogglePanel("Arbeitszeit");
		panel1.removeCount();
		this.createSection(tbody1, ["azVon", "azBis"]);
		panel1.setContent(tbody1);

		const tbody2 = $("<tbody>");
		const panel2 = new TogglePanel("Pausenkorridore");
		panel2.removeCount();
		this.createSection(tbody2, ["pause1Von", "pause1Bis", "pause1Min", "pause2Von", "pause2Bis", "pause2Min", "pause3Von", "pause3Bis", "pause3Min"]);
		panel2.setContent(tbody2);

		table.append([panelHeader.getEl(), panel1.getEl(), panel2.getEl()]);
		this.panelContainer?.append(table);
	}

	createSection(tbody: JQuery<HTMLElement>, fields: string[]): void {
		fields.forEach(field => {
			const fieldRow = $("<tr>").addClass("field-row");
			$("<td>").text(this.getFieldLabel(field)).appendTo(fieldRow);
			this.model.data.forEach((day, dayIndex) => {
				const cell = $("<td>").appendTo(fieldRow);
				let input = new Timefield();
				if (field == "Min. Pausenzeit 1" || field == "Min. Pausenzeit 2" || field == "Min. Pausenzeit 3") {
					input = new Hourfield();
				} else {
					input = new DayTimefield();
				}
				input.val(day ? (day as any)[field] : '');

				cell.append(input.getEl());
				cell.on("click", (e) => {
					e.stopPropagation();
					this.selectDay(dayIndex);
					this.selectInput(input.getEl());
				});
			});
			tbody.append(fieldRow);
		});
	}

	getFieldLabel(field: string): string {
		const labels: { [key: string]: string; } = {
			azVon: "Arbeitszeit Von",
			azBis: "Arbeitszeit Bis",
			pause1Von: "Pause 1 Von",
			pause1Bis: "Pause 1 Bis",
			pause1Min: "Min. Pausenzeit 1",
			pause2Von: "Pause 2 Von",
			pause2Bis: "Pause 2 Bis",
			pause2Min: "Min Pausenzeit 2",
			pause3Von: "Pause 3 Von",
			pause3Bis: "Pause 3 Bis",
			pause3Min: "Min Pausenzeit 3"
		};
		return labels[field] || field;
	}

	selectDay(dayIndex: number): void {
		this.selectedDayIndex = dayIndex;
		this.panelContainer?.find("td").removeClass("selected");
		this.panelContainer?.find(`td:nth-child(${dayIndex + 2})`).addClass("selected");
	}

	selectInput(input: JQuery): void {
		this.panelContainer?.find("input").removeClass("selected");
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
*/


import { Button, DayTimefield, Hourfield, MessageBox, Toast } from "@web-nx/ibo-native-cmp";
import { t } from "i18next";
import { Timefield } from "libs/ibo-native-cmp/src/lib/component/Timefield";
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

		this.createSection(tbody, "Arbeitszeit", ["azVon", "azBis"]);
		this.createSection(tbody, "Pausenkorridore", ["pause1Von", "pause1Bis", "pause1Min", "pause2Von", "pause2Bis", "pause2Min", "pause3Von", "pause3Bis", "pause3Min"]);

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
		const fieldValue = day ? (day as any)[field] : '';
		/*
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
				this.update();
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
				this.update();
			});
		}

		return input;
		*/


		let input = new Timefield();
		if (field == "Min. Pausenzeit 1" || field == "Min. Pausenzeit 2" || field == "Min. Pausenzeit 3") {
			input = new Hourfield();
		} else {
			input = new DayTimefield();
		}
		input.val(fieldValue.toString());
		return input.getEl();

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

	getFieldLabel(field: string): string {
		const labels: { [key: string]: string; } = {
			azVon: "Arbeitszeit Von",
			azBis: "Arbeitszeit Bis",
			pause1Von: "Pause 1 Von",
			pause1Bis: "Pause 1 Bis",
			pause1Min: "Min. Pausenzeit 1",
			pause2Von: "Pause 2 Von",
			pause2Bis: "Pause 2 Bis",
			pause2Min: "Min Pausenzeit 2",
			pause3Von: "Pause 3 Von",
			pause3Bis: "Pause 3 Bis",
			pause3Min: "Min Pausenzeit 3"
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
