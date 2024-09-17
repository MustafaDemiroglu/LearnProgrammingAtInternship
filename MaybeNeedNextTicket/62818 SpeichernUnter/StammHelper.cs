using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using Ibo.Common.Data;
using Ibo.Common.Data.Dictionary;
using Ibo.Common.Data.MVC;
using Ibo.Common.Data.Provider;
using Ibo.Common.Data.Query;
using Ibo.Common.Data.Structure;
using Ibo.Common.Data.Utils;
using Ibo.Common.Web.Manager;
using Ibo.Pap.Data;
using Ibo.Pap.Data.Batch;
using Ibo.Pap.Data.Check;
using Ibo.Pap.Data.Delete;
using Ibo.Pap.Data.DisplayText;
using Ibo.Pap.Data.Graph.Controllers;
using Ibo.Pap.Data.Graph.GraphTypes.Draw;
using Ibo.Pap.Data.Graph.GraphTypes.Rules;
using Ibo.Pap.Data.Graph.GraphTypes.Stencils;
using Ibo.Pap.Data.Graph.IboObjects;
using Ibo.Pap.Data.Graph.Models;
using Ibo.Pap.Data.Html;
using Ibo.Pap.Data.Html.TblBricks;
using Ibo.Pap.Data.Models;
using Ibo.Pap.Data.Stamm;
using Ibo.Pap.Data.Text;
using Ibo.Pap.Data.Utils;
using Ibo.Pap.Data.Utils.Images;
using Ibo.Pap.Data.WebManagers;
using Ibo.Pap.Data.Workflow;
using Ibo.Pap.Web.Images;
using Ibo.Pap.Web.Manager.Models;
using Ibo.Pap.Web.Properties;
using Ibo.Prom.Data;
using Ibo.Prom.Data.DisplayTexts;
using Ibo.Prom.Data.FlowProf;
using Ibo.Prom.Data.GraphTypes;
using Ibo.Prom.Data.GraphTypes.Bpmn;
using Ibo.Prom.Data.GraphTypes.Gps;
using Ibo.Prom.Data.GraphTypes.IboStd.Fp;
using Ibo.Prom.Data.GraphTypes.IboStd.Lane;
using Ibo.Prom.Data.Models;
using Ibo.Prom.Data.Models.ElementBricks;
using Ibo.Prom.Data.Options;
using Ibo.Prom.Data.Painters;
using Ibo.Prom.Data.TblBricks;
using Ibo.Prom.Data.VariableTranslators.Info;

namespace Ibo.Pap.Web.Manager.Sdm
{
    /// ============================================================================================================================
    /// <summary>
    /// Hilfsklasse für die Stammdaten
    /// </summary>
    public class StammHelper
    {
        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Läd einen Datensatz aus der Tabelle
        /// </summary>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="id">Is des Datensatzes</param>
        /// <param name="session">Session</param>
        /// <returns>ServerResponse.</returns>
        public ServerResponse Load(string tableName, string id, PapUserSession session)
        {
            IboObject result = new IboObject();
            using (SdmModel model = ModelHelper.GetModel(session, tableName, id))
            {
                IboObject infoModel = InfoModelToIboObject(model, tableName, id, session);
                result.Add(IboObjectKeys.InfoModel, infoModel);
                if (!id.IsNullOrEmpty())
                    AddAdditionalModels(result, tableName, model, session);
                model.Close(false);
            }
            return new DataResponse(result);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Läd einen Datensatz aus der Tabelle und gibt die "Haupdaten" als IboObject zurück
        /// </summary>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="id">Is des Datensatzes</param>
        /// <param name="session">Session</param>
        /// <returns>ServerResponse.</returns>
        public IboObject LoadInfoModel(string tableName, string id, PapUserSession session)
        {
            IboObject result;
            using (SdmModel model = ModelHelper.GetModel(session, tableName, id))
            {
                result = ModelToIboObject(model, tableName, session);
                model.Close(false);
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Überträgt die Hauptdaten eines geladenen Models an ein IboObject und gibt dieses zurück
        /// </summary>
        /// <param name="model">das geladene Model</param>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="id">Is des Datensatzes</param>
        /// <param name="session">Session</param>
        /// <returns>Das infoModel</returns>
        public static IboObject InfoModelToIboObject(SdmModel model, string tableName, string id, PapUserSession session)
        {
            IboObject infoModel = new IboObject();
            if (id == null)
            {
                model.MainRec[Fld.ID] = string.Empty;
            }
            infoModel.Add(IboObjectKeys.MainData, ModelToIboObject(model, tableName, session));
            model.GetAdditionalFieldsValue((string additionalTableName, string fieldName, IboBaseValue rawValue, string displayValue) =>
            {
                if (!infoModel.Has<IboObject>(additionalTableName))
                    infoModel.Add(additionalTableName, new IboObject());
                IboObject field = new IboObject();

                if (string.IsNullOrEmpty(displayValue))
                    displayValue = WebConvertValueHelper.GetDisplayValueByDD(session, rawValue, tableName, fieldName);
                field.Add(IboObjectKeys.RawValue, rawValue);
                field.Add(IboObjectKeys.DisplayValue, displayValue);

                infoModel.Get<IboObject>(additionalTableName).Add(fieldName.ToLower(), field);
            });
            return infoModel;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Übeträgt die Daten in ein IboObject
        /// </summary>
        /// <param name="model">Model mit den zu übertragenden Daten</param>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="session">Session</param>
        /// <returns>IboObject.</returns>
        public static IboObject ModelToIboObject(SdmModel model, string tableName, PapUserSession session)
        {
            IboObject result = new IboObject();
            using (TableDataSerializer serializer = new TableDataSerializer(session, tableName))
            {
                serializer.Serialize(model.EditRow, out IboObject rawRec, out IboObject displayRec, Fld.DATDEL);
                result.Add(IboObjectKeys.MainRec, rawRec);
                result.Add(IboObjectKeys.MainTextRec, displayRec);
            }
            return result;
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
        public ServerResponse InternalSave(PapUserSession session, string tableName, string id, IboObject values)
        {
            SendAdditionalPagesToSave(session, tableName, id, values);
            IboObject mainValues = values.Get<IboObject>(IboObjectKeys.InfoModel);
            IboObject additionalValues = values.Has<IboObject>("additionalValues") ? values.Get<IboObject>("additionalValues") : null;
            return MakeChanges(tableName, mainValues, additionalValues, id, session);
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

            return InternalSave(session, tableName, newId, values);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Übeträgt die Änderungen ins Model
        /// </summary>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="values">Die Werte</param>
        /// <param name="additionalValues">Zusätzliche Werte</param>
        /// <param name="id">ID des Datensatzes</param>
        /// <param name="session">Session</param>
        /// <param name="getResult">Im Erfolgsfall wird null zurückgeliefert, da kein Ergebnis gewünscht ist.</param>
        /// <returns>ServerResponse.</returns>
        public ServerResponse MakeChanges(string tableName, IboObject values, IboObject additionalValues, string id, PapUserSession session, bool getResult = true)
        {
            IboObject infoData = new IboObject();
            IboObject result = new IboObject();
            result.Add(IboObjectKeys.InfoModel, infoData);
            using (SdmModel model = ModelHelper.GetModel(session, tableName, id))
            {
                if (!id.IsNullOrEmpty() && !model.Edit())
                {
                    AddAdditionalModels(result, tableName, model, session);
                    model.Close();
                    return new DataResponse(result);
                }

                MakeChangesToModel(model, values, id, session);

                List<RequiredField> requiredFields = model.GetRequiredFields();
                if (requiredFields.Count > 0)
                    return PapBaseManager.RequiredFieldsResponse(requiredFields);

                try
                {
                    model.Save();
                }
                catch (UniqueKeyException ex)
                {
                    return PapBaseManager.ErrorToastResponse(ex.Message);
                }
                if (tableName == Tbl.BILD && additionalValues.Count > 0)
                {
                    try
                    {
                        SaveImage(session, model.MainRec["id"].ToString(), additionalValues["url"].ToString());
                    }
                    catch (ImageSizeExceededException ex)
                    {
                        return new ErrorResponse(string.Format(ex.WebMessage, session.AdminOptions.MaxImageSizeInKb.Value), "ImageSizeExceeded");
                    }
                }

                if (getResult)
                {
                    infoData.Add(IboObjectKeys.MainData, ModelToIboObject(model, tableName, session));
                    model.GetAdditionalFieldsValue((string additionalTableName, string fieldName, IboBaseValue rawValue, string displayValue) =>
                    {
                        if (!infoData.Has<IboObject>(additionalTableName))
                            infoData.Add(additionalTableName, new IboObject());

                        if (string.IsNullOrEmpty(displayValue))
                            displayValue = WebConvertValueHelper.GetDisplayValueByDD(session, rawValue, tableName, fieldName);
                        IboObject field = new IboObject();
                        field.Add(IboObjectKeys.RawValue, rawValue);
                        field.Add(IboObjectKeys.DisplayValue, displayValue);

                        infoData.Get<IboObject>(additionalTableName).Add(fieldName.ToLower(), field);
                    });
                    AddAdditionalModels(result, tableName, model, session);
                    model.Close();
                }
                else
                {
                    model.Close();
                    return null;
                }

            }
            return new DataResponse(result);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Wendet die Änderungen auf das Model an
        /// </summary>
        /// <param name="model">Model</param>
        /// <param name="values">Neue Werte</param>
        /// <param name="id">Id des Datensatzes</param>
        /// <param name="session">Session</param>
        public void MakeChangesToModel(SdmModel model, IboObject values, string id, PapUserSession session)
        {
            foreach (KeyValuePair<string, IDataStructure> kvp in values)
            {
                DdField field = session.DataDictionary.GetField(model.TableName, kvp.Key);
                object val;
                if (field != null)
                {
                    val = WebConvertValueHelper.GetDbValueByDataBaseType(field.DataType, kvp.Value, field.TypeInfo);
                }
                else
                {
                    val = WebConvertValueHelper.GetFieldValueByIboValue(kvp.Value);
                }

                model.SetValueByFieldName(kvp.Key, val);
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Verteilt die Änderungen auf das Model für spezielle Additionalpages um zu speichern
        /// </summary>
        /// <param name="session">Session</param>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="id">Id des Datensatzes</param>
        /// <param name="values">Neue Werte</param>
        public void SendAdditionalPagesToSave(PapUserSession session, string tableName, string id, IboObject values)
        {
            if (values.Has<IboObject>(IboObjectKeys.CheckCatalogModel))
                SaveCatalogModel(session, id, tableName, values);
            if (values.Has<IboObject>(IboObjectKeys.TextBrickModel))
            {
                if (tableName.EqualsIgnoreCase(Tbl.HTMLTXTBRICK))
                    SaveTextBrickModel(session, id, values);
                else if (tableName.EqualsIgnoreCase(Tbl.MAILTMPL))
                    SaveMailTemplateModel(session, id, values);
            }
            if (values.Has<IboObjectList<IboObject>>(IboObjectKeys.TableBrickFldModel))
                SaveTableBrickFldModel(session, id, values);
            if (values.Has<IboObjectList<IboObject>>(IboObjectKeys.TableBrickFilterModel))
                SaveTableBrickFilterModel(session, id, values);
            if (values.Has<IboObjectList<IboObject>>(IboObjectKeys.FlowProfModel))
                SaveFlowProfModel(session, id, values);
            if (values.Has<IboObjectList<IboObject>>(IboObjectKeys.EvalCritExpModel))
                SaveEvalCritExpModel(session, id, values);
            if (values.Has<IboObjectList<IboObject>>(IboObjectKeys.BatchCfgModel))
                SaveBatchCfgModel(session, id, values);
            if (values.Has<IboObject>(IboObjectKeys.ElementBrickModel))
                SaveElementBrickModel(session, id, values);
            if (values.Has<IboObject>(IboObjectKeys.SkalaEleModel))
                SaveSkalaEleModel(session, id, values);
            if (values.Has<IboObject>(IboObjectKeys.SkalaAnfModel))
                SaveSkalaAnfModel(session, id, values);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Fügt die zusätzlichen Models hinzu.
        /// </summary>
        /// <param name="result">Ergebnis</param>
        /// <param name="tableName">Tabellenname</param>
        /// <param name="model">Model</param>
        /// <param name="session">Sitzung</param>
        public void AddAdditionalModels(IboObject result, string tableName, SdmModel model, PapUserSession session)
        {
            string id = model.MainId.ToString();
            switch (tableName)
            {
                case Tbl.MAILLIST:
                    result.Add(IboObjectKeys.MailListModel, GetMailListEle(session, id));
                    break;
                case Tbl.HTMLTXTBRICK:
                    result.Add(IboObjectKeys.TextBrickModel, GetTextBrickModel(session, id));
                    break;
                case Tbl.MAILTMPL:
                    result.Add(IboObjectKeys.TextBrickModel, GetMailTemplateModel(session, id));
                    break;
                case Tbl.FLOWTBLBRICKS:
                    result.Add(IboObjectKeys.TableBrickFldModel, GetTableBrickFldModel(session, id));
                    result.Add(IboObjectKeys.TableBrickFilterModel, GetTableBrickFilterModel(session, id));
                    break;
                case Tbl.FLOWPROF:
                    result.Add(IboObjectKeys.FlowProfModel, GetFlowProfModel(session, id));
                    break;
                case Tbl.BEWKRIT:
                    result.Add(IboObjectKeys.EvalCritExpModel, GetEvalCritExpModel(session, id));
                    break;
                case Tbl.BATCHCFG:
                    result.Add(IboObjectKeys.BatchCfgModel, (model as BatchCfgModel).ToIboObject());
                    break;
                case Tbl.ELEMENTBRICK:
                    result.Add(IboObjectKeys.ElementBrickModel, GetElementBrickModel(session, id));
                    result.Add(IboObjectKeys.ElementBrickFilterModel, GetElementBrickFilterModel(session, id));
                    break;
                case Tbl.SKALA:
                    result.Add(IboObjectKeys.Elements, GetSkalaEles(model as SkalaModel));
                    result.Add(IboObjectKeys.AnfList, GetSkalaAnf(model as SkalaModel));
                    break;
                default:
                    break;
            }
            if (this.isLinkpageVisible(tableName, model))
                result.Add(IboObjectKeys.LinkModel, GetLinks(session, model));
            if (model is CheckCatalogModel checkCatalogModel)
                result.Add(IboObjectKeys.CheckCatalogModel, GetCheckCatalog(checkCatalogModel));
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// prüft, ob die Zuordnungen Seite angezeigt werden soll
        /// </summary>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="model">Model</param>
        /// <returns>ist Seite sichtbar</returns>
        public bool isLinkpageVisible(string tableName, SdmModel model)
        {
            return tableName != Tbl.ORG && model.LinkModel?.Links.Count > 0;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// löscht einen Datensatz
        /// </summary>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="idList">Liste der Datensätze</param>
        /// <param name="session">Session</param>
        /// <returns>ServerResponse.</returns>
        public ServerResponse Delete(string tableName, string[] idList, PapUserSession session)
        {
            IboObject result = new IboObject();
            CanDeleteHandler canDeleteHandler = new CanDeleteHandler(tableName, idList, session, false);
            if (!canDeleteHandler.CanDeleteRecords())
                result.Add(IboObjectKeys.WarningMsg, canDeleteHandler.GetNoDeleteMessage());

            if (canDeleteHandler.DeletableIdsList.Any())
            {
                DeleteHandler handler = new DeleteHandler(tableName, canDeleteHandler.DeletableIdsList.ToArray(), session);
                handler.DeleteRecords(false);
                if (handler.ErrorRecInfos.Count > 0)
                    return new ErrorResponse(handler.ErrorMessage, handler.GetCompleteErrorMessage());
                else
                    result.Add(IboObjectKeys.DeletedCount, canDeleteHandler.DeletableIdsList.Count);
            }
            return new DataResponse(result);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Records der Meta-Tabelle und befüllt das übergeben IboObject
        /// </summary>
        /// <param name="result">Ergebnis</param>
        /// <param name="session">Session</param>
        /// <param name="tableName">Tabellenname</param>
        /// <param name="linkId">Id der Zuordnung</param>
        public void FillMetaTableRec(ref IboObject result, PapUserSession session, string tableName, string linkId)
        {
            string[] metaFields = session.DataDictionary.GetFieldNames(tableName);
            DataTable metaTable = session.DataHandler.LoadDataTable(tableName, metaFields, $"{Fld.ID}='{linkId}'");
            using (TableDataSerializer serializer = new TableDataSerializer(session, tableName))
            {
                serializer.Serialize(metaTable.Rows[0], out IboObject dataRec, out IboObject textRec);
                result.Add(IboObjectKeys.MainRec, dataRec);
                result.Add(IboObjectKeys.MainTextRec, textRec);
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Records der Ziel-Tabelle und befüllt das übergeben IboObject
        /// </summary>
        /// <param name="result">Ergebnis</param>
        /// <param name="session">Session</param>
        /// <param name="targetTableName">Name der Zieltabelle</param>
        /// <param name="targetId">Id des Ziel-Stammdatensatzes</param>
        public void FillTableToRec(ref IboObject result, PapUserSession session, string targetTableName, string targetId)
        {
            List<string> tableToFields = LinkTable.GetFieldsTo(session, targetTableName);
            DataTable targetTable = session.DataHandler.LoadDataTable(targetTableName, tableToFields.ToArray(), $"{Fld.ID}='{targetId}'");
            using (TableDataSerializer serializer = new TableDataSerializer(session, targetTableName))
            {
                serializer.Serialize(targetTable.Rows[0], out IboObject dataRec, out IboObject textRec);
                result.Add(IboObjectKeys.TargetRec, dataRec);
                result.Add(IboObjectKeys.TargetTextRec, textRec);
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt alle Zuordnungen des Datensatzes
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="model">Model</param>
        /// <returns>Liste der Zuordnungen</returns>
        public IboObjectList<IboObject> GetLinks(PapUserSession session, SdmModel model)
        {
            IboObjectList<IboObject> linkList = new IboObjectList<IboObject>();
            foreach (LinkTable link in model.LinkModel.Links)
            {
                IboObjectList<IboObject> linkDataList = new IboObjectList<IboObject>();
                foreach (LinkEntry linkEntry in link.LinkEntries)
                {
                    IboObject linkData = new IboObject();
                    linkData.Add(IboObjectKeys.id, linkEntry.LinkId.ToString());
                    linkData.Add(IboObjectKeys.label, session.LabelCache.GetDisplayText(link.TableTo.TableName, linkEntry.DesLinkId));
                    linkData.Add(IboObjectKeys.TargetId, linkEntry.DesLinkId.ToString());
                    linkData.Add(IboObjectKeys.Editable, session.LabelCache.GetRow(link.TableTo.TableName, linkEntry.DesLinkId) != null);
                    linkDataList.Add(linkData);
                }
                IboObject linkTableList = new IboObject();
                linkTableList.Add(IboObjectKeys.tableName, link.TableMeta.TableName);
                linkTableList.Add(IboObjectKeys.caption, link.GetCaption());
                linkTableList.Add(IboObjectKeys.TargetTableName, link.TableTo.TableName);
                linkTableList.Add(IboObjectKeys.TargetTableFilter, link.FilterTableTo);
                linkTableList.Add(IboObjectKeys.FieldFrom, link.FieldNameTableFrom);
                linkTableList.Add(IboObjectKeys.FieldTo, link.FieldNameTableTo);
                linkTableList.Add(IboObjectKeys.ExtraInfo, link.Tag?.ToString() ?? string.Empty);
                linkTableList.Add(IboObjectKeys.LinkList, linkDataList);
                linkList.Add(linkTableList);
            }
            model.Close(false);
            return linkList;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt alle Zuordnungen anhand der Id und dem Tabellenname
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="tableName">Tabellenname</param>
        /// <param name="id">Id</param>
        /// <returns>Liste der Zuordnungen</returns>
        public IboObjectList<IboObject> GetLinksById(PapUserSession session, string tableName, string id)
        {
            using (SdmModel model = ModelHelper.GetModel(session, tableName, id))
                return GetLinks(session, model);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Fügt Zuordnungen hinzu.
        /// </summary>
        /// <param name="session">Session</param>
        /// <param name="id">Id des Datensatzes</param>
        /// <param name="tableName">Tabellenname des Datensatzes</param>
        /// <param name="tableToIds">Ids der zuzuordnenden Datensätze</param>
        /// <param name="tableToName">Tabellenname der zuzuordnenden Datensätze</param>
        /// <param name="metaTableName">Name der Zuordnungtabelle</param>
        /// <param name="fieldFrom">Feld des Hauptdatensatzes </param>
        /// <param name="fieldTo">Feld des verlinkten Datensatzes</param>
        /// <param name="extraInfo">Zusatzinfos (z.B. strelId)</param>
        /// <returns>Id des ersten Links</returns>
        public string AddLinks(PapUserSession session, string id, string tableName, string[] tableToIds, string tableToName, string metaTableName, string fieldFrom, string fieldTo, string extraInfo)
        {
            List<string> tableToFields = LinkTable.GetFieldsTo(session, tableToName);
            string firstNewId = "";
            using (SdmModel model = ModelHelper.GetModel(session, tableName, id))
            {
                model.Edit();
                LinkTable linkTable = model.LinkModel.Links.Where((link) =>
                {
                    return link.TableNameMeta == metaTableName &&
                            link.FieldNameTableFrom == fieldFrom &&
                            link.FieldNameTableTo == fieldTo &&
                            (link.Tag?.ToString() ?? string.Empty) == extraInfo;
                }).FirstOrDefault();
                foreach (string tableToId in tableToIds)
                {
                    DataTable tableTo = session.DataHandler.LoadDataTable(tableToName, tableToFields.ToArray(), $"{Fld.ID}='{tableToId}'");
                    SdmLinkHelper linkHelper = new SdmLinkHelper();
                    string newId = linkHelper.AddRowToLinkTable(session, linkTable, id, tableToId, tableTo.Rows[0])[Fld.ID].ToString();

                    if (tableToIds[0] == tableToId)
                    {
                        firstNewId = newId;
                    }

                }
                model.LinkModel.Modified = true;
                model.Save();
                model.Close();
            }
            return firstNewId;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert das SkalaElemodel
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <param name="values">Werte</param>
        public void SaveSkalaEleModel(PapUserSession session, string id, IboObject values)
        {
            SkalaModel skalaModel = new SkalaModel(session.DataProvider);
            skalaModel.Load(id);
            IboObject skalaEleModel = values.Get<IboObject>(IboObjectKeys.SkalaEleModel);
            IboObjectList<IboObject> elements = skalaEleModel.GetListOrNull<IboObject>(IboObjectKeys.Elements);

            if (elements != null)
            {
                skalaModel.EleTable.DeleteAllRows();
                int sortNr = 1;
                foreach (IboObject ele in elements)
                {
                    DataRow row = skalaModel.EleTable.Select($"{Fld.ID}='{ele.GetSaveStringValue(IboObjectKeys.id)}'", string.Empty, DataViewRowState.Deleted).FirstOrDefault();
                    if (row != null)
                    {
                        row.RejectChanges();
                    }
                    else
                    {
                        row = skalaModel.EleTable.NewRow();
                        row[Fld.ID] = skalaModel.DataProvider.GetNextId(Tbl.SKALAELE);
                        row[Fld.SKALAID] = skalaModel.MainId;
                        skalaModel.EleTable.Rows.Add(row);
                    }
                    DataUtils.SetStrValueIfNotSame(row, Fld.TXT, ele.GetSaveStringValue(IboObjectKeys.caption));
                    DataUtils.SetIntValueIfNotSame(row, Fld.SORTNR, sortNr);
                    sortNr++;
                }
            }
            skalaModel.Save();
            skalaModel.Close();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert das SkalaAnfmodel
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <param name="values">Werte</param>
        public void SaveSkalaAnfModel(PapUserSession session, string id, IboObject values)
        {
            SkalaModel skalaModel = new SkalaModel(session.DataProvider);
            skalaModel.Load(id);
            IboObject skalaAnfModel = values.Get<IboObject>(IboObjectKeys.SkalaAnfModel);
            IboObjectList<IboObject> anfList = skalaAnfModel.GetListOrNull<IboObject>(IboObjectKeys.AnfList);

            if (anfList != null && skalaModel.Session.Rights.TableValue(Tbl.ANF) == Common.Data.Rights.UserRightValue.Write)
            {
                skalaModel.AnfTable.DeleteAllRows();
                List<string> anfIds = new List<string>();
                foreach (IboObject anf in anfList)
                {
                    string anfId = anf.GetSaveStringValue(IboObjectKeys.id);
                    anfIds.Add(anfId);
                    skalaModel.AnfTable.Rows.Add(anfId, skalaModel.MainId);
                }
                skalaModel.AnfTable.AcceptChanges(); // Datenbankupdate durch SaveModel vermeiden
                DateTime serverNow = skalaModel.Session.DataProvider.GetCurrentDateTime();
                int anzSet = skalaModel.Session.Query.Update(Tbl.ANF, out QueryTable anfTbl)
                    .Set
                        .Field(anfTbl, Fld.SKALAID).Value(skalaModel.MainId)
                        .Field(anfTbl, Fld.USERAEND).Value(skalaModel.Session.UserInfo.Id)
                        .Field(anfTbl, Fld.DATAEND).Value(serverNow)
                    .Where
                        .Field(anfTbl, Fld.ID).InValues(anfIds.ToArray())
                    .And
                        .Begin
                            .Field(anfTbl, Fld.SKALAID).IsNotEqualTo.Value(skalaModel.MainId)
                        .Or
                            .Field(anfTbl, Fld.SKALAID).IsNull
                        .End
                    .ExecuteNonQuery();

                int anzClear = skalaModel.Session.Query.Update(Tbl.ANF, out anfTbl)
                    .Set
                        .Field(anfTbl, Fld.SKALAID).Value(DBNull.Value)
                        .Field(anfTbl, Fld.USERAEND).Value(skalaModel.Session.UserInfo.Id)
                        .Field(anfTbl, Fld.DATAEND).Value(serverNow)
                    .Where
                        .Field(anfTbl, Fld.ID).NotInValues(anfIds.ToArray())
                    .And
                        .Field(anfTbl, Fld.SKALAID).IsEqualTo.Value(skalaModel.MainId)
                    .ExecuteNonQuery();
            }
            skalaModel.Save();
            skalaModel.Close();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert das übergebene Bild
        /// </summary>
        /// <param name="session">Aktuelle Sitzung</param>
        /// <param name="id">Id des Bildes</param>
        /// <param name="url">Url mit Bilddaten</param>
        public void SaveImage(UserSession session, string id, string url)
        {
            BildModel model = new BildModel(session.DataProvider);
            model.Load(id);
            string[] split = url.ToString().Split(';');
            string type = split[0].Remove(0, "data:image/".Length).ToLower();
            string base64Content = split[1].Remove(0, "base64,".Length);
            byte[] imageBytes = Convert.FromBase64String(base64Content);
            using (MemoryStream ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
            {
                ms.Write(imageBytes, 0, imageBytes.Length);
                model.MainRec[Fld.GLYPH] = ms.ToArray();

                DdField field = session.DataDictionary.GetField(Tbl.BILD, Fld.TYP);
                if (field != null && field.Size >= type.Length)
                    model.MainRec[Fld.TYP] = type;

                ms.Close();
            }
            model.Save();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Liefert die Bilddaten
        /// </summary>
        /// <param name="session">Aktuelle Benutzersitzung</param>
        /// <param name="id">id des Datensatzes</param>
        /// <param name="download">Soll Bild heruntergeladen werden</param>
        /// <returns>Bilddaten</returns>
        public ServerResponse GetImage(PapUserSession session, string id, bool download = false)
        {
            byte[] bytes = null;
            string mimeType = null;
            using (BildModel model = new BildModel(session.DataProvider))
            {
                model.Load(id);
                byte[] preview = (byte[])model.MainRec[Fld.ORIGINAL];
                string fileName = model.MainRec[Fld.TXT].ToString();
                model.Close(false);
                using (MemoryStream imgStream = new MemoryStream(preview))
                {
                    Image image = Image.FromStream(imgStream);
                    mimeType = ImageCodecInfo.GetImageDecoders().First(c => c.FormatID == image.RawFormat.Guid).MimeType;
                    if (image.Height > 400 && download == false)
                    {
                        int height = 400;
                        int width = Math.Max((int)Math.Round(400 * ((decimal)image.Width / (decimal)image.Height), MidpointRounding.AwayFromZero), 1);
                        Image newImage = ImageHelper.ResizeImage(Image.FromStream(imgStream), width, height);
                        using (MemoryStream outStream = new MemoryStream())
                        {
                            newImage.Save(outStream, image.RawFormat);
                            bytes = outStream.ToArray();
                        }
                    }
                    else
                    {
                        bytes = imgStream.ToArray();
                    }
                }
                if (download)
                    return new FileDownload(fileName, bytes, mimeType).Download();
                else
                    return new FileResponse(bytes, "preview_" + id, mimeType);
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Bild-Url
        /// </summary>
        /// <param name="session">Aktuelle Sitzung</param>
        /// <param name="id">Id des Bildes</param>
        /// <returns>Url</returns>
        public ServerResponse GetImageUrl(UserSession session, string id)
        {
            using (BildModel model = new BildModel(session.DataProvider))
            {
                model.Load(id);
                bool hasImage = !string.IsNullOrEmpty(model.MainRec[Fld.GLYPH].ToString());
                string imageDatAend = model.MainRec[Fld.DATAEND].ToString();
                model.Close(false);
                if (hasImage)
                    return new DataResponse(new IboObject().Add(IboObjectKeys.Url, new FileResponseUrl(session.SessionId).SdmManager_ImagePreview(id, imageDatAend)));
                else
                    return new DataResponse(new IboObject().Add(IboObjectKeys.Url, null));
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Liefert den Prüfkatalog
        /// </summary>
        /// <param name="model">Prüfkatalog</param>
        /// <returns>Prüfkatalog-Information</returns>
        public IboObject GetCheckCatalog(CheckCatalogModel model)
        {
            int categoryCounter = 0;
            IboObject result = new IboObject();
            IboObjectList<IboObject> categories = new IboObjectList<IboObject>();

            foreach (KeyValuePair<string, CheckBase> kvp in model.Checks.OrderBy(x => x.Value.Caption).OrderBy(x => x.Value.SubCategory).OrderBy(x => x.Value.Category))
            {
                CheckBase check = kvp.Value;
                IboObject checkRule = new IboObject();
                checkRule.Add(IboObjectKeys.key, kvp.Key);
                checkRule.Add(IboObjectKeys.caption, check.Caption);
                checkRule.Add(IboObjectKeys.SubCategory, check.SubCategory);
                checkRule.Add(IboObjectKeys.Description, check.Description);
                checkRule.Add(IboObjectKeys.Enabled, check.Enabled);
                checkRule.Add(IboObjectKeys.ProtokollItemLevel, check.ProtokollItemLevel.ToString());

                bool categoryExists = false;

                foreach (IboObject category in categories)
                {
                    if (check.Category != null && check.Category.Equals(category.Get<IboValue<string>>(IboObjectKeys.Category).Value))
                    {
                        category.Get<IboObjectList<IboObject>>(IboObjectKeys.Data).Add(checkRule);
                        categoryExists = true;

                        break;
                    }
                }
                if (categoryExists == false)
                {
                    categories.Add(CreateNewCategory(check.Category, checkRule));
                    categoryCounter++;
                }
            }
            result.Add(IboObjectKeys.Catalog, categories);
            result.Add(IboObjectKeys.ShowTabPanel, categoryCounter > 1);
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Erstellt eine neue Kategorie
        /// </summary>
        /// <param name="category">Kategorie des Katalogs</param>
        /// <param name="checkRule">Datensatz der Kategorie</param>
        /// <returns> Die neue Kategorie </returns>
        private IboObject CreateNewCategory(string category, IboObject checkRule)
        {
            IboObject newCategory = new IboObject();
            IboObjectList<IboObject> data = new IboObjectList<IboObject>();
            string icon = SetCategoryIcon(category);

            data.Add(checkRule);
            newCategory.Add(IboObjectKeys.Category, category);
            newCategory.Add(IboObjectKeys.Data, data);
            newCategory.Add(IboObjectKeys.Icon, icon);
            return newCategory;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Prüft die Kategorie und gibt das passende Icon zurück
        /// </summary>
        /// <param name="category">Kategorie des Katalogs</param>
        /// <returns> Passendes Icon zur Kategorie </returns>
        private string SetCategoryIcon(string category)
        {
            if (category.Equals(Resources.DefaultCategoryCommon))
            {
                return "fa fa-file-alt";
            }
            else if (category.Equals(Resources.CategoryBpmn))
            {
                return "far fa-circle";
            }
            else if (category.Equals(Resources.CategoryDebug))
            {
                return "fas fa-bug";
            }
            else if (category.Equals(Resources.CategoryIboStd))
            {
                return "iboStandardIcon";
            }
            else if (category.Equals(Resources.RiskManagement))
            {
                return "fas fa-exclamation-triangle";
            }
            return null;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Prüft, um welchen Katalog es sich handelt und speichert diesen
        /// </summary>
        /// <param name="session">Sitzungen</param>
        /// <param name="id">Id des Datensatzes</param>
        /// <param name="tableName">Tabellenname</param>
        /// <param name="values">Werte</param>
        public void SaveCatalogModel(PapUserSession session, string id, string tableName, IboObject values)
        {
            IboObject changedValues = values.Get<IboObject>(IboObjectKeys.CheckCatalogModel);

            using (SdmModel sdmModel = ModelHelper.GetModel(session, tableName, id))
            {
                if (!(sdmModel is CheckCatalogModel model))
                {
                    Debug.Fail("Model ist kein CheckKatalogModel");
                    return;
                }

                model.Edit();
                foreach (KeyValuePair<string, IDataStructure> field in changedValues)
                {
                    model.Checks.TryGetValue(field.Key, out CheckBase check);
                    IboObject record = changedValues.Get<IboObject>(field.Key);

                    IDataStructure enabledValue = record.GetOrDefault<IDataStructure>(IboObjectKeys.Enabled);
                    IDataStructure itemLevel = record.GetOrDefault<IDataStructure>(IboObjectKeys.ProtokollItemLevel);

                    if (itemLevel != null)
                    {
                        switch (itemLevel.ToString())
                        {
                            case "Warning":
                                check.ProtokollItemLevel = ProtokollItemLevel.Warning;
                                break;
                            case "Information":
                                check.ProtokollItemLevel = ProtokollItemLevel.Information;
                                break;
                            case "Error":
                                check.ProtokollItemLevel = ProtokollItemLevel.Error;
                                break;
                            default:
                                break;
                        }
                    }
                    if (enabledValue != null)
                    {
                        check.Enabled = bool.Parse(enabledValue.ToString());
                    }
                }
                model.Save(); // Save muss aufgerufen werden, da Strukturänderungen im BeforeSave übertragen werden (nur Close reicht nicht)
                model.Close();
            }
        }

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

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt alle Elemente im Mailverteiler
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <returns>Liste aller Elemente</returns>
        public IboObjectList<IboObject> GetMailListEle(PapUserSession session, string id)
        {
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            using (MailListModel model = new MailListModel(session.DataProvider))
            {
                model.Load(id);
                foreach (DataRow row in model.EleTable.Rows)
                {
                    IboObject entry = new IboObject();
                    entry.Add(IboObjectKeys.id, row[Fld.ID].ToString());
                    entry.Add(IboObjectKeys.text, WorkflowHelper.CalcRespText(row, session, shortText: true));
                    entry.Add(IboObjectKeys.tableName, GetRefTableNameByRow(row));
                    result.Add(entry);
                }

                model.Close();
            }
            return result;
        }

        private IDataStructure GetSkalaEles(SkalaModel model)
        {
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            foreach (DataRow row in model.EleTable.Select(string.Empty, Fld.SORTNR))
            {
                result.Add(new IboObject
                {
                    { IboObjectKeys.id, row[Fld.ID].ToString() },
                    { IboObjectKeys.caption, row[Fld.TXT].ToString() }
                });
            }

            return result;
        }

        private IDataStructure GetSkalaAnf(SkalaModel model)
        {
            List<IdLabelItem> anfList = new();
            foreach (DataRow row in model.AnfTable.Select())
                anfList.Add(new IdLabelItem(row[Fld.ID], model.Session.LabelCache.GetDisplayText(Tbl.ANF, row[Fld.ID])));
            anfList.Sort();

            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            foreach (var item in anfList)
                result.Add(new IboObject() { { IboObjectKeys.id, item.Id.ToString() }, { IboObjectKeys.caption, item.Label.ToString() } });

            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt das Textbaustein-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <returns>Das Textbaustein-Model</returns>
        private IboObject GetTextBrickModel(PapUserSession session, string id)
        {
            using (HtmlTxtBrickModel model = new HtmlTxtBrickModel(session.DataProvider))
            {
                model.Load(id);
                using (SinglePageHtmlContainerSerializer htmlContainerSerializer = new SinglePageHtmlContainerSerializer(session, model.HtmlContainer))
                {
                    return htmlContainerSerializer.SerializeCKEditorHtml();
                }
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt das Elementbaustein-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <returns>Das Elementbaustein-Model</returns>
        private IboObject GetElementBrickModel(PapUserSession session, string id)
        {
            using (ElementBrickModel model = new ElementBrickModel(session.DataProvider))
            {
                model.Load(id);
                using (SinglePageHtmlContainerSerializer htmlContainerSerializer = new SinglePageHtmlContainerSerializer(session, model.HtmlContainer as SinglePageHtmlContainer))
                {
                    return htmlContainerSerializer.SerializeCKEditorHtml();
                }
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt das Elementbaustein-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <returns>Das Elementbaustein-Model</returns>
        private IboObjectList<IboObject> GetElementBrickFilterModel(PapUserSession session, string id)
        {
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            ElementBrickModel model = new ElementBrickModel(session.DataProvider);
            model.Load(id);
            foreach (DataRow row in model.ElementFilterTable.Rows)
            {
                IboObject entry = new IboObject();
                entry.Add(IboObjectKeys.id, row[Fld.ID].ToString());
                entry.Add(IboObjectKeys.Var, row[Fld.VARNAME].ToString());
                entry.Add(IboObjectKeys.Value, row[Fld.VAL].ToString());
                result.Add(entry);
            }
            model.Close();
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt das Textbaustein-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <returns>Das Textbaustein-Model</returns>
        private IboObject GetMailTemplateModel(PapUserSession session, string id)
        {
            using (MailTmplModel model = new MailTmplModel(session.DataProvider))
            {
                model.Load(id);
                using (SinglePageHtmlContainerSerializer htmlContainerSerializer = new SinglePageHtmlContainerSerializer(session, model.HtmlContainer as SinglePageHtmlContainer))
                {
                    return htmlContainerSerializer.SerializeCKEditorHtml();
                }
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert das Textbaustein-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <param name="values">Werte</param>
        public void SaveTextBrickModel(PapUserSession session, string id, IboObject values)
        {
            IboObject textBrickModel = values.Get<IboObject>(IboObjectKeys.TextBrickModel);
            string html = textBrickModel.GetOrDefault<IboValue<string>>(IboObjectKeys.Html)?.Value;

            if (html != null)
            {
                using (HtmlTxtBrickModel model = new HtmlTxtBrickModel(session.DataProvider))
                {
                    model.Load(id);
                    model.HtmlContainer.SetNewHtmlText(html, true);
                    model.HtmlContainer.BeforeSave();
                    model.Save();
                    model.Close();
                }
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert das Elementbaustein-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <param name="values">Werte</param>
        public void SaveElementBrickModel(PapUserSession session, string id, IboObject values)
        {
            ElementBrickModel model = new ElementBrickModel(session.DataProvider);
            model.Load(id);
            IboObject elementBrickModel = values.Get<IboObject>(IboObjectKeys.ElementBrickModel);
            string html = elementBrickModel.GetOrDefault<IboValue<string>>(IboObjectKeys.Html)?.Value;
            IboObjectList<IboObject> elementBrickFilterModel = values.GetOrDefault(IboObjectKeys.ElementBrickFilterModel, new IboObjectList<IboObject>());

            if (html != null)
            {
                model.HtmlContainer.SetNewHtmlText(html, true);
                model.HtmlContainer.BeforeSave();
            }
            model.ElementFilterTable.DeleteAllRows();
            foreach (IboObject elementBrickFilter in elementBrickFilterModel)
            {
                DataRow row = model.ElementFilterTable.NewRow();
                row[Fld.ID] = session.DataProvider.GetNextId(Tbl.ELEMENTBRICKFILTER);
                row[Fld.ELEMENTBRICKID] = model.MainId;
                row[Fld.VARNAME] = elementBrickFilter[IboObjectKeys.Var].ToString();
                row[Fld.VAL] = elementBrickFilter[IboObjectKeys.Value].ToString();
                model.ElementFilterTable.Rows.Add(row);
            }
            model.Save();
            model.Close();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert das Briefvorlagen-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <param name="values">Werte</param>
        public void SaveMailTemplateModel(PapUserSession session, string id, IboObject values)
        {
            IboObject textBrickModel = values.Get<IboObject>(IboObjectKeys.TextBrickModel);
            string html = textBrickModel.GetOrDefault<IboValue<string>>(IboObjectKeys.Html)?.Value;

            if (html != null)
            {
                using (MailTmplModel model = new MailTmplModel(session.DataProvider))
                {
                    model.Load(id);
                    model.HtmlContainer.SetNewHtmlText(html, true);
                    model.Save();
                    model.Close();
                }
            }
        }
        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt eine Liste mit Feldern der Tabellenbausteine, welche im Web als Model behandelt wird.
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <returns>Liste der Felder</returns>
        private IboObjectList<IboObject> GetTableBrickFldModel(PapUserSession session, string id)
        {
            IboObjectList<IboObject> fieldList = new IboObjectList<IboObject>();
            using (TblBrickModel model = new TblBrickModel(session.DataProvider))
            {
                model.Load(id);

                DataRow[] dataRows = model.BrickFieldsTable.Select().OrderBy(u => u[Fld.SORTNR]).ToArray();
                foreach (DataRow row in dataRows)
                {
                    IboObject field = new IboObject();

                    model.RefreshFieldLists();
                    TblBrickFieldBaseInfo fieldInfo = model.FieldInfos.AllFields.Where(f => f.VarName.EqualsIgnoreCase(row[Fld.FLDNAME].ToString())).FirstOrDefault();

                    field.Add(IboObjectKeys.id, row[Fld.ID].ToString());
                    field.Add(IboObjectKeys.Txt, row[Fld.TXT].ToString());
                    field.Add(IboObjectKeys.Font, row[Fld.FONT].ToString());
                    field.Add(IboObjectKeys.FieldName, row[Fld.FLDNAME].ToString());

                    string[] fieldNameInfo = row[Fld.FLDNAME].ToString().Split('.');
                    string fieldName, tableName;
                    if (fieldNameInfo.Length > 1)
                    {
                        tableName = fieldNameInfo[0];
                        fieldName = fieldNameInfo[1];
                    }
                    else
                    {
                        tableName = model.GetFieldTableName();
                        fieldName = row[Fld.FLDNAME].ToString();
                    }

                    if (fieldName == VariableTranslatorConst.EffectivePrefix + Fld.GROSSRISKCLASSID)
                        field.Add(IboObjectKeys.DisplayFieldName, session.DataHandler.GetDisplayLabel(Tbl.FLOWVRISKINFO, Fld.GROSSRISKCLASSID) + PapDataStrings.VarCapEffectiveSuffix);
                    else if (fieldName == VariableTranslatorConst.EffectivePrefix + Fld.NETRISKCLASSID)
                        field.Add(IboObjectKeys.DisplayFieldName, session.DataHandler.GetDisplayLabel(Tbl.FLOWVRISKINFO, Fld.NETRISKCLASSID) + PapDataStrings.VarCapEffectiveSuffix);
                    else if (fieldName == Fld.STATUS && tableName == Tbl.MAPPEVELE)
                        field.Add(IboObjectKeys.DisplayFieldName, session.DataHandler.GetDisplayLabel(Tbl.MAPPEV, Fld.STATUS));
                    else if (tableName.StartsWith(TblBrickFieldURLInfo.PrefixUrl))
                        field.Add(IboObjectKeys.DisplayFieldName, session.DataHandler.GetDisplayLabel(tableName.Substring(TblBrickFieldURLInfo.PrefixUrl.Length), fieldName.Substring(TblBrickFieldURLInfo.PrefixUrl.Length)));
                    else if (fieldInfo != null)
                        field.Add(IboObjectKeys.DisplayFieldName, fieldInfo.GetPopupItemCaption());
                    else
                        field.Add(IboObjectKeys.DisplayFieldName, session.DataHandler.GetDisplayLabel(tableName, fieldName));

                    field.Add(IboObjectKeys.Width, row[Fld.WIDTH].ToString());
                    field.Add(IboObjectKeys.SortNr, row[Fld.SORTNR].ToString());
                    field.Add(IboObjectKeys.HorizontalAlignment, row[Fld.HORIZONTALALIGNMENT].ToString());
                    field.Add(IboObjectKeys.HorizontalAlignmentCell, row[Fld.HORIZONTALALIGNMENTCELL].ToString());
                    field.Add(IboObjectKeys.VerticalAlignment, row[Fld.VERTICALALIGNMENT].ToString());
                    field.Add(IboObjectKeys.VerticalAlignmentCell, row[Fld.VERTICALALIGNMENTCELL].ToString());

                    ValueHelper.TryGetColorValue(row[Fld.BACKGROUNDCOLOR], out Color backgroundColor);
                    field.Add(IboObjectKeys.BackgroundColor, backgroundColor.ToIboObject());

                    if (!row[Fld.COLOR].ToString().IsNullOrEmpty())
                    {
                        ValueHelper.TryGetColorValue(row[Fld.COLOR], out Color color);
                        field.Add(IboObjectKeys.Color, color.ToIboObject());
                    }
                    else
                    {
                        field.Add(IboObjectKeys.Color, Color.Black.ToIboObject());
                    }
                    if (fieldInfo == null)
                        fieldInfo = model.FieldInfos.AllFields.FirstOrDefault();
                    field.Add(IboObjectKeys.IsHyperLink, fieldInfo.PaintHyperLinks);

                    fieldList.Add(field);
                }
                model.Close(false);
            }
            return fieldList;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert die Felder in das Tabellenbaustein-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <param name="values">Werte</param>
        public void SaveTableBrickFldModel(PapUserSession session, string id, IboObject values)
        {
            using (TblBrickModel model = new TblBrickModel(session.DataProvider))
            {
                model.Load(id);
                IboObjectList<IboObject> tableBrickFldModel = values.Get<IboObjectList<IboObject>>(IboObjectKeys.TableBrickFldModel);
                foreach (DataRow row in model.BrickFieldsTable.Rows)
                    row.Delete();

                foreach (IboObject tableBrickFld in tableBrickFldModel)
                {
                    model.CreateNewColumnWithWebValues(tableBrickFld);
                }
                model.Save();
                model.Close();
            }
        }

        /// <summary>
        /// Holt die Diagrammtypen für Tabellenbausteine
        /// </summary>
        /// <returns></returns>
        public IboObjectList<IboObject> GetGraphTypeData()
        {
            DataTable table = new DataTable();
            GraphTypeDisplayText xTable = new GraphTypeDisplayText();
            xTable.FillTable(table);
            return GetFlowTblBrickSettingsData(table);
        }

        /// <summary>
        /// Holt die Datenquellen für Tabellenbausteine
        /// </summary>
        /// <returns></returns>
        public IboObjectList<IboObject> GetDataSourceData()
        {
            DataTable table = new DataTable();
            TblBrickSourceDisplayText xTable = new TblBrickSourceDisplayText();
            xTable.FillTable(table);
            return GetFlowTblBrickSettingsData(table);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Tabellennamen für die Tabellen-Auswahl der Tabellenbausteine
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <returns></returns>
        public IboObjectList<IboObject> GetFlowTblBrickTableNameData(PapUserSession session, string graphType)
        {
            DataTable table = new DataTable();
            FlowTblBrickTableNameDisplayText xTable = new FlowTblBrickTableNameDisplayText(session);
            xTable.FillTable(table);
            HashSet<string> tables = TblBrickHelper.GetTableBrickTablesOfGraphType(session, graphType);
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            foreach (DataRow row in table.AsEnumerable().Where(table => tables.Contains(table[Fld.ID])).OrderBy(table => table[Fld.TXT]))
            {
                IboObject entry = new IboObject();
                entry.Add(IboObjectKeys.key, row[Fld.ID].ToString());
                entry.Add(IboObjectKeys.DisplayName, row[Fld.TXT].ToString());
                result.Add(entry);
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Tabellenkopf-Modis für die Tabellenbausteine
        /// </summary>
        /// <returns>Tabellenkopf-Modis</returns>
        public IboObjectList<IboObject> GetFlowTblBrickHeaderModeData()
        {
            DataTable table = new DataTable();
            FlowTblBrickHeaderModeDisplayText xTable = new FlowTblBrickHeaderModeDisplayText();
            xTable.FillTable(table);
            return GetFlowTblBrickSettingsData(table);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Tabellenbausteinregeln
        /// </summary>
        /// <returns>Tabellenbausteinregeln</returns>
        public IboObject GetFlowTblBrickRuleKeyData()
        {
            DataTable table = new DataTable();
            FlowTblBrickRuleKeyDisplayText xTable = new FlowTblBrickRuleKeyDisplayText();
            xTable.FillTable(table);

            IboObjectList<IboObject> fktList = new IboObjectList<IboObject>();
            IboObjectList<IboObject> stList = new IboObjectList<IboObject>();
            IboObjectList<IboObject> orgList = new IboObjectList<IboObject>();
            IboObjectList<IboObject> smList = new IboObjectList<IboObject>();
            IboObjectList<IboObject> flowVList = new IboObjectList<IboObject>();

            foreach (DataRow row in table.AsEnumerable())
            {
                IboObject entry = new IboObject();
                entry.Add(IboObjectKeys.key, row[Fld.ID].ToString());
                entry.Add(IboObjectKeys.DisplayName, row[Fld.TXT].ToString());

                switch (row[Fld.ID].ToString())
                {
                    case FlowDataRuleKeys.RuleAufgabenTraeger:
                        fktList.Add(entry);
                        stList.Add(entry);
                        break;
                    case FlowDataRuleKeys.RuleRole:
                    case FlowDataRuleKeys.RuleAccountable:
                    case FlowDataRuleKeys.RuleConsulted:
                    case FlowDataRuleKeys.RuleInformed:
                    case FlowDataRuleKeys.RuleInvolved:
                        fktList.Add(entry);
                        stList.Add(entry);
                        orgList.Add(entry);
                        smList.Add(entry);
                        break;
                    case FlowDataRuleKeys.RuleOrgeinheit:
                        orgList.Add(entry);
                        break;
                    case FlowDataRuleKeys.RuleSachmittel:
                        smList.Add(entry);
                        break;
                    case FlowDataRuleKeys.RuleInitialprozess:
                    case FlowDataRuleKeys.RuleTeilprozess:
                    case FlowDataRuleKeys.RuleFolgeprozess:
                        flowVList.Add(entry);
                        break;
                }
            }

            IboObject result = new IboObject();
            result.Add(Tbl.FKT, fktList);
            result.Add(Tbl.ST, stList);
            result.Add(Tbl.ORG, orgList);
            result.Add(Tbl.SM, smList);
            result.Add(Tbl.FLOWV, flowVList);

            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Liste der Schriftarten
        /// </summary>
        /// <returns>Schriftarten</returns>
        public IboObjectList<IboObject> GetFontFamilyList()
        {
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            DataTable table = new DataTable();
            FontFamilyDisplayText fontFamilyList = new FontFamilyDisplayText();
            fontFamilyList.FillTable(table);

            foreach (DataRow row in table.AsEnumerable())
            {
                IboObject fontFamily = new IboObject();
                fontFamily.Add(IboObjectKeys.key, row[Fld.ID].ToString());
                fontFamily.Add(IboObjectKeys.DisplayName, row[Fld.TXT].ToString());
                result.Add(fontFamily);
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Baut die IboObjectList für eine Combobox anhand einer Table zusammen.
        /// </summary>
        /// <param name="table"></param>
        /// <returns></returns>
        private IboObjectList<IboObject> GetFlowTblBrickSettingsData(DataTable table)
        {
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            foreach (DataRow row in table.AsEnumerable().OrderBy(table => table[Fld.TXT]))
            {
                IboObject entry = new IboObject();
                entry.Add(IboObjectKeys.key, row[Fld.ID].ToString());
                entry.Add(IboObjectKeys.DisplayName, row[Fld.TXT].ToString());
                result.Add(entry);
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Liste der Felder, die man zum Tabellenbaustein hinzufügen kann
        /// </summary>
        /// <param name="tableName">Tabellenbaustein</param>
        /// <param name="distinct"></param>
        /// <param name="source">Quelle</param>
        /// <param name="session">Sitzung</param>
        /// <returns>Liste der Felder</returns>
        public IboObjectList<IboObject> GetTblBrickFields(string tableName, bool distinct, string source, PapUserSession session)
        {
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            TblBrickFieldInfos fieldInfos = new TblBrickFieldInfos(tableName, distinct, source, session);
            foreach (TblBrickFieldBaseInfo field in fieldInfos.AllFields)
            {
                if (IgnoreTblBrickField(tableName, field.FieldName))
                    continue;

                IboObject fieldGroup = result.Find(x => x.Get<IboValue<string>>(IboObjectKeys.tableName).Value.Contains(field.TableName));
                if (fieldGroup == null)
                {
                    fieldGroup = new IboObject();
                    fieldGroup.Add(IboObjectKeys.DisplayText, field.GetPopupMenuCaption());
                    fieldGroup.Add(IboObjectKeys.FieldList, new IboObjectList<IboObject>());
                    fieldGroup.Add(IboObjectKeys.tableName, field.TableName);
                    result.Add(fieldGroup);
                }

                IboObject fieldObject = new IboObject();
                if (field.TableName == tableName)
                {
                    fieldObject.Add(IboObjectKeys.FieldName, field.FieldName);
                    fieldObject.Add(IboObjectKeys.DisplayName, field.GetPopupItemCaption());
                }
                else
                {
                    fieldObject.Add(IboObjectKeys.FieldName, field.VarName);
                    fieldObject.Add(IboObjectKeys.DisplayName, field.GetPopupItemCaption());
                }
                fieldObject.Add(IboObjectKeys.IsHyperLink, field.PaintHyperLinks);
                fieldGroup.Get<IboObjectList<IboObject>>(IboObjectKeys.FieldList).Add(fieldObject);
            }
            return result;
        }

        /// <summary>
        /// Felder, die ignoriert werden sollen
        /// </summary>
        /// <param name="tableName">Tabellenname</param>
        /// <param name="fieldName">Feldname</param>
        /// <returns>true oder false</returns>
        private bool IgnoreTblBrickField(string tableName, string fieldName)
        {
            if (tableName == Tbl.MAPPEVELE && fieldName == Fld.MAPPEVELEID)
                return true;
            else
                return false;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt das Filter-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <returns>Filter-Model</returns>
        public IboObject GetTableBrickFilterModel(PapUserSession session, string id)
        {
            IboObject result = new();
            IboObjectList<IboObject> filterList = new IboObjectList<IboObject>();
            using (TblBrickModel model = new TblBrickModel(session.DataProvider))
            {
                model.Load(id);
                DataTable table = model.BrickFiltersTable;

                foreach (DataRow row in table.Rows)
                {
                    IboObject filter = new IboObject();
                    filter.Add(IboObjectKeys.FieldName, row[Fld.FLDNAME].ToString());
                    filter.Add(IboObjectKeys.Value, row[Fld.VAL].ToString());
                    filter.Add(IboObjectKeys.id, row[Fld.ID].ToString());
                    filter.Add(IboObjectKeys.Kind, row[Fld.KIND].ToString());
                    filter.Add(IboObjectKeys.KindTxt, row[Fld.KIND].ToString().ToTblFilterKind().GetDisplayText());
                    filterList.Add(filter);
                }
            }
            result.Add(IboObjectKeys.FilterList, filterList);
            result.Add(IboObjectKeys.DefaultValue, TblBrickModel.DefaultFilterKind.ToDbValue());
            result.Add(IboObjectKeys.DisplayText, TblBrickModel.DefaultFilterKind.GetDisplayText());
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speicher die Filter
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <param name="values">Werte</param>
        public void SaveTableBrickFilterModel(PapUserSession session, string id, IboObject values)
        {
            using (TblBrickModel model = new TblBrickModel(session.DataProvider))
            {
                model.Load(id);
                IboObjectList<IboObject> tableBrickFilterModel = values.Get<IboObjectList<IboObject>>(IboObjectKeys.TableBrickFilterModel);
                foreach (DataRow row in model.BrickFiltersTable.Rows)
                    row.Delete();
                model.Save();

                foreach (IboObject tableBrickFilter in tableBrickFilterModel)
                {
                    DataRow row = model.BrickFiltersTable.NewRow();
                    row[Fld.ID] = DataProvider.NewGuid();
                    row[Fld.FLOWTBLBRICKSID] = model.MainId;
                    row[Fld.FLDNAME] = tableBrickFilter[IboObjectKeys.FieldName].ToString();
                    row[Fld.VAL] = tableBrickFilter[IboObjectKeys.Value].ToString();
                    row[Fld.KIND] = tableBrickFilter[IboObjectKeys.Kind].ToString();
                    model.BrickFiltersTable.Rows.Add(row);
                }
                model.Save();
                model.Close();
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Prüft anhand des Spaltennamens die referenzierte Tabelle
        /// </summary>
        /// <param name="row">Datenreihe</param>
        /// <returns>Tabellenname</returns>
        private string GetRefTableNameByRow(DataRow row)
        {
            if (!string.IsNullOrEmpty(row[Fld.PRSID].ToString()))
                return Tbl.PRS;
            else if (!string.IsNullOrEmpty(row[Fld.FKTID].ToString()))
                return Tbl.FKT;
            else if (!string.IsNullOrEmpty(row[Fld.STID].ToString()))
                return Tbl.ST;
            else if (!string.IsNullOrEmpty(row[Fld.TEAMID].ToString()))
                return Tbl.TEAM;
            else if (!string.IsNullOrEmpty(row[Fld.ORGID].ToString()))
                return Tbl.ORG;
            else if (!string.IsNullOrEmpty(row[Fld.MAILLISTID].ToString()))
                return Tbl.MAILLIST;
            else
                return null;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert eine Liste von neuen Elementen im Mailverteiler
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">ID</param>
        /// <param name="dataIds">Ids der Elemente</param>
        /// <param name="tableName">Tabelenname</param>
        public void SaveMailListEle(UserSession session, string id, string[] dataIds, string tableName)
        {
            using (MailListModel model = new MailListModel(session.DataProvider))
            {
                model.Load(id);
                model.Edit();
                foreach (string dataId in dataIds)
                {
                    if (!ExistMailListEle(model, $"{tableName}{Fld.ID}", dataId.ToString(), MailListEleKind.Reference))
                    {
                        DataRow row = model.EleTable.NewRow();
                        row[Fld.ID] = session.DataProvider.GetNextId(Tbl.MAILLISTELE);
                        row[Fld.MAILLISTID] = model.MainId;
                        SetIdOnField(dataId.ToString(), tableName, row);
                        model.EleTable.Rows.Add(row); ;
                    }
                }
                model.Save();
                model.Close();

            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert eine Variable im Mailverteiler
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id</param>
        /// <param name="fieldName">Feldname</param>
        public void SaveMailListVarEle(UserSession session, string id, string fieldName)
        {
            using (MailListModel model = new MailListModel(session.DataProvider))
            {
                if (!ExistMailListEle(model, Fld.FLDNAME, fieldName, MailListEleKind.Variable))
                {
                    model.Load(id);
                    model.Edit();
                    DataRow respRow = model.EleTable.NewRow();
                    respRow[Fld.ID] = session.DataProvider.GetNextId(Tbl.MAILLISTELE);
                    respRow[Fld.MAILLISTID] = model.MainId;
                    respRow[Fld.KIND] = MailListEleKind.Variable.ToDbValue();
                    respRow[Fld.FLDNAME] = fieldName;
                    model.EleTable.Rows.Add(respRow);
                    model.Save();
                    model.Close();
                }
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Setzt die Id auf das Feld der übergebenen Tabelle
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="tableName">Tabellenname</param>
        /// <param name="row">Datenreihe</param>
        private void SetIdOnField(string id, string tableName, DataRow row)
        {
            DataUtils.SetStrValueIfNotSame(row, Fld.KIND, MailListEleKind.Reference.ToDbValue());
            DataUtils.SetStrValueIfNotSame(row, Fld.PRSID, tableName.Equals(Tbl.PRS) ? id : string.Empty);
            DataUtils.SetStrValueIfNotSame(row, Fld.STID, tableName.Equals(Tbl.ST) ? id : string.Empty);
            DataUtils.SetStrValueIfNotSame(row, Fld.FKTID, tableName.Equals(Tbl.FKT) ? id : string.Empty);
            DataUtils.SetStrValueIfNotSame(row, Fld.ORGID, tableName.Equals(Tbl.ORG) ? id : string.Empty);
            DataUtils.SetStrValueIfNotSame(row, Fld.TEAMID, tableName.Equals(Tbl.TEAM) ? id : string.Empty);
            DataUtils.SetStrValueIfNotSame(row, Fld.FLDNAME, string.Empty);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Prüft ob das Element bereits vorhanden ist
        /// </summary>
        /// <param name="model">Model</param>
        /// <param name="fieldName">Feldname</param>
        /// <param name="value">Value</param>
        /// <param name="kind">Elementart</param>
        /// <returns>Element vorhanden</returns>
        private bool ExistMailListEle(MailListModel model, string fieldName, string value, MailListEleKind kind)
        {
            DataRow[] rows = model.EleTable.Select($"{fieldName}='{value}' AND {Fld.KIND}='{kind.ToDbValue()}'");
            return rows.Length > 0;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Gibt die Liste aller möglichen Variablen für den Mailverteiler zurück
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <returns>Liste aller Variablen</returns>
        public IboObjectList<IboObject> GetMailListVarList(PapUserSession session)
        {
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            WftVarControlHelper wftVarControlHelper = new WftVarControlHelper();
            List<WftVar> wftVarList = wftVarControlHelper.GetDocumentVars(session, true);
            foreach (WftVar wftVar in wftVarList)
            {
                IboObject varObject = new IboObject();
                varObject.Add(IboObjectKeys.DisplayText, wftVar.DisplayText);
                varObject.Add(IboObjectKeys.FieldName, wftVar.FieldName);
                result.Add(varObject);
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Cached das im TextEditor geladene Bild.
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id des Datensatzes</param>
        /// <param name="base64">Bilddatensatz</param>
        /// <param name="fileName">Dateiname</param>
        /// <returns>Bilddaten</returns>
        public IboObject AddNewTextEditorImage(PapUserSession session, string tableName, string id, string base64, string fileName)
        {
            int start = base64.IndexOf(":") + 1;
            int end = base64.IndexOf(";", start);
            string mimeType = base64.Substring(start, end - start);
            int baseStart = base64.IndexOf(",") + 1;
            byte[] bytes = Convert.FromBase64String(base64.Substring(baseStart));


            using (SdmModel model = SdmModelCreator.CreateModel(session, tableName, true))
            {
                if (!(model is ITextModel textModel))
                    return null;
                model.Load(id);
                object textId = textModel.HtmlContainer.GetTextId(true);
                string imageId = TextImageCache.Get(session).AddTextImage(textId, bytes, mimeType, fileName);
                string path = textModel.HtmlContainer.GetImageSrcWeb(imageId, session.SessionId);
                model.Close();
                return new IboObject
                {
                    {IboObjectKeys.Path, path },
                    {IboObjectKeys.ImageId, imageId }
                };
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Lädt das Bild anhand der Id
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="imageId">Id des Bildes</param>
        /// <returns>Bilddaten</returns>
        public FileResponse GetTextEditorImage(PapUserSession session, string imageTableName, string textRefField, string imageId)
        {
            TextImageCache cache = TextImageCache.Get(session);
            TextImage image = SinglePageHtmlContainer.GetTextImageById(session, cache, imageTableName, textRefField, imageId);
            if (image != null)
            {
                return new FileResponse(image.Data, image.FileName, image.MimeType);
            }
            return null;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt das Profilsicht-Model
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id des Datensatzes</param>
        /// <returns>Profilischt-Model</returns>
        public IboObject GetFlowProfModel(PapUserSession session, string id)
        {
            IboObject result = new IboObject();
            using (FlowProfModel model = new FlowProfModel(session.DataProvider))
            {
                model.Load(id);
                result.Add(IboObjectKeys.ProfData, LoadProfData(session, model));
                result.Add(IboObjectKeys.LinkModel, GetFlowProfRightsLinkModel(session, model));
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt Profilsicht-Daten
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="model">Model</param>
        /// <returns>Daten der Profilsicht</returns>
        public IboObject LoadProfData(PapUserSession session, FlowProfModel model)
        {
            IboObject result = new IboObject();
            string modelGraphType = model.MainRec[Fld.GRAPHTYPE].ToString();
            FlowGraphType graphType = (FlowGraphType)Enum.Parse(typeof(FlowGraphType), modelGraphType, true);
            Stencil stencil = session.Get<FlowSessionObjects>().StencilCache.GetOriginalStencilByGraphType(graphType);
            FlowDocument stencilDocument = stencil.DocPropSet as FlowDocument;
            using (stencilDocument.UndoRedoManager.StartNoUndoNoEdit())
            {
                LayoutHelper.DoSetCurrentLayout(stencil, stencilDocument.Layouts[0].NodeName);
                stencilDocument.UndoRedoManager.Commit();
            }
            FlowPainter painter = FlowPainter.GetPainterByDiagramType(stencilDocument.Layout.DiagramType, FlowSettings.Get(session));
            if (stencil != null)
            {
                FlowVariableTableInfo instEleVars = null;
                model.Stencil = stencil;
                FlowVariableSearchInfo variableTranslator = new FlowVariableSearchInfo(stencil);
                Dictionary<string, FlowVariableTableInfo> rules = variableTranslator.GetRuleVarsByKeys();
                FlowVariableTableInfo lineFields = variableTranslator.GetVarsByKey(VariableTranslatorConst.LinePrefix);
                FlowVariableTableInfo eleFields = variableTranslator.GetVarsByKey(VariableTranslatorConst.ElePrefix);
                if (stencil.GraphType.Equals(FlowGraphType.GPS.ToString()))
                    instEleVars = variableTranslator.GetVarsByKey(VariableTranslatorConst.InstElePrefix);
                FlowVariableTableInfo connectorFields = variableTranslator.GetVarsByKey(VariableTranslatorConst.ConnectorPrefix);
                FlowVariableTableInfo docLinkVars = variableTranslator.GetVarsByKey(VariableTranslatorConst.DocLinksPrefix);
                Dictionary<String, StencilItem> stencilItems = new Dictionary<string, StencilItem>();
                FlowInfoLane stencilInfoLane = null;
                StencilItem stencilItemEFPCol = null;

                foreach (StencilGroup group in stencil.Groups)
                {
                    if (!group.ShowInStencilBox)
                        continue;
                    foreach (StencilItem item in group.Items.OrderBy(groupMember => groupMember.SortNr))
                        stencilItems.Add(item.Key, item);
                }

                if (stencil.GraphType.Equals(FlowGraphType.FP.ToString()))
                {
                    stencilItemEFPCol = stencil.GetFirstItemByType(typeof(FlowColEFP));
                    FlowDocument document = stencil.DocPropSet as FlowDocument;
                    foreach (DrawDocumentLayout layout in document.Layouts)
                    {
                        LaneDocumentLayout laneLayout = layout as LaneDocumentLayout;
                        if (laneLayout != null)
                        {
                            stencilInfoLane = laneLayout.StencilInfoLane;
                            if (stencilInfoLane != null)
                                break;
                        }
                    }
                }

                ProfDataInitializer profInit = new ProfDataInitializer();
                DataTable ruleTable = profInit.InitRuleDataTable(model, painter, stencilItems, rules, stencilItemEFPCol, stencilInfoLane);
                result.Add(IboObjectKeys.RuleData, ProfTableToIboObject(ruleTable).Add(IboObjectKeys.Prefix, "RULE"));
                DataTable eleVarsDataTable = profInit.InitEleVarsDataTable(model, painter, eleFields, instEleVars, stencilItems, stencilItemEFPCol, stencilInfoLane);
                result.Add(IboObjectKeys.EleVarsData, ProfTableToIboObject(eleVarsDataTable).Add(IboObjectKeys.Prefix, VariableTranslatorConst.ElePrefix));
                DataTable lineVarsDataTable = profInit.InitLineVarsDataTable(model, painter, lineFields, stencilItems);
                result.Add(IboObjectKeys.LineVarsData, ProfTableToIboObject(lineVarsDataTable).Add(IboObjectKeys.Prefix, VariableTranslatorConst.LinePrefix));
                DataTable connectorVarsDataTable = profInit.InitConnectorVarsDataTable(model, painter, stencilItems, connectorFields);
                result.Add(IboObjectKeys.ConnectorVarsData, ProfTableToIboObject(connectorVarsDataTable).Add(IboObjectKeys.Prefix, VariableTranslatorConst.ConnectorPrefix));
                DataTable docLinkVarsDataTable = profInit.InitDocLinkVarsDataTable(model, docLinkVars);
                result.Add(IboObjectKeys.DocLinkVarsData, ProfTableToIboObject(docLinkVarsDataTable).Add(IboObjectKeys.Prefix, VariableTranslatorConst.DocLinksPrefix));
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Tabellen der Profilsicht in IboObject umwandeln
        /// </summary>
        /// <param name="table">Tabelle</param>
        /// <returns>Umgewandeltes Object</returns>
        public IboObject ProfTableToIboObject(DataTable table)
        {
            IboObject tableObject = new IboObject();
            IboObjectList<IboObject> columnList = new IboObjectList<IboObject>();
            foreach (DataColumn column in table.Columns)
            {
                if (column.ColumnName.Equals("KEY") || column.ColumnName.Equals("COLORELE"))
                    continue;
                IboObject columnObject = new IboObject();
                columnObject.Add(IboObjectKeys.ColumnName, column.ColumnName);
                columnObject.Add(IboObjectKeys.caption, column.Caption);
                columnList.Add(columnObject);
            }
            tableObject.Add(IboObjectKeys.ColumnList, columnList);

            IboObjectList<IboObject> rowDataList = new IboObjectList<IboObject>();
            foreach (DataRow row in table.Rows)
            {
                IboObject rowData = new IboObject();
                foreach (DataColumn column in table.Columns)
                {
                    switch (column.ColumnName)
                    {
                        case "COLORELE":
                            continue;
                        case "SYMBOL":
                            if (row[column.ColumnName] is Bitmap img)
                            {
                                ImageData imgData = new ImageData(img, ImageFormat.Png);
                                rowData.Add(column.ColumnName, imgData.ToDataUrl());
                            }
                            break;
                        case "DISPLAYTEXT":
                        case "KEY":
                        case "REGION":
                            rowData.Add(column.ColumnName, row[column.ColumnName].ToString());
                            break;
                        case "GOODWAYCOLOR":
                        case "BADWAYCOLOR":
                            ValueHelper.TryGetColorValue(row[column.ColumnName], out Color backgroundColor);
                            rowData.Add(column.ColumnName, backgroundColor.ToIboObject());
                            break;
                        default:
                            if (row[column.ColumnName] != DBNull.Value)
                                rowData.Add(column.ColumnName, (bool)row[column.ColumnName]);
                            break;

                    }
                }
                rowDataList.Add(rowData);
            }
            tableObject.Add(IboObjectKeys.RowDataList, rowDataList);
            return tableObject;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Lädt die Rechtezuordnungen für Profilsichten
        /// </summary>
        /// <param name="session">Session</param>
        /// <param name="flowProfId">Id der Profilsicht</param>
        /// <returns>Liste der Zuordnungen</returns>
        public IboObjectList<IboObject> GetFlowProfRightsLinkModel(UserSession session, string flowProfId)
        {
            using (FlowProfModel model = new FlowProfModel(session.DataProvider))
            {
                model.Load(flowProfId);
                return GetFlowProfRightsLinkModel(session, model);
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Lädt die Rechtezuordnungen für Profilsichten
        /// </summary>
        /// <param name="session">Session</param>
        /// <param name="model">Model der Profilsicht</param>
        /// <returns></returns>
        public IboObjectList<IboObject> GetFlowProfRightsLinkModel(UserSession session, FlowProfModel model)
        {
            IboObjectList<IboObject> result = new()
            {
                GetFlowProfUsersLink(session, model),
                GetFlowProfGrpLink(session, model)
            };

            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt de Gruppen Zuordnungen einer Profilsicht
        /// </summary>
        /// <param name="session">Session</param>
        /// <param name="model">Model der Profilsicht</param>
        /// <returns>Gruppen Zuordnungen</returns>
        private IboObject GetFlowProfGrpLink(UserSession session, FlowProfModel model)
        {
            IboObject result = new();

            result.Add(IboObjectKeys.tableName, Tbl.FLOWPROFGRP);
            result.Add(IboObjectKeys.TargetTableName, Tbl.GRP);
            result.Add(IboObjectKeys.caption, session.DataHandler.GetDisplayLabel(Tbl.GRP));

            IboObjectList<IboObject> linkList = new();
            foreach (DataRow row in model.GrpTable.Rows)
            {
                IboObject link = new();
                string groupId = row.GetStringValue(Fld.GRPID);
                link.Add(IboObjectKeys.id, row.GetStringValue(Fld.ID));
                link.Add(IboObjectKeys.label, session.LabelCache.GetDisplayText(Tbl.GRP, groupId));
                link.Add(IboObjectKeys.TargetId, groupId);
                linkList.Add(link);
            }

            result.Add(IboObjectKeys.LinkList, linkList);

            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Benutzer Zuordnungen einer Profilsicht
        /// </summary>
        /// <param name="session">Session</param>
        /// <param name="model">Model der Profilsicht</param>
        /// <returns>Benutzer Zuordnungen</returns>
        private IboObject GetFlowProfUsersLink(UserSession session, FlowProfModel model)
        {
            IboObject result = new();

            result.Add(IboObjectKeys.tableName, Tbl.FLOWPROFUSERS);
            result.Add(IboObjectKeys.TargetTableName, Tbl.V_USERS);
            result.Add(IboObjectKeys.caption, session.DataHandler.GetDisplayLabel(Tbl.USERS));

            IboObjectList<IboObject> linkList = new();
            foreach (DataRow row in model.UsersTable.Rows)
            {
                IboObject link = new();
                string userId = row.GetStringValue(Fld.USERID);
                link.Add(IboObjectKeys.id, row.GetStringValue(Fld.ID));
                link.Add(IboObjectKeys.label, session.LabelCache.GetDisplayText(Tbl.USERS, userId));
                link.Add(IboObjectKeys.TargetId, userId);
                linkList.Add(link);
            }

            result.Add(IboObjectKeys.LinkList, linkList);

            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speicher die geänderten Daten in die Profilsicht
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">Id des Datensatzes</param>
        /// <param name="values">Geänderten Werte</param>
        public void SaveFlowProfModel(UserSession session, string id, IboObject values)
        {
            IboObjectList<IboObject> flowProfDataList = values.Get<IboObjectList<IboObject>>(IboObjectKeys.FlowProfModel);
            using (FlowProfModel model = new FlowProfModel(session.DataProvider))
            {
                model.Load(id);
                foreach (IboObject flowProfData in flowProfDataList)
                {
                    string prefix = flowProfData[IboObjectKeys.Prefix].ToString();
                    string ruleKey = flowProfData[IboObjectKeys.RuleKey].ToString();
                    string eleKey = flowProfData[IboObjectKeys.EleKey].ToString();
                    if (!prefix.IsNullOrEmpty())
                    {
                        if (prefix == "RULE" || ruleKey == "SHOW")
                            model.SetVisible(eleKey, ruleKey, Convert.ToBoolean(flowProfData[IboObjectKeys.Value].ToString()));
                        else if (prefix == "LINE" && ruleKey == "GOODWAYCOLOR")
                        {
                            model.SetGoodWayColor(eleKey, ValueHelper.GetColorValue(flowProfData[IboObjectKeys.Value]));
                        }
                        else if (prefix == "LINE" && ruleKey == "BADWAYCOLOR")
                        {
                            model.SetBadWayColor(eleKey, ValueHelper.GetColorValue(flowProfData[IboObjectKeys.Value]));
                        }
                        else
                        {
                            if (eleKey.Equals(BpmnConst.StencilItemPool) || eleKey.Equals(GpsConst.StencilItemPool))
                                prefix = VariableTranslatorConst.PoolPrefix;
                            else if (eleKey.Equals(BpmnConst.StencilItemLane))
                                prefix = VariableTranslatorConst.LanePrefix;

                            model.SetVisible(eleKey, $"{prefix}.{ruleKey}", Convert.ToBoolean(flowProfData[IboObjectKeys.Value].ToString()));
                        }
                    }
                }
                model.Save();
                model.Close();
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Erstellt eine Rechtezuordnung für Profilsichten
        /// </summary>
        /// <param name="session">Session</param>
        /// <param name="flowProfId">Id der Profilsicht</param>
        /// <param name="targetIdList">Ids der Zuordnungen</param>
        /// <param name="targetTableName">Zieltabelle</param>
        /// <param name="metaTableName">Metatabelle</param>
        public string AddFlowProfRightLinks(UserSession session, string flowProfId, string[] targetIdList, string targetTableName, string metaTableName)
        {
            string newId = String.Empty;
            string targetField = GetTargetIdField(targetTableName);
            HashSet<string> linkIds = DataUtils.GetFieldValuesOfTable(session.Query
                    .From(metaTableName, out QueryTableRef metaTable)
                    .Select
                        .Field(metaTable, targetField)
                    .Where
                        .Field(metaTable, Fld.FLOWPROFID).IsEqualTo.Value(flowProfId)
                    .DontCheckRights.ExecuteQuery(), fieldname: targetField);

            foreach (string targetId in targetIdList)
            {
                if (!linkIds.Contains(targetId))
                {
                    object nextId = session.DataProvider.GetNextId(metaTableName);
                    if (String.IsNullOrEmpty(newId))
                        newId = nextId.ToString();

                    session.Query.InsertInto(metaTableName)
                        .ColumnValue(Fld.ID, nextId)
                        .ColumnValue(Fld.FLOWPROFID, flowProfId)
                        .ColumnValue(targetField, targetId)
                        .ColumnValue(Fld.USERERST, session.UserInfo.Id)
                        .ColumnValue(Fld.DATERST, DateTime.Now)
                        .ExecuteNonQuery();
                }
            }

            return newId;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Löscht eine Rechtezuordnung für Profilsichten
        /// </summary>
        /// <param name="session">Session</param>
        /// <param name="metaTableName">Metatabelle</param>
        /// <param name="linkId">Id des Link-Datensatzes</param>
        public void DeleteFlowProfRightLink(UserSession session, string metaTableName, string linkId)
        {
            session.Query.DeleteFrom(metaTableName, out QueryTable metaTable)
                .Where.Field(metaTable, Fld.ID).IsEqualTo.Value(linkId)
                .ExecuteNonQuery();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt für das ID-Feld der Metatabelle für die Zieltabelle
        /// </summary>
        /// <param name="targetTableName">Zieltabelle</param>
        /// <returns>Referenzfeld der Metatabelle</returns>
        private string GetTargetIdField(string targetTableName)
        {
            if (targetTableName.StartsWith("V_"))
                targetTableName = targetTableName.Substring(2);

            switch (targetTableName)
            {
                case Tbl.USERS:
                    return Fld.USERID;
                case Tbl.GRP:
                    return Fld.GRPID;
                default: return String.Empty;
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt Combobox-Einträge für das Sonderfeld Ausprägung
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="skalaId">Id der ausgewählten Skala</param>
        /// <returns></returns>
        public IboObjectList<IboObject> GetSkalaEntrysBySkalaIdOrDefault(UserSession session, String skalaId)
        {
            if (skalaId == null)
                skalaId = GetDefaultSkalaId(session);

            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            DataQueryBuilder query = session.Query
                .From(Tbl.SKALAELE, out QueryTableRef mainTable).As(Tbl.SKALAELE)
                .Select
                    .Field(mainTable, IboFld.TXT)
                    .Field(mainTable, IboFld.SORTNR)
                .Where
                    .Field(mainTable, "SkalaId").IsEqualTo.Value(skalaId)
                .OrderBy
                    .Field(mainTable, IboFld.SORTNR);

            DataTable table = query.ToDataTable();
            foreach (DataRow row in table.Rows)
            {
                IboObject entry = new IboObject();
                entry.Add(IboObjectKeys.Value, row[IboFld.TXT].ToString());
                entry.Add(IboObjectKeys.key, row[IboFld.SORTNR].ToString());
                result.Add(entry);
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Id der Standard-Skala
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <returns>Die Id der Standard-Skala</returns>
        public string GetDefaultSkalaId(UserSession session)
        {
            DataQueryBuilder query = session.Query
                .From(Tbl.SKALA, out QueryTableRef mainTable).As(Tbl.SKALA)
                .Select
                    .Field(mainTable, IboFld.ID)
                .Where
                    .Field(mainTable, IboFld.STANDARD).IsTrue;

            IboObjectRow row = query.ToIboObjectRow();
            if (row != null)
                return row[IboFld.ID].ToString();
            return null;
        }


        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Holt die Liste der Ausprägungen in einem Stellenbewertungkriterium.
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">ID des Datensatzes</param>
        /// <returns>Liste der Ausprägungen</returns>
        public IboObjectList<IboObject> GetEvalCritExpModel(PapUserSession session, string id)
        {
            IboObjectList<IboObject> result = new IboObjectList<IboObject>();
            using (BewKritModel model = new BewKritModel(session.DataProvider, Tbl.BEWKRIT))
            {
                model.Load(id);
                DataTable table = model.EleTable;

                foreach (DataRow row in table.Rows)
                {
                    IboObject crit = new IboObject();
                    crit.Add(Fld.ID, row[Fld.ID].ToString());
                    crit.Add(Fld.TXT, row[Fld.TXT].ToString());
                    crit.Add(Fld.KRZ, row[Fld.KRZ].ToString());
                    crit.Add(Fld.SORTNR, row[Fld.SORTNR].ToString());
                    crit.Add(Fld.VAL, row[Fld.VAL].ToString());
                    crit.Add(Fld.FREITEXT, row[Fld.FREITEXT].ToString());
                    result.Add(crit);
                }
            }
            return result;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert die Liste der Ausprägungen in einem Stellenbewertungkriterium.
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">ID des Datensatzes</param>
        /// <param name="values">Werte</param>
        public void SaveEvalCritExpModel(UserSession session, string id, IboObject values)
        {
            using (BewKritModel model = new BewKritModel(session.DataProvider, Tbl.BEWKRIT))
            {
                model.Load(id);
                IboObjectList<IboObject> evalCritExpModel = values.Get<IboObjectList<IboObject>>(IboObjectKeys.EvalCritExpModel);
                foreach (DataRow row in model.EleTable.Rows)
                    row.Delete();
                model.Save();

                foreach (IboObject evalCritExp in evalCritExpModel)
                {
                    DataRow row = model.EleTable.NewRow();
                    row[Fld.ID] = DataProvider.NewGuid();
                    row[Fld.BEWKRITID] = model.MainId;
                    row[Fld.TXT] = evalCritExp[Fld.TXT].ToString();
                    row[Fld.KRZ] = evalCritExp[Fld.KRZ].ToString();
                    row[Fld.SORTNR] = evalCritExp[Fld.SORTNR].ToString();
                    row[Fld.VAL] = float.Parse(evalCritExp[Fld.VAL].ToString());
                    row[Fld.FREITEXT] = evalCritExp[Fld.FREITEXT].ToString();
                    model.EleTable.Rows.Add(row);
                }
                model.Save();
                model.Close();
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichern der Wertezusammenstellung
        /// </summary>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <param name="values"></param>
        public void SaveBatchCfgModel(UserSession session, string id, IboObject values)
        {
            using (BatchCfgModel model = new BatchCfgModel(session.DataProvider))
            {
                model.Load(id);
                model.SaveIboObjectValues(values);
                model.Save();
                model.Close();
            }
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Daten für die Kacheldarstellung der Tabellenbausteine
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="queryHelper">Stammdaten-Query</param>
        /// <param name="filter">Store-Filter aus ExtJs zum einschränken der Datenmenge.</param>
        /// <param name="start">Index des Startdatensatzes der Ergebnismenge.</param>
        /// <param name="limit">Anzahl der gewünschten Datensätze in der Ergebnismenge.</param>
        /// <param name="sortField">Das Feld, nachdem sortiert werden soll.</param>
        /// <param name="sortDirection">Sortierart</param>
        /// <returns>Json-Antwort</returns>
        public static void LoadTableBrickTileValues(UserSession session, StammDatenQuery queryHelper, IboObjectList<IboObject> filter, int start, int limit, string sortField, string sortDirection)
        {
            queryHelper.SetLimits(start, limit);
            queryHelper.SetFilters(filter);
            queryHelper.SetColumns(Fld.ID, Fld.TXT, Fld.DATAEND);
            queryHelper.SetSorting(sortField, sortDirection, null);
            queryHelper.Execute(true);
            IboObjectList<IboObject> tileDatas = new IboObjectList<IboObject>();
            IboObjectTable table = queryHelper.GetOrDefault<IboObjectTable>("data");
            foreach (IboObjectRow row in table)
            {
                string id = row.GetValue<string>(Fld.ID);
                string txt = row.GetValue<string>(Fld.TXT);
                string datAendStamp = row.GetValue<DateTime>(Fld.DATAEND).Ticks.ToString();
                IboObject tileData = new IboObject();
                tileData.Add(IboObjectKeys.id, id);
                tileData.Add(IboObjectKeys.text, HtmlHelper.HtmlEncode(txt));
                tileData.Add(IboObjectKeys.Icon, $"url({new FileResponseUrl(session.SessionId).FlowTextEditorManager_GetScaledTableBrickPreviewImage(id, datAendStamp)})");
                tileDatas.Add(tileData);
            }
            queryHelper["data"] = tileDatas;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Erstellt einen neuen Eintrag in der Silbentrennung
        /// </summary>
        /// <returns></returns>
        public void NewHyphen(UserSession session, string txt, string wordHyp)
        {
            if (string.IsNullOrEmpty(txt))
                return;

            session.Query
                .InsertInto(Tbl.HYPHEN)
                .ColumnValue(Fld.ID, session.DataProvider.GetNextId(Tbl.HYPHEN))
                .ColumnValue(Fld.TXT, txt)
                .ColumnValue(Fld.WORDHYP, wordHyp)
                .ExecuteNonQuery();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="txt"></param>
        /// <param name="wordHyp"></param>
        public void UpdateHyphen(UserSession session, string id, string txt, string wordHyp)
        {
            session.Query
                    .Update(Tbl.HYPHEN, out QueryTable hyphen).Set
                    .Field(hyphen, Fld.TXT).Value(txt)
                    .Field(hyphen, Fld.WORDHYP).Value(wordHyp)
                    .Where.Field(hyphen, Fld.ID).IsEqualTo.Value(id)
                    .ExecuteNonQuery();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Löscht einen Eintrag der Silbentrennung
        /// </summary>
        /// <param name="ids">die zu löschenden ids</param>
        /// <returns></returns>
        public void DeleteHyphen(UserSession session, string[] ids)
        {
            session.Query
                .DeleteFrom(Tbl.HYPHEN, out QueryTable hyphen)
                .Where.Field(hyphen, Fld.ID)
                .InValues(ids)
                .ExecuteNonQuery();
        }

        /// <summary>
        /// Erstellt neue Übersetzung
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="srcTxt">Quelltext</param>
        /// <param name="destTxt">Zieltext</param>
        /// <param name="srcLang">Quellsprache</param>
        /// <param name="destLang">Zielsprache</param>
        public void NewMultiLang(UserSession session, string srcTxt, string destTxt, string srcLang, string destLang)
        {
            session.Query
                .InsertInto(Tbl.MULTILANG)
                .ColumnValue(Fld.ID, session.DataProvider.GetNextId(Tbl.MULTILANG))
                .ColumnValue(Fld.SRCTXT, srcTxt)
                .ColumnValue(Fld.DESTTXT, destTxt)
                .ColumnValue(Fld.SRCLANG, srcLang)
                .ColumnValue(Fld.DESTLANG, destLang)
                .ExecuteNonQuery();
        }

        /// <summary>
        /// Aktualisiert die Übersetzung
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="id">ID</param>
        /// <param name="srcTxt">Quelltext</param>
        /// <param name="destTxt">Zieltext</param>
        public void UpdateMultiLang(UserSession session, string id, string srcTxt, string destTxt)
        {
            session.Query
                   .Update(Tbl.MULTILANG, out QueryTable multiLang).Set
                   .Field(multiLang, Fld.SRCTXT).Value(srcTxt)
                   .Field(multiLang, Fld.DESTTXT).Value(destTxt)
                   .Where.Field(multiLang, Fld.ID).IsEqualTo.Value(id)
                   .ExecuteNonQuery();
        }

        /// <summary>
        /// Übersetzung löschen
        /// </summary>
        /// <param name="session">Sitzung</param>
        /// <param name="ids">Liste der Ids</param>
        public void DeleteMultiLang(UserSession session, string[] ids)
        {
            session.Query
                .DeleteFrom(Tbl.MULTILANG, out QueryTable multiLang)
                .Where.Field(multiLang, Fld.ID)
                .InValues(ids)
                .ExecuteNonQuery();
        }
    }
}
