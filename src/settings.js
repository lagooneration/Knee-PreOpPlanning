
//import "./angles.css";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import Draggable from "gsap/Draggable";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import CSSRulePlugin from "gsap/CSSRulePlugin";
import CSSPlugin from "gsap/CSSPlugin";
import CustomEase from "gsap/CustomEase";
import EasePack from "gsap/EasePack";
import { TweenMax, TimelineMax, Linear } from "gsap/all";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";
import TWEEN from '@tweenjs/tween.js';
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(CustomEase, ScrollTrigger, MotionPathPlugin, Draggable, MorphSVGPlugin, DrawSVGPlugin, CSSRulePlugin, EasePack, CSSPlugin);
///////////////////////////////////////////////////////////////////////////////
////  NAV HEADER //// ATRIBUTES: https://codepen.io/0pensource/pen/GRLopQM

//import $ from 'jquery';
//import './sidebar.scss';






////import './styles/styles.scss';
////import { slideToggle, slideUp, slideDown } from './libs/slide';
////import {
////    ANIMATION_DURATION,
////    FIRST_SUB_MENUS_BTN,
////    INNER_SUB_MENUS_BTN,
////    SIDEBAR_EL,
////} from './libs/constants';
//import Poppers from './libs/poppers';

//const PoppersInstance = new Poppers();
//import { FIRST_SUB_MENUS_BTN, INNER_SUB_MENUS_BTN, SIDEBAR_EL, ANIMATION_DURATION } from './libs/constants';
///**
// * wait for the current animation to finish and update poppers position
// */
//const updatePoppersTimeout = () => {
//    setTimeout(() => {
//        PoppersInstance.updatePoppers();
//    }, ANIMATION_DURATION);
//};

///**
// * sidebar collapse handler
// */
//document.getElementById('btn-collapse').addEventListener('click', () => {
//    SIDEBAR_EL.classList.toggle('collapsed');
//    PoppersInstance.closePoppers();
//    if (SIDEBAR_EL.classList.contains('collapsed'))
//        FIRST_SUB_MENUS_BTN.forEach((element) => {
//            element.parentElement.classList.remove('open');
//        });

//    updatePoppersTimeout();
//});

///**
// * sidebar toggle handler (on break point )
// */
//document.getElementById('btn-toggle').addEventListener('click', () => {
//    SIDEBAR_EL.classList.toggle('toggled');

//    updatePoppersTimeout();
//});

///**
// * toggle sidebar on overlay click
// */
//document.getElementById('overlay').addEventListener('click', () => {
//    SIDEBAR_EL.classList.toggle('toggled');
//});

//const defaultOpenMenus = document.querySelectorAll('.menu-item.sub-menu.open');

//defaultOpenMenus.forEach((element) => {
//    element.lastElementChild.style.display = 'block';
//});

///**
// * handle top level submenu click
// */
//FIRST_SUB_MENUS_BTN.forEach((element) => {
//    element.addEventListener('click', () => {
//        if (SIDEBAR_EL.classList.contains('collapsed'))
//            PoppersInstance.togglePopper(element.nextElementSibling);
//        else {
//            /**
//             * if menu has "open-current-only" class then only one submenu opens at a time
//             */
//            const parentMenu = element.closest('.menu.open-current-submenu');
//            if (parentMenu)
//                parentMenu
//                    .querySelectorAll(':scope > ul > .menu-item.sub-menu > a')
//                    .forEach(
//                        (el) =>
//                            window.getComputedStyle(el.nextElementSibling).display !==
//                            'none' && slideUp(el.nextElementSibling)
//                    );
//            slideToggle(element.nextElementSibling);
//        }
//    });
//});

///**
// * handle inner submenu click
// */
//INNER_SUB_MENUS_BTN.forEach((element) => {
//    element.addEventListener('click', () => {
//        slideToggle(element.nextElementSibling);
//    });
//});


/////////////////// ////////////////////////////////////////////////////////////
////  POPUP HEADERs //// 

const indicator = document.querySelector(".nav-indicator-wrapper");
const items = document.querySelectorAll(".nav-item");

function handleIndicator(el) {
  items.forEach((item) => {
    item.classList.remove("is-active");
  });

  indicator.style.width = `${el.offsetWidth}px`;
  indicator.style.left = `${el.offsetLeft}px`;

  el.classList.add("is-active");
}

items.forEach((item) => {
  item.addEventListener("click", (e) => {
    handleIndicator(item);
  });

  item.classList.contains("is-active") && handleIndicator(item);
});


//////// VIEW


const indicator2 = document.querySelector(".nav-indicator-wrapper2");
const items2 = document.querySelectorAll(".nav-item2");

function handleIndicator2(el) {
    items2.forEach((items) => {
        items.classList.remove("is-active");
    });

    indicator2.style.width = `${el.offsetWidth}px`;
    indicator2.style.left = `${el.offsetLeft}px`;

    el.classList.add("is-active");
}

items2.forEach((items) => {
    items.addEventListener("click", (e) => {
        handleIndicator2(items);
    });

    items.classList.contains("is-active") && handleIndicator2(items);
});



///////////////////////////////////////////////////////////////////////////////
//// POINTS //// ATRIBUTES: https://codepen.io/Yanis-Ahmidach/pen/VwNNGrO

document.getElementById("open-popup").addEventListener("click", function () {
  document.getElementById("popup").classList.toggle("hidden");
  addOverlay(); // Call function to add overlay
});

document.getElementById("close-popup").addEventListener("click", function () {
  document.getElementById("popup").classList.add("hidden");
  removeOverlay(); // Call function to remove overlay
});

const links = document.querySelectorAll(".nav a");

links.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // Toggle active class on sidebar links
    links.forEach((link) => link.classList.remove("active"));
    this.classList.add("active");

    // Show the relevant section
    const targetSection = document.querySelector(this.getAttribute("href"));
    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.add("hidden"));
    targetSection.classList.remove("hidden");
  });
});

function addOverlay() {
  // Create overlay element
  const overlay = document.createElement("div");
  overlay.classList.add("overlay"); // Add class for styling
  document.body.appendChild(overlay); // Append overlay to the body
}

function removeOverlay() {
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay); // Remove overlay if exists
  }
}



//////////////////////////////////////////////////////  /////////////////////////
//document.getElementById("open-popup2").addEventListener("click", function () {
//    document.getElementById("popup2").classList.toggle("hidden");
//    addOverlay(); // Call function to add overlay
//});

//document.getElementById("close-popup2").addEventListener("click", function () {
//    document.getElementById("popup2").classList.add("hidden");
//    removeOverlay2(); // Call function to remove overlay
//});

const links2 = document.querySelectorAll(".nav2 a");

links2.forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        // Toggle active class on sidebar links
        links2.forEach((link) => link.classList.remove("active"));
        this.classList.add("active");

        // Show the relevant section
        const targetSection = document.querySelector(this.getAttribute("href"));
        document
            .querySelectorAll(".content-section2")
            .forEach((section) => section.classList.add("hidden"));
        targetSection.classList.remove("hidden");
    });
});

//function addOverlay2() {
//    // Create overlay element
//    const overlay = document.createElement("div");
//    overlay.classList.add("overlay"); // Add class for styling
//    document.body.appendChild(overlay); // Append overlay to the body
//}

function removeOverlay2() {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
        overlay.parentNode.removeChild(overlay); // Remove overlay if exists
    }
}


// function handleIndicator(el) {
//   links.forEach((item) => {
//     item.classList.remove("is-active");
//   });

//   indicator.style.width = `${el.offsetWidth}px`;
//   indicator.style.left = `${el.offsetLeft}px`;

//   el.classList.add("is-active");
// }

///////////////////////////////////////////////////////////////////////////////
//// LANDMARK REMOVAL

const checkboxList = document.getElementById("checkbox-list");
const dropdown = document.getElementById("dropdown");
const newItemText = document.getElementById("new-item-text");
const addButton = document.getElementById("add-landmark");
const removeButton = document.getElementById("remove-landmark");

// Initialize the dropdown with existing items
function initializeDropdown() {
  const labels = checkboxList.querySelectorAll(".label-text");
  labels.forEach((label) => {
    const option = document.createElement("option");
    option.value = label.innerText;
    option.innerText = label.innerText;
    dropdown.appendChild(option);
  });
}

// Add new item to checkbox list and dropdown
function addItem() {
  const text = newItemText.value.trim();
  if (text === "") return;

  // Create new checkbox item
  const newLabel = document.createElement("label");
  newLabel.classList.add("label");
  const newCheckbox = document.createElement("input");
  newCheckbox.type = "checkbox";
  newCheckbox.name = "value-radio";
  newCheckbox.classList.add("check-box");
  const newLabelText = document.createElement("div");
  newLabelText.classList.add("label-text");
  newLabelText.innerText = text;

  newLabel.appendChild(newCheckbox);
  newLabel.appendChild(newLabelText);
  checkboxList.appendChild(newLabel);

  // Add to dropdown
  const newOption = document.createElement("option");
  newOption.value = text;
  newOption.innerText = text;
  dropdown.appendChild(newOption);

  // Clear the input field
  newItemText.value = "";
}

// Remove selected item from checkbox list and dropdown
function removeItem() {
  const selectedValue = dropdown.value;
  if (selectedValue === "") return;

  // Remove from checkbox list
  const labels = checkboxList.querySelectorAll(".label");
  labels.forEach((label) => {
    const labelText = label.querySelector(".label-text").innerText;
    if (labelText === selectedValue) {
      checkboxList.removeChild(label);
    }
  });

  // Remove from dropdown
  const options = dropdown.querySelectorAll("option");
  options.forEach((option) => {
    if (option.value === selectedValue) {
      dropdown.removeChild(option);
    }
  });
}

addButton.addEventListener("click", addItem);
removeButton.addEventListener("click", removeItem);

// Initialize the dropdown with existing items on page load
initializeDropdown();




///////////////////////////////////////////////////////////////////////////////
///// EMAIL






///////////////////////////////////////////////////////////////////////////////
////  UPDATE BUTTON ////
// document.getElementById("updateButton").addEventListener("click", function () {
//   // Get all checkbox elements within the wrapper
//   var checkboxes = document.querySelectorAll(
//     '#checkbox-list .label input[type="checkbox"]'
//   );
//   var allChecked = true;

//   // Check if all checkboxes are checked
//   for (var i = 0; i < checkboxes.length; i++) {
//     if (!checkboxes[i].checked) {
//       allChecked = false;
//       break;
//     }
//   }

//   // If not all checkboxes are checked, display a warning
//   if (!allChecked) {
//     alert("Warning: Please complete all landmarks before updating.");
//   }
// });


//const buttons = document.querySelectorAll("button");
//const minValue = 0;
//const maxValue = 10;

//buttons.forEach((button) => {
//  button.addEventListener("click", (event) => {
//    // 1. Get the clicked element
//    const element = event.currentTarget;
//    // 2. Get the parent
//    const parent = element.parentNode;
//    // 3. Get the number (within the parent)
//    const numberContainer = parent.querySelector(".number");
//    const number = parseFloat(numberContainer.textContent);
//    // 4. Get the minus and plus buttons
//    const increment = parent.querySelector(".plus");
//    const decrement = parent.querySelector(".minus");
//    // 5. Change the number based on click (either plus or minus)
//    const newNumber = element.classList.contains("plus")
//      ? number + 1
//      : number - 1;
//    numberContainer.textContent = newNumber;
//    console.log(newNumber);
//    // 6. Disable and enable buttons based on number value (and undim number)
//    if (newNumber === minValue) {
//      decrement.disabled = true;
//      numberContainer.classList.add("dim");
//      // Make sure the button won't get stuck in active state (Safari)
//      element.blur();
//    } else if (newNumber > minValue && newNumber < maxValue) {
//      decrement.disabled = false;
//      increment.disabled = false;
//      numberContainer.classList.remove("dim");
//    } else if (newNumber === maxValue) {
//      increment.disabled = true;
//      numberContainer.textContent = `${newNumber}+`;
//      element.blur();
//    }
//  });
//});



///////////////////////////////////////////////////////////////////////////////
////  AxES PLUS MINUS////

//$(document).on('click', '.inputs-block .minus', function () {
//    var $_inp = $(this).parent().find('input');
//    $_inp.val(parseInt($_inp.val()) - 1);
//    $_inp.trigger('propertychange');
//    return false;
//});

//$(document).on('click', '.inputs-block .plus', function () {
//    var $_inp = $(this).parent().find('input');
//    $_inp.val(parseInt($_inp.val()) + 1);
//    $_inp.trigger('propertychange');
//    return false;
//});

//$('.inputs-block input').bind('input propertychange', function () {
//    var $this = $(this);
//    $this.val($this.val().replace(/[^0-9]/gim, ''));
//    if ($this.val().length == 0 || parseInt($this.val()) <= 0)
//        $this.val(1);
//    var a = $('.inputs-block input').val();
//    var b = $('body').find('#pum-344').find('input[name="count"]').val(a);
//});

//$("#element").anglepicker({
//    start: function (e, ui) {

//    },
//    change: function (e, ui) {
//        $("#label").text(ui.value)
//    },
//    stop: function (e, ui) {

//    },
//    value: 90
//});



//$("#element").anglepicker("value", 50);



// following code needs some refactoring




//const curve = {
//    x: 0,
//    y: 50,
//    cpx: 60,
//    cpy: 0,
//    endx: 120,
//    endy: 50
//}
//let percent = 0.7

//let curveEl = document.getElementById('curve')
//let thumbEl = document.getElementById('thumb')

//// get the XY at the specified percentage along the curve
//const getQuadraticBezierXYatPercent = (curve, percent) => {
//    let x = Math.pow(1 - percent, 2) * curve.x + 2 * (1 - percent) * percent
//        * curve.cpx + Math.pow(percent, 2) * curve.endx
//    let y = Math.pow(1 - percent, 2) * curve.y + 2 * (1 - percent) * percent
//        * curve.cpy + Math.pow(percent, 2) * curve.endy

//    return { x, y }
//}

//const drawCurve = () => {
//    curveEl.setAttribute(
//        'd',
//        `M${curve.x},${curve.y} Q${curve.cpx},${curve.cpy} ${curve.endx},${curve.endy}`
//    )
//}

//const drawThumb = percent => {
//    let pos = getQuadraticBezierXYatPercent(curve, percent)
//    document.getElementById('value').textContent = Math.floor(percent * 100);

//    thumbEl.setAttribute('cx', pos.x)
//    thumbEl.setAttribute('cy', pos.y)
//}

//const moveThumb = e => {
//    console.log(e.target.value)
//    percent = e.target.value / 100
//    drawThumb(percent)
//}

//// event on the range input
//let rangeEl = document.getElementById('range')
//rangeEl.value = percent * 100
//rangeEl.addEventListener('input', moveThumb)

//// init
//drawCurve()
//drawThumb(percent)




//const sliderWrapper = document.querySelector('.slider-wrapper');
//const sliderSvg = document.querySelector('.slider-svg');
//const sliderPath = document.querySelector('.slider-svg-path');
//const sliderPathLength = sliderPath.getTotalLength();
//const sliderThumb = document.querySelector('.slider-thumb');
//const sliderInput = document.querySelector('.slider-input');
//const sliderMinValue = +sliderInput.min || 0;
//const sliderMaxValue = +sliderInput.max || 100;

//const time = document.querySelector('.slider-value');

//const updateTime = (timeInMinutes) => {
//    let hours = Math.floor(timeInMinutes / 60);
//    const minutes = timeInMinutes % 60;
//    const isMorning = hours < 12;
//    const formattedHours = String(isMorning ? hours || 12 : (hours - 12 || 12)).padStart(2, '0');
//    const formattedMinutes = String(minutes).padStart(2, '0');
//    time.textContent = `${formattedHours}:${formattedMinutes} ${isMorning || (hours === 24) ? 'AM' : 'PM'}`;
//}

//const setColor = (progress) => {
//    const colorStops = [
//        { r: 243, g: 217, b: 112 },  // #F3D970
//        { r: 252, g: 187, b: 93 },   // #FCBB5D
//        { r: 246, g: 135, b: 109 },  // #F6876D
//        { r: 147, g: 66, b: 132 },   // #934284
//        { r: 64, g: 40, b: 98 },     // #402862
//        { r: 1, g: 21, b: 73 }        // #011549
//    ];
//    const numStops = colorStops.length;

//    const index = (numStops - 1) * progress;
//    const startIndex = Math.floor(index);
//    const endIndex = Math.ceil(index);

//    const startColor = colorStops[startIndex];
//    const endColor = colorStops[endIndex];

//    const percentage = index - startIndex;

//    const [r, g, b] = [Math.round(startColor.r + (endColor.r - startColor.r) * percentage), Math.round(startColor.g + (endColor.g - startColor.g) * percentage), Math.round(startColor.b + (endColor.b - startColor.b) * percentage)];

//    sliderThumb.style.setProperty('--color', `rgb(${r} ${g} ${b})`);
//}

//// updating position could be done with CSS Motion Path instead of absolute positioning but Safari <15.4 doesn’t seem to support it
//const updatePosition = (progress) => {
//    const point = sliderPath.getPointAtLength(progress * sliderPathLength);
//    const svgRect = sliderSvg.getBoundingClientRect();
//    const scaleX = svgRect.width / sliderSvg.viewBox.baseVal.width;
//    const scaleY = svgRect.height / sliderSvg.viewBox.baseVal.height;
//    sliderThumb.style.left = `${point.x * scaleX * 100 / svgRect.width}%`;
//    sliderThumb.style.top = `${point.y * scaleY * 100 / svgRect.height}%`;
//    const value = Math.round(progress * (sliderMaxValue - sliderMinValue));
//    sliderInput.value = value;
//    updateTime(value);
//    setColor(progress);
//};

//sliderInput.addEventListener('input', () => {
//    const progress = sliderInput.valueAsNumber / (sliderMaxValue - sliderMinValue);
//    updatePosition(progress);
//});

//const handlePointerMove = (event) => {
//    const sliderWidth = sliderPath.getBoundingClientRect().width;
//    const pointerX = event.clientX - sliderPath.getBoundingClientRect().left;
//    const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
//    updatePosition(progress);
//};

//const handlePointerDown = (event) => {
//    const sliderWidth = sliderPath.getBoundingClientRect().width;
//    const pointerX = event.clientX - sliderPath.getBoundingClientRect().left;
//    const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
//    const isThumb = event.target.classList.contains('slider-thumb');
//    if (!isThumb) updatePosition(progress);
//    window.addEventListener('pointermove', handlePointerMove);
//    window.addEventListener('pointerup', () => {
//        window.removeEventListener('pointermove', handlePointerMove);
//    });
//};

//sliderThumb.addEventListener('pointerdown', handlePointerDown);
//sliderPath.addEventListener('pointerdown', handlePointerDown);

//updatePosition(sliderInput.valueAsNumber / (sliderMaxValue - sliderMinValue));

//sliderWrapper.addEventListener('selectstart', (event) => {
//    event.preventDefault();
//})






////////////////////////////////// CANVAS ANGLE////////////////////////////////////

var DegreePicker = function (el, opts) {

    var defaults = {
        /**
         * Degrees step
         * @type {Number}
         */
        step: 1,

        /**
         * Function called after degree update
         * @param  {DOM Element}   self   Picker
         * @param  {Number}   degree 
         */
        callback: function (self, degree) { }
    };

    opts = opts || {};

    for (var property in defaults) {
        if (!opts[property])
            opts[property] = defaults[property];
    }


    var _ = {
        container: {
            el: null,
            x: null,
            y: null,
            radius: null,
            center: {
                x: null,
                y: null
            }
        },
        handle: {
            el: null,
            x: null,
            y: null,
            size: 0,
            position: function (of) {
                return Math.round(_.container.radius * Math[of === 'x' ? 'cos' : 'sin'](Math.atan2(_.handle.y, _.handle.x)));
            }
        },

        degree: {
            el: null,
            value: null,

            get: function () {
                return Math.round(this.value);
            },

            update: function () {
                this.value = Math.atan2(_.handle.y * -1, _.handle.x) * 180 / Math.PI;

                this.value += this.value < 0 ? 360 : 0;
            },

            set: function (value) {
                value = value > 180 ? value - 360 : value;

                value = value * Math.PI / 180;

                _.handle.x = Math.cos(value);

                _.handle.y = -Math.sin(value);

                _.move();
            }
        },

        isDragging: false,

        init: function () {
            _.container.el = document.querySelector(el);
            _.container.x = _.container.el.offsetLeft;
            _.container.y = _.container.el.offsetTop;
            _.container.radius = _.container.el.offsetWidth / 2;
            _.updateElementCenter();

            _.handle.el = _.container.el.children[0];
            _.handle.size = _.handle.el.offsetWidth;

            _.degree.el = _.container.el.children[1];
            _.degree.set(_.container.el.getAttribute('data-degree') || 0);

            // Bind events
            _.handle.el.addEventListener('mousedown', _.onMouseDown);
            window.addEventListener('mouseup', _.onMouseUp);
            window.addEventListener('mousemove', _.onMouseMove);
            window.addEventListener('resize', _.updateElementCenter);
        },

        /* Events
         *************************************/
        onMouseDown: function (event) {
            _.isDragging = true;
            _.updateCoords(event);
            _.move();
        },

        onMouseUp: function () {
            _.isDragging = false;
        },

        onMouseMove: function (event) {
            if (_.isDragging) {
                _.updateCoords(event);
                _.move();
            }
        },

        /* Methods
         *************************************/
        updateElementCenter: function () {
            _.container.center.x = _.container.el.offsetLeft + _.container.radius;
            _.container.center.y = _.container.el.offsetTop + _.container.radius;
        },

        updateCoords: function (e) {
            _.handle.x = e.clientX - _.container.center.x;
            _.handle.y = e.clientY - _.container.center.y;
        },

        move: function () {
            _.degree.update();

            if (_.degree.get() % opts.step === 0) {
                _.degree.el.innerHTML = _.degree.get();
                _.container.el.setAttribute('data-degree', _.degree.get());
            }

            _.handle.el.style['-webkit-transform'] = 'translate(' + _.handle.position('x') + 'px, ' + _.handle.position('y') + 'px)';
            _.handle.el.style['-moz-transform'] = 'translate(' + _.handle.position('x') + 'px, ' + _.handle.position('y') + 'px)';
            _.handle.el.style['-o-transform'] = 'translate(' + _.handle.position('x') + 'px, ' + _.handle.position('y') + 'px)';
            _.handle.el.style.transform = 'translate(' + _.handle.position('x') + 'px, ' + _.handle.position('y') + 'px)';

            opts.callback(_.container.el, _.degree.get());
        }
    };

    _.init();

    /**
     * Picker API
     */
    return {
        /**
         * Get picker value
         * @return {Number}
         */
        getValue: _.degree.get,

        /**
         * Set value of picker
         * @param {Number} value
         */
        setValue: _.degree.set
    };
};

var picker = new DegreePicker('.js-radius-picker');

////////////////////////////////////////////////////////////////////////////////
//// RANGE SLIDER MODEL SIZE && LANDMARK SIZE

//let select = s => document.querySelector(s),
//	mainSVG = select('#mainSVG'),
//	dialToothContainer = select('#dialToothContainer'),
//	dialBodyShine = select('#dialBodyShine'),
//	dialMarker = select('#dialMarker'),
//	dialTooth = select('.dialTooth'),
//	numTeeth = 32,
//	dialToothArray = [],
//	maxRotation = 270,
//	style = getComputedStyle(document.body),
//	uiGrey = style.getPropertyValue('--ui-red'),
//	dragger = null,
//	currentTooth = 0,
//	toothRadius = 4,
//	dialColorArray = [style.getPropertyValue('--ui-green'), style.getPropertyValue('--ui-amber'), style.getPropertyValue('--ui-red')],
//	step = maxRotation / (numTeeth - 1),
//	dialColor = gsap.utils.interpolate(dialColorArray),
//	toothIdClamp = gsap.utils.clamp(0, numTeeth - 1),
//	jumpEase = CustomEase.create("custom", "M0,0 C0.25,0 0.342,0.22 0.384,0.422 0.474,0.864 0.698,1 1,1 ")

//gsap.set('svg', {
//	visibility: 'visible'
//})
//function blendEases(startEase, endEase, blender) {
//	var parse = function (ease) {
//		return typeof (ease) === "function" ? ease : gsap.parseEase("power4.inOut");
//	},
//		s = gsap.parseEase(startEase),
//		e = gsap.parseEase(endEase),
//		blender = parse(blender);
//	return function (v) {
//		var b = blender(v);
//		return s(v) * (1 - b) + e(v) * b;
//	};
//}
//gsap.set(dialMarker, {
//	x: 334,
//	y: 356
//})


//function jumpTo(toothId, duration) {
//	toothId = toothIdClamp(toothId);
//	gsap.to(dialMarker, {
//		rotation: toothId * step,
//		onUpdate: onDrag,
//		scale: 2,
//		duration: duration || 0.5,
//		ease: jumpEase
//	})
//}
//gsap.set(dialMarker, {
//	svgOrigin: `${dialBodyShine.getAttribute('cx')} ${dialBodyShine.getAttribute('cy')}`,
//	attr: {
//		r: toothRadius * 2
//	}
//})
//for (let i = 0; i < numTeeth; i++) {
//	let clone = dialTooth.cloneNode(true);
//	dialToothContainer.appendChild(clone);
//	clone.addEventListener('click', function (e) {
//		jumpTo(i)
//	})
//	gsap.set(clone, {
//		rotation: i * step,
//		svgOrigin: `${dialBodyShine.getAttribute('cx')} ${dialBodyShine.getAttribute('cy')}`,
//		attr: {
//			r: toothRadius
//		}
//	})
//	gsap.from(clone, {
//		attr: {
//			r: 10
//		},
//		opacity: 0,
//		delay: i / numTeeth
//	})
//	dialToothArray.push(clone)
//}
//let pipeRotation = gsap.utils.pipe(
//	gsap.utils.mapRange(0, 1, 1, dialToothArray.length),
//	gsap.utils.snap(1)
//)



//function onDrag() {
//	let dialRotation = gsap.getProperty(dialMarker, 'rotation');
//	let rotationProgress = dialRotation / maxRotation;
//	currentTooth = pipeRotation(rotationProgress);
//	//tooth colours
//	gsap.to(dialToothArray, {
//		fill: (i) => currentTooth <= i ? uiGrey : dialColor(i / (dialToothArray.length)),
//		duration: 0.25
//	})
//	//dial marker colour
//	//gsap.set(dialMarker, {
//	//	fill: (i) => dialColor(currentTooth / (dialToothArray.length))
//	//})
//	//want the shadow to follow the current color? No problem!
//	/* 	gsap.set(':root', {
//			'--ui-shadow': dialColor(currentTooth/(dialToothArray.length))
//		})	 
		
//		*/

//}
//function onDial(str) {

//	gsap.to('#dialBodyGroup', {
//		scale: str == 'press' ? 0.96 : 1,
//		duration: 0.6,
//		ease: str == 'press' ? 'expo' : 'elastic(0.5, 0.25)'
//	})
//}
//dragger = Draggable.create(dialMarker, {
//	type: 'rotation',
//	trigger: '#dialBodyGroup',
//	bounds: { min: 0, max: maxRotation },
//	onDrag: onDrag,
//	onThrowUpdate: onDrag,
//	inertia: true,
//	dragResistance: 0.23,
//	onPress: onDial,
//	onPressParams: ['press'],
//	onRelease: onDial,
//	onReleaseParams: ['release'],
//	overshootTolerance: 0.3,
//	throwResistance: 3000
//})
//let initTl = gsap.timeline();
//initTl.from('#dialBodyGroup', {
//	scale: 0,
//	transformOrigin: '50% 50%',
//	onComplete: function () {
//		jumpTo(28, 1.5)
//	},
//	ease: blendEases('power1.in', 'expo'),
//	duration: 1.6
//})



////
//////////////////////////////////////////////////////////////////////////\


//// SLIDER  ANGLE

/* a Pen by Diaco m.lotfollahi  : https://diacodesign.com */

// const D = document.createElement('div');
//const D = document.getElementById('xyz');
//gsap.set('svg', { overflow: "visible" });
//// gsap.set('.knobA', { x: 10, y: 80 });

//const tl = gsap.timeline({ paused: true })
//    .from("#path2", 1, { drawSVG: "0%", stroke: 'orange', ease: Linear.easeNone })
//    .to('.knobA', 1, { bezier: { type: "quadratic", values: [{ x: 10, y: 80 }, { x: 150, y: 0 }, { x: 300, y: 80 }] }, ease: Linear.easeNone }, 0);

//Draggable.create('div', {
//    trigger: ".knobA",
//    type: 'x',
//    throwProps: true,
//    bounds: { minX: 0, maxX: 300 },
//    onDrag: Update,
//    onThrowUpdate: Update
//});

//function Update() {
//    tl.progress(Math.abs(this.x / 300));
//}

//gsap.to('#path1', { duration: 0.5, strokeDashoffset: -10, repeat: -1, ease: "none" });





