using System;
using System.IO;
using System.Text;
using System.Net;
using System.Threading.Tasks;
using System.Net.Mime;
using BitMiracle.LibTiff.Classic;
using System.Security;
using NetVips;
using System.Net.Sockets;
using System.Security.Cryptography;

namespace HttpListenerExample
{
    class HttpServer
    {
        static string filename = "LABJP2.svs";
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

        static int tilex1;
        static int tilex2;
        static int tilex3;

        public static async Task HandleIncomingConnections()
        {
            while (true)
            {
                HttpListenerContext ctx = await listener.GetContextAsync();
                HttpListenerRequest req = ctx.Request;  
                HttpListenerResponse resp = ctx.Response;

                if (req.Url.AbsolutePath.StartsWith("/series/"))
                {

                    try
                    {
                        int dirn = Int32.Parse(req.Url.AbsolutePath.Split("/")[3]);
                        if (dirn == 1)
                        {
                            if (currdir != 0)
                            {
                                input.SetDirectory(0);
                                currdir = 0;
                            }

                            tilex = Int32.Parse(req.Url.AbsolutePath.Split("/")[4].Split("_")[0]);
                            tiley = Int32.Parse(req.Url.AbsolutePath.Split("/")[4].Split("_")[1]);
                            //Console.WriteLine("{0} {1}", req.Url.AbsolutePath.Split("/")[4].Split("_")[0].ToString(), req.Url.AbsolutePath.Split("/")[4].Split("_")[1].ToString()/*req.Url.AbsolutePath.Split("/")[4].Split("_")[1]*/);
                            rts = (int)input.RawTileSize(tilex + tiley * tilex1);
                            tileBuf = new byte[rts];
                            input.ReadRawTile(tilex + tiley * tilex1, tileBuf, 0, rts);
                        }

                        if (dirn == 2)
                        {
                            if (currdir != 2)
                            {
                                input.SetDirectory(2);
                                currdir = 2;
                            }

                            tilex = Int32.Parse(req.Url.AbsolutePath.Split("/")[4].Split("_")[0]);
                            tiley = Int32.Parse(req.Url.AbsolutePath.Split("/")[4].Split("_")[1]);
                            rts = (int)input.RawTileSize(tilex + tiley * tilex2);
                            tileBuf = new byte[rts];
                            input.ReadRawTile(tilex + tiley * tilex2, tileBuf, 0, rts);
                        }

                        if (dirn == 3)
                        {
                            if (currdir != 3)
                            {
                                input.SetDirectory(3);
                                currdir = 3;
                            }

                            tilex = Int32.Parse(req.Url.AbsolutePath.Split("/")[4].Split("_")[0]);
                            tiley = Int32.Parse(req.Url.AbsolutePath.Split("/")[4].Split("_")[1]);
                            rts = (int)input.RawTileSize(tilex + tiley * tilex3);
                            tileBuf = new byte[rts];
                            input.ReadRawTile(tilex + tiley * tilex3, tileBuf, 0, rts);
                        }
                    }

                    catch { }
                    if (tileBuf!=null)
                    {
                    var imvips = NetVips.Image.NewFromBuffer(tileBuf);
                    var buf = imvips.WriteToBuffer(".jpg[Q=50]");

                    resp.ContentType = MediaTypeNames.Image.Jpeg;
                    resp.ContentEncoding = Encoding.UTF8;
                    resp.ContentLength64 = buf.Length;

                    resp.OutputStream.Write(buf, 0, buf.Length);
                    resp.Close();
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

            input = Tiff.Open(filename, "r");
            input.SetDirectory(0);
            tilex1 = (int) Math.Ceiling(input.GetField(TiffTag.IMAGEWIDTH)[0].ToDouble()/input.GetField(TiffTag.TILEWIDTH)[0].ToDouble());
            input.SetDirectory(2);
            tilex2 = (int) Math.Ceiling(input.GetField(TiffTag.IMAGEWIDTH)[0].ToDouble()/input.GetField(TiffTag.TILEWIDTH)[0].ToDouble());
            input.SetDirectory(3);
            tilex3 = (int) Math.Ceiling(input.GetField(TiffTag.IMAGEWIDTH)[0].ToDouble()/input.GetField(TiffTag.TILEWIDTH)[0].ToDouble());
            input.SetDirectory(0);

            listener = new HttpListener();
            listener.Prefixes.Add(url);
            listener.Start();
            Console.WriteLine("Listening for connections on {0}", url);

            
            Task listenTask = Task.Run(HandleIncomingConnections);
            listenTask.GetAwaiter().GetResult();

            
            listener.Close();
        }
    }
}