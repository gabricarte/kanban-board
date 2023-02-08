class BoardController {

    constructor() {

        this.selectAll();
        this.addTask();

    }

    //search all saved cards from the client server
    selectAll() {

        HttpRequest.get('/cards').then(data => {

            //data is an object with an array of objects (cards)
            data.cards.sort((a, b) => (a._position > b._position) ? 1 : ((b._position > a._position) ? -1 : 0)); //ordering card by position

            data.cards.forEach(dataCard => {
                let card = new Card();
                card.loadFromJSON(dataCard);
                this.insertSavedTask(card);

            });
        });

    }

    insertSavedTask(cardObj) {

        const card = document.createElement('div');

        card.id = `card${cardObj.position}`;

        card.className = 'card';

        let color = cardObj.color;

        card.style.backgroundColor = color;

        card.setAttribute('draggable', true);

        card.innerHTML =
            `        
        <i class="fa-regular fa-trash-can" id="delete-btn"></i>
        <i class="fa-solid fa-pen-to-square" id="edit-btn"></i>
        <i class="fa-solid fa-floppy-disk" id="save-btn" style="display:none"></i>
        <i class="fa-regular fa-floppy-disk" id="onedit-btn" style="display:none"></i>

        <textarea name="text" id="text-title"  disabled
            oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'">${cardObj.title}</textarea>

        <textarea  name="text" id="text-description" disabled
            oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'">${cardObj.description}</textarea>

        `

        let column = document.querySelector(`.columns > #column${cardObj.column}`);

        column.appendChild(card);

        let titleArea = document.querySelector(`#column${cardObj.column} > #${card.id} > textarea[id^='text-title']`);
        let descriptionArea = document.querySelector(`#column${cardObj.column} > #${card.id} > textarea[id^='text-description']`);

        this.addCardEvents(card, cardObj, titleArea, descriptionArea);

        this.initDragEvent(card, cardObj);
    }


    addTask() {

        const buttons = document.querySelectorAll('button');
        const columns = document.querySelectorAll('.column');

        columns.forEach((column, index) => {

            this.addBtnEvent(buttons[index], column);

        });

    }


    addBtnEvent(btn, column, event = 'click') {

        btn.addEventListener(event, e => {

            let cardCount = document.querySelectorAll(` #${column.id} > div[id^='card']`).length;
            // card's position
            //counts the number of cards on the column, starting with 0 

            this.insertNewTask(column, cardCount);

        });

    }


    insertNewTask(column, cardCount) {

        const card = document.createElement('div');

        card.id = `card${cardCount}`;

        card.className = 'card';

        let color = Utils.randomColor();

        card.style.backgroundColor = color;

        card.setAttribute('draggable', true);

        card.innerHTML =
            `        
        <i class="fa-regular fa-trash-can" id="delete-btn" style="display:none" ></i>

        <i class="fa-solid fa-pen-to-square" id="edit-btn"  style="display:none" ></i>

        <i class="fa-solid fa-floppy-disk" id="save-btn"></i>

        <i class="fa-regular fa-floppy-disk" id="onedit-btn" style="display:none"></i>

        <textarea name="text" id="text-title"
            oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'"></textarea>

        <textarea  name="text" id="text-description"
            oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'"></textarea>

        `
        column.appendChild(card);

        this.onEnter(card, column);

        this.saveNewTask(card, column.id, color);

    }


    onEnter(card, column) {

        console.log(card)

        let textDescriptionArea = document.querySelector(`#${column.id} > #${card.id} > textarea[id^='text-description'] `);

        console.log(textDescriptionArea) //here

        card.addEventListener('keydown', event => {

            if (event.key === "Enter") {

                console.log('enter!');
                textDescriptionArea.focus();

            };

        });

    }

    saveNewTask(card, columnId, color) {

        const saveBtn = card.querySelector('#save-btn');

        saveBtn.addEventListener('click', e => {

            let titleArea = document.querySelector(`#${columnId} > #${card.id} > textarea[id^='text-title']`);
            let descriptionArea = document.querySelector(`#${columnId} >  #${card.id} > textarea[id^='text-description'] `);
            let column = columnId.replace('column', '');
            let position = card.id.replace('card', '');

            if (titleArea.value && descriptionArea.value) {

                let newCardObj = new Card(titleArea.value, descriptionArea.value, column, color, position);

                newCardObj.save().then(dataCard => {

                    console.log(`Task saved successfully on the database: `, dataCard);

                    this.disableTextArea(titleArea, descriptionArea);

                    saveBtn.style.display = 'none';

                    this.addCardEvents(card, dataCard, titleArea, descriptionArea);
                    this.initDragEvent(card, dataCard);
                });

                this.showButtons(card);



            } else {
                window.alert('Please, insert a title and a description for your task! ');
            }

        });
    }

    showButtons(card) {
        card.querySelector('#delete-btn').style.display = 'block';
        card.querySelector('#edit-btn').style.display = 'block';
    }

    //edit and delete 
    addCardEvents(card, cardObj, titleArea, descriptionArea) {

        const onEditBtn = card.querySelector('#onedit-btn');

        card.querySelector('#delete-btn').addEventListener('click', e => {

            if (confirm('Would you like to delete this card? ')) {

                cardObj.delete().then(data => {

                    card.remove(); //remove the card from the dom 

                });
            }

        });

        card.querySelector('#edit-btn').addEventListener('click', e => {

            console.log('edit! ');

            this.disableTextArea(titleArea, descriptionArea, false);

            onEditBtn.style.display = 'block';

            onEditBtn.addEventListener('click', e => {

                cardObj.edit(titleArea.value, descriptionArea.value);

                console.log(`Successfully edited! New Card:`, cardObj);

                onEditBtn.style.display = 'none';

            });

        });

    }


    initDragEvent(card, cardObj) {

        const dropzones = document.querySelectorAll('.column')

        card.addEventListener('dragstart', e => {

            card.classList.add('is-dragging');

            dropzones.forEach(dropzone => {
                dropzone.classList.add('highlight');
            });
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        card.addEventListener('dragend', e => {

            card.classList.remove('is-dragging');

            dropzones.forEach(dropzone => {
                dropzone.classList.remove('highlight');

            });

            const column = card.parentNode;
            this.changeColumn(card, column, cardObj);

        });

        dropzones.forEach(dropzone => {

            dropzone.addEventListener('dragover', e => {

                dropzone.classList.add('over');

                const cardDragged = document.querySelector('.is-dragging');

                dropzone.appendChild(cardDragged);

            });

            dropzone.addEventListener('dragleave', e => {

                dropzone.classList.remove('over');

            });

            dropzone.addEventListener('drop', e => {

                card.classList.remove('is-dragging');

                dropzone.classList.remove('over');



            });

        })

    }

    changeColumn(card, column, cardObj) {

        var index = Array.prototype.indexOf.call(column.children, card);
        //console.log(column.children)

        let columnNumber = column.id.replace('column', '');

        cardObj.changeColumn(columnNumber, index).then(
            console.log('Card sucessfully moved to another column or position!')
        );


    }

    //refactoring 
    disableTextArea(title, description, boolean = true) {
        title.disabled = boolean;
        description.disabled = boolean;
    }


}


