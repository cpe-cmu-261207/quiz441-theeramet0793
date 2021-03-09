import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, query, validationResult } from 'express-validator'
import fs from 'fs'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"

interface JWTPayload {
  username: string;
  password: string;
}

app.post('/login',
  (req, res) => {

    const { username, password } = req.body
    // Use username and password to create token.
    if(username !== undefined && password !== undefined){
       return res.status(200).json({
        message: 'Login succesfully',"token": "token ที่ระบบสร้างขึ้น"
      })
    }else{
      return res.status(400).json({
        message: 'Invalid username or password',
      })
    }
    
  })

app.post('/register',
  (req, res) => {

    const { username, password, firstname, lastname, balance } = req.body
    const file = JSON.parse(
      fs.readFileSync("./customer.json", { encoding: "utf-8" })
    );
    const { users } = file;
    const registered_user = users.find(
      (user: { username: string }) => user.username === username
    );
    if (registered_user) {
      res.status(400).json({ massage: "Username is already in used" });
    } else {
      const newUser = {
        username,
        password,
        firstname,
        lastname,
        balance,
      };
      users.push(newUser);
      fs.writeFileSync("./customer.json", JSON.stringify(file));
      res.status(200).json({ massage: "Register successfully" });
    }
  })

app.get('/balance',
  (req, res) => {
    const token = req.query.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
      
    }
    catch (e) {
      //response in case of invalid token
      res.status(401).json({
        massage: "Invalid token",
      });

    }
  })

app.post('/deposit',
  body('amount').isInt({ min: 1 }),
  (req, res) => {

    //Is amount <= 0 ?
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })
    //
  })

app.post('/withdraw',
  (req, res) => {
  })

app.delete('/reset', (req, res) => {

  //code your database reset here
  
  return res.status(200).json({
    message: 'Reset database successfully'
  })
})

app.get('/me', (req, res) => {
  res.status(200)
  res.json({
      firstname: "theeramet",
      lastname: "metha",
      code: 620610793,
      gpa: 3.25
    })
  
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))