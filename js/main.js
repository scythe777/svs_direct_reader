import * as THREE from "/js/three.module.js";




window.onload = function () {
    var camera, camera1, scene, scene1, renderer, renderer2, renderer3, renderer4;
    var geometry, material, mesh;
    var geometry1, material1, mesh1;
    var geometry2, material2, mesh2;
    init();
    animate();
    // инициализация начальных значений
    function init() {
        // создаем камеру - перспективная проекция
        var loader = new THREE.TextureLoader();

        //loading texture
        var texture = loader.load('./js/texture.png');


        //initializing material
        //var material = new THREE.MeshPhongMaterial();

        //setting material property


        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2500);
        // установка z-координаты камеры
        camera.position.z = 1000;
        // настройка сцены
        scene = new THREE.Scene();
        scene1 = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene1.background = new THREE.Color(0xffffff);
        // настройка геометрии - в качестве геометрии будет куб
        // настроим его ширину, высоту и длину по оси z
        //geometry = new THREE.CubeGeometry(200, 200, 200);
        geometry = new THREE.BoxGeometry(700, 700, 700, 10, 10, 10);
        //geometry1 = new THREE.BoxGeometry(200, 200, 0);

        const vertices = new Float32Array([
            -150, -150, 0, // v0
            150.0, -150.0, 0, // v1
            150.0, 150.0, 0, // v2
            -150.0, 150.0, 0, // v3
        ]);
        const vertices2 = new Float32Array([
            -150, -150, 0, // v0
            150.0, -150.0, 0, // v1
            150.0, 150.0, 0, // v2
            -150.0, 150.0, 0, // v3
        ]);
        const indices = [
            0, 1, 2,
            2, 3, 0,
        ];


        camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
        // установка z-координаты камеры
        camera1.position.z = 1000;
        camera1.position.y = 1000;
        camera1.position.x = 2000;
        //material = new THREE.MeshPhongMaterial();
        material = new THREE.MeshPhongMaterial({ wireframe: true });
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

        var geom = new Array();
        var mat = new Array();
        var mes = new Array();
        let j = 1;
        for (let j = 0; j < 20; j++) {
            for (let i = 0; i < 20; i++)
            //{
            {
                geom[i, j] = new THREE.PlaneGeometry(300, 300);
                texture = loader.load('./js/texture' + (i + 9333 - j * 258));
                console.log('./js/texture' + (i + 9833 - j * 258));
                mat[i, j] = new THREE.MeshPhongMaterial({ map: texture, wireframe: false });
                mes[i, j] = new THREE.Mesh(geom[i, j], mat[i, j]);
                scene1.add(mes[i, j]);
                mes[i, j].position.x = i * 300;
                mes[i, j].position.y = j * 300;
                //mes[i,j].position.y = j*300;


            }   //}
        }

        /*setTimeout(function() {
            for (let j = 0; j < 20; j++) {
                for (let i = 0; i < 20; i++)
                {
                    scene1.remove(mes[i,j]);
                }

            }
        },1000);*/
        
        scene.add(light);
        scene1.add(light1);
        scene.add(mesh);
        /*scene1.add(mesh1);
        scene1.add(mesh2);*/
        // создаем объект для рендеринга сцены
        renderer = new THREE.WebGLRenderer({ canvas: canvas3D, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);
        renderer2 = new THREE.WebGLRenderer({ canvas: canvas3D1, antialias: true });
        renderer2.setPixelRatio(window.devicePixelRatio);
        renderer2.setSize(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);

        renderer3 = new THREE.WebGLRenderer({ canvas: canvas3D2, antialias: true });
        renderer3.setPixelRatio(window.devicePixelRatio);
        renderer3.setSize(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);

        renderer4 = new THREE.WebGLRenderer({ canvas: canvas3D3, antialias: true });
        renderer4.setPixelRatio(window.devicePixelRatio);
        renderer4.setSize(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);
        // установка размеров
        //renderer.setSize(window.innerWidth, window.innerHeight);
        // встраиваем в DOM-структуру страницы
        //document.body.appendChild(renderer.domElement);

    }

    window.addEventListener('resize', onWindowResize, false);
    //window.addEventListener('keydown', onDocumentKeyDown, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        camera1.aspect = window.innerWidth / window.innerHeight;
        camera1.updateProjectionMatrix();

        renderer.setSize(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);
        renderer2.setSize(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);
        renderer3.setSize(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);
        renderer4.setSize(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);

    }

    /*function onDocumentKeyDown() {
        var delta = 50;
        var keycode = event.keyCode;
        switch (keycode) {
            case 37: //left arrow 向左箭头
                camera1.position.x = camera1.position.x + delta;
                break;
            case 38: // up arrow 向上箭头
                camera1.position.y = camera1.position.y - delta;
                break;
            case 39: // right arrow 向右箭头
                camera1.position.x = camera1.position.x - delta;
                break;
            case 40: //down arrow向下箭头
                camera1.position.y = camera1.position.y + delta;
                break;
            case 61:
                camera1.position.z = camera1.position.z - delta;
                break;
            case 173:
                camera1.position.z = camera1.position.z + delta;
                break;
        }
    }*/

    var mx = 0;
    var my = 0;
    var deltam = 4.8;
    document.getElementById("canvas3D1").onmousemove = function (e) {
        if(e.buttons == 1)
        {
            camera1.position.x = camera1.position.x - e.movementX*deltam;
            camera1.position.y = camera1.position.y + e.movementY*deltam;
        }
    }

    /*document.getElementById("canvas3D1").onwheel = function (e) {
            camera1.position.z = camera1.position.z + e.deltaY*4;

    }*/



    // функция анимации
    function animate() {

        requestAnimationFrame(animate);
        // вращение меша вокруг осей
        mesh.rotation.x += 0.006;
        mesh.rotation.y += 0.005;
        /*mesh1.rotation.x -= 0.004;
        mesh1.rotation.y += 0.004;*/
        // рендеринг сцены - метод, производящий по сути отрисовку
        renderer.render(scene, camera);

        renderer2.render(scene1, camera1);
        renderer3.render(scene, camera);
        renderer4.render(scene, camera);
    }
}

/* ---------------------------- */
let items = document.querySelectorAll('.s');
let cont = document.querySelectorAll('.dblock');
var md = 0;

var t;
items.forEach(function (ball) {
    var td;
    var tc = null;
    var dtarg;
    var tcg = null;
    var tb;
    var ballselected = 0;

    ball.onmousedown = function (event) { // (1) отследить нажатие
        ballselected = 1;
        if (event.buttons != 1) { return }
        td = document.elementsFromPoint(event.clientX, event.clientY).find(el => el.className == 'dblock');
        tc = ball.cloneNode();
        tc.style.border = "1px solid green";
        tc.style.opacity = "0.7";
        tc.style = "background: lightblue";
        tb = ball.nextSibling;
        td.insertBefore(tc, tb);
        let dragged = null;
        dragged = ball;
        // (2) подготовить к перемещению:
        // разместить поверх остального содержимого и в абсолютных координатах
        ball.style.position = 'absolute';
        ball.style.zIndex = 1000;
        // переместим в body, чтобы мяч был точно не внутри position:relative
        document.body.append(ball);

        // и установим абсолютно спозиционированный мяч под курсор

        moveAt(event.pageX, event.pageY);

        // передвинуть мяч под координаты курсора
        // и сдвинуть на половину ширины/высоты для центрирования

        function moveAt(pageX, pageY) {

            ball.style.left = pageX - ball.offsetWidth / 2 + 'px';
            ball.style.top = pageY - ball.offsetHeight / 2 + 'px';
        }

        let tt = null;
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
            let t = document.elementsFromPoint(event.clientX, event.clientY).find(el => el.className == 'dblock');

            if (t != td && md == 0 && tt != t && ballselected == 1) {
                tt = t;
                tcg = tc.cloneNode();
                tcg.style.background = 'lightgreen';
                t.appendChild(tcg);
                md = 1;
            }
            if (t != tt && ballselected == 1) {
                tcg.remove();
                md = 0;
            }
        }


        // (3) перемещать по экрану
        document.addEventListener('mousemove', onMouseMove);

        // (4) положить мяч, удалить более ненужные обработчики событий
        ball.onmouseup = function (event) {
            md = 0;
            ballselected = 0;
            //document.querySelector(".d").appendChild(ball);
            //document.elementsFromPoint(event.clientX, event.clientY).find(el=>el.className='dblock').appendChild(dragged);
            try {
                let t = document.elementsFromPoint(event.clientX, event.clientY).find(el => el.className == 'dblock');
                if (t == td) {
                    /*let tb = ball.nextSibling;
                    t.insertBefore(tb,tc)*/
                    t.insertBefore(ball, t);
                    tc.remove();
                    tcg.remove();
                }
                else {
                    t.appendChild(ball);
                    setTimeout(function () { tc.remove() }, 200);
                    tcg.remove();
                    //tc.remove();
                }
            }
            catch {
                ball.onmouseup = null;
                ball.style.position = null;
                ball.style.zIndex = null;
                //tc = ball;
                td.insertBefore(ball, tb);
                tc.remove();
                tcg.remove();
                //td.appendChild(ball);
            }
            tcg.remove();

            document.removeEventListener('mousemove', onMouseMove);
            ball.onmouseup = null;
            ball.style.position = null;
            ball.style.zIndex = null;
            //cont[1].appendChild(ball);
        };
        ball.ondragstart = function (e) {

            return false;

        };
        ball.ondragover = function (e) {
            e.preventDefault();
        }

    };
});
