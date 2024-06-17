import { Button, Checkbox, RadioGroup, Textfield, Window } from "@web-nx/ibo-native-cmp";
import { t } from 'i18next';
import './DropExternalDataWindow.scss';


export class DropExternalDataWindow extends Window {
	private descriptionField: Textfield;
	private urlField!: Textfield;
	private group!: RadioGroup;
	private linkField!: Textfield;
	private confirmBtn!: Button;
	private $btnGroup!: JQuery;
	private $warnMessage: JQuery;

	constructor(description: string, url: string, xPosition: number, yPosition: number, callback: (check: unknown, description?: unknown, url?: unknown, release?: unknown, createLink?: unknown) => void) {
		super();
		this.getEl().addClass("dropExternalDataWindow");

		this.createArrow(xPosition, yPosition);
		this.createHeader(t("prom:createDocument"));

		this.descriptionField = this.createInputField(t("prom:description"), description, t("prom:descriptionPathPlaceholder"));

		if (url) {
			this.urlField = this.createInputField(t("prom:url"), url, t("prom:noTextPlaceholder"), t("prom:urlTooltip"));
			this.$warnMessage = this.createLabel(t("prom:urlTooltip"), "warnMessage");
		} else {
			this.group = new RadioGroup("Group");

			this.group.addEntry("upload", t("prom:fileUpload"));
			this.group.addEntry("link", t("prom:fileLink"));
			this.group.checked("upload");
			this.getEl().append(this.group.getEl());

			this.linkField = this.createInputField(t("prom:filePath"), "", t("prom:filePathPlaceholder"), t("prom:filePathTooltip"));
			this.$warnMessage = this.createLabel(t("prom:filePathTooltip"), "warnMessage");
		}
		this.createBtnGroup(callback);
		this.show();
	}

	override show(): void {
		super.show();
		setTimeout(() => {
			this.getEl().css("transform", "scale(1)");
		}, 1);
	}

	private createHeader(title: string): void {
		const $header = this.createLabel(title, "header");
		this.getEl().append($header);
	}

	private createReleaseGroup(): Checkbox {
		const $releaseGroup = this.create("div", "releaseGroup");
		const $label = this.create("div", "label");
		const checkbox = new Checkbox();

		$label.text(t("prom:release"));
		$releaseGroup.addClass("flex");
		$releaseGroup.append($label, checkbox.getEl());
		this.getEl().append($releaseGroup);
		return checkbox;
	}

	private createInputField(name: string, val: string, placeholder?: string, tooltip?: string): Textfield {
		const textField = new Textfield(name);
		const $textField = textField.getEl();

		if (val) {
			textField.val(val);
		}
		$textField.removeClass("inlineFlex");
		$textField.addClass("flex");

		textField.placeholder(placeholder ?? "");
		textField.title(tooltip ?? "");

		this.getEl().append($textField);
		return textField;
	}

	private createBtnGroup(callback: (check: boolean, description?: string, url?: string | null, release?: boolean, createLink?: boolean) => void): void {
		const $btnGroup = this.create("div", "btnGroup");
		const releaseCheckBox = this.createReleaseGroup();
		const cancelBtn = new Button(t("prom:cancel"), "", true);

		this.confirmBtn = new Button(t("prom:check"), "", true);
		this.checkValidConfirmBtn();

		this.confirmBtn.bindClick(() => {
			this.destroy();
			if (this.urlField) {
				callback(true, this.descriptionField.val(), this.urlField.val(), releaseCheckBox.checked() ?? false);
			} else {
				if (this.group.getValue() === "upload")
					callback(true, this.descriptionField.val(), null, releaseCheckBox.checked() ?? false, false);
				else
					callback(true, this.descriptionField.val(), this.linkField.val(), releaseCheckBox.checked() ?? false, true);
			}
		});
		cancelBtn.bindClick(() => {
			this.destroy();
			callback(false);
		});
		$btnGroup.append(this.confirmBtn.getEl(), cancelBtn.getEl());
		this.$btnGroup = $btnGroup;
		this.getEl().append($btnGroup);
	}

	private checkValidConfirmBtn(): void {
		this.checkFieldValid();
		this.descriptionField.bindLiveEvents(this.checkFieldValid.bind(this));
		this.urlField?.bindLiveEvents(this.checkFieldValid.bind(this));
		this.linkField?.bindLiveEvents(this.checkFieldValid.bind(this));
		this.group?.bindLiveEvents(this.checkFieldValid.bind(this));
	}

	private checkFieldValid(): void {
		const isDescriptionValid = this.descriptionField.val() !== "";
		const isUrlValid = this.urlField == null || this.urlField.val() !== "";
		const isLinkValid = this.linkField == null || this.linkField.val() !== "";
		const isLinkChecked = this.group != null && this.group.getValue() === "link";

		const canConfirm = isDescriptionValid && isUrlValid && (!isLinkChecked || (isLinkChecked && isLinkValid));

		this.confirmBtn.disabled(!canConfirm);

		if (isLinkChecked) {
			this.$btnGroup?.before(this.$warnMessage);
		} else {
			this.$warnMessage?.remove();
		}
	}

	private createArrow(xPosition: number, yPosition: number): void {
		const $window = this.getEl();
		const browserHeight = document.body.clientHeight;
		const browserWidth = document.body.clientWidth;
		const windowHeight = parseInt($window.css("max-height"));
		const windowWidth = $window.width() ?? 0;
		const $arrow = this.create("div", "arrow");
		const skewFactorTop = 22;
		const skewFactorBottom = 17;

		if ((xPosition + windowWidth) > browserWidth && (yPosition + windowHeight) > browserHeight) {
			$window.css("top", (yPosition - windowHeight) + skewFactorTop);
			$window.css("left", (xPosition - windowWidth) - skewFactorTop);
			$arrow.addClass("downRight");
		} else if ((yPosition + windowHeight) > browserHeight) {
			$window.css("top", (yPosition - windowHeight) + skewFactorTop);
			$window.css("left", xPosition + skewFactorTop);
			$arrow.addClass("downLeft");
		} else if ((xPosition + windowWidth) > browserWidth) {
			$window.css("left", (xPosition - windowWidth) - skewFactorTop);
			$window.css("top", yPosition - skewFactorBottom);
			$arrow.addClass("topRight");
		} else {
			$window.css("top", yPosition - skewFactorBottom);
			$window.css("left", xPosition + skewFactorTop);
			$arrow.addClass("topLeft");
		}
		this.getEl().append($arrow);
	}
}
