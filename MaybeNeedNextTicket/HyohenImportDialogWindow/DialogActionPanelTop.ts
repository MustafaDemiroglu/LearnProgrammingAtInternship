import { Button } from "./Button";
import { Component } from "./Component";
import "./DialogActionPanel.scss";

export class DialogActionPanelTop extends Component {
	/** @property {Button} selectAllButton */
	selectAllButton!: Button;

	/** @property {Button} clearAllButton */
	clearAllButton!: Button;

	constructor() {
		super(Component.createDiv("dialogActionPanel flex0 flex"));

		const selAllBtn = new Button("Select All Tables", "fas fa-check-square", false);
		const selectAllCtn = this.createDiv("btnContainer flex1");
		const clearAllCtn = this.createDiv("btnContainer flex1");
		const cleAllBtn = new Button("Clear All Tables", "far fa-square", false);

		this.selectAllButton = selAllBtn;
		this.clearAllButton = cleAllBtn;

		selectAllCtn.append(this.selectAllButton.getEl());
		clearAllCtn.append(this.clearAllButton.getEl());

		this.append([selectAllCtn, clearAllCtn]);
	}

	/**
	 * @param {() => void} callback
	 */
	bindOnSelectAll(callback: any) {
		this.selectAllButton.bindClick(callback);
	}

	/**
	 * @param {() => void} callback
	 */
	bindOnClearAll(callback: any) {
		this.clearAllButton.bindClick(callback);
	}
}
