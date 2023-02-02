let NeDB = require('nedb');
//creating the database 
let db = new NeDB({
    filename: 'cards.db',
    autoload: true
});


//a function that receives the app variable when it's exported 
module.exports = (app) => {

    let route = app.route('/cards');

    //all of them are gonna be called with "/cards" before 
    route.get((req, res) => {

        db.find({}).sort({ title: 1 }).exec((err, cards) => {

            if (err) {
                app.utils.error.send(err, req, res);

            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ cards: cards });

            }
        });

    });

    //req.body is the data(json) that we are sending using post method
    //card is the saved register (req.body + created id)
    route.post((req, res) => {

        if (!app.utils.validator.card(app, req, res)) return false;     //assert 

        db.insert(req.body, (err, user) => {

            if (err) {
                app.utils.error.send(err, req, res);
            } else {

                res.status(200).json(user);
            }

        });

    });

    //specifying id
    let routeId = app.route('/cards/:id');

    routeId.get((req, res) => {

        db.findOne({ _id: req.params.id }).exec((err, card) => {

            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(card);
            }

        });
    });


    routeId.put((req, res) => {

        db.update({ _id: req.params.id }, req.body, err => {

            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(Object.assign(req.params, req.body));
            }

        });

    });

    routeId.delete((req, res) => {

        db.remove({ _id: req.params.id }, {}, err => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params);
            }
        });

    });


}



