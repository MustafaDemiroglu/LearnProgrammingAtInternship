 /// ------------------------------------------------------------------------------------------------------------------------
 /// <summary>
 /// Liefert die vorhandenen Kennungsattribute für die angegebene Tabelle und ihre Werte.
 /// </summary>
 /// <param name="tableName">Name der Tabelle</param>
 /// <returns>Liste von Kennungen</returns>
 [ManagerCommandAttribute("SdmManager_GetKennungAttributes")]
 public ServerResponse GetKennungAttributes(string tableName)
 {
     KennungsEditorHelper helper = new KennungsEditorHelper();
     PapUserSession session = new PapUserSession();
     return DataResponse(helper.GetKennungAttributes(tableName, session)); 
 }