import * as THREE from "three";

class ViewHelper extends THREE.Object3D {
  constructor(editorCamera, container, orbitControls) {
    super();

    this.animating = false;
      this.orbitControls = orbitControls;

    const panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.left = "0";
    panel.style.bottom = "0px";
    panel.style.height = "128px";
    panel.style.width = "128px";
    panel.style.borderRadius = "50%";
    panel.style.backgroundColor = "rgba(0.3,0.3,0.3,0.7)";
    panel.style.zIndex = "9999";

    const scope = this;

    panel.addEventListener("mouseup", function (event) {
      event.stopPropagation();

      scope.handleClick(event);
    });

    panel.addEventListener("mousedown", function (event) {
      event.stopPropagation();
    });

    container.appendChild(panel);

    const color1 = new THREE.Color("#ff3653");
    const color2 = new THREE.Color("#8adb00");
    const color3 = new THREE.Color("#2c8fff");

    const interactiveObjects = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dummy = new THREE.Object3D();

    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0, 4);
    camera.position.set(0, 0, 2);

    const geometry = new THREE.BoxGeometry(0.8, 0.05, 0.05).translate(
      0.4,
      0,
      0
    );

    const xAxis = new THREE.Mesh(geometry, getAxisMaterial(color1));
    const yAxis = new THREE.Mesh(geometry, getAxisMaterial(color2));
    const zAxis = new THREE.Mesh(geometry, getAxisMaterial(color3));

    yAxis.rotation.z = Math.PI / 2;
    zAxis.rotation.y = -Math.PI / 2;

    this.add(xAxis);
    this.add(zAxis);
    this.add(yAxis);

    const posXAxisHelper = new THREE.Sprite(getSpriteMaterial(color1, "X"));
    posXAxisHelper.userData.type = "posX";
    const posYAxisHelper = new THREE.Sprite(getSpriteMaterial(color2, "Y"));
    posYAxisHelper.userData.type = "posY";
    const posZAxisHelper = new THREE.Sprite(getSpriteMaterial(color3, "Z"));
    posZAxisHelper.userData.type = "posZ";
    const negXAxisHelper = new THREE.Sprite(getSpriteMaterial(color1));
    negXAxisHelper.userData.type = "negX";
    const negYAxisHelper = new THREE.Sprite(getSpriteMaterial(color2));
    negYAxisHelper.userData.type = "negY";
    const negZAxisHelper = new THREE.Sprite(getSpriteMaterial(color3));
    negZAxisHelper.userData.type = "negZ";

    posXAxisHelper.position.x = 1;
    posYAxisHelper.position.y = 1;
    posZAxisHelper.position.z = 1;
    negXAxisHelper.position.x = -1;
    negXAxisHelper.scale.setScalar(0.8);
    negYAxisHelper.position.y = -1;
    negYAxisHelper.scale.setScalar(0.8);
    negZAxisHelper.position.z = -1;
    negZAxisHelper.scale.setScalar(0.8);

    this.add(posXAxisHelper);
    this.add(posYAxisHelper);
    this.add(posZAxisHelper);
    this.add(negXAxisHelper);
    this.add(negYAxisHelper);
    this.add(negZAxisHelper);

    interactiveObjects.push(posXAxisHelper);
    interactiveObjects.push(posYAxisHelper);
    interactiveObjects.push(posZAxisHelper);
    interactiveObjects.push(negXAxisHelper);
    interactiveObjects.push(negYAxisHelper);
    interactiveObjects.push(negZAxisHelper);

    const point = new THREE.Vector3();
    const dim = 128;
    const turnRate = 2 * Math.PI; // turn rate in angles per second

    const clock = new THREE.Clock();

    this.render = function (renderer) {
      if (this.animating) {
        this.update();
      }
      this.quaternion.copy(editorCamera.quaternion).invert();
      this.updateMatrixWorld();

      point.set(0, 0, 1);
      point.applyQuaternion(editorCamera.quaternion);

      if (point.x >= 0) {
        posXAxisHelper.material.opacity = 1;
        negXAxisHelper.material.opacity = 0.5;
      } else {
        posXAxisHelper.material.opacity = 0.5;
        negXAxisHelper.material.opacity = 1;
      }

      if (point.y >= 0) {
        posYAxisHelper.material.opacity = 1;
        negYAxisHelper.material.opacity = 0.5;
      } else {
        posYAxisHelper.material.opacity = 0.5;
        negYAxisHelper.material.opacity = 1;
      }

      if (point.z >= 0) {
        posZAxisHelper.material.opacity = 1;
        negZAxisHelper.material.opacity = 0.5;
      } else {
        posZAxisHelper.material.opacity = 0.5;
        negZAxisHelper.material.opacity = 1;
      }

      //

      renderer.clearDepth();
      renderer.setViewport(
        container.offsetWidth - dim,
        container.offsetHeight - dim,
        dim,
        dim
      );
      renderer.render(this, camera);
    };

    const targetPosition = new THREE.Vector3();
    const targetQuaternion = new THREE.Quaternion();

    const q1 = new THREE.Quaternion();
    const q2 = new THREE.Quaternion();
    let radius = 0;

    this.handleClick = function (event) {
      if (this.animating === true) return false;

      mouse.y = (dim / 2 - event.offsetY) / (dim / 2);
      mouse.x = -(dim / 2 - event.offsetX) / (dim / 2);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(interactiveObjects);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const object = intersection.object;

        prepareAnimationData(object, this.controls.target);

        this.animating = true;
        clock.start();

        return true;
      } else {
        return false;
      }
    };

    this.update = function () {
      const step = clock.getDelta() * turnRate;
      const focusPoint = this.controls.target;

      // animate position by doing a slerp and then scaling the position on the unit sphere

      q1.rotateTowards(q2, step);
      editorCamera.position
        .set(0, 0, 1)
        .applyQuaternion(q1)
        .multiplyScalar(radius)
        .add(focusPoint);

      // animate orientation

      editorCamera.quaternion.rotateTowards(targetQuaternion, step);

      if (q1.angleTo(q2) === 0) {
        this.animating = false;
        clock.stop();
      }
    };

    function prepareAnimationData(object, focusPoint) {
      switch (object.userData.type) {
        case "posX":
          targetPosition.set(1, 0, 0);
          targetQuaternion.setFromEuler(new THREE.Euler(0, Math.PI * 0.5, 0));
          break;

        case "posY":
          targetPosition.set(0, 1, 0);
          targetQuaternion.setFromEuler(new THREE.Euler(-Math.PI * 0.5, 0, 0));
          break;

        case "posZ":
          targetPosition.set(0, 0, 1);
          targetQuaternion.setFromEuler(new THREE.Euler());
          break;

        case "negX":
          targetPosition.set(-1, 0, 0);
          targetQuaternion.setFromEuler(new THREE.Euler(0, -Math.PI * 0.5, 0));
          break;

        case "negY":
          targetPosition.set(0, -1, 0);
          targetQuaternion.setFromEuler(new THREE.Euler(Math.PI * 0.5, 0, 0));
          break;

        case "negZ":
          targetPosition.set(0, 0, -1);
          targetQuaternion.setFromEuler(new THREE.Euler(0, Math.PI, 0));
          break;

        default:
          console.error("ViewHelper: Invalid axis.");
      }

      //

      radius = editorCamera.position.distanceTo(focusPoint);
      targetPosition.multiplyScalar(radius).add(focusPoint);

      dummy.position.copy(focusPoint);

      dummy.lookAt(editorCamera.position);
      q1.copy(dummy.quaternion);

      dummy.lookAt(targetPosition);
      q2.copy(dummy.quaternion);
    }

    function getAxisMaterial(color) {
      return new THREE.MeshBasicMaterial({ color: color, toneMapped: false });
    }

    function getSpriteMaterial(color, text = null) {
      const canvas2 = document.createElement("canvas");
      canvas2.width = 64;
      canvas2.height = 64;
      canvas2.style.top = "90";
      canvas2.style.zIndex = "100";

      const context = canvas2.getContext("2d");
      context.beginPath();
      context.arc(32, 32, 16, 0, 2 * Math.PI);
      context.closePath();
      context.fillStyle = color.getStyle();
      context.fill();

      if (text !== null) {
        context.font = "24px Arial";
        context.textAlign = "center";
        context.fillStyle = "#000000";
        context.fillText(text, 32, 41);
      }

      const texture = new THREE.CanvasTexture(canvas2);

      return new THREE.SpriteMaterial({ map: texture, toneMapped: false });
    }
  }
}

ViewHelper.prototype.isViewHelper = true;

export { ViewHelper };
