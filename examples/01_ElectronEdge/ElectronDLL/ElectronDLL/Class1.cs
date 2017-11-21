using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectronDLL
{
    public class Startup
    {
        public async Task<object> Invoke(object input)
        {
            return this.Hello((string)input);
        }

        string Hello(string v)
        {
            return Helper.Hello(v);
        }
    }

    public static class Helper
    {
        public static string Hello(string v)
        {
            return "Hello " + v;
        }

        public static string HelloCsharp(string v)
        {
            return "HelloCsharp " + v;
        }
    }
}
