import * as THREE from "three";

import { Editor } from "./assets/js/Editor.js";
import { Viewport } from "./assets/js/Viewport.js";
import { Toolbar } from "./assets/js/Toolbar.js";
import signals from "./assets/js/signals.js";
const editor = new Editor();

window.editor = editor; // Expose editor to Console
window.THREE = THREE; // Expose THREE to APP Scripts and Console

const viewport = new Viewport(editor);
document.body.appendChild(viewport.dom);

const toolbar = new Toolbar(editor);
document.body.appendChild(toolbar.dom);

editor.storage.init(function () {
  editor.storage.get(function (state) {
    if (isLoadingFromHash) return;

    if (state !== undefined) {
      editor.fromJSON(state);
    }

    const selected = editor.config.getKey("selected");

    if (selected !== undefined) {
      editor.selectByUuid(selected);
    }
  });

  //

  let timeout;

  function saveState() {
    if (editor.config.getKey("autosave") === false) {
      return;
    }

    clearTimeout(timeout);

    timeout = setTimeout(function () {
      editor.signals.savingStarted.dispatch();

      timeout = setTimeout(function () {
        editor.storage.set(editor.toJSON());

        editor.signals.savingFinished.dispatch();
      }, 100);
    }, 1000);
  }

  const signals = editor.signals;

  signals.geometryChanged.add(saveState);
  signals.objectAdded.add(saveState);
  signals.objectChanged.add(saveState);
  signals.objectRemoved.add(saveState);
  signals.materialChanged.add(saveState);
  signals.sceneBackgroundChanged.add(saveState);
  signals.sceneEnvironmentChanged.add(saveState);
  signals.sceneFogChanged.add(saveState);
  signals.sceneGraphChanged.add(saveState);
  signals.scriptChanged.add(saveState);
  signals.historyChanged.add(saveState);
});

//

document.addEventListener("dragover", function (event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop", function (event) {
  event.preventDefault();

  if (event.dataTransfer.types[0] === "text/plain") return; // Outliner drop

  if (event.dataTransfer.items) {
    // DataTransferItemList supports folders

    editor.loader.loadItemList(event.dataTransfer.items);
  } else {
    editor.loader.loadFiles(event.dataTransfer.files);
  }
});

function onWindowResize() {
  editor.signals.windowResize.dispatch();
}

window.addEventListener("resize", onWindowResize);

onWindowResize();

//

let isLoadingFromHash = false;
const hash = window.location.hash;

if (hash.slice(1, 6) === "file=") {
  const file = hash.slice(6);

  if (confirm("Any unsaved data will be lost. Are you sure?")) {
    const loader = new THREE.FileLoader();
    loader.crossOrigin = "";
    loader.load(file, function (text) {
      editor.clear();
      editor.fromJSON(JSON.parse(text));
    });

    isLoadingFromHash = true;
  }
}

// ServiceWorker

if ("serviceWorker" in navigator) {
  try {
    navigator.serviceWorker.register("sw.js");
  } catch (error) {}
}
