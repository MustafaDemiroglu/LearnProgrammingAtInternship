
        /// <summary>
        /// Kopiert alle Daten aus einem FlowProfRightsLinkModel und überträgt sie auf ein anderes Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="sourceId">ID des Quellmodells</param>
        /// <param name="targetId">ID des Zielmodells</param>
        /// <param name="tableName">Tabellenname für beide Modelle</param>
        public void CopyFlowProfRightsLinkModel(PapUserSession session, string sourceId, string targetFlowProfId, string tableName)
        {
            using (FlowProfModel sourceModel = new FlowProfModel(session.DataProvider))
            using (FlowProfModel targetModel = new FlowProfModel(session.DataProvider))
            {
                sourceModel.Load(sourceId);
                targetModel.Load(targetFlowProfId);
                targetModel.Edit();

                IboObject sourceModelGrpLink = GetFlowProfGrpLink(session, sourceModel);
                string[] groupTargetIds = sourceModelGrpLink
                   .Get<IboObjectList<IboObject>>(IboObjectKeys.LinkList)
                   .Select(link => link.Get<string>(IboObjectKeys.TargetId))
                   .ToArray();
                AddFlowProfRightLinks(session, targetFlowProfId, groupTargetIds, Tbl.GRP, Tbl.FLOWPROFGRP);

                IboObject sourceModelUsersLink = GetFlowProfUsersLink(session, sourceModel);
                string[] userTargetIds = sourceModelUsersLink
                    .Get<IboObjectList<IboObject>>(IboObjectKeys.LinkList)
                    .Select(link => link.Get<string>(IboObjectKeys.TargetId))
                    .ToArray();

                AddFlowProfRightLinks(session, targetFlowProfId, userTargetIds, Tbl.V_USERS, Tbl.FLOWPROFUSERS);

                //MakeChangesToModel(targetModel, GetFlowProfGrpLink(session, sourceModel), targetId, session);
                //MakeChangesToModel(targetModel, GetFlowProfUsersLink(session, sourceModel), targetId, session);

                targetModel.Save();
                targetModel.Close();
            }
        }


        /// ------------------------------------------------------------------------------------------------------------------------
/// <summary>
/// Speichert die übergebenen Daten zu gegebenen Model und gibt die aktualisierten Models zurück
/// </summary>
/// <param name="session">Session</param>
/// <param name="tableName">Tabelle der jeweiligen Daten</param>
/// <param name="id">ID des Datensatzes, aus welchem die Daten in das neue Model übertragen werden sollen</param>
/// <param name="values">Werte zum Speichern</param>
/// <returns>Neuer Stammdatensatz</returns>
public ServerResponse InternalSaveAsEntry(PapUserSession session, string tableName, string id, IboObject values)
{
    SdmModel model = ModelHelper.GetModel(session, tableName, id);
    model.Load(id);
    model.PrepareSaveAs(false, null);
    model.Save();
    string newId = model.MainId.ToString();
    model.Close();

    if (values.Has<IboObject>(IboObjectKeys.CheckCatalogModel) )
        CopyCatalogModelData(session, id, newId, tableName);
    if (values.Has<IboObject>(IboObjectKeys.ElementBrickModel))
        CopyElementBrickModelData(session, id, newId);
    if (tableName == Tbl.FLOWPROF)
        CopyFlowProfRightsLinkModel(session, id, newId, tableName);

    return InternalSave(session, tableName, newId, values);
}