import { Checkbox } from "./Checkbox";
import { Component } from "./Component";
import { DialogActionPanel } from "./DialogActionPanel";
import { DialogActionPanelTop } from "./DialogActionPanelTop";
import './MultiSelectWindow.scss';
import { Window } from "./Window";

export class MultiSelectWindow extends Window {

	possibleValues: Map<string, string>;
	values: Map<string, boolean>;

	constructor(title: string, possibleValues: Map<string, string>, values: Map<string, boolean>, private onSubmit: (value: Map<string, boolean>) => void, lastFocusedElement?: any) {
		super(lastFocusedElement);

		this.addClass("multiSelectWindow");

		this.possibleValues = possibleValues;
		this.values = values;

		const $header = this.createHeader(title);
		this.append($header);

		const $body = this.addWindowContent();
		this.append($body);
	}

	private createHeader(title: string) {
		const $header = this.createDiv("header flex0");
		$header.html(title);
		return $header;
	}

	private addWindowContent() {
		const $fieldBox = this.createDiv("fieldBox flex flex1 flexColumn");
		const actionPanelTop = new DialogActionPanelTop();
		const actionPanelEnd = new DialogActionPanel();
		const dataCopy = new Map(this.values);

		const checkBoxes: Map<string, Checkbox> = new Map();

		dataCopy.forEach((value, key) => {
			const $field = this.createDiv("field flex");
			const $label = this.createLabel(this.possibleValues.get(key) ?? "", "label flex1");
			const checkBox = new Checkbox();
			checkBox.checked(value);
			checkBox.addClass("flex0");
			checkBox.bindLiveEvents((newState: boolean) => {
				dataCopy.set(key, newState);
			});
			$field.append($label, checkBox.getEl());
			$fieldBox.append($field);
			checkBoxes.set(key, checkBox);
		});

		actionPanelTop.bindOnSelectAll(() => {
			checkBoxes.forEach((checkBox) => {
				checkBox.checked(true);
			});
		});

		actionPanelTop.bindOnClearAll(() => {
			checkBoxes.forEach((checkBox) => {
				checkBox.checked(false);
			});
		});

		actionPanelEnd.bindOnCancel(() => {
			this.destroy();
		});

		actionPanelEnd.bindOnSubmit(() => {
			this.onSubmit(dataCopy);
			this.destroy();
		});

		return Component.create("div", "", [actionPanelTop.getEl(), $fieldBox, actionPanelEnd.getEl()]);
	}
}