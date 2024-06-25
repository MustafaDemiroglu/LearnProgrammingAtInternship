using DevExpress.XtraRichEdit.Import.Doc;
using Ibo.Common.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ibo.Pap.Data.Stamm
{
    /// ============================================================================================================================
    /// <summary>
    /// Klasse für die Liste der Tabellen, die nicht Speichern Unter Funktion verwendet werden kann  
    /// </summary>
    public static class SdmSaveAsHelper
    {
        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// eine Liste der allen Tabellen, die nicht für Speichern unter Funktion benutzen dürfen  
        /// </summary>
        private static HashSet<string> invalidTableNames = new HashSet<string>()
        {
            Tbl.FKTTYP,
            Tbl.ORGATTR,
            Tbl.PBATTR,
            Tbl.PBINSTITUTE,
            Tbl.PBKSTST,
            Tbl.PBTREIBER,
            Tbl.FKTBIV,
            Tbl.GVPIV,
            Tbl.STBIV,
            Tbl.MA
        };

        /// ------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Überprüft ob die Tabelle für die Speichern unter funtion valid ist   
        /// </summary>
        /// returns boolean zurück 
        public static Boolean isTableValidToUseSaveAs(string tableName)
        {
            if(invalidTableNames.Contains(tableName))
                return false;
            else
                return true;
        }
    }  
}
