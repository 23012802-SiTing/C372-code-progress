const db = require('../db');

exports.getCart = (req, res) => {
    const userId = req.session.user.userId;
    console.log(userId)
    const sql = `SELECT p.snackId, p.snackname, p.description, p.image, p.price, c.cartsnackquantity 
                    FROM snacks p
                    JOIN cart_snack c ON p.snackId = c.cartsnackId
                    WHERE c.cartUserId = ?;`;
    // Fetch data from MySQL
    db.query(sql, [userId], (error, results) => {
        if (error) {
            return res.status(500).send('Error retrieving snacks');
        }

        if (results.length > 0) {
            console.log('All snacks:', results[0].snackname);

            let totalAmount = 0;
            let cartsnackquantity = 0;
            let price = 0;

            for (let i = 0; i < results.length; i++) {
                cartsnackquantity = results[i].cartsnackquantity;
                price = results[i].price;
                totalAmount += cartsnackquantity * price;
            }

            res.render('viewCart', { cart_snack: results, totalAmount: totalAmount, msg: "" });
        } else {
            res.render('viewCart', { msg: "No snack in cart" });
        }
    });
};

exports.addtoCart = (req, res) => {
    const snackId = req.params.id;
    const { cartsnackquantity } = req.body
    console.log("snack qty to add" + cartsnackquantity)
    const userId = req.session.user.userId;

    // Check if snack is already in the cart for the user
    const checkCartQuery = 'SELECT * FROM cart_snack WHERE cartsnackId = ? AND cartUserId = ?';
    db.query(checkCartQuery, [snackId, userId], (err, cartResult) => {
        if (err) throw err;

        if (cartResult.length > 0) {
            // If the snack is already in the cart, update the quantity
            const updateCartQuery = `
                UPDATE cart_snack SET cartsnackquantity = cartsnackqua  ntity + ?
                WHERE cartsnackId = ? AND cartUserId = ?
            `;
            db.query(updateCartQuery, [cartsnackquantity, snackId, userId], (err, updateResult) => {
                if (err) throw err;
                res.redirect('/cart');
            });
        } else {
            // Otherwise, add a new row in the cart table
            const addToCartQuery = `
                INSERT INTO cart_snack (cartsnackquantity, cartsnackId, cartUserId)
                VALUES (?, ?, ?)
            `;
            db.query(addToCartQuery, [cartsnackquantity, snackId, userId], (err, insertResult) => {
                if (err) throw err;
                res.redirect('/cart');
            });
        }
    });

};


exports.updateCartProduct = (req, res) => {
    const snackId = req.params.id;
    const { cartsnackquantity } = req.body

    const userId = req.session.user.userId;

    const updateCartQuery = ` UPDATE cart_snack SET cartsnackquantity = ?
                            WHERE cartsnackId = ? AND cartUserId = ?`;
    db.query(updateCartQuery, [cartsnackquantity, snackId, userId], (err, updateResult) => {
        if (err) throw err;
        res.redirect('/cart');
    });

};


exports.removeFromCart = (req, res) => {
    const snackId = req.params.id;
    const userId = req.session.user.userId;
    const sql = 'DELETE FROM cart_snack WHERE cartsnackId = ? AND cartUserId = ?';
    db.query(sql, [snackId, userId], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error deleting product from cart:", error);
            res.status(500).send('Error deleting product from cart');
        } else {
            // Send a success response
            res.redirect('/cart');
        }
    });
}

exports.checkout = (req, res) => {

    const {paymentMethod, orderId, transactionId }= req.params
    console.log(`order id: ${orderId} transaction id: ${transactionId}`)
    
    const userId = req.session.user.userId; // Get userId from session
    console.log(userId);

    // SQL query to fetch cart items for the logged-in user
    const sql = `
        SELECT p.snackId, p.snackname, p.description, p.image, p.price, c.cartsnackquantity
        FROM snacks p
        JOIN cart_snack c ON p.snackId = c.cartsnackId
        WHERE c.cartUserId = ?;
    `;

    db.query(sql, [userId], (error, cartItems) => {
        if (error) {
            console.error('Error retrieving cart items:', error);
            return res.status(500).send('Error retrieving cart items');
        }

        if (cartItems.length > 0) {
            let totalAmount = 0;

            // Calculate total amount
            cartItems.forEach(item => {
                totalAmount += item.cartsnackquantity * item.price;
            });

            // Insert cart items into 'order_items' table
            const orderItemsSql = `
                    INSERT INTO order_items (orderProductId, ordersnackQuantity, orderUserId, orderDate, paymentMethod, orderId, transactionId)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

            const orderDate = new Date();
            cartItems.forEach(orderItem => {
                console.log(orderItem.snackId, orderItem.cartsnackquantity, userId, orderDate)
                console.log(orderItem)
                db.query(orderItemsSql, [
                    orderItem.snackId, orderItem.cartsnackquantity, userId, orderDate, paymentMethod, orderId, transactionId
                ]);
            });

            // Clear the cart after transferring items
            const clearCartSql = `DELETE FROM cart_snack WHERE cartUserId = ?`;
            db.query(clearCartSql, [userId], (clearCartError) => {
                if (clearCartError) {
                    console.error('Error clearing cart:', clearCartError);
                    return res.status(500).send('Error clearing cart');
                }

                // Render the invoice page (or confirmation page)
                res.render('invoice', {
                    cart_snack: cartItems,
                    totalAmount: totalAmount.toFixed(2), // Format total amount to 2 decimal places
                    userId: userId,
                    orderDate: orderDate, // Current date for the invoice
                    paymentMethod: paymentMethod,
                    orderId: orderId,
                    transactionId: transactionId
                });
            });


        } else {
            // Handle empty cart
            res.status(404).send('Your cart is empty');
        }
    });

};