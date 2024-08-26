using Ibo.Common.Data;
using Ibo.Common.Data.Dictionary;
using Ibo.Common.Data.Provider;
using Ibo.Common.Data.Query;
using Ibo.Common.Data.Structure;
using Ibo.Pap.Data.Graph.IboObjects;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ibo.Common.Web.Helper
{
    /// ============================================================================================================================
    /// <summary>
    /// Basis Hilfsklasse für KennungsEditor  
    /// </summary>
    public class KennungHelper
    {
        #region Konstruktoren

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Konstruktor
        /// </summary>
        /// <param name="session">Usersession</param>
        /// <param name="dataProvider"> DataProvider</param>
        public KennungHelper(UserSession session, DataProvider dataProvider)
        {
            Session = session;
            this.dataProvider = dataProvider;
            dataDictionary = session.DataDictionary;
        }

        #endregion Konstruktoren

        #region Properties

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Zugriff auf die Sitzung des Benutzers.
        /// </summary>
        public UserSession Session { get; private set; }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Instanz des DataDictionaries
        /// </summary>
        private DataDictionary dataDictionary;

        /// <summary>
        /// Instanz des DataProviders
        /// </summary>
        private DataProvider dataProvider;

        #endregion Properties

        #region Methoden
        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Erzeugt die IboObjectStruktur fürs Web, für die Kennungen einer Stammdatentabelle
        /// </summary>
        /// <param name="tableName">Der Tabellenname</param>
        /// <returns>Die Liste mit Attributen und Ausprägungen für den KennungsEditor</returns>
        public IboObjectList<IboObject> LoadKennungForTable(string tableName)
        {
            QueryTableRef knRef, knValRef;
            var knTable = Session.Query
                .From(IboTbl.KN, out knRef).As("K")
                .LeftJoin(IboTbl.KNVAL, out knValRef).As("V")
                    .OnField(knRef, IboFld.ID, IboFld.KNID)
                .Select
                    .Field(knRef, IboFld.ID)
                    .Field(knRef, IboFld.TXT)
                    .Field(knRef, IboFld.SORTNR)
                    .Field(knValRef, IboFld.ID)
                    .Field(knValRef, IboFld.KRZ)
                    .Field(knValRef, IboFld.TXT)
                    .Field(knValRef, IboFld.SORTNR)
                .Where
                    .Field(knRef, IboFld.TBLNAME).IsEqualTo.Value(tableName)
                .OrderBy
                    .Field(knRef, IboFld.SORTNR)
                    .Field(knValRef, IboFld.SORTNR)
                .DefaultAliases()
                .ToIboObjectTable();

            Dictionary<string, IboObject> knAttributes = new Dictionary<string, IboObject>();

            foreach (var knRow in knTable)
            {
                var knId = knRow["K_ID"].ToString();
                var knTxt = knRow["K_TXT"].ToString();
                var knSortNr = knRow["K_SORTNR"].ToString();
                var knValId = knRow["V_ID"].ToString();
                var knValKrz = knRow["V_KRZ"].ToString();
                var knValTxt = knRow["V_TXT"].ToString();
                var knValSortNr = knRow["V_SORTNR"].ToString();

                IboObject kn;
                if (!knAttributes.TryGetValue(knId, out kn))
                {
                    kn = new IboObject(IboObjectKeys.id, knId); // Add ID for KN
                    kn.Add(IboObjectKeys.Txt, knTxt); // do not localize
                    kn.Add(IboObjectKeys.SortNr, knSortNr); // do not localize
                    kn.Add(IboObjectKeys.Values, new IboObjectList<IboObject>()); // do not localize
                    knAttributes.Add(knId, kn);
                }
                if (!string.IsNullOrEmpty(knValKrz))
                {
                    var knAttributeValues = (IboObjectList<IboObject>)kn[IboObjectKeys.Values];
                    IboObject knVal = new IboObject(IboObjectKeys.id, knValId); // Add ID for KNVal
                    knVal.Add(IboObjectKeys.Krz, knValKrz); // do not localize
                    knVal.Add(IboObjectKeys.Txt, knValTxt); // do not localize
                    knVal.Add(IboObjectKeys.SortNr, knValSortNr); // do not localize
                    knAttributeValues.Add(knVal);
                }
            }
            return new IboObjectList<IboObject>(knAttributes.Values);
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Speichert die geänderten Kennungsattribute für die angegebene Tabelle.
        /// Prüft jedes Attribut und die Ausprägung ob es eine Änderung gibt wie löschen, ändern und neue
        /// Dann ruft die benötige Methode zum Prozess
        /// </summary>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="updatedData">Liste der aktualisierten Kennungen</param>
        public void UpdateKennungForTable(string tableName, IboObjectList<IboObject> updatedData)
        {
            IboObjectList<IboObject> updatedDataKennung = UpdateSortIndex(tableName, updatedData);
            Dictionary<string, IboObject> existingAttributes = LoadKennungForTable(tableName).ToDictionary(kn => kn[IboObjectKeys.id].ToString());

            // updatedData kontrollieren
            foreach (var updatedKn in updatedDataKennung)
            {
                var updatedKnId = updatedKn[IboObjectKeys.id].ToString();

                if (!existingAttributes.ContainsKey(updatedKnId))
                {
                    // neue Attribute und dazu gehörige Ausprägungen an die DB hinzufügen wenn es gibt
                    AddKn(tableName, updatedKn);
                    var updatedKnValues = (IboObjectList<IboObject>)updatedKn[IboObjectKeys.Values];
                    foreach (var updatedKnVal in updatedKnValues)
                    {
                        AddKnVal(updatedKn, updatedKnVal);
                    }
                }
                else
                {
                    var existingKn = existingAttributes[updatedKnId];

                    // Attribut-Text und SortNR vergleichen / überprüfen 
                    if (updatedKn[IboObjectKeys.Txt].ToString() != existingKn[IboObjectKeys.Txt].ToString() || updatedKn[IboObjectKeys.SortNr].ToString() != existingKn[IboObjectKeys.SortNr].ToString())
                    {
                        UpdateKn(updatedKn);
                    }

                    // Ausprägungen werden in einer DictionaryListe gelegt, um zu kontrollieren ob es eine Änderung gibt
                    var updatedKnValues = (IboObjectList<IboObject>)updatedKn[IboObjectKeys.Values];
                    var existingKnValues = (IboObjectList<IboObject>)existingKn[IboObjectKeys.Values];
                    var updatedKnValuesDict = updatedKnValues.ToDictionary(knVal => knVal[IboObjectKeys.id].ToString());
                    var existingKnValuesDict = existingKnValues.ToDictionary(knVal => knVal[IboObjectKeys.id].ToString());

                    // Ausprägungen vergleichen / überprüfen
                    foreach (var updatedKnVal in updatedKnValues)
                    {
                        var updatedKnValId = updatedKnVal[IboObjectKeys.id].ToString();

                        // Neue Ausprägungn hinzufügen, wenn es gibt, sonst geänderte Daten übernehmen
                        if (!existingKnValuesDict.ContainsKey(updatedKnValId))
                        {
                            AddKnVal(updatedKn, updatedKnVal);
                        }
                        else
                        {
                            var existingKnVal = existingKnValuesDict[updatedKnValId];
                            if (updatedKnVal[IboObjectKeys.Txt].ToString() != existingKnVal[IboObjectKeys.Txt].ToString() ||
                                updatedKnVal[IboObjectKeys.Krz].ToString() != existingKnVal[IboObjectKeys.Krz].ToString() ||
                                updatedKnVal[IboObjectKeys.SortNr].ToString() != existingKnVal[IboObjectKeys.SortNr].ToString())
                            {
                                UpdateKnVal(updatedKnVal);
                            }
                        }
                    }

                    foreach (var existingKnVal in existingKnValues)
                    {
                        var existingKnValId = existingKnVal[IboObjectKeys.id].ToString();
                        if (!updatedKnValuesDict.ContainsKey(existingKnValId))
                        {
                            // einzelne gelöschte Ausprägungen eines Attributes ohne Attribut löschen
                            DeleteKnVal(tableName, existingKnVal);
                        }
                    }

                    existingAttributes.Remove(updatedKnId);
                }
            }

            // alle Ausprägungen des gelöschten Attributs werden auch gelöscht wenn ein Atrribut gelöscht wird
            foreach (var remainingKey in existingAttributes.Keys)
            {
                var kn = existingAttributes[remainingKey];
                var knValues = (IboObjectList<IboObject>)kn[IboObjectKeys.Values];
                foreach (var knValue in knValues)
                {
                    DeleteKnVal(tableName, knValue);
                }
                DeleteKn(kn);
            }

        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Gibt den Wert dieser IboObjectList<IboObject> mit gefüllten ID`s und SortNr wieder als IboObjectList<IboObject> zurück.
        /// </summary>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="updatedData">Liste der aktualisierten Kennungen</param>
        /// <param name="dataProvider"> DataProvider</param>
        /// <returns>Die Liste mit gefüllten fehlenden Ids und SortNr für das Kennungsfeld</returns>
        private IboObjectList<IboObject> UpdateSortIndex(string tableName, IboObjectList<IboObject> updatedData)
        {
            int knAttributeSortNr = 0;
            foreach (var updatedKn in updatedData)
            {
                updatedKn.Add(IboObjectKeys.SortNr, knAttributeSortNr);
                knAttributeSortNr++;
                if (string.IsNullOrEmpty(updatedKn[IboObjectKeys.id].ToString()))
                {
                    updatedKn.Remove(IboObjectKeys.id);
                    updatedKn.Add(IboObjectKeys.id, dataProvider.GetNextId(IboTbl.KN).ToString());
                }

                int knValueSortNr = 0;
                var updatedKnValues = (IboObjectList<IboObject>)updatedKn[IboObjectKeys.Values];
                foreach (var updatedKnVal in updatedKnValues)
                {
                    updatedKnVal.Add(IboObjectKeys.SortNr, knValueSortNr);
                    knValueSortNr++;
                    if (string.IsNullOrEmpty(updatedKnVal[IboObjectKeys.id].ToString()))
                    {
                        updatedKnVal.Remove(IboObjectKeys.id);
                        updatedKnVal.Add(IboObjectKeys.id, dataProvider.GetNextId(IboTbl.KNVAL).ToString());
                    }
                }
            }
            return updatedData;
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Löscht das gegebenen Attribut von der DB bzw. KN Tabelle  
        /// </summary>
        /// <param name="kn">Attribut Object</param>
        private void DeleteKn(IboObject kn)
        {
            dataProvider.Query
                .DeleteFrom(IboTbl.KN, out QueryTable queryTable)
                .Where.Field(queryTable, IboFld.ID).IsEqualTo.Value(kn[IboObjectKeys.id].ToString())
                .ExecuteNonQuery();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Übernimmt die Änderung des gegebenen Attribut an die DB bzw. KN Tabelle  
        /// </summary>
        /// <param name="kn">Attribut Object</param>
        private void UpdateKn(IboObject kn)
        {
            dataProvider.Query
                .Update(IboTbl.KN, out QueryTable queryTable)
                .Set.Field(queryTable, IboFld.SORTNR).Value(kn[IboObjectKeys.SortNr].ToString())
                .Set.Field(queryTable, IboFld.TXT).Value(kn[IboObjectKeys.Txt].ToString())
                .Where.Field(queryTable, IboFld.ID).IsEqualTo.Value(kn[IboObjectKeys.id].ToString())
                .ExecuteNonQuery();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Fügt ein neues Attribut an die DB bzw. KN Tabelle hinzu  
        /// </summary>
        /// <param name="tableName">TabellenName, welche das Attribut Referenziell zugehört</param>
        /// <param name="kn">Attribut Object</param>
        private void AddKn(string tableName, IboObject kn)
        {
            dataProvider.Query
                .InsertInto(IboTbl.KN)
                .ColumnValue(IboFld.ID, kn[IboObjectKeys.id].ToString())
                .ColumnValue(IboFld.MASTERDBID, Session.DataProvider.DatabaseInfos(0).Id)
                .ColumnValue(IboFld.TBLNAME, tableName)
                .ColumnValue(IboFld.SORTNR, kn[IboObjectKeys.SortNr].ToString())
                .ColumnValue(IboFld.TXT, kn[IboObjectKeys.Txt].ToString())
                .ColumnValue(IboFld.FREITEXT, kn.GetValueOrDefault<string>("freiText"))
                .ColumnValue(IboFld.USERERST, dataProvider.UserInfo.Id)
                .ColumnValue(IboFld.DATERST, DateTime.Now)
                .ColumnValue(IboFld.USERAEND, dataProvider.UserInfo.Id)
                .ColumnValue(IboFld.DATAEND, DateTime.Now)
                .ExecuteNonQuery();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Fügt eine neue Ausprägung an die DB bzw. KNVAL Tabelle hinzu  
        /// </summary>
        /// <param name="knVal">Ausprägung Object</param>
        /// <param name="kn">Attribut Object, welches die Ausprägung Referenziell zugehört</param>
        private void AddKnVal(IboObject kn, IboObject knVal)
        {
            dataProvider.Query
                .InsertInto(IboTbl.KNVAL)
                .ColumnValue(IboFld.ID, knVal[IboObjectKeys.id].ToString())
                .ColumnValue(IboFld.MASTERDBID, Session.DataProvider.DatabaseInfos(0).Id)
                .ColumnValue(IboFld.KNID, kn[IboObjectKeys.id].ToString())
                .ColumnValue(IboFld.SORTNR, knVal[IboObjectKeys.SortNr].ToString())
                .ColumnValue(IboFld.KRZ, knVal[IboObjectKeys.Krz].ToString())
                .ColumnValue(IboFld.TXT, knVal[IboObjectKeys.Txt].ToString())
                .ColumnValue(IboFld.FREITEXT, knVal.GetValueOrDefault<string>("freiText"))
                .ColumnValue(IboFld.VAL, knVal.GetValueOrDefault<string>("val"))
                .ColumnValue(IboFld.USERERST, dataProvider.UserInfo.Id)
                .ColumnValue(IboFld.DATERST, DateTime.Now)
                .ColumnValue(IboFld.USERAEND, dataProvider.UserInfo.Id)
                .ColumnValue(IboFld.DATAEND, DateTime.Now)
                .ExecuteNonQuery();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Übernimmt die Änderung der gegebenen Ausprägung an die DB bzw. KNVAL Tabelle  
        /// </summary>
        /// <param name="kn">Attribut Object</param>
        private void UpdateKnVal(IboObject knVal)
        {
            dataProvider.Query
                .Update(IboTbl.KNVAL, out QueryTable queryTable)
                .Set.Field(queryTable, IboFld.SORTNR).Value(knVal[IboObjectKeys.SortNr].ToString())
                .Set.Field(queryTable, IboFld.TXT).Value(knVal[IboObjectKeys.Txt].ToString())
                .Set.Field(queryTable, IboFld.KRZ).Value(knVal[IboObjectKeys.Krz].ToString())
                .Where.Field(queryTable, IboFld.ID).IsEqualTo.Value(knVal[IboObjectKeys.id].ToString())
                .ExecuteNonQuery();
        }

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Löscht die gegebene Ausprägung von der DB bzw. KNVAL Tabelle  
        /// </summary>
        /// <param name="kn">Attribut Object</param>
        private void DeleteKnVal(string tableName, IboObject knVal)
        {
            dataProvider.Query
                .DeleteFrom(IboTbl.KNVAL, out QueryTable queryTable)
                .Where.Field(queryTable, IboFld.ID).IsEqualTo.Value(knVal[IboObjectKeys.id].ToString())
                .ExecuteNonQuery();
        }

        #endregion Methoden
    }
}