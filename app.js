const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req,res) =>{
    res.render("index");
})
app.get('/read', async (req,res) =>{
    let users = await userModel.find();
    res.render("read",{users});
})
app.post('/create', async(req,res) =>{
    let{name, email, password} = req.body;
    let newUser = await userModel.create({
        name,
        email, 
        password
    }); 

    res.redirect("/read");

})

app.get('/delete/:id', async (req,res) =>{
    let users = await userModel.findOneAndDelete({_id: req.params.id});
    res.redirect("/read");
})

app.get('/update/:id', async (req, res) => {
    let id = req.params.id;
    let user = await userModel.findById(id); // Fetch the user to populate the update form
    res.render("edit", { user }); // Render an update form with user data
});

app.post('/update/:id', async (req, res) => {
    let id = req.params.id;
    let { name, email, password } = req.body;
    await userModel.findOneAndUpdate({ _id: id }, { name, email, password });
    res.redirect("/read");
});

app.listen(3000);
