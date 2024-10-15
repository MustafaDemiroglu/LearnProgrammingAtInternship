public void SaveAzmDayTable(PapUserSession session, string id, IboObject values)
{
    using (AzmModel model = new AzmModel(session.DataProvider))
    {
        model.Load(id);
        IboObject azmDayModel = values.Get<IboObject>(IboObjectKeys.AzmDayModel);
        IboObjectList<IboObject> azmDay = azmDayModel.GetListOrNull<IboObject>(IboObjectKeys.AzmDay);

        if(model.WeekCount < 1)
            return;


        if (azmDay != null && model.Session.Rights.TableValue(Tbl.AZMDAY) == Common.Data.Rights.UserRightValue.Write)
        {
            model.AzmDayTable.DeleteAllRows();
            model.AzmDayTable.AcceptChanges();

            HashSet<string> existingAzmDayIds = new HashSet<string>();

            if (model.AzmDayTable?.Rows != null)
            {
                foreach (DataRow row in model.AzmDayTable.Rows)
                {
                    if (row.RowState != DataRowState.Deleted)
                    {
                        existingAzmDayIds.Add(row[Fld.ID].ToString());
                    }
                }
            }

            HashSet<string> newAzmDayIds = new HashSet<string>();
            foreach (IboObject day in azmDay)
            {
                string dayId = day.GetSaveStringValue("ID");
                if (!string.IsNullOrEmpty(dayId))
                {
                    newAzmDayIds.Add(dayId);
                }
            }

            HashSet<string> deletedAzmDayIds = new HashSet<string>(existingAzmDayIds);
            deletedAzmDayIds.ExceptWith(newAzmDayIds);

            foreach (string deletedId in deletedAzmDayIds)
            {
                session.DataProvider.Query
                    .DeleteFrom(Tbl.AZMDAY, out QueryTable table)
                    .Where.Field(table, Fld.ID).IsEqualTo.Value(deletedId)
                    .ExecuteNonQuery();
            }

            foreach (string deletedId in deletedAzmDayIds)
            {
                session.DataProvider.Query
                    .DeleteFrom(Tbl.AZMDAY, out QueryTable table)
                    .Where.Field(table, Fld.ID).IsEqualTo.Value(deletedId)
                    .ExecuteNonQuery();
            }

            foreach (IboObject day in azmDay)
            {
                string dayId = day.GetSaveStringValue("ID");
                string azmId = id;

                if (string.IsNullOrEmpty(dayId))
                {
                    dayId = session.DataProvider.GetNextId(Tbl.AZMDAY).ToString();

                    session.DataProvider.Query
                        .InsertInto(Tbl.AZMDAY)
                        .ColumnValue(Fld.ID, dayId)
                        .ColumnValue(Fld.AZMID, azmId)
                        .ColumnValue(Fld.AZVON, ValueHelper.GetDateNullValue(day.GetValueOrDefault("AZVON")))
                        .ColumnValue(Fld.AZBIS, ValueHelper.GetDateNullValue(day.GetValueOrDefault("AZBIS")))
                        .ColumnValue(Fld.PAUSE1VON, ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE1VON")))
                        .ColumnValue(Fld.PAUSE1BIS, ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE1BIS")))
                        .ColumnValue(Fld.PAUSE1MIN, ValueHelper.GetIntNullValue(day.GetValueOrDefault("PAUSE1MIN")))
                        .ColumnValue(Fld.PAUSE2VON, ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE2VON")))
                        .ColumnValue(Fld.PAUSE2BIS, ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE2BIS")))
                        .ColumnValue(Fld.PAUSE2MIN, ValueHelper.GetIntNullValue(day.GetValueOrDefault("PAUSE2MIN")))
                        .ColumnValue(Fld.PAUSE3VON, ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE3VON")))
                        .ColumnValue(Fld.PAUSE3BIS, ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE3BIS")))
                        .ColumnValue(Fld.PAUSE3MIN, ValueHelper.GetIntNullValue(day.GetValueOrDefault("PAUSE3MIN")))
                        .ColumnValue(Fld.USERERST, model.Session.UserInfo.Id)
                        .ColumnValue(Fld.DATERST, model.Session.DataProvider.GetCurrentDateTime())
                        .ColumnValue(Fld.TAG, azmDay.IndexOf(day) + 1)
                        .ExecuteNonQuery();

                    continue;
                }
                
                    session.DataProvider.Query
                        .Update(Tbl.AZMDAY, out QueryTable table)
                        .Set.Field(table, Fld.AZVON).Value(ValueHelper.GetDateNullValue(day.GetValueOrDefault("AZVON")))
                        .Set.Field(table, Fld.AZBIS).Value(ValueHelper.GetDateNullValue(day.GetValueOrDefault("AZBIS")))
                        .Set.Field(table, Fld.PAUSE1VON).Value(ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE1VON")))
                        .Set.Field(table, Fld.PAUSE1BIS).Value(ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE1BIS")))
                        .Set.Field(table, Fld.PAUSE1MIN).Value(ValueHelper.GetIntNullValue(day.GetValueOrDefault("PAUSE1MIN")))
                        .Set.Field(table, Fld.PAUSE2VON).Value(ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE2VON")))
                        .Set.Field(table, Fld.PAUSE2BIS).Value(ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE2BIS")))
                        .Set.Field(table, Fld.PAUSE2MIN).Value(ValueHelper.GetIntNullValue(day.GetValueOrDefault("PAUSE2MIN")))
                        .Set.Field(table, Fld.PAUSE3VON).Value(ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE3VON")))
                        .Set.Field(table, Fld.PAUSE3BIS).Value(ValueHelper.GetDateNullValue(day.GetValueOrDefault("PAUSE3BIS")))
                        .Set.Field(table, Fld.PAUSE3MIN).Value(ValueHelper.GetIntNullValue(day.GetValueOrDefault("PAUSE3MIN")))
                        .Set.Field(table, Fld.USERAEND).Value(model.Session.UserInfo.Id)
                        .Set.Field(table, Fld.DATAEND).Value(model.Session.DataProvider.GetCurrentDateTime())
                        .Set.Field(table, Fld.AZMID).Value(model.MainId.ToString())
                        .Set.Field(table, Fld.TAG).Value(ValueHelper.GetIntNullValue(azmDay.IndexOf(day) + 1))
                        .Where.Field(table, Fld.ID).IsEqualTo.Value(dayId)
                        .ExecuteNonQuery();
                
            }
            model.Save();
            model.Close();
        }
    }
}