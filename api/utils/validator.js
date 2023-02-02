module.exports = {

    card: (app, req, res) => {
        req.assert('_title', 'Title is required').notEmpty();
        req.assert('_description', 'Description is required').notEmpty();

        let errors = req.validationErrors();

        if (errors) {
            app.utils.error.send(errors, req, res);
            return false;
        } else {
            return true;
        }
    }

}