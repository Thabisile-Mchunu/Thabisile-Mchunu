//require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve frontend files

// Database config
const dbConfig = {
    user: 'sa',
    password: 'adminuser',
    server: 'localhost',
    database: 'projects',
    options: {
        encrypt: true, // For Azure SQL
        trustServerCertificate: true // For local dev
    }
};

// Connect to database
let pool;
sql.connect(dbConfig).then(p => {
    pool = p;
    console.log('Connected to SQL Server');
}).catch(err => {
    console.error('Database connection failed:', err);
});

// JWT secret
//const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const userCheck = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @email');
        
        if (userCheck.recordset.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'The email already exists' 
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert new user
        await pool.request()
            .input('firstname', sql.NVarChar, firstname)
            .input('lastname', sql.NVarChar, lastname)
            .input('dob', sql.NVarChar, dob)
            .input('address', sql.NVarChar, address)
            .input('city', sql.NVarChar, city)
            .input('code', sql.NVarChar, code)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .query('INSERT INTO Users (firstname, lastname, dob, address, city, code, email, password ) VALUES (@firstname, @lastname, @dob, @address, @city, @code, @email, @password )');
        
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const result = await pool.request()
            .input('email', sql.NVarChar,email)
            .query('SELECT * FROM Users WHERE Email = @email');
        
        if (result.recordset.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const user = result.recordset[0];
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user.UserID }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        res.json({ 
            success: true, 
            token, 
            message: 'Login successful' 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is protected data', userId: req.user.userId });
});

// Token verification middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});