module.exports = (app) => {
    app.get('/', (req, res) => {
        res.statusCode = 200;
        res.render('index', { title: 'Index' });
    });
};

