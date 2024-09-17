
        /// <summary>
        /// Kopiert alle Daten aus einem CheckCatalogModel und überträgt sie auf ein anderes Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="sourceId">ID des Quellmodells</param>
        /// <param name="targetId">ID des Zielmodells</param>
        /// <param name="tableName">Tabellenname</param>
        public void CopyCatalogModelData(PapUserSession session, string sourceId, string targetId, string tableName)
        {
            using (SdmModel sourceModel = ModelHelper.GetModel(session, tableName, sourceId))
            {
                if (!(sourceModel is CheckCatalogModel sourceCatalog))
                {
                    Debug.Fail("Source model is not CheckCatalogModel");
                    return;
                }

                using (SdmModel targetModel = ModelHelper.GetModel(session, tableName, targetId))
                {
                    if (!(targetModel is CheckCatalogModel targetCatalog))
                    {
                        Debug.Fail("Target model is not CheckCatalogModel");
                        return;
                    }

                    targetCatalog.Edit();

                    foreach (var checkItem in sourceCatalog.Checks)
                    {
                        if (targetCatalog.Checks.TryGetValue(checkItem.Key, out CheckBase targetCheck))
                        {
                            targetCheck.Enabled = checkItem.Value.Enabled;
                            targetCheck.ProtokollItemLevel = checkItem.Value.ProtokollItemLevel;

                        }
                    }

                    targetCatalog.Save();
                    targetCatalog.Close();
                }
            }
        }
