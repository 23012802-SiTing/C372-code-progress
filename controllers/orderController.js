const db = require('../db');

exports.getmyOrders= (req, res) => {
    const userId = req.session.user.userId;
    console.log(userId)
    const sql = `SELECT 
                    p.snackId,
                    u.userName,
                    p.snackname,
                    p.description,
                    p.image,
                    p.price,
                    o.ordersnackQuantity,
                    o.orderDate
                FROM 
                    order_items o
                JOIN 
                    snacks p ON p.snackId = o.orderProductId
                JOIN 
                    users u ON o.orderUserId = u.userId
                WHERE 
                    o.orderUserId = ?;`;
    // Fetch data from MySQL
    db.query(sql, [userId], (error, results) => {
        if (error) {
            return res.status(500).send('Error retrieving products');
        }

        if (results.length > 0) {
            console.log('All products:', results[0].snackname);

            let totalAmount = 0;
            let orderProductQuantity = 0;
            let price = 0;

            for (let i = 0; i < results.length; i++) {
                orderProductQuantity = results[i].orderProductQuantity;
                price = results[i].pice;
                totalAmount += orderProductQuantity * price;
            }

            res.render('viewOrders', { order_items: results, totalAmount: totalAmount, msg: "" });
        } else {
            // If no product with the given ID was found, 
            //render a 404 page or handle it accordingly
            // res.status(404).send('No orders');

            res.render('viewOrders', { msg: "No orders" });
        }
    });
};


exports.getOrders = (req, res) => {
    const sql = `SELECT o.orderUserId, u.userName, p.snackId, p.snackname, p.description, p.image, p.price, o.orderProductQuantity, o.orderDate 
                FROM snacks p, order_items o, users u
                WHERE  p.snackId = o.orderProductId
                AND o.orderUserId = u.userId
                ORDER BY u.userName`;

    // Fetch data from MySQL
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).send('Error retrieving products');
        }

        console.log("results: " + results.length)
        if (results.length > 0) {
            console.log('All products:', results[0].snackname);

            let totalAmount = 0;
            let orderProductQuantity = 0;
            let price = 0;

            for (let i = 0; i < results.length; i++) {
                orderProductQuantity = results[i].orderProductQuantity;
                price = results[i].price;
                totalAmount += orderProductQuantity * price;
            }

            res.render('viewOrders', { order_items: results, totalAmount: totalAmount, msg: "" });
        } else {
            // If no product with the given ID was found, 
            //render a 404 page or handle it accordingly
            // res.status(404).send('No orders');

            res.render('viewOrders', { msg: "No orders" });
        }
    });
};
