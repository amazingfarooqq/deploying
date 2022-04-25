const express = require('express');
const app = express()
const path = require('path')
const cors = require('cors')
const dotenv = require("dotenv");
const { MongoClient } = require('mongodb');
dotenv.config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(cors())

app.get('/', (req,res) => {
    res.send('sadas')
})


app.post('/authregister', (req , res) => {
        console.log(req.body);
        MongoClient.connect(process.env.CONNECTIONSTRING  ,  async (err , client) => {
            const db = client.db()
            const con = db.collection("users");
            if (!req.body.email ||
                !req.body.password ||
                !req.body.firstName ||
                !req.body.lastName ||
                !req.body.phoneNumber ||
                !req.body.age ||
                !req.body.dob ||
                !req.body.address
                ) {
        
                    res.send({
                        status: 503,
                        message: `Plase fill out complete registeration form`
                    })
                return;
            }

                try {
                    const checkemail = await con.find({email: req.body.email}).toArray()
                    const checkedemail = checkemail[0] && checkemail[0].email    
                    if(checkedemail === req.body.email) {
                         res.send({
                            status: 503,
                            message: `This email is already registered`
                        })
                        return
                    } else {
                        await con.insertOne({
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email:  req.body.email, 
                                phoneNumber:  req.body.phoneNumber, 
                                password : req.body.password,
                                age: req.body.age,
                                dob: req.body.dob,
                                address: req.body.address,
                                role: 'user',
                                approvement: false
                            })
                        res.send({
                            status: 200,
                            message: `Thanks for registration`
                        }) 
                    }   
                } catch (error) {
                    console.log('database', error);
                }

            client.close()
        })

})



app.post('/authlogin', (req , res) => {
    
    // console.log(req.body.email);
    // console.log(req.body.password);

    MongoClient.connect(process.env.CONNECTIONSTRING  ,  async (err , client) => {
        const db = client.db()
        const con = db.collection("users");
        if (!req.body.email || !req.body.password) {
                res.send({
                    status: 403,
                    message: `please enter your email/password`
                })
            return;
        }

            try {
                const getUser = await con.findOne(
                    {
                        email: req.body.email,
                        password: req.body.password,
                    })

                    if(getUser) {
                        if(req.body.email === getUser.email && req.body.password === getUser.password){
                            
                            res.send({
                                status: 200,
                                message: `correct info`,
                                email: req.body.email,
                                getUser: getUser 
                            })
                        }
                    } else {
                        res.send({
                            status: 503,
                            message: `not correct info`
                        })
                    }
                
            } catch (error) {
                console.log('database', error);
            }

        client.close()
    })

})

app.post('/profiles', (req , res) => {
    
    // console.log(req.body.email);
    // console.log(req.body.password);

    MongoClient.connect(process.env.CONNECTIONSTRING  ,  async (err , client) => {
        const db = client.db()
        const con = db.collection("users");

            try {
                const getUsers = await con.find().toArray()       
                res.send({
                  status: 200,
                  getUsers: getUsers 
                })
            }              
            catch (error) {
                console.log('database', error);
            }

        client.close()
    })

})

app.listen(5000)