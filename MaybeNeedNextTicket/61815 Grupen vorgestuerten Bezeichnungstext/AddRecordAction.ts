
import { Action } from '@web-nx/ibo-core';
import { GetRemarkDialog, Toast } from '@web-nx/ibo-native-cmp';
import { Admin } from '../Admin';
import { AdminPageKeys } from '../AdminPageKeys';

/**
 * Gruppe hinzufügen
 */
export class AddRecordAction extends Action {
	override execute(tableName: string): Promise<any> {
		//new AddUserRecordDialog(tableName, (text: string) => {
		new GetRemarkDialog("Gruppe anlegen", "Bitte geben Sie Bezeichnung", (text: string) => {
			//const mask = new LoadingMask($('body'), t("admin:reloadText"));
			Admin.serverRequest("AdminManager_AddRecord", {
				tableName: tableName,
				text: text
			}).then((newId: string) => {
				Admin.appRouter.navigate(tableName + "/" + newId + "/" + AdminPageKeys.INFO);
				return null;
			}).catch((error) => {
				if (error.name === "InvalidSessionException")
					throw error;
				Toast.showErrorToast(error.message);
				return Promise.resolve();
			}).finally(() => {
				//mask.remove();
			});
		}, "", false, 100);
		return Promise.resolve();
	}
}