const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'vulnerable-app-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


app.use(express.static('public'));

const UserAndPassword = () => {
    try {
      return {
        usernames: ['admin', 'wafa', 'linda'],
        passwords: ['admin123', 'wafa2025', 'pa$$word']
      };
    } catch (error) {
    console.error('Error loading user and password:', error.message);
  }
};

const initializeUsers = () => {
  const { usernames, passwords } = UserAndPassword();
  
  const validUsernames = usernames.slice(0, 5);
  const validPasswords = passwords.slice(0, 5);
  
  return validUsernames.map((username, index) => ({
    username,
    password: validPasswords[index < validPasswords.length ? index : 0]
  }));
};


const users = initializeUsers();


const loginAttempts = {};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const user = users.find(u => u.username === username);
  
    if (!user) {
      
      setTimeout(() => {
        return res.status(401).json({ 
          error: 'Invalid username' 
        });
      }, 50);
    } else {
      if (user.password !== password) {
        
        setTimeout(() => {
          return res.status(401).json({ 
            error: 'Invalid password. Please try again.' 
          });
        }, 500);
      } else {
       
        req.session.user = {
          username: user.username,
          authenticated: true
        };
        return res.json({ 
          success: true, 
          message: `Welcome, ${user.username}!`,
          redirect: '/dashboard'
        });
      }
    }
  });
  

app.get('/dashboard', (req, res) => {
  if (!req.session.user || !req.session.user.authenticated) {
    return res.redirect('/');
  }
  
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/reset-password', (req, res) => {
  const { username } = req.body;
  
  const user = users.find(u => u.username === username);
  
  if (!user) {
    setTimeout(() => {
      return res.status(200).json({ 
        message: 'If a matching account is found, a password reset link will be sent.'
      });
    }, 50);
  } else {
    setTimeout(() => {
      return res.status(200).json({ 
        message: 'If a matching account is found, a password reset link will be sent.'
      });
    }, 500);
  }
});

app.listen(PORT, () => {
  console.log(`Vulnerable application running on port ${PORT}`);

});