import { t } from "i18next";
import { DisplayTextData, SkalaAnf, SkalaEle, SkalaModelData } from "../../responses/SkalaModelData";

export class SkalaModel {
	eleList: SkalaEle[];
	anfList: SkalaAnf[];
	modified = false;

	constructor(data: SkalaModelData) {
		this.eleList = data.elements;
		if (this.eleList.length === 0) {
			this.eleList.push({ id: "", caption: t("core-data:valueString") + " 1" });
			this.eleList.push({ id: "", caption: t("core-data:valueString") + " 2" });
		}
		this.anfList = data.anfList;
		this.modified = false;
	}

	getElesList(): SkalaEle[] {
		return this.eleList;
	}
	getAnfList(): SkalaAnf[] {
		return this.anfList;
	}
	setModified(val: boolean): void {
		this.modified = val;
	}

	getChangedValues(): SkalaModelData | null {
		if (this.modified) {
			return {
				elements: this.eleList,
				anfList: this.anfList
			};
		} else {
			return null;
		}
	}

	/*
	getChangedValues(): SkalaModelData {
		return {
			elements: this.eleList,
			anfList: this.anfList
		};
	}
	*/

	/**
	  * löscht den Wert aus der Liste
	  */
	deleteEle(list: (SkalaEle | SkalaAnf)[], item: SkalaEle | SkalaAnf): void {
		const indexOf = list.indexOf(item);
		list.splice(indexOf, 1);
		this.modified = true;
	}

	addAnf(item: DisplayTextData): void {
		let found = false;
		this.anfList.forEach((anf: SkalaAnf) => {
			if (anf.id === item.id)
				found = true;
		});
		if (!found) {
			this.anfList.push({
				id: item.id,
				caption: item.displayText
			});
			this.modified = true;
		}
	}

	addEle(): void {
		const nextNumber = t("core-data:valueString") + " " + (this.eleList.length + 1);
		this.eleList.push({
			id: "",
			caption: nextNumber
		});
		this.modified = true;
	}

	/**
	* Verscheibt ein Feld nach oben/unten
	*/
	move(list: SkalaEle[], ele: SkalaEle, down: boolean): void {
		const direction = down ? +1 : -1;
		for (let i = 0; i < list.length; i++) {
			if (list[i] === ele) {
				const targetField = list[i + direction];

				if (targetField != null) {
					list[i] = targetField;
					list[i + direction] = ele;
					this.modified = true;
					return;
				}
			}
		}
		this.modified = true;
	}

}