import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import pool from './models/database.js';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
config();

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(cookieParser());
app.use(express.static('views'))

app.get('/', (req, res) => {
res.send('Welcome to our modern website!');
});

app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
});

app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        res.status(201).send('User created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating the user');
    }
});

app.post('/users', async (req, res) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ user, token });
});


app.get('/products', async (req, res) => {
    try {
      const [products] = await pool.query('SELECT * FROM products_table');
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving products from the database');
    }
  });

  app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [product] = await pool.query('SELECT * FROM products_table WHERE products_id = ?', [id]);
        if (product.length > 0) {
            res.json(product[0]);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving product from the database');
    }
});

app.post('/products', async (req, res) => {
    const { products_name, quantity, amount, category, products_url } = req.body;
    try {
        const sql = 'INSERT INTO products_table (products_name, quantity, amount, category, products_url) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(sql, [products_name, quantity, amount, category, products_url]);
        
        if (result.affectedRows > 0) {
            res.status(201).json({ message: "Product added successfully", productId: result.insertId });
        } else {
            res.status(400).send("Error adding the product");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding product to the database');
    }
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { products_name, quantity, amount, category, products_url } = req.body;
    
    try {
        const sql = 'UPDATE products_table SET products_name = ?, quantity = ?, amount = ?, category = ?, products_url = ? WHERE products_id = ?';
        const [result] = await pool.query(sql, [products_name, quantity, amount, category, products_url, id]);
        
        if (result.affectedRows > 0) {
            res.json({ message: "Product updated successfully" });
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product in the database');
    }
});

app.patch('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updateFields = Object.entries(req.body).map(([key, value]) => `${key} = '${value}'`).join(', ');
    
    if (!updateFields) {
        return res.status(400).send("No fields provided for update");
    }
    
    try {
        const sql = `UPDATE products_table SET ${updateFields} WHERE products_id = ?`;
        const [result] = await pool.query(sql, [id]);
        
        if (result.affectedRows > 0) {
            res.json({ message: "Product updated successfully" });
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product in the database');
    }
});




app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
