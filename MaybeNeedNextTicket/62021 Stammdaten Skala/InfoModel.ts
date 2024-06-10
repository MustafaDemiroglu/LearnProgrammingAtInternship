import { FieldInfoData } from "../../responses/FieldInfoData";
import { InfoModelData } from "../../responses/InfoModelData";
import { ValuesData } from "../../responses/ValuesData";

export class InfoModel {

	/** @property {object} data */
	data: InfoModelData | null = null;

	/** @property {object} changedData */
	changedData: ValuesData = null;

	/**
	 * Model für den Datensatz
	 */
	constructor(data: InfoModelData) {
		this.data = data;
		this.changedData = {};
	}

	/**
	 * Setzt die Daten zurück und initialisiert die geänderten Daten.
	 */
	setData(data: InfoModelData | null): void {
		this.changedData = {};
		this.data = data;
	}

	/**
	 * Gibt alle Daten zurück
	 */
	getData() {
		return this.data;
	}

	/**
	 * Gibt die Id des Datensatzes zurück
	 */
	getId() {
		return this.data ? this.getMainRec().id : null;
	}

	/**
	 * Gibt den Text des Datensatzes zurück
	 */
	getText() {
		return this.getMainRec()?.txt;
	}

	getModName() {
		return this.getMainRec()?.modname;
	}

	/**
	 * Gibt das Haupt-Rec zurück
	 */
	getMainRec() {
		return this.data?.MainData.mainRec;
	}

	/**
	 * Gibt das Haupt-Text-Rec zurücks
	 */
	getMainTextRec() {
		return this.data?.MainData.mainTextRec;
	}

	/**
	 * Setzt den Wert eines Feldes und speichert die Änderung, falls der Wert geändert wurde.
	 */
	setValue(value: string, fld: FieldInfoData) {
		this.changedData[fld.ident.toLowerCase()] = value;
		/*
		const fieldName = fld.ident.toLowerCase();
		const originalValue = this.getMainRec()[fieldName];

		if (originalValue == null) {
			if (value !== '' && value != null) {
				this.changedData[fieldName] = value;
			} else {
				delete this.changedData[fieldName];
			}
		} else {
			if (value !== originalValue) {
				this.changedData[fieldName] = value;
			} else {
				delete this.changedData[fieldName];
			}
		}
		*/
	}

	setValueByFieldName(value: string, fieldName: string) {
		this.changedData[fieldName] = value;
		/*
		const originalValue = this.getMainRec()[fieldName];

		if (originalValue == null) {
			if (value !== '' && value != null) {
				this.changedData[fieldName] = value;
			} else {
				delete this.changedData[fieldName];
			}
		} else {
			if (value !== originalValue) {
				this.changedData[fieldName] = value;
			} else {
				delete this.changedData[fieldName];
			}
		}
		*/
	}

	/**
	 * Liefert alle geänderten Werte zurück oder null, falls keine Änderungen vorhanden sind.
	 */
	getChangedValues() {
		return this.changedData;
	}

	/**
	 * Liefert dem im Model aktuell gesetzten Wert.
	 */
	getCurrentFieldValues(fieldName: string) {
		if (this.changedData[fieldName] !== undefined) {
			return this.getChangedValues()[fieldName];
		} else {
			return this.getMainRec()[fieldName];
		}
	}

	/**
	 * Gibt zurück, ob ein vorhandener Datensatz editiert wird.
	 */
	isEdit() {
		return this.getId() !== "" && this.getId() !== null;
	}
}