import { Component, DialogActionPanel, Textfield, Window } from "@web-nx/ibo-native-cmp";
import { t } from "i18next";
import './AddUserRecordDialog.scss';

/**
 * Erfassung eines Benutzers bzw. Mitarbeiters
 */
export class AddUserRecordDialog extends Window {
	private text: Textfield | undefined;
	private caption: string;

	callback: (krz: string) => void;

	constructor(tableName: string, callback: (text: string) => void) {
		super();
		this.disableAutoDestroy();
		this.addClass("addUserRecordDialog flex flexColumn");

		this.caption = t("admin:dialogHeaderRecord");
		this.createHeader();

		this.addWindowContent();
		this.maskBackground();
		this.show((($(window).width() ?? 0) / 2) - ((this.width() ?? 0) / 2), (($(window).height() ?? 0) / 2) - ((this.getEl().height() ?? 0) / 2));
		this.text?.$input.focus();
		this.callback = callback;
	}
	/**
	 * Überschrift wird erstellt
	 */
	createHeader(): void {
		this.append(this.createLabel(this.caption, "header"));
	}

	/**
	 * Schalfläche steuern
	 */
	canSubmit(): boolean {
		return this.text?.val();
	}

	/**
	 * Erstellt den Inhalt des Fensters
	 */
	private addWindowContent(): void {
		const $fieldBox = Component.createDiv("fieldBox flex flex1 flexColumn");
		const actionPanel = new DialogActionPanel();

		this.text = this.creatEditFieldBox($fieldBox, t("admin:captionText"), 100, () => { actionPanel.submitDisabled(!this.canSubmit()); }, t("admin:requireText"));

		actionPanel.bindOnSubmit(() => {
			this.doSave(this.text?.val());
		});

		actionPanel.bindOnCancel(() => {
			this.destroy();
		});
		actionPanel.submitDisabled(!this.canSubmit());
		this.append([$fieldBox, actionPanel.getEl()]);
	}

	creatEditFieldBox(box: JQuery, label: string, maxLength: number, submitCallback: () => void, placeholdertext?: string): Textfield | undefined {
		const $textBox = Component.createDiv("fieldBox flex");
		const textfield = new Textfield();
		textfield.addClass("flex");

		if (maxLength > 0)
			textfield.maxLength(maxLength);
		if (placeholdertext)
			textfield.placeholder(placeholdertext);

		textfield.bindLiveEvents(() => { submitCallback(); });
		$textBox.append([this.createLabel(label), textfield.getEl()]);
		box.append($textBox);
		return textfield;
	}

	/**
	 * Beendet den Dialog und ruft den Callback auf
	 */
	doSave(text: string): void {
		this.callback(text);
		this.destroy();
	}
}