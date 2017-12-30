import {
    addNewContact,
    getContacts
} from "../controllers/crmController";

const routes = (app) => {
    app.route('/contact')
        .get((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request Type: ${req.method}`)
            next();

        }, getContacts)

        .post(addNewContact);

    app.route('/contact/:contactId')
        .get((req, res) =>
            res.send('GET by ID  request successfull'))
        .put((req, res) =>
            res.send('PUT request successfull'))

        .delete((req, res) =>
            res.send('DELETE request successfull'));
}
export default routes;