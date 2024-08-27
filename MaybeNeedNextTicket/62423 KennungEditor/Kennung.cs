using Ibo.Common.Data.Structure;
using Ibo.Pap.Data.Graph.IboObjects;
using System.Collections.Generic;

namespace Ibo.Common.Web.Helper
{
    public class Kennung
    {
        public string Id { get; set; }
        public string Txt { get; set; }
        public string SortNr { get; set; }
        public string FreiText { get; set; }
        public string Val { get; set; }
        public List<KennungValue> Values { get; set; }

        public IboObject ToIboObject()
        {
            IboObject result = new()
            {
                { IboObjectKeys.id, Id },
                { IboObjectKeys.Txt, Txt },
                { IboObjectKeys.SortNr, SortNr },
                { IboObjectKeys.FreiText, FreiText },
            };

            if (Values != null)
                result.Add(IboObjectKeys.Values, Values.ToIboObjectList());

            return result;
        }

        public static List<Kennung> FromIboObjectList(IboObjectList<IboObject> iboObjects)
        {
            List<Kennung> kennungen = new List<Kennung>();
            foreach (var iboObject in iboObjects)
            {
                Kennung kennung = new Kennung
                {
                    Id = iboObject.GetValueOrDefault<string>(IboObjectKeys.id),
                    Txt = iboObject.GetValueOrDefault<string>(IboObjectKeys.Txt),
                    SortNr = iboObject.GetValueOrDefault<string>(IboObjectKeys.SortNr),
                    FreiText = iboObject.GetValueOrDefault<string>(IboObjectKeys.FreiText),
                    Values = new List<KennungValue>()
                };

                if (iboObject.TryGetValue(IboObjectKeys.Values, out var valuesObj) && valuesObj is IboObjectList<IboObject> valuesIboList)
                {
                    foreach (var valueIboObject in valuesIboList)
                    {
                        KennungValue kennungValue = new KennungValue
                        {
                            Id = valueIboObject.GetValueOrDefault<string>(IboObjectKeys.id),
                            Txt = valueIboObject.GetValueOrDefault<string>(IboObjectKeys.Txt),
                            Krz = valueIboObject.GetValueOrDefault<string>(IboObjectKeys.Krz),
                            SortNr = valueIboObject.GetValueOrDefault<string>(IboObjectKeys.SortNr),
                            FreiText = valueIboObject.GetValueOrDefault<string>(IboObjectKeys.FreiText),
                            Val = valueIboObject.GetValueOrDefault<string>(IboObjectKeys.Val)
                        };
                        kennung.Values.Add(kennungValue);
                    }
                }

                kennungen.Add(kennung);
            }
            return kennungen;
        }
    }

    public class KennungValue
    {
        public string Id { get; set; }
        public string Txt { get; set; }
        public string Krz { get; set; }
        public string SortNr { get; set; }
        public string FreiText { get; set; }
        public string Val { get; set; }

        public IboObject ToIboObject()
        {
            IboObject result = new()
            {
                { IboObjectKeys.id, Id },
                { IboObjectKeys.Txt, Txt },
                { IboObjectKeys.Krz, Krz },
                { IboObjectKeys.SortNr, SortNr },
                { IboObjectKeys.FreiText, FreiText },
                { IboObjectKeys.Val, Val }            
            };

            return result;
        }
    }

    public static class KennungExtensions
    {
        public static IboObjectList<IboObject> ToIboObjectList(this List<Kennung> kennungen)
        {
            IboObjectList<IboObject> result = new();
            foreach (var kennung in kennungen)
            {
                result.Add(kennung.ToIboObject());
            }
            return result;
        }

        public static IboObjectList<IboObject> ToIboObjectList(this List<KennungValue> values)
        {
            IboObjectList<IboObject> result = new();
            foreach (var value in values)
            {
                result.Add(value.ToIboObject());
            }
            return result;
        }
    }
}
