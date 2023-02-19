class BoardController {

    constructor() {

        this.selectAll();
        this.addTask();

        //array for each column, containing the instanced objects 
        this.firstColumn = [];
        this.secondColumn = [];
        this.thirdColumn = [];
        this.fourthColumn = [];

    }

    //search all saved cards from the client server
    selectAll() {

        HttpRequest.get('/cards').then(data => {

            //data is an object with an array of objects (cards)
            data.cards.sort((a, b) => (a._position > b._position) ? 1 : ((b._position > a._position) ? -1 : 0)); //ordering card by position

            console.log(data.cards);

            data.cards.forEach(dataCard => {

                let card = new Card();
                card.loadFromJSON(dataCard);
                this.pushToColumnArray(card);

            });

            this.insertSavedTask(this.firstColumn);
            this.insertSavedTask(this.secondColumn);
            this.insertSavedTask(this.thirdColumn);
            this.insertSavedTask(this.fourthColumn);


        });


    }

    pushToColumnArray(cardObj) {

        switch (cardObj._column) {
            case '1':
                this.firstColumn.push(cardObj);
                break;
            case '2':
                this.secondColumn.push(cardObj);
                break;
            case '3':
                this.thirdColumn.push(cardObj);
                break;
            case '4':
                this.fourthColumn.push(cardObj);
                break;
        }

    }

    insertSavedTask(columnArray) {

        columnArray.forEach(dataCard => {

            const card = document.createElement('div');

            card.className = 'card';

            let color = dataCard.color;

            card.style.backgroundColor = color;

            card.setAttribute('draggable', true);

            card.innerHTML =
                `        
            <i class="fa-regular fa-trash-can" id="delete-btn"></i>
            <i class="fa-solid fa-pen-to-square" id="edit-btn"></i>
            <i class="fa-solid fa-floppy-disk" id="save-btn" style="display:none"></i>
            <i class="fa-regular fa-floppy-disk" id="onedit-btn" style="display:none"></i>
    
            <textarea name="text" id="text-title"  disabled
                oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'">${dataCard.title}</textarea>
    
            <textarea  name="text" id="text-description" disabled
                oninput="this.style.height = ''; this.style.height = this.scrollHeight +'px'">${dataCard.description}</textarea>
    
            `

            let column = document.querySelector(`.columns > #column${dataCard.column}`);

            let titleArea = card.querySelector(` textarea[id ^= 'text-title']`);
            let descriptionArea = card.querySelector(`textarea[id ^= 'text-description']`);

            column.appendChild(card);

            this.addCardEvents(card, dataCard, titleArea, descriptionArea);

            this.initDragEvent(card, dataCard);

        });

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

            this.insertNewTask(column);

        });

    }


    insertNewTask(column) {

        const card = document.createElement('div');

        card.className = 'card';

        let color = Utils.randomColor();

        card.style.backgroundColor = color;

        card.setAttribute('draggable', true);

        card.innerHTML =

            `
        <i class= "fa-regular fa-trash-can" id = "delete-btn" style = "display:none" ></i >

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


    onEnter(card) {

        let descriptionArea = card.querySelector(`textarea[id ^= 'text-description']`);

        card.addEventListener('keydown', event => {

            if (event.key === "Enter") {
                descriptionArea.focus();
            };

        });

    }


    getNewPosition(column) {

        let position;

        if (column.length == 0) {
            position = 0;
        } else if (column.length == 1) {
            position = 1;
        }
        else {
            position = column.length;
        }
        return position;
    }

    saveNewTask(card, columnId, color) {

        const saveBtn = card.querySelector('#save-btn');

        saveBtn.addEventListener('click', e => {

            let titleArea = card.querySelector(` textarea[id ^= 'text-title']`);
            let descriptionArea = card.querySelector(` textarea[id ^= 'text-description']`);
            let column = columnId.replace('column', '');
            let position;

            if (titleArea.value && descriptionArea.value) {

                switch (column) {
                    case '1':
                        position = this.getNewPosition(this.firstColumn);
                        break;
                    case '2':
                        position = this.getNewPosition(this.secondColumn);
                        break;
                    case '3':
                        position = this.getNewPosition(this.thirdColumn);
                        break;
                    case '4':
                        position = this.getNewPosition(this.fourthColumn);
                        break;
                }

                let newCardObj = new Card(titleArea.value, descriptionArea.value, column, color, position);
                this.pushToColumnArray(newCardObj);

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

                console.log(`Successfully edited! New Card: `, cardObj);

                onEditBtn.style.display = 'none';

            });

        });

    }


    initDragEvent(card, cardObj) {

        const initialColumn = card.parentNode;

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


            switch (initialColumn.id) {

                case 'column1':

                    let index = this.firstColumn.indexOf(cardObj);

                    if (index !== -1) {
                        this.firstColumn.splice(index, 1);
                    }

                    this.firstColumn.forEach((card, cardindex) => {

                        card.position = cardindex;
                    });

                    break;

                case 'column2':

                    let index2 = this.secondColumn.indexOf(cardObj);

                    if (index2 !== -1) {
                        this.secondColumn.splice(index2, 1);
                    }

                    this.secondColumn.forEach((card, cardindex) => {
                        card.position = cardindex;
                    });

                    break;
                case 'column3':
                    break;
                case 'column4':
                    break;


            }

            const endColumn = card.parentNode;

            switch (endColumn.id) {

                case 'column1':
                    this.changePosition(this.firstColumn, cardObj, endColumn);
                    break;
                case 'column2':
                    this.changePosition(this.secondColumn, cardObj, endColumn);
                    break;
                case 'column3':
                    this.changePosition(this.thirdColumn, cardObj, endColumn);
                    break;
                case 'column4':
                    this.changePosition(this.fourthColumn, cardObj, endColumn);
                    break;

            }


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

    changeColumn(column, cardObj) {

        let columnNumber = column.id.replace('column', '');

        cardObj.changeColumn(columnNumber, cardObj.position).then(
            console.log('changed position: ', cardObj)
        );

    }

    changePosition(column, cardObj, endColumn) {

        column.push(cardObj);

        column.filter((item, index) => {

            if (item === cardObj) {
                cardObj.position = index;
                this.changeColumn(endColumn, cardObj);
            }

        });

        column.forEach(card => {
            HttpRequest.put(`/cards/${card._id}`, card);
        });


    }

    //refactoring 
    disableTextArea(title, description, boolean = true) {
        title.disabled = boolean;
        description.disabled = boolean;
    }


}


