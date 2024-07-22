using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ibo.Common.Data;
using Ibo.Common.Data.Query;
using Ibo.Common.Data.Structure;
using Ibo.Common.Web.Manager;
using Ibo.Pap.Data;

namespace Ibo.Pap.Web.Helpers
{
    /// ============================================================================================================================
    /// <summary>
    /// Helper mit Kommandos für Kennungen.
    /// </summary>
    /// 
    public class KennungsEditorHelper
    {
        #region Konstruktor
        #endregion Konstruktor
        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Liefert die vorhandenen Kennungsattribute für die angegebene Tabelle und ihre Werte.
        /// </summary>
        /// <param name="tableName">Name der Tabelle</param>
        /// <param name="session">Session.</param>
        /// <returns>Liste von Kennungen</returns>
        public IDataStructure GetKennungAttributes(string tableName, PapUserSession session)
        {
            QueryTableRef knRef, knValRef;
            var knTable = session.Query
                .From(IboTbl.KN, out knRef).As("K")
                .LeftJoin(IboTbl.KNVAL, out knValRef).As("V")
                    .OnField(knRef, IboFld.ID, IboFld.KNID)
                .Select
                    .Field(knRef, IboFld.ID)
                    .Field(knRef, IboFld.TXT)
                    .Field(knValRef, IboFld.KRZ)
                    .Field(knValRef, IboFld.TXT)
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
                var knValKrz = knRow["V_KRZ"].ToString();
                var knValTxt = knRow["V_TXT"].ToString();

                IboObject kn;
                if (!knAttributes.TryGetValue(knId, out kn))
                {
                    kn = new IboObject("txt", knTxt); // do not localize
                    kn.Add("values", new IboObjectList<IboObject>()); // do not localize
                    knAttributes.Add(knId, kn);
                }
                if (!string.IsNullOrEmpty(knValKrz))
                {
                    var knAttributeValues = (IboObjectList<IboObject>)kn["values"];
                    IboObject knVal = new IboObject("krz", knValKrz); // do not localize
                    knVal.Add("txt", knValTxt); // do not localize
                    knAttributeValues.Add(knVal);
                }
            }

            IDataStructure data = new IboObjectList<IboObject>(knAttributes.Values);
            return data;
        }
    }
}
