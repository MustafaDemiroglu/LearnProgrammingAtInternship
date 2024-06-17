import { Component } from "./Component";

export class RadioButton extends Component {
	$input;
	constructor(name: string | null, value: string, caption?: string) {
		super(Component.createDiv("radio inlineFlex"));
		const $input = Component.create("input");

		$input.on("change", () => { });

		this.$input = $input;
		$input.attr("type", "radio");
		this.attribute("role", "radio");
		$input.attr("name", name);
		$input.attr("value", value);
		$input.attr("tabindex", -1);
		$input.attr("aria-label", name);
		this.append($input);

		const btn = this.createButton(caption);

		if (btn) {
			btn.attr("aria-hidden", "true");
			this.append(btn);
		}

		this.bindEvent("keydown", (sender: RadioButton, event: JQuery.Event) => {
			if (event.key === "Enter" || event.key === "Space") {
				this.$input.trigger("click");
			}
		});
	}

	checked(checked: boolean): void {
		if (checked !== undefined) {
			this.$input.prop("checked", checked);
			this.attribute("aria-checked", "" + checked);
		} else {
			this.$input.prop("checked");
		}
	}

	protected createButton(caption?: string): JQuery | undefined {
		if (caption) {
			return this.createLabel(caption, "label");
		}
		return;
	}
}
