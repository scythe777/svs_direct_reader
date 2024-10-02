import * as THREE from "/js/three.module.js";


var coordx = 0;
var coordy = 0;

window.onload = function () {

    var slide_w_1 = 43200;
    var slide_h_1 = 28272;

    var slide_w_2 = 10800;
    var slide_h_2 = 7068;

    var slide_w_3 = 2700;
    var slide_h_3 = 1767;

    var tile_w = 240;
    var tile_h = 240;

    var camera, camera1, scene, scene1, renderer, renderer2, renderer3, renderer4;
    var geometry, material, mesh;
    var geometry1, material1, mesh1;
    var geometry2, material2, mesh2;

    var zoom;
    var wf = false;

    var geom;
    var mat;
    var mes, mes2, mes3;
    var loader;
    var lx = Math.ceil(slide_w_1 / tile_w);
    var ly = Math.ceil(slide_h_1 / tile_h);

    var lx2 = Math.ceil(slide_w_2 / tile_w);
    var ly2 = Math.ceil(slide_h_2 / tile_h);

    var lx3 = Math.ceil(slide_w_3 / tile_w);
    var ly3 = Math.ceil(slide_h_3 / tile_h);

    //var lxh = 179;
    //var lyh = 68;
    var lxh = Math.ceil(lx / 2);
    var lyh = Math.ceil(ly / 2);
    var lxh2 = Math.ceil(lx2 / 2);
    var lyh2 = Math.ceil(ly2 / 2);
    var lxh3 = Math.ceil(lx3 / 2);
    var lyh3 = Math.ceil(ly3 / 2);
    var texture;
    var ge;
    var ma;

    init();
    animate();

    // инициализация начальных значений
    function init() {

        loader = new THREE.TextureLoader();

        //loading texture
        texture = loader.load('./js/texture.png');

        // настройка сцены

        scene1 = new THREE.Scene();

        scene1.background = new THREE.Color(0xffffff);


        //camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 15000);
        camera1 = new THREE.OrthographicCamera(-document.getElementById("canvas3D1").clientWidth / 2, document.getElementById("canvas3D1").clientWidth / 2, document.getElementById("canvas3D1").clientWidth / 2, -document.getElementById("canvas3D1").clientWidth / 2, 0, 1500);

        camera1.position.z = 500;

        camera1.position.y = 0;
        camera1.position.x = 0;
        //material = new THREE.MeshPhongMaterial();
        material = new THREE.MeshPhongMaterial({ wireframe: false });
        material.map = texture;

        mesh = new THREE.Mesh(geometry, material);
        /*mesh1 = new THREE.Mesh(geometry1, material1);
        mesh2 = new THREE.Mesh(geometry2, material1);
        mesh1.position.x = 100;
        mesh2.position.x = 400;*/

        var light = new THREE.AmbientLight(0xffffff, 2);
        light.position.set(1000, 1000, 1000);
        var light1 = new THREE.AmbientLight(0xffffff, 3);
        //light.position.set(1000, 1000, 1000);

        geom = new Array();
        mat = new Array();
        mes = new Array();
        mes2 = new Array();
        mes3 = new Array();

        camera1.zoom = 0.2;
        camera1.updateProjectionMatrix();
        camera1.position.x = -200;
        camera1.position.y = -200;

        async function lf() {

            for (let i = -Math.round(800 / 1600 / camera1.zoom); i <= Math.round(800 / 1600 / camera1.zoom); i++) {
                mes3[i] = [];

                for (let j = -Math.round(600 / 1600 / camera1.zoom); j <= Math.round(600 / 1600 / camera1.zoom); j++) {

                    let x = +lxh3 + +i;
                    let y = +lyh3 + -j;

                    /*if (x < 0) continue;
                    if (y < 0) continue;
                    if (x >= lx3) continue;
                    if (y >= ly3) continue;//y= ly3;*/
                    //console.log("XY " + x + " " + y + " half " + lxh2 + " " + lyh2 + " full " + lx2 + " " + ly2);
                    texture = await loader.load('./series/0/3/' + (x) + "_" + (y));


                    ge = new THREE.PlaneGeometry(1600, 1600);
                    ma = new THREE.MeshPhongMaterial({ map: texture, wireframe: false });
                    //console.log("texture loaded");
                    mes3[i][j] = new THREE.Mesh(ge, ma);
                    
                    //console.log("mesh textured");
                    mes3[i][j].position.x = i * 1600 + 1000;
                    mes3[i][j].position.y = j * 1600 - 1000;
                    mes3[i][j].position.z = 400;
                    scene1.add(mes3[i][j]);
                    //console.log("MESH " + mes3[i][j].position.x + " " + mes3[i][j].position.y);
                }
            };

        }
        lf();

        scene1.add(light1);



        // создаем объект для рендеринга сцены
        renderer2 = new THREE.WebGLRenderer({ canvas: canvas3D1, antialias: true });
        renderer2.setPixelRatio(window.devicePixelRatio);
        renderer2.setSize(document.getElementById("canvas3D1").clientWidth, document.getElementById("canvas3D1").clientHeight);

    }
    var mx = 0;
    var my = 0;
    var trigx = 0;
    var trigy = 0;
    var trigy = 0;
    var deltax = 0;

    var newi;
    var newj;

    var deltam = 1;
    var currentx = 5;
    var currenty = 5;
    let cx = 0;
    let cy = 0;

    document.getElementById("canvas3D1").addEventListener("mousemove", movehandler);

    function movehandler(e) {
        if (e.buttons == 1) {
            camera1.position.x = camera1.position.x - deltam * e.movementX / (camera1.zoom);
            camera1.position.y = camera1.position.y + deltam * e.movementY / (camera1.zoom);
            coordx = coordx - deltam * e.movementX / 400 / (camera1.zoom);
            coordy = coordy - deltam * e.movementY / 400 / (camera1.zoom);
            /*console.log(Math.round(coordx / 10));
            console.log(Math.round(coordy / 10));*/
            if (cx != (Math.round(coordx)) || cy != (Math.round(coordy))) {
                lf();
                cx = Math.round(coordx);
                cy = Math.round(coordy);

                //console.log(cx + " " + cy);

            }

            async function lf() {
                //let i = 10;
                //if (cx > 0) {
                if (camera1.zoom > 1) {
                    for (let i = -Math.round(800 / 100 / camera1.zoom) + cx * 4; i <= Math.round(800 / 100 / camera1.zoom) + +Math.round(cx * 4); i++) {
                        if (mes[i] == undefined) {
                            mes[i] = [];
                        }

                        for (let j = -Math.round(600 / 100 / camera1.zoom) - cy * 4; j <= Math.round(600 / 100 / camera1.zoom) - +Math.round(cy * 4); j++) {
                            if (mes[i][j] == undefined) {
                                let x = +lxh + 3 + +i;
                                let y = +lyh + 3 + -j;
                                loader.load('./series/0/1/' + (x) + "_" + (y), function (texture) {
                                    ge = new THREE.PlaneGeometry(100, 100);
                                    ma = new THREE.MeshPhongMaterial({ map: texture, wireframe: wf });

                                    if (mes[i][j] == undefined) {
                                        mes[i][j] = new THREE.Mesh(ge, ma);
                                        mes[i][j].position.x = i * 100 - 50;
                                        mes[i][j].position.y = j * 100 - 50;
                                        mes[i][j].position.z = 0;
                                        scene1.add(mes[i][j]);
                                    }
                                });
                            }
                            //console.log(Math.round(coordx) - +30);

                        }
                    }
                }


                if (camera1.zoom <= 1 && camera1.zoom > 0.4) {
                    //console.log("zoom move");
                    for (let i = -Math.round(800 / 400 / camera1.zoom) + Math.round(cx); i <= Math.round(800 / 400 / camera1.zoom) + +Math.round(cx); i++) {
                        if (mes2[i] == undefined) {
                            mes2[i] = [];
                        }
                        for (let j = -Math.round(600 / 400 / camera1.zoom) - Math.round(cy); j <= Math.round(600 / 400 / camera1.zoom) - +Math.round(cy); j++) {
                            if (mes2[i][j] == undefined) {
                                let x = +lxh2 + +i;
                                let y = +lyh2 + -j;

                                loader.load('./series/0/2/' + (x) + "_" + (y), function (texture) {
                                    ge = new THREE.PlaneGeometry(400, 400);
                                    ma = new THREE.MeshPhongMaterial({ map: texture, wireframe: wf });

                                    if (mes2[i][j] == undefined) {
                                        mes2[i][j] = new THREE.Mesh(ge, ma);
                                        mes2[i][j].position.x = i * 400;
                                        mes2[i][j].position.y = j * 400;
                                        mes2[i][j].position.z = 200;
                                        scene1.add(mes2[i][j]);
                                    }
                                });
                            }
                            //console.log(Math.round(coordx) - +30);

                        }
                    }
                }

                if (camera1.zoom <= 0.4) {
                    //console.log("zoom move");
                    for (let i = -Math.round(800 / 1600 / camera1.zoom) + Math.round(cx / 4); i <= Math.round(800 / 1600 / camera1.zoom) + +Math.round(cx / 4); i++) {
                        if (mes3[i] == undefined) {
                            mes3[i] = [];
                        }
                        for (let j = -Math.round(600 / 1600 / camera1.zoom) - Math.round(cy / 4); j <= Math.round(600 / 1600 / camera1.zoom) - +Math.round(cy / 4); j++) {
                            if (mes3[i][j] == undefined) {
                                let x = +lxh3 + +i;
                                let y = +lyh3 + -j;
                                loader.load('./series/0/3/' + (x) + "_" + (y), function (texture) {
                                    ge = new THREE.PlaneGeometry(1600, 1600);
                                    ma = new THREE.MeshPhongMaterial({ map: texture, wireframe: wf });

                                    if (mes3[i][j] == undefined) {
                                        mes3[i][j] = new THREE.Mesh(ge, ma);
                                        mes3[i][j].position.x = i * 1600 + 1000;
                                        mes3[i][j].position.y = j * 1600 - 1000;
                                        mes3[i][j].position.z = 400;
                                        scene1.add(mes3[i][j]);
                                    }
                                });
                            }
                            //console.log(Math.round(coordx) - +30);

                        }
                    }
                }

            };
        }

    }

    var zdelta = 0.001;
    document.getElementById("canvas3D1").onwheel = function (e) {
        if (camera1.zoom <= 0.4) {
            camera1.position.z = 500;
        }
        if (camera1.zoom > 0.4 && camera1.zoom <= 1) {
            camera1.position.z = 300;
        }
        if (camera1.zoom > 1) {
            camera1.position.z = 50;
        }


        //console.log(camera1.zoom);
        if (camera1.zoom >= 0.1)
            camera1.zoom = camera1.zoom - e.deltaY * zdelta * camera1.zoom;
        else camera1.zoom = 0.1;
        //if(camera1.zoom<1) camera1.zoom = 1;


        camera1.updateProjectionMatrix();
        lf();
        async function lf() {

            if (camera1.zoom > 1) {
                for (let i = -Math.round(800 / 100 / camera1.zoom) + cx * 4; i <= Math.round(800 / 100 / camera1.zoom) + +Math.round(cx * 4); i++) {
                    if (mes[i] == undefined) {
                        mes[i] = [];
                    }

                    for (let j = -Math.round(600 / 100 / camera1.zoom) - cy * 4; j <= Math.round(600 / 100 / camera1.zoom) - +Math.round(cy * 4); j++) {
                        if (mes[i][j] == undefined)
                            loader.load('./series/0/1/' + (+lxh + 3 + +i) + "_" + (+lyh + 3 + -j), function (texture) {
                                ge = new THREE.PlaneGeometry(100, 100);
                                ma = new THREE.MeshPhongMaterial({ map: texture, wireframe: wf });

                                if (mes[i][j] == undefined) {
                                    mes[i][j] = new THREE.Mesh(ge, ma);
                                    mes[i][j].position.x = i * 100 - 50;
                                    mes[i][j].position.y = j * 100 - 50;
                                    mes[i][j].position.z = 0;
                                    scene1.add(mes[i][j]);
                                }
                            });

                    }
                }
            }



            if (camera1.zoom <= 1 && camera1.zoom > 0.4) {

                for (let i = -Math.round(800 / 400 / camera1.zoom) + Math.round(cx); i <= Math.round(800 / 400 / camera1.zoom) + +Math.round(cx); i++) {
                    if (mes2[i] == undefined) {
                        mes2[i] = [];
                    }
                    for (let j = -Math.round(600 / 400 / camera1.zoom) - Math.round(cy); j <= Math.round(600 / 400 / camera1.zoom) - +Math.round(cy); j++) {
                        if (mes2[i][j] == undefined)
                            loader.load('./series/0/2/' + (+lxh2 + +i) + "_" + (+lyh2 + -j), function (texture) {
                                ge = new THREE.PlaneGeometry(400, 400);
                                ma = new THREE.MeshPhongMaterial({ map: texture, wireframe: wf });

                                if (mes2[i][j] == undefined) {
                                    mes2[i][j] = new THREE.Mesh(ge, ma);
                                    mes2[i][j].position.x = i * 400;
                                    mes2[i][j].position.y = j * 400;
                                    mes2[i][j].position.z = 200;
                                    scene1.add(mes2[i][j]);
                                }
                            });

                    }
                }
            }

            if (camera1.zoom <= 0.4) {

                for (let i = -Math.round(800 / 1600 / camera1.zoom) + Math.round(cx / 4); i <= Math.round(800 / 1600 / camera1.zoom) + +Math.round(cx / 4); i++) {
                    if (mes3[i] == undefined) {
                        mes3[i] = [];
                    }
                    for (let j = -Math.round(600 / 1600 / camera1.zoom) - Math.round(cy / 4); j <= Math.round(600 / 1600 / camera1.zoom) - +Math.round(cy / 4); j++) {
                        if (mes3[i][j] == undefined)
                            loader.load('./series/0/3/' + (+lxh3 + +i) + "_" + (+lyh3 + -j), function (texture) {
                                ge = new THREE.PlaneGeometry(1600, 1600);
                                ma = new THREE.MeshPhongMaterial({ map: texture, wireframe: wf });

                                if (mes3[i][j] == undefined) {
                                    mes3[i][j] = new THREE.Mesh(ge, ma);
                                    mes3[i][j].position.x = i * 1600 + 1000;
                                    mes3[i][j].position.y = j * 1600 - 1000;
                                    mes3[i][j].position.z = 400;
                                    scene1.add(mes3[i][j]);
                                }
                            });

                    }
                }
            }

        };
    }

    //window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera1.aspect = window.innerWidth / window.innerHeight;
        camera1.updateProjectionMatrix();

        renderer2.setSize(document.getElementById("canvas3D1").clientWidth, document.getElementById("canvas3D1").clientHeight);

    }




    // функция анимации
    function animate() {

        requestAnimationFrame(animate);

        /*setTimeout(function () {

            requestAnimationFrame(animate);

        }, 1000 / 60);*/
        renderer2.render(scene1, camera1);

    }
}

