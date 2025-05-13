const db = require('../db');

// category page
exports.getCategories = (req,res) => {
    db.query("SELECT * FROM category", (error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving category by ID');
        } else {
            res.render('viewAllCategory', {category:results })
        }
    });
};

exports.getCategory = (req, res) => {
    const categoryId = req.params.id;
    const sql = 'SELECT * FROM category WHERE categoryId = ?';
    // Fetch data from MySQL
    db.query(sql, [categoryId], (error, results) => {

        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving category by ID');
        }

        // Check if any category with the given ID was found
        if (results.length > 0) {
            // Render HTML page with the category data
            res.render('viewCategory', { category: results[0] });
        } else {
            // If no category with the given ID was found, 
            //render a 404 page or handle it accordingly
            res.status(404).send('Category not found');
        }
    });
};
// exports.getCategory = (req, res) => {
//         // Extract the category ID from the request parameters
//         const categoryId = req.params.id;
//         const sql = 'SELECT * FROM category WHERE categoryId = ?';
//         // Fetch data from MySQL based on the student ID
//         db.query(sql , [categoryId], (error, results) => {
//         db.query(sql , [categoryId], (error, results) => {
//             if (error) {
//                 console.error('Database query error:', error.message);
//                 return res.status(500).send('Error retrieving category by ID');
//             }
   
//             // Check if any category with the given ID was found
//             if (results.length > 0) {
//                 // Render HTML page with the category data
//                 res.render('category', { category: results });
//                 // Render HTML page with the category data
//                 res.render('category', { category: results });
//             } else {
//                 // If no category with the given ID was found,
//                 //render a 404 page or handle it accordingly
//                 res.status(404).send('Category not found');
//                 res.status(404).send('Category not found');
//             }
//         });
//     };
 
exports.addCategoryForm = (req, res) => {
    res.render('addCategory');
};

exports.addCategory = (req, res) => {
    // Extract product data from the request body
    const { categoryname } = req.body;
    const sql = 'INSERT INTO category (categoryname, categoryImage) VALUES (?, ?)';
    let categoryImage; 
    if (req.file) { 
        categoryImage = req.file.filename; // Save only the filename 
    } else { 
        categoryImage = null; 
    }

    // Insert the new category into the database
    db.query( sql, [categoryname, categoryImage], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error adding category:", error);
            res.status(500).send('Error adding Category');
        } else {
            // Send a success response
            res.redirect('/categories');
        }
    });
};

exports.editCategoryForm = (req,res) => {
const categoryId = req.params.id;
const sql = 'SELECT * FROM category WHERE categoryId = ?';

// Fetch data from MySQL based on the student ID
db.query(sql , [categoryId], (error, results) => {
    if (error) {
        console.error('Database query error:', error.message);
        return res.status(500).send('Error retrieving category by ID');
    }

    // Check if any category with the given ID was found
    if (results.length > 0) {
        // Render HTML page with the category data
        res.render('editCategory', { category: results[0] });
    } else {
        // If no category with the given ID was found, render a 404 page or handle it accordingly
        res.status(404).send('Category not found');
    }
    });
};
   
exports.editCategory = (req, res) => {
const categoryId = req.params.id;
// Extract student data from the request body
const { categoryname } = req.body;
let image  = req.body.currentImage; //retrieve current image filename
if (req.file) { //if new image is uploaded
    image = req.file.filename; // set image to be new image filename
}
console.log("new file: " + image);
const sql = 'UPDATE category SET categoryname = ?, categoryImage = ? WHERE categoryId = ?';

// Insert the new category into the database
db.query( sql , [categoryname, categoryId], (error, results) => {
    if (error) {
        // Handle any error that occurs during the database operation
        console.error("Error updating category:", error);
        res.status(500).send('Error updating category');
    } else {
        // Send a success response
        res.redirect('/categories');
    }
});
};

exports.deleteCategory = (req, res) => {
    const categoryId = req.params.id;
    const sql = 'DELETE FROM category WHERE categoryId = ?';
    db.query( sql , [categoryId], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error deleting category:", error);
            res.status(500).send('Error deleting category');
        } else {
            // Send a success response
            res.redirect('/categories');
        }
    });
};
