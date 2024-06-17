import { Component } from "./Component";
import { RadioButton } from "./RadioButton";

export class RadioGroup extends Component {
	name: string;

	/** Basisklasse für ein RadioGroup */
	constructor(name: string) {
		super(Component.create("div", "radiogroup flex flexColumn"));
		this.getEl().attr("role", "radiogroup");
		this.getEl().attr("tabindex", 0);
		this.name = name;
	}

	/** Liefert den Wert des markierten RadioButtons */
	getValue(): string | number | string[] | undefined {
		return this.getEl().find("input:checked").val();
	}

	/** Markiert den RadioButton, anhand des übergebenen Wertes */
	checked(value: string): void {
		this.getEl().find(`input[value=${value}]`).prop("checked", true);
	}

	addEntry(value: string, caption: string): RadioButton {
		const btn = new RadioButton(this.name, value, caption);
		this.append(btn);
		return btn;
	}

	bindLiveEvent(callback: () => void) {
		this.bindEvent("change", () => {
			callback();
		});
	}
}
