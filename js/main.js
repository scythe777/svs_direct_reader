import * as THREE from "/js/three.module.js";

window.onload = function () {
    var camera, camera1, scene, scene1, renderer, renderer2;
    var geometry, material, mesh;
    var geometry1, material1, mesh1;
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


        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
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
        const indices = [
            0, 1, 2,
            2, 3, 0,
        ];


        geometry1 = new THREE.BufferGeometry();
        geometry1.setIndex(indices);
        geometry1.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        // настройка материала - установка цвета
        //material = new THREE.MeshBasicMaterial({ color: 0xf5a9c1, wireframe: false });

        material1 = new THREE.MeshBasicMaterial({ color: 0x447597, wireframe: true });
        // настраиваем меш, который будет отображать куб
        //camera1 = new THREE.OrthographicCamera(window.innerWidth / 2, window.innerWidth / -2, window.innerHeight / 2, window.innerHeight / -2, -5000, 5000);
        camera1= new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500);
        // установка z-координаты камеры
        camera1.position.z = 1500;
        //material = new THREE.MeshPhongMaterial();
        material = new THREE.MeshPhongMaterial();
        material.map = texture;

        mesh = new THREE.Mesh(geometry, material);
        mesh1 = new THREE.Mesh(geometry1, material1);
        mesh1.position.x = 100;
        
        var light = new THREE.AmbientLight(0xffffff, 2);
        light.position.set(1000, 1000, 1000);
        var light1 = new THREE.AmbientLight(0xffffff, 2);
        light.position.set(1000, 1000, 1000);
        scene.add(light);
        scene1.add(light1);
        scene.add(mesh);
        scene1.add(mesh1);
        // создаем объект для рендеринга сцены
        renderer = new THREE.WebGLRenderer({ canvas: canvas3D });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth / 2 - 20, window.innerHeight / 2);
        renderer2 = new THREE.WebGLRenderer({ canvas: canvas3D1 });
        renderer2.setPixelRatio(window.devicePixelRatio);
        renderer2.setSize(window.innerWidth / 2 - 20, window.innerHeight / 2);
        // установка размеров
        //renderer.setSize(window.innerWidth, window.innerHeight);
        // встраиваем в DOM-структуру страницы
        //document.body.appendChild(renderer.domElement);
    }

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onDocumentKeyDown, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        camera1.aspect = window.innerWidth / window.innerHeight;
        camera1.updateProjectionMatrix();
        renderer.setSize(window.innerWidth / 2 - 20, window.innerHeight / 2);
        renderer2.setSize(window.innerWidth / 2 - 20, window.innerHeight / 2);

    }

    function onDocumentKeyDown() {
        var delta = 10;
        var keycode = event.keyCode;
        switch (keycode) {
            case 37: //left arrow 向左箭头
                camera1.position.x = camera.position.x - delta;
                break;
            case 38: // up arrow 向上箭头
                camera1.position.y = camera.position.y - delta;
                break;
            case 39: // right arrow 向右箭头
                camera1.position.x = camera.position.x + delta;
                break;
            case 40: //down arrow向下箭头
                camera1.position.y = camera.position.y + delta;
                break;
        }
    }

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
    }
}