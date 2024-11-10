import express from 'express';
import User from './model/user.model.js';
import { Totp, generateConfig } from 'time2fa';
import QRCode from 'qrcode';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug')
app.get('/frontend', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

// route for receiving de qr code and rendering it
app.get('/frontend/code', async (req, res) => {
  const img = req.body.img;
    res.render('scan-code', { title: 'Hey', message: 'Hello there!', img: img })
} )

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/register", async (req, res) => {

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required'});
  }
 
  const id = new Date().getTime().toString();
  try {

    // Create key until it it verified
    const key = Totp.generateKey({issuer: 'NOC', user: id});

// Create user in the database
    const newUser = await User.create({
      name,
      email,
      id,
      key
    })
    await newUser.save();

    QRCode.toDataURL(newUser.key.url)
    .then(url => {
      console.log(url);
      const data = url.split(',')[1];
      res.render(`scan-code`, { img: data, idUser: newUser.id });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error generating QR code'})
    });

  } catch(e) {
    console.log(e);
    res.status(500).json({ message: 'Error generating secret key'})
  }
})

app.post("/api/createcodes", async (req, res) => {
  const { idUser } = req.body;
  try {
    // Retrieve user from database
    const user = await User.findOne({ id: idUser });
    console.log( user )
    const secret = user.key.secret;

    const config = generateConfig();
    const codes = Totp.generatePasscodes({ secret }, config);
    res.status(200).json(codes);
  
    
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user'})
  }
})


app.post("/validate", async (req,res) => {
  const { idUser, passCode } = req.body;
  try {
    // Retrieve user from database
    const user = await User.findOne({ id: idUser });
    
    const secret = user.key.secret;

    const tokenValidates = Totp.validate({
      passcode: passCode,
      secret
    })
    
    if (tokenValidates) {
      res.render('welcome', { title: 'Hey', message: 'Hello there!' })
    } else {
      res.json({ validated: false})
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user'})
  };
})

export default app;