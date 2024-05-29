let number = 4;
let boolean = true;

const options = {
  placement: "center-center",
  size: 44,
  lineWidth: 3,
  offset: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  font: {
    family: "helvetica",
    weight: 900,
  },
  resolution: 64,
  backgroundSphere: {
    enabled: true,
    color: 16777215,
    opacity: 0.2,
  },
  x: {
    text: "X",
    drawLine: true,
    border: false,
    colors: {
      main: "#ff7f9b",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  y: {
    text: "Y",
    drawLine: true,
    border: false,
    colors: {
      main: "#c2ee00",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  z: {
    text: "Z",
    drawLine: true,
    border: false,
    colors: {
      main: "#73c5ff",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  nx: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#ff7f9b",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  ny: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#c2ee00",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
  nz: {
    text: "",
    drawLine: false,
    border: false,
    colors: {
      main: "#73c5ff",
      hover: "#ffffff",
      text: "#000000",
      hoverText: "#000000",
    },
  },
};

export default options;
