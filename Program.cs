using System;
using System.IO;
using System.Text;
using System.Net;
using System.Threading.Tasks;
using System.Net.Mime;
using BitMiracle.LibTiff.Classic;
using System.Security;

namespace HttpListenerExample
{
    class HttpServer
    {
        public static HttpListener listener;
        public static string url = "http://127.0.0.1:8000/";
        public static int pageViews = 0;
        public static int requestCount = 0;
        static Tiff input;
        static byte[] tileBuf;
        static short currdir = 0;
        static int tilex = 0;
        static int tiley = 0;
        static int rts = 0;
        public static async Task HandleIncomingConnections()
        {
            bool runServer = true;

            // While a user hasn't visited the `shutdown` url, keep on handling requests
            while (runServer)
            {
                //input.ReadTile(tileBuf,0,256,256,0,0);
                // Will wait here until we hear from a connection
                HttpListenerContext ctx = await listener.GetContextAsync();

                // Peel out the requests and response objects
                HttpListenerRequest req = ctx.Request;
                HttpListenerResponse resp = ctx.Response;

                // Print out some info about the request
                Console.WriteLine("Request #: {0}", ++requestCount);
                Console.WriteLine(req.Url.ToString());
                Console.WriteLine(req.HttpMethod);
                Console.WriteLine(req.UserHostName);
                Console.WriteLine(req.UserAgent);
                Console.WriteLine();

                if (req.Url.AbsolutePath.StartsWith("/js/texture"))
                {
                    if (req.Url.AbsolutePath == "/js/texture.png")
                    {

                        byte[] data = File.ReadAllBytes(@"./js/texture.png");
                        //byte[] data = Encoding.UTF8.GetBytes(String.Format(pageData, pageViews, disableSubmit));
                        //resp.ContentType = "";
                        resp.ContentType = MediaTypeNames.Image.Png;
                        resp.ContentEncoding = Encoding.UTF8;
                        resp.ContentLength64 = data.LongLength;

                        // Write out to the response stream (asynchronously), then close it
                        resp.OutputStream.Write(data, 0, data.Length);
                        resp.Close();
                    }
                    else
                    {

                        try
                        {
                        //Console.WriteLine(req.Url.AbsolutePath);
                        //int tile = Int32.Parse(req.Url.AbsolutePath.Split("_").Last());
                        int zlevel = Int32.Parse(req.Url.AbsolutePath.Split("_")[1]);
                        if (zlevel == 1)
                        {
                            if(currdir != 0)
                            {
                                input.SetDirectory(0);
                                currdir = 0;
                            }

                            tilex = Int32.Parse(req.Url.AbsolutePath.Split("_")[2]);
                            tiley = Int32.Parse(req.Url.AbsolutePath.Split("_")[3]);
                            rts = (int)input.RawTileSize(tilex + tiley * 258);
                            input.ReadRawTile(tilex + tiley * 258, tileBuf, 0, rts);
                        }

                        if (zlevel == 2)
                        {
                            if(currdir != 2)
                            {
                                input.SetDirectory(2);
                                currdir = 2;
                            }
                            
                            tilex = Int32.Parse(req.Url.AbsolutePath.Split("_")[2]);
                            tiley = Int32.Parse(req.Url.AbsolutePath.Split("_")[3]);
                            rts = (int)input.RawTileSize(tilex + tiley * 65);
                            input.ReadRawTile(tilex + tiley * 65, tileBuf, 0, rts);
                        }
                        //byte[] data = File.ReadAllBytes("." + req.Url.AbsolutePath);
                        //byte[] data = Encoding.UTF8.GetBytes(String.Format(pageData, pageViews, disableSubmit));
                        //resp.ContentType = "";
                        resp.ContentType = MediaTypeNames.Image.Jpeg;
                        resp.ContentEncoding = Encoding.UTF8;
                        //resp.ContentLength64 = data.LongLength;
                        resp.ContentLength64 = rts;

                        // Write out to the response stream (asynchronously), then close it
                        //resp.OutputStream.Write(data, 0, data.Length);
                        resp.OutputStream.Write(tileBuf, 0, rts);
                        resp.Close();

                    }
                    catch {}
                    }
                }

                if (req.Url.AbsolutePath == "/js/main.js")
                {
                    byte[] data = File.ReadAllBytes(@"./js/main.js");
                    //byte[] data = Encoding.UTF8.GetBytes(String.Format(pageData, pageViews, disableSubmit));
                    //resp.ContentType = "";
                    resp.ContentType = MediaTypeNames.Text.JavaScript;
                    resp.ContentEncoding = Encoding.UTF8;
                    resp.ContentLength64 = data.LongLength;

                    // Write out to the response stream (asynchronously), then close it
                    resp.OutputStream.Write(data, 0, data.Length);
                    resp.Close();
                }
                if (req.Url.AbsolutePath == "/js/three.module.js")
                {
                    byte[] data = File.ReadAllBytes(@"./js/three.module.js");
                    //byte[] data = Encoding.UTF8.GetBytes(String.Format(pageData, pageViews, disableSubmit));
                    //resp.ContentType = "text/html";
                    resp.ContentType = MediaTypeNames.Text.JavaScript;
                    resp.ContentEncoding = Encoding.UTF8;
                    resp.ContentLength64 = data.LongLength;

                    // Write out to the response stream (asynchronously), then close it
                    resp.OutputStream.Write(data, 0, data.Length);
                    resp.Close();
                }
                if (req.Url.AbsolutePath == "/")
                {
                    byte[] data = File.ReadAllBytes(@"./html/index.html");
                    //byte[] data = Encoding.UTF8.GetBytes(String.Format(pageData, pageViews, disableSubmit));
                    resp.ContentType = "text/html";
                    resp.ContentEncoding = Encoding.UTF8;
                    resp.ContentLength64 = data.LongLength;

                    // Write out to the response stream (asynchronously), then close it
                    resp.OutputStream.Write(data, 0, data.Length);
                    resp.Close();
                }

            }
        }


        public static void Main(string[] args)
        {
            tileBuf = new byte[100000];
            input = Tiff.Open("5130.svs", "r");
            input.SetDirectory(0);
            // Create a Http server and start listening for incoming connections
            listener = new HttpListener();
            listener.Prefixes.Add(url);
            listener.Start();
            Console.WriteLine("Listening for connections on {0}", url);

            // Handle requests
            Task listenTask = HandleIncomingConnections();
            listenTask.GetAwaiter().GetResult();

            // Close the listener
            listener.Close();
        }
    }
}