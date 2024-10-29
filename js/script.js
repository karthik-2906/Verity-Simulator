(function () {
    class VerityCalculator {
        constructor() {
            this.accordion = document.querySelector(".verity-container__header-info-container");
            this.accordionIcon = document.querySelector(".verity-container__header-info-accordion");
            this.accordionContent = document.querySelector(".verity-container__header-accordion-content");
            this.resetBtn = document.querySelector('.verity-container__controls-reset');
            this.randomiseBtn = document.querySelector('.verity-container__controls-randomise');
            this.lettersCheckbox = document.getElementById('letters');
            this.calloutsArr = ['C', 'T', 'S'];
            this.statuesArr = ['C', 'C', 'T', 'T', 'S', 'S'];

            this.shapes = [
                { src: 'assets/media/circle.svg', letter: 'C' },
                { src: 'assets/media/triangle.svg', letter: 'T' },
                { src: 'assets/media/square.svg', letter: 'S' }
            ];

            this.status = document.querySelector(".verity-container__statues-status");

            this.leftStatue = document.querySelector(".verity-container__statue-left");
            this.midStatue = document.querySelector(".verity-container__statue-mid");
            this.rightStatue = document.querySelector(".verity-container__statue-right");

            this.leftDissect = document.querySelector(".verity-container__dissect-left");
            this.midDissect = document.querySelector(".verity-container__dissect-mid");
            this.rightDissect = document.querySelector(".verity-container__dissect-right");

            this.dissectStatus = false;
            this.dissect1;
            this.dissect2;

            this.shapeHeldTitle = document.getElementsByClassName("verity-container__shape-held-title")[0];
            this.knights = document.getElementsByClassName("verity-container__enemies-knight");

            this.leftKnightKill = document.querySelector(".verity-container__enemies-left-knight-kill");
            this.midKnightKill = document.querySelector(".verity-container__enemies-mid-knight-kill");
            this.rightKnightKill = document.querySelector(".verity-container__enemies-right-knight-kill");

            this.knightActions = {
                "verity-container__enemies-left-knight-kill": {
                    src: "assets/media/circle.svg",
                    pickupClass: "verity-container__pickup-left",
                    ignoreClass: "verity-container__ignore-left"
                },
                "verity-container__enemies-mid-knight-kill": {
                    src: "assets/media/triangle.svg",
                    pickupClass: "verity-container__pickup-mid",
                    ignoreClass: "verity-container__ignore-mid"
                },
                "verity-container__enemies-right-knight-kill": {
                    src: "assets/media/square.svg",
                    pickupClass: "verity-container__pickup-right",
                    ignoreClass: "verity-container__ignore-right"
                }
            };

            this.leftShapePickup = document.querySelector(".verity-container__pickup-left");
            this.midShapePickup = document.querySelector(".verity-container__pickup-mid");
            this.rightShapePickup = document.querySelector(".verity-container__pickup-right");

            this.pickupActions = {
                "verity-container__pickup-left": {
                    src: "assets/media/knight.webp",
                    shape: "C",
                    shapeImg: "assets/media/circle.svg",
                    ignoreClass: "verity-container__ignore-left"
                },
                "verity-container__pickup-mid": {
                    src: "assets/media/knight.webp",
                    shape: "T",
                    shapeImg: "assets/media/triangle.svg",
                    ignoreClass: "verity-container__ignore-mid"
                },
                "verity-container__pickup-right": {
                    src: "assets/media/knight.webp",
                    shape: "S",
                    shapeImg: "assets/media/square.svg",
                    ignoreClass: "verity-container__ignore-right"
                }
            }

            this.leftShapeIgnore = document.querySelector(".verity-container__ignore-left");
            this.midShapeIgnore = document.querySelector(".verity-container__ignore-mid");
            this.rightShapeIgnore = document.querySelector(".verity-container__ignore-right");

            this.ignoreActions = {
                "verity-container__ignore-left": {
                    src: "assets/media/knight.webp",
                    pickupClass: "verity-container__pickup-left"
                },
                "verity-container__ignore-mid": {
                    src: "assets/media/knight.webp",
                    pickupClass: "verity-container__pickup-mid"
                },
                "verity-container__ignore-right": {
                    src: "assets/media/knight.webp",
                    pickupClass: "verity-container__pickup-right"
                }
            }

            this.ogres = document.querySelector(".verity-container__enemies-champions");
            this.ogresKill = document.querySelector(".verity-container__enemies-ogre-kill")
        }

        toggleAccordion() {
            this.accordionContent.classList.toggle('show');
            this.accordionIcon.classList.toggle('rotate');
        }

        reset() {
            this.populateStatues();
            this.resetDisabledState();
            this.resetShapeHeldStatus();
            this.resetKnights();
            this.spawnKnights();
            if (document.querySelector(".dissect-primed")) {
                document.querySelector(".dissect-primed").classList.remove("dissect-primed");
            };
            this.dissectStatus = false;
        }

        randomise() {
            this.reset();
            this.start();
        }

        start() {
            const callouts = document.querySelectorAll('.verity-container__callouts-shapes');
            callouts.forEach(callout => {
                Array.from(callout.children).forEach(child => child.remove());
            });

            this.calloutsArr.sort(() => Math.random() - 0.5);

            const shapesContainer = document.getElementsByClassName('verity-container__callouts-shapes')[0];

            this.calloutsArr.forEach(shape => {
                if (this.lettersCheckbox.checked) {
                    const shapeData = this.shapes.find(s => s.letter === shape);
                    if (shapeData) {
                        const pElement = document.createElement('p');
                        pElement.textContent = shapeData.letter;
                        pElement.className = "verity-container__callouts-letter";
                        shapesContainer.appendChild(pElement);
                    }
                } else {
                    const shapeData = this.shapes.find(s => s.letter === shape);
                    if (shapeData) {
                        const imgElement = document.createElement('img');
                        imgElement.src = shapeData.src;
                        imgElement.className = "verity-container__callouts-shape";
                        shapesContainer.appendChild(imgElement);
                    }
                }
            });

            this.randomiseStatues();
        }

        randomiseStatues() {
            const finalArray = new Array(6).fill(null);

            finalArray[0] = this.calloutsArr[0];
            finalArray[2] = this.calloutsArr[1];
            finalArray[4] = this.calloutsArr[2];

            let randomIndex = Math.floor(Math.random() * this.calloutsArr.length);
            finalArray[1] = this.calloutsArr[randomIndex];

            do {
                randomIndex = Math.floor(Math.random() * this.calloutsArr.length);
                finalArray[3] = this.calloutsArr[randomIndex];
            } while (finalArray[3] === finalArray[1]);

            do {
                randomIndex = Math.floor(Math.random() * this.calloutsArr.length);
                finalArray[5] = this.calloutsArr[randomIndex];
            } while (finalArray[5] === finalArray[1] || finalArray[5] === finalArray[3]);

            this.statuesArr = finalArray;
            this.populateStatues();
        }

        populateStatues() {
            this.leftStatue.setAttribute('statue-shape', this.statuesArr[0] + this.statuesArr[1]);
            this.midStatue.setAttribute('statue-shape', this.statuesArr[2] + this.statuesArr[3]);
            this.rightStatue.setAttribute('statue-shape', this.statuesArr[4] + this.statuesArr[5]);

            this.updateStatueShape();
        }

        updateStatueShape() {
            let leftStatueShapes = this.leftStatue.getAttribute('statue-shape');
            let midStatueShapes = this.midStatue.getAttribute('statue-shape');
            let rightStatueShapes = this.rightStatue.getAttribute('statue-shape');

            const shapeAssets = {
                "CC": "assets/media/sphere.svg",
                "SS": "assets/media/cube.svg",
                "TT": "assets/media/pyramid.svg",
                "SC": "assets/media/cylinder.svg",
                "CS": "assets/media/cylinder.svg",
                "TS": "assets/media/prism.png",
                "ST": "assets/media/prism.png",
                "CT": "assets/media/cone.svg",
                "TC": "assets/media/cone.svg"
            };

            const updateStatueSrc = (statue, shape) => {
                statue.children[0].src = shapeAssets[shape];
            };

            updateStatueSrc(this.leftStatue, leftStatueShapes);
            updateStatueSrc(this.midStatue, midStatueShapes);
            updateStatueSrc(this.rightStatue, rightStatueShapes);

            this.updateStatus(leftStatueShapes, midStatueShapes, rightStatueShapes);
        }

        updateStatus(leftStatueShapes, midStatueShapes) {
            let leftCombinedShapes = leftStatueShapes + this.calloutsArr[0];
            let midCombinedShapes = midStatueShapes + this.calloutsArr[1];

            if (leftCombinedShapes.includes("C") && leftCombinedShapes.includes("S") && leftCombinedShapes.includes("T")) {
                if (midCombinedShapes.includes("C") && midCombinedShapes.includes("S") && midCombinedShapes.includes("T")) {
                    this.status.classList.add("correct-status");
                    this.status.textContent = "Correct";
                } else {
                    this.status.classList.remove("correct-status");
                    this.status.textContent = "Incorrect";
                }
            } else {
                this.status.classList.remove("correct-status");
                this.status.textContent = "Incorrect";
            }
        }

        handleLetterCheckbox() {
            if (this.lettersCheckbox.checked) {
                this.shapes.forEach(shape => {
                    const pElement = document.createElement('p');
                    pElement.textContent = shape.letter;
                    pElement.className = "verity-container__callouts-letter"
                    const imgElement = document.querySelector(`img[src="${shape.src}"]`);
                    if (imgElement) {
                        imgElement.replaceWith(pElement);
                    }
                });
            } else {
                this.shapes.forEach(shape => {
                    const pElements = Array.from(document.querySelectorAll('p'));
                    const pElement = pElements.find(p => p.textContent === shape.letter);
                    if (pElement) {
                        const imgElement = document.createElement('img');
                        imgElement.src = shape.src;
                        imgElement.className = "verity-container__callouts-shape";
                        pElement.replaceWith(imgElement);
                    }
                });
            }
        }

        resetShapeHeldStatus() {
            this.shapeHeldTitle.setAttribute('shape-held', '');
            if (this.shapeHeldTitle.nextElementSibling) {
                this.shapeHeldTitle.nextElementSibling.remove();
            }
            this.resetDisabledState();

            this.leftShapePickup.disabled = false;
            this.midShapePickup.disabled = false;
            this.rightShapePickup.disabled = false;
        }

        resetDisabledState() {
            this.leftDissect.disabled = true;
            this.midDissect.disabled = true;
            this.rightDissect.disabled = true;
        }

        dissectStatue(event) {
            if (this.dissectStatus == false) {
                this.dissectStatus = true;
                event.target.previousElementSibling.classList.add("dissect-primed");
                this.dissect1 = this.shapeHeldTitle.getAttribute("shape-held");
                this.resetShapeHeldStatus();
            } else {
                this.dissectStatus = false;
                this.dissect2 = this.shapeHeldTitle.getAttribute("shape-held");
                this.resetShapeHeldStatus();

                let statue1 = document.querySelector(".dissect-primed").parentElement;
                let statue1Shape = document.querySelector(".dissect-primed").parentElement.getAttribute("statue-shape");
                let statue2Shape = event.target.parentElement.getAttribute("statue-shape");
                document.querySelector(".dissect-primed").classList.remove("dissect-primed");

                statue1Shape = statue1Shape.replace(this.dissect1, '');
                statue1Shape += this.dissect2;

                statue2Shape = statue2Shape.replace(this.dissect2, '');
                statue2Shape += this.dissect1;

                statue1.setAttribute("statue-shape", statue1Shape);
                event.target.parentElement.setAttribute("statue-shape", statue2Shape);

                console.log(statue1, event.target.parentElement)

                this.updateStatueShape();
            }
        }

        killKnight(event) {
            const currentBtn = event.currentTarget;
            const action = this.knightActions[currentBtn.className];

            if (action) {
                currentBtn.previousElementSibling.src = action.src;
                document.getElementsByClassName(action.pickupClass)[0].classList.remove("hide-class");
                document.getElementsByClassName(action.ignoreClass)[0].classList.remove("hide-class");
                currentBtn.classList.add("hide-class");
            }
        }

        pickupShape(event) {
            const currentBtn = event.currentTarget;
            const action = this.pickupActions[currentBtn.className];

            if ((this.leftStatue.getAttribute("statue-shape")).includes(action.shape) && !this.leftDissect.previousElementSibling.classList.contains("dissect-primed")) {
                this.leftDissect.disabled = false;
            }

            if ((this.midStatue.getAttribute("statue-shape")).includes(action.shape) && !this.midDissect.previousElementSibling.classList.contains("dissect-primed")) {
                this.midDissect.disabled = false;
            }

            if ((this.rightStatue.getAttribute("statue-shape")).includes(action.shape) && !this.rightDissect.previousElementSibling.classList.contains("dissect-primed")) {
                this.rightDissect.disabled = false;
            }

            if (action) {
                this.leftShapePickup.disabled = true;
                this.midShapePickup.disabled = true;
                this.rightShapePickup.disabled = true;

                const imgElement = document.createElement('img');
                imgElement.src = action.shapeImg;
                imgElement.className = "verity-container__callouts-shape";
                this.shapeHeldTitle.setAttribute('shape-held', action.shape);
                this.shapeHeldTitle.insertAdjacentElement('afterend', imgElement);

                let previousImg = currentBtn.previousElementSibling;

                while (previousImg && previousImg.tagName !== 'IMG') {
                    previousImg = previousImg.previousElementSibling;
                }

                previousImg.classList.add("hide-class");
                previousImg.src = action.src;
                document.getElementsByClassName(action.ignoreClass)[0].classList.add("hide-class");
                currentBtn.classList.add("hide-class");
            }

            if (document.getElementsByClassName("verity-enemies hide-class").length == 3) {
                this.spawnOgres();
            }
        }

        ignoreShape(event) {
            const currentBtn = event.currentTarget;
            const action = this.ignoreActions[currentBtn.className];

            if (action) {
                let previousImg = currentBtn.previousElementSibling;

                while (previousImg && previousImg.tagName !== 'IMG') {
                    previousImg = previousImg.previousElementSibling;
                }

                previousImg.classList.add("hide-class");
                previousImg.src = action.src;
                document.getElementsByClassName(action.pickupClass)[0].classList.add("hide-class");
                currentBtn.classList.add("hide-class");
            }

            if (document.getElementsByClassName("verity-enemies hide-class").length == 3) {
                this.spawnOgres();
            }
        }

        spawnOgres() {
            Array.from(this.knights).forEach(knight => {
                knight.classList.add("hide-class");
            });
            this.ogres.classList.remove("hide-class");
        }

        spawnKnights() {
            this.ogres.classList.add("hide-class");
            Array.from(this.knights).forEach(knight => {
                knight.classList.remove("hide-class");
                knight.children[0].classList.remove("hide-class");
            });
            this.leftKnightKill.classList.remove("hide-class");
            this.midKnightKill.classList.remove("hide-class");
            this.rightKnightKill.classList.remove("hide-class");
        }

        resetKnights() {
            this.leftShapePickup.classList.add("hide-class");
            this.midShapePickup.classList.add("hide-class");
            this.rightShapePickup.classList.add("hide-class");

            this.leftShapeIgnore.classList.add("hide-class");
            this.midShapeIgnore.classList.add("hide-class");
            this.rightShapeIgnore.classList.add("hide-class");

            Array.from(this.knights).forEach(knight => {
                knight.children[0].src = "assets/media/knight.webp";
            });
        }

        bindingEvents() {
            this.accordion.addEventListener('click', ()=> this.toggleAccordion());
            this.resetBtn.addEventListener('click', () => this.reset());
            this.randomiseBtn.addEventListener('click', () => this.randomise());
            this.lettersCheckbox.addEventListener('change', this.handleLetterCheckbox.bind(this));

            this.leftKnightKill.addEventListener('click', (event) => this.killKnight(event));
            this.midKnightKill.addEventListener('click', (event) => this.killKnight(event));
            this.rightKnightKill.addEventListener('click', (event) => this.killKnight(event));

            this.leftShapePickup.addEventListener('click', (event) => this.pickupShape(event));
            this.midShapePickup.addEventListener('click', (event) => this.pickupShape(event));
            this.rightShapePickup.addEventListener('click', (event) => this.pickupShape(event));

            this.leftShapeIgnore.addEventListener('click', (event) => this.ignoreShape(event));
            this.midShapeIgnore.addEventListener('click', (event) => this.ignoreShape(event));
            this.rightShapeIgnore.addEventListener('click', (event) => this.ignoreShape(event));

            this.leftDissect.addEventListener('click', (event) => this.dissectStatue(event));
            this.midDissect.addEventListener('click', (event) => this.dissectStatue(event));
            this.rightDissect.addEventListener('click', (event) => this.dissectStatue(event));

            this.ogresKill.addEventListener('click', () => this.spawnKnights());

            window.onload = this.resetDisabledState();
        }

        init() {
            this.start();
            this.bindingEvents();
        }
    }
    window.addEventListener("DOMContentLoaded", () => {
        const verityCalculatorObj = new VerityCalculator();
        verityCalculatorObj.init();
    });
})();
