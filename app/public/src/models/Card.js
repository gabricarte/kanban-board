class Card {

    constructor(title, description, column, color, position) {
        this._title = title;
        this._description = description;
        this._column = column;
        this._color = color;
        this._position = position;
        this._id;
    }

    //getters and setters 
    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get column() {
        return this._column;
    }

    get color() {
        return this._color;
    }

    get position() {
        return this._position;
    }


    //converts json in the object instantiated 
    loadFromJSON(json) {

        for (let name in json) {
            this[name] = json[name];
        }

    }

    //converts the object instantiated in json
    toJSON() {

        let json = {};

        Object.keys(this).forEach(key => {
            if (this[key] !== undefined) json[key] = this[key];
        });

        return json;

    }

    //save the card on the api 
    save() {

        return new Promise((resolve, reject) => {

            let promise;

            promise = HttpRequest.post(`/cards`, this.toJSON());

            promise.then(data => {

                this.loadFromJSON(data);

                resolve(this);

            }).catch(e => {
                reject(e)
            });

        });
    }

    delete() {
        return HttpRequest.delete(`/cards/${this._id}`);
    }

    edit(title, description) {

        this._title = title;
        this._description = description;

        return HttpRequest.put(`/cards/${this._id}`, this.toJSON());
    }

    changeColumn(column, position) {

        this._column = column;
        this._position = position;

        return HttpRequest.put(`/cards/${this._id}`, this.toJSON());

    }

}