//MailChimp NewsLetter app
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config')

const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mailchimp.setConfig({
    apiKey: config.MY_KEY,
    server: config.SERVER
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.Email;
    const mob = req.body.Number;

    const list_id = config.LIST_ID;
 
    async function run() {
        const response = await mailchimp.lists.addListMember(list_id, {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName ,
                    PHONE: mob
                }
        })
        console.log(response);

        if (response.status === 'subscribed') {
            res.sendFile(__dirname + '/success.html');
        }
        else{
            res.sendFile(__dirname + '/failure.html');
        }
    }

    run();

})

app.post('/failure.html', (req, res)=>{
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening on 3000');
})