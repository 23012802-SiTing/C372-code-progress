const db = require('../db');

// Render the successful feedback page
exports.getsuccessful = (req, res) => {
    res.render('successfulfeedback');
};

// Display all feedbacks
exports.getFeedback = (req, res) => {
    const sql = `SELECT f.feedbackId, f.feedback, f.email, f.phone_number, f.feedbackbyuserId, u.userName 
                 FROM feedbacks f
                 JOIN users u ON f.feedbackbyuserId = u.userId`;
    
    // Fetch data from MySQL
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving feedbacks');
        }

        if (results.length > 0) {
            console.log('All feedbacks:', results);
            res.render('feedback', { feedback: results });
        } else {
            res.status(404).send('No feedbacks found');
        }
    });
};

// Display feedback details by ID
exports.getFeedbackById = (req, res) => {
    const feedbackId = req.params.id;
    const sql = 'SELECT * FROM feedbacks WHERE feedbackId = ?';
    
    db.query(sql, [feedbackId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving feedback by ID');
        }

        if (results.length > 0) {
            res.render('feedbackDetails', { feedback: results[0] });
        } else {
            res.status(404).send('Feedback not found');
        }
    });
};

// Render the form to add new feedback
exports.addFeedback = (req, res) => {
    res.render('addFeedback');
};

// Handle the submission of new feedback
exports.addFeedbackpost = (req, res) => {
    const { email, phone_number, feedback } = req.body;
    const feedbackbyuserId = req.session.user.userId; // Assuming user ID is stored in session

    const sql = 'INSERT INTO feedbacks (email, phone_number, feedback, feedbackbyuserId) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [email, phone_number, feedback, feedbackbyuserId], (error) => {
        if (error) {
            console.error("Error adding feedback:", error);
            return res.status(500).send('Error adding feedback');
        }
        res.redirect('/successfulfeedback'); // Redirect to successful feedback page
    });
};

// Render the edit feedback form
exports.editFeedbackid = (req, res) => {
    const feedbackId = req.params.id;
    const sql = 'SELECT * FROM feedbacks WHERE feedbackId = ?';
    
    db.query(sql, [feedbackId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving feedback by ID');
        }

        if (results.length > 0) {
            res.render('editFeedback', { feedback: results[0] });
        } else {
            res.status(404).send('Feedback not found');
        }
    });
};

// Handle the submission of edited feedback
exports.editFeedbackpost = (req, res) => {
    const feedbackId = req.params.id;
    const { email, phone_number, feedbackContent, feedbackRating } = req.body;
    let feedbackImage = req.body.currentFeedbackImage; // Retrieve current image filename

    if (req.file) { // If a new image is uploaded
        feedbackImage = req.file.filename; // Set image to be new image filename
    }

    const sql = 'UPDATE feedbacks SET email = ?, phone_number = ?, feedback = ? WHERE feedbackId = ?';

    db.query(sql, [email, phone_number, feedback, feedbackId], (error) => {
        if (error) {
            console.error("Error updating feedback:", error);
            return res.status(500).send('Error updating feedback');
        }
        res.redirect('/feedback'); // Redirect to feedback page after updating
    });
};

// Delete feedback by ID
exports.deleteFeedback = (req, res) => {
    const feedbackId = req.params.id;
    const sql = 'DELETE FROM feedbacks WHERE feedbackId = ?';
    
    db.query(sql, [feedbackId], (error) => {
        if (error) {
            console.error("Error deleting feedback:", error);
            return res.status(500).send('Error deleting feedback');
        }
        res.redirect('/feedback'); // Redirect to feedback page after deletion
    });
};

// Display all feedbacks
// exports.getFeedback = (req, res) => {
//     const sql = 'SELECT * FROM feedbacks';
//     db.query(sql, (error, results) => {
//         if (error) {
//             console.error('Database query error:', error.message);
//             return res.status(500).send('Error retrieving feedbacks');
//         }
//         res.render('feedback', { feedback: results }); // Pass feedbacks to the view
//     });
// };

// // exports.getadminFeedback = (req, res) => {
// //     const sql = 'SELECT * FROM feedbacks';
// //     db.query(sql, (error, results) => {
// //         if (error) {
// //             console.error('Database query error:', error.message);
// //             return res.status(500).send('Error retrieving feedbacks');
// //         }
// //         res.render('adminfeedback', { feedback: results }); // Pass feedbacks to the view
// //     });
// // };

// // Display feedback details by ID
// exports.getFeedbackById = (req, res) => {
//     const feedbackId = req.params.id;
//     const sql = 'SELECT * FROM feedbacks WHERE feedbackId = ?';
//     db.query(sql, [feedbackId], (error, results) => {
//         if (error) {
//             console.error('Database query error:', error.message);
//             return res.status(500).send('Error retrieving feedback by ID');
//         }
//         if (results.length > 0) {
//             res.render('feedbackDetails', { feedback: results[0] }); // Render feedback details view
//         } else {
//             res.status(404).send('Feedback not found');
//         }
//     });
// };

// // Add new feedback

// exports.addFeedback = (req, res) => {
//     res.render('addFeedback'); 
// };

// exports.addFeedbackpost = (req, res) => {
//     const { email, phone_number, feedback } = req.body;

//     // Basic validation
//     if (!email || !phone_number || !feedback) {
//         return res.status(400).send('All fields are required.');
//     }

//     const sql = 'INSERT INTO feedbacks (email, phone_number, feedback) VALUES (?, ?, ?)';
//     db.query(sql, [email, phone_number, feedback], (error) => {
//         if (error) {
//             console.error("Error adding feedback:", error);
//             return res.status(500).send('Error adding feedback');
//         }
//         res.redirect('/successfulfeedback'); // Redirect to feedback page after submission
//     });
// };

// exports.editFeedbackid = (req, res) => {
//     const feedbackId = req.params.id;
//     const sql = 'SELECT * FROM feedbacks WHERE feedbackId = ?';
//     db.query(sql, [feedbackId], (error, results) => {
//         // Check if any product with the given ID was found
//         if (results.length > 0) {
//             // Render HTML page with the student data
//             res.render('editFeedback', { feedback: results[0] });
//         } else {
//             // If no student with the given ID was found, render a 404 page or handle it accordingly
//             res.status(404).send('Product not found');
//         }
//     });
// };

//     //     // Check if any product with the given ID was found
//     //     if (results.length > 0) {
//     //         // Render HTML page with the student data
//     //         res.render('editProduct', { product: results[0] });
//     //     } else {
//     //         // If no student with the given ID was found, render a 404 page or handle it accordingly
//     //         res.status(404).send('Product not found');
//     //     }
//     // });


// exports.editFeedbackpost = (req, res) => {
//     const feedbackId = req.params.id;
//     const { email, phone_number, feedback} = req.body;

//     const sql = 'UPDATE snacks SET email = ?, phone_number = ?, feedback = ? WHERE feedbackId = ?';
//     db.query(sql, [ email, phone_number, feedback, feedbackId], (error) => {
//         if (error) {
//             console.error("Error updating feedback:", error);
//             res.status(500).send('Error updating feedback');
//         } else {
//             res.redirect('/feedback');
//         }
//     });
// };


// // Delete feedback by ID
// exports.deleteFeedback = (req, res) => {
//     const feedbackId = req.params.id;
//     const sql = 'DELETE FROM feedbacks WHERE feedbackId = ?';
//     db.query(sql, [feedbackId], (error) => {
//         if (error) {
//             console.error("Error deleting feedback:", error);
//             res.status(500).send('Error deleting feedback');
//         } else {
//             res.redirect('/feedback'); // Redirect to feedback page after deletion
//         }
//     });
// };