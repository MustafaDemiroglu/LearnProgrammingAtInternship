
export class HyphenImportDialogModel {

	caption: string | null = null;
	ident: string;
	id: string;
	filterId: string | undefined;
	hyphenActive = false;

	constructor(ident: string, id: string, filterId?: string) {
		this.ident = ident;
		this.id = id;
		this.filterId = filterId;
		this.hyphenActive = false;
	}

	getIdent(): string {
		return this.ident;
	}

	getId(): string {
		return this.id;
	}

	setId(id: string) {
		this.id = id;
	}

	getFilterId(): string | undefined {
		return this.filterId;
	}

	isTemporaryReport(): boolean {
		return this.filterId != null;
	}

	getCaption(): string | null {
		return this.caption;
	}

	setCaption(caption: string) {
		this.caption = caption;
	}

	isHyphenActive(): boolean {
		return this.hyphenActive;
	}

	setHyphenActive(value: boolean) {
		this.hyphenActive = value;
	}
}