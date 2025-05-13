const { query } = require('express');
const db = require('../db');

exports.gethome = (req, res) => {
    res.render('home'); 
}; 

exports.getcontact =  (req, res) => {
    res.render('contact'); // Ensure you have a 'contact.ejs' or 'contact.html' file in your views folder
};

exports.getaboutus =  (req, res) => {
    res.render('aboutus'); // Ensure 'aboutus' is the correct view name
};

/////////////////////ADMIN SNACK//////////////////////////

exports.getProducts = (req, res) => {
    const sql = 'SELECT * FROM snacks';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message); 
            return res.status(500).send('Error Retrieving products'); 
        }
        res.render('snack', {snack: results, currentPage: 'shop'});
    });
};

exports.getProductsByCategory = (req, res) => {
    const categoryId = req.params.id;
    const sql = `SELECT 
                    p.snackId, 
                    p.snackname, 
                    p.price, 
                    p.image, 
                    p.description, 
                    p.size, 
                    p.quantity,
                    c.categoryName 
                FROM 
                    snacks p
                JOIN 
                    category c 
                ON 
                    p.categoryId = c.categoryId 
                WHERE 
                    c.categoryId = ?;`;
    // Fetch data from MySQL
    db.query(sql, [categoryId], (error, results) => {
        if (error) {
            return res.status(500).send('Error retrieving snacks');
        }

        if (results.length > 0) {
            console.log('All products:', results[0].snackname);
            res.render('viewAllProducts', { snack: results});
        } else {
            // If no product with the given ID was found, 
            //render a 404 page or handle it accordingly
            res.status(404).send('No snack');
        }
    });
};

exports.getProductsid = (req, res) => {
    const snackId = req.params.id;
    const sql = 'SELECT * FROM snacks WHERE snackId = ?';
    db.query(sql, [snackId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message); 
            return res.status(500).send('Error retrieving product by ID'); 
        }
        if (results.length > 0) {
            res.render('snackdetails', { snack: results[0] });
        } else {
            res.status(404).send('Product not found');
        }
    });
};

// exports.addProduct = (req, res) => {
//     const sql = 'SELECT * FROM category';
//     db.query(sql, (error, results) => {
//         if (error) {
//             console.error('Error fetching category:', error.message);
//             res.status(500).send('Error fetching category');

        
//         } else {
//             res.render('addSnack', { category: results }); // Pass categories to the view
//         }
//     });
// };

exports.addProduct = (req, res) => {

    const sql = 'SELECT * FROM category';
    // Fetch data from MySQL
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving category');
        }

        if (results.length > 0) {
            console.log('All categories:', results[0].categoryname);
            res.render('addSnack', { category: results });
            // res.render('viewAllCategories', { categories: results });
        } else {
            // If no product with the given ID was found, 
            //render a 404 page or handle it accordingly
            res.status(404).send('No category');
        }
    });
};

exports.addProductpost = (req, res) => {
    const { snackname, price, description, size, quantity, categoryId } = req.body;
    // const image = req.file ? req.file.filename : null;
    let image;
    if (req.file) {
        image = req.file.filename; // Save only the filename
    } else {
        image = null;
    }

    const sql = 'INSERT INTO snacks (snackname, price, description, size, quantity, categoryId, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [snackname, price, description, size, quantity, categoryId, image], (error) => {
        if (error) {
            console.error("Error adding product:", error);
            res.status(500).send('Error adding snack');
        } else {
            res.redirect('/snack');
        }
    });

};


exports.editProductid = async (req, res) => {
    const snackId = req.params.id;
    // First, fetch the categories
    getAllCategories(db, (categoriesError, category) => {
        if (categoriesError) {
            console.error('Error retrieving categories:', categoriesError.message);
            return res.status(500).send('Error retrieving category');
        }

        // Once categories are fetched, fetch the product by ID
        const sql = 'SELECT * FROM snakcs WHERE snackId = ?';
        db.query(sql, [snackId], (productError, results) => {
            if (productError) {
                console.error('Database query error:', productError.message);
                return res.status(500).send('Error retrieving snack by ID');
            }

            // Check if any product with the given ID was found
            if (results.length > 0) {
                // Render HTML page with the product and categories data
                res.render('editProduct', { product: results[0], category: category });
            } else {
                // If no product with the given ID was found, handle accordingly
                res.status(404).send('Product not found');
            }
        });
    });

};

// Fetch all categories using a callback
const getAllCategories = (db, callback) => {
    const sql = 'SELECT * FROM category';

    // Fetch data from MySQL
    db.query(sql, (error, results) => {
        if (error) {
            return callback(error, null); // Call callback with error
        }

        if (results.length > 0) {
            return callback(null, results); // Call callback with categories
        } else {
            return callback(null, []); // No categories found, return empty array
        }
    });
};


exports.editProductpost = (req, res) => {
    const snackId = req.params.id;
    const { snackname, price, description, size, quantity, categoryId } = req.body;
    let image = req.body.currentImage;
    if (req.file) {
        image = req.file.filename;
    }
    console.log("new file: " + image);

    const sql = 'UPDATE snacks SET snackname = ?, price = ?, description = ?, size = ?, quantity = ?, image = ?, categoryId = ? WHERE snackId = ?';
    db.query(sql, [snackname, price, description, size, quantity, image, categoryId, snackId], (error) => {
        if (error) {
            console.error("Error updating snack:", error);
            res.status(500).send('Error updating snack');
        } else {
            res.redirect('/snack');
        }
    });
};


exports.deleteProduct = (req, res) => {
    const snackId = req.params.id;
    const sql = 'DELETE FROM snacks WHERE snackId = ?';
    db.query( sql , [snackId], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error deleting snack:", error);
            res.status(500).send('Error deleting snack');
        } else {
            // Send a success response
            res.redirect('/snack');
        }
    });
};

