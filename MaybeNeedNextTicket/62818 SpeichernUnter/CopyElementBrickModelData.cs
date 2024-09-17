
        /// <summary>
        /// Kopiert alle Daten aus einem ElementBrickModel und überträgt sie auf ein anderes Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="sourceId">ID des Quellmodells</param>
        /// <param name="targetId">ID des Zielmodells</param>
        public void CopyElementBrickModelData(PapUserSession session, string sourceId, string targetId)
        {
            using (ElementBrickModel sourceModel = new ElementBrickModel(session.DataProvider))
            {
                sourceModel.Load(sourceId);

                using (ElementBrickModel targetModel = new ElementBrickModel(session.DataProvider))
                {
                    targetModel.Load(targetId);

                    string html = sourceModel.HtmlContainer.GetHtmlText();
                    if (html != null)
                    {
                        targetModel.HtmlContainer.SetNewHtmlText(html, true);
                        targetModel.HtmlContainer.BeforeSave();
                    }

                    targetModel.ElementFilterTable.DeleteAllRows();
                    foreach (DataRow row in sourceModel.ElementFilterTable.Rows)
                    {
                        DataRow newRow = targetModel.ElementFilterTable.NewRow();
                        newRow[Fld.ID] = session.DataProvider.GetNextId(Tbl.ELEMENTBRICKFILTER);
                        newRow[Fld.ELEMENTBRICKID] = targetModel.MainId;
                        newRow[Fld.VARNAME] = row[Fld.VARNAME].ToString();
                        newRow[Fld.VAL] = row[Fld.VAL].ToString();
                        targetModel.ElementFilterTable.Rows.Add(newRow);
                    }

                    targetModel.Save();
                    targetModel.Close();
                }

                sourceModel.Close();
            }
        }