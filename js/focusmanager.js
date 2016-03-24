"use strict";

function FocusManager() {
    this.keyCodes = {
        ENTER: 13,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };
    this.isFocusChanged = true;
    this.previousElement = null;
    this.previousElementIndex = 0;
    this.currentElement = null;
    this.currentElementIndex = 0;
    this.targetElement = null;
    this.targetElementIndex = 0;
    this.savedElement = null;
    this.elements = [];
    this.destDistanceX = 0;
    this.destDistanceY = 0;
}
(function() {
    this.addFocusItem = function(ele) {
        if (ele === null) {
            return;
        }
        this.elements.push(ele);
    };

    this.addFocusItems = function(pageScope) {
        if (pageScope === null) {
            return;
        }
        this.elements = pageScope.querySelectorAll("[tabindex]");
    };

    this.removeFocusItem = function(ele, container) {
        var containerArr = [];
        for (var i = 0; i < container.length; i++) {
            var self = container[i];
            containerArr.push(self);
        }
        if (ele === null) {
            return;
        }
        for (var k = 0; k < containerArr.length; k++) {
            if (containerArr[k] === ele) {
                var index = containerArr.indexOf(ele);
                if (index > -1) {
                    containerArr.splice(index, 1);
                }
            }
        }
        return containerArr;
    };

    this.setStartfocus = function(startpoint) {
        if (startpoint === null) {
            startpoint = 0;
        }
        this.currentElement = this.elements[startpoint];
        this.targetElement = this.elements[startpoint];
        this.moveFocus();
    };

    this.toUP = function() {
        var exceptCurrentElementArr = this.removeFocusItem(this.currentElement, this.elements);
        if (exceptCurrentElementArr.length > 0) {
            var exceptArr = [];
            var diff = 0;
            for (var i = 0; i < exceptCurrentElementArr.length; i++) {
                diff = this.currentElement.getBoundingClientRect().top - exceptCurrentElementArr[i].getBoundingClientRect().top;
                if (diff >= this.currentElement.getBoundingClientRect().height / 2) {
                    exceptArr.push(exceptCurrentElementArr[i]);
                }
            }
            if (exceptArr.length !== 0) {
                this.isFocusChanged = true;
                this.computeShortLine(exceptArr, "up");
                this.moveFocus();
            } else {
                this.isFocusChanged = false;
            }
        }
    };

    this.toDOWN = function() {
        var exceptCurrentElementArr = this.removeFocusItem(this.currentElement, this.elements);
        if (exceptCurrentElementArr.length > 0) {
            var exceptArr = [];
            var diff = 0;
            for (var i = 0; i < exceptCurrentElementArr.length; i++) {
                diff = exceptCurrentElementArr[i].getBoundingClientRect().bottom - this.currentElement.getBoundingClientRect().bottom;
                if (diff >= this.currentElement.getBoundingClientRect().height / 2) {
                    exceptArr.push(exceptCurrentElementArr[i]);
                }
            }
            if (exceptArr.length !== 0) {
                this.isFocusChanged = true;
                this.computeShortLine(exceptArr, "down");
                this.moveFocus();
            } else {
                this.isFocusChanged = false;
            }
        }
    };

    this.toLEFT = function() {
        var exceptCurrentElementArr = this.removeFocusItem(this.currentElement, this.elements);
        if (exceptCurrentElementArr.length > 0) {
            var exceptArr = [];
            for (var i = 0; i < exceptCurrentElementArr.length; i++) {
                if (exceptCurrentElementArr[i].getBoundingClientRect().left < this.currentElement.getBoundingClientRect().left &&
                    Math.abs(exceptCurrentElementArr[i].getBoundingClientRect().top - this.currentElement.getBoundingClientRect().top) <= this.currentElement.getBoundingClientRect().height) {
                    exceptArr.push(exceptCurrentElementArr[i]);
                }
            }
            if (exceptArr.length !== 0) {
                this.isFocusChanged = true;
                this.computeShortLine(exceptArr, "left");
                this.moveFocus();
            } else {
                this.isFocusChanged = false;
            }
        }
    };

    this.toRIGHT = function() {
        var exceptCurrentElementArr = this.removeFocusItem(this.currentElement, this.elements);
        if (exceptCurrentElementArr.length > 0) {
            var exceptArr = [];
            for (var i = 0; i < exceptCurrentElementArr.length; i++) {
                if (exceptCurrentElementArr[i].getBoundingClientRect().left > this.currentElement.getBoundingClientRect().left &&
                    Math.abs(exceptCurrentElementArr[i].getBoundingClientRect().top - this.currentElement.getBoundingClientRect().top) <= this.currentElement.getBoundingClientRect().height) {
                    exceptArr.push(exceptCurrentElementArr[i]);
                }
            }
            if (exceptArr.length !== 0) {
                this.isFocusChanged = true;
                this.computeShortLine(exceptArr, "right");
                this.moveFocus();
            } else {
                this.isFocusChanged = false;
            }
        }
    };

    this.computeShortLine = function(spotArr) {
        var diffValueZ = 0,
            minZ = 0,
            position = 0,
            horizontalLine = 0,
            verticalLine = 0;
        for (var i = 0; i < spotArr.length; i++) {
            verticalLine = this.currentElement.getBoundingClientRect().top - spotArr[i].getBoundingClientRect().top;
            horizontalLine = this.currentElement.getBoundingClientRect().left - spotArr[i].getBoundingClientRect().left;
            if (i === 0) {
                position = i;
                minZ = Math.sqrt(Math.pow(Math.abs(verticalLine), 2) + Math.pow(Math.abs(horizontalLine), 2));
            } else {
                diffValueZ = Math.sqrt(Math.pow(Math.abs(verticalLine), 2) + Math.pow(Math.abs(horizontalLine), 2));
                if (minZ > diffValueZ) {
                    minZ = diffValueZ;
                    position = i;
                }
            }
        }
        this.targetElement = spotArr[position];
        this.destDistanceX = this.targetElement.getBoundingClientRect().left - this.currentElement.getBoundingClientRect().left;
        this.destDistanceY = this.targetElement.getBoundingClientRect().top - this.currentElement.getBoundingClientRect().top;

        for (var k = 0; k < this.elements.length; k++) {
            if (this.elements[k] === this.targetElement) {
                this.targetElementIndex = k;
                // console.log("********** targetElementIndex: "+this.targetElementIndex);
            }
        }
    };

    this.moveFocus = function() {
        if (this.elements.length === 0) {
            return;
        }

        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i] !== this.targetElement) {
                this.elements[i].classList.remove("focus");
                this.elements[i].blur();
            } else {
                this.currentElementIndex = i;
                // console.log("========= currentElementIndex: "+this.currentElementIndex);
            }
        }
        this.previousElement = this.currentElement;
        this.targetElement.classList.add("focus");
        this.currentElement = this.targetElement;
    };

    this.clickFocus = function() {
        console.log("FocusManager clickFocus tagName is: " + this.currentElement.className);
        this.currentElement.focus();
        this.currentElement.click();
        return true;
    };

}).apply(FocusManager.prototype);

window[FocusManager] = FocusManager;

