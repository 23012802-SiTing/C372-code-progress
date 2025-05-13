const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const snackController = require('./controllers/snackController');
const cartController = require('./controllers/cartController');
const categoryController = require('./controllers/categoryController');
const reviewController = require('./controllers/reviewController');
const roleController = require('./controllers/roleController');
const orderController = require('./controllers/orderController');
const bizfeedbackController = require('./controllers/bizfeedbackController');
const netsQrController = require("./controllers/netsQrController")
const paypalController = require('./controllers/paypalController');

require('dotenv').config();

// Import middleware
const { checkAuthenticated, checkAdmin, checkUser } = require('./middleware/auth');
const { validateRegistration, validateLogin } = require('./middleware/validation');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

// Set up view engine
app.set('view engine', 'ejs');
//  enable static files
app.use(express.static('public'));
// enable form processing
app.use(express.urlencoded({
    extended: false
}));

//Code for Session Middleware  
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // Session expires after 1 week of inactivity
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

//This middleware assigns the current session object (req.session) to res.locals.session, making session data accessible within your view templates. 
//This approach is particularly useful when using templating engines like EJS, as it allows you to reference session variables directly in your templates.
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Use connect-flash middleware
app.use(flash()); // Use flash middleware after session middleware

// Define routes here
app.get('/', (req, res) => {

    let loggedIn = false;
    if (req.session.user) {
        loggedIn = true;
    }
    res.render('home', { loggedIn});
});

app.get('/', snackController.gethome);
app.get('/aboutus', snackController.getaboutus);
app.get('/contact', snackController.getcontact);

app.get('/feedback', bizfeedbackController.getFeedback); // Display all feedback
app.get('/feedback/:id', bizfeedbackController.getFeedbackById); // Display feedback by ID
app.post('/addfeedback', bizfeedbackController.addFeedbackpost); // Add new feedback
app.get('/addFeedback', bizfeedbackController.addFeedback); // Render add feedback form
app.get('/successfulfeedback', bizfeedbackController.getsuccessful); // Render successful feedback page
app.get('/editFeedback/:id', bizfeedbackController.editFeedbackid); // Render edit feedback form
app.post('/editFeedback/:id', bizfeedbackController.editFeedbackpost); // Process edit feedback
app.get('/deleteFeedback/:id', bizfeedbackController.deleteFeedback); // Delete feedback by ID

//category
app.get('/categories', categoryController.getCategories);
app.get('/category/:id', categoryController.getCategory);
app.get('/addCategory', checkAdmin, categoryController.addCategoryForm);
app.post('/addCategory', checkAdmin, upload.single('categoryImage'), categoryController.addCategory);
app.get('/editCategory/:id', checkAdmin, categoryController.editCategoryForm);
app.post('/editCategory/:id', checkAdmin, upload.single('categoryImage'), categoryController.editCategory);
app.get('/deleteCategory/:id', checkAdmin, categoryController.deleteCategory);

//snack
app.get('/snack', snackController.getProducts);
app.get('/category/:id/snack', snackController.getProductsByCategory);
app.get ('/snack/:id', snackController.getProductsid); 
app.get ('/addSnack', checkAdmin, snackController.addProduct);
app.post('/addSnack', checkAdmin, upload.single('image'), snackController.addProductpost); 
app.get('/editSnack/:id', checkAdmin, snackController.editProductid);
app.post('/editSnack/:id', checkAdmin, upload.single('image'), snackController.editProductpost); 
app.get ('/deleteSnack/:id', checkAdmin, snackController.deleteProduct);

//reviews
app.get('/reviews', reviewController.getReviews);
app.get('/snack/:id/reviews', reviewController.getProductReviews);
app.get('/review/:id', reviewController.getReview);
app.get('/addReview/:id', checkAuthenticated, reviewController.addReviewForm);
app.post('/addReview/:id', checkAuthenticated, upload.single('reviewImage'), reviewController.addReview);
app.get('/editReview/:id', checkAuthenticated, reviewController.editReviewForm);
app.post('/editReview/:id', checkAuthenticated, upload.single('reviewImage'), reviewController.editReview);
app.get('/deleteReview/:id', checkAdmin, reviewController.deleteReview);

//cart
app.get('/cart', [checkAuthenticated, checkUser], cartController.getCart);
app.post('/addToCart/:id', [checkAuthenticated, checkUser], cartController.addtoCart);
app.post('/updateCartProduct/:id', [checkAuthenticated, checkUser], cartController.updateCartProduct);
app.get('/removeFromCart/:id', [checkAuthenticated, checkUser], cartController.removeFromCart);
app.get('/checkout', [checkAuthenticated, checkUser], cartController.checkout);


//LOGIN
app.get('/login', roleController.loginForm);
app.post('/login', validateLogin, roleController.login);
app.get('/logout', checkAuthenticated, roleController.logout);

app.get('/register', roleController.registerForm);
app.post('/register', upload.single('userImage'), validateRegistration, roleController.register);

app.get('/users', checkAdmin, roleController.getUsers);
app.get('/user/:id', checkAdmin, roleController.getUser);
app.get('/editUser/:id', checkAdmin, roleController.editUserForm);
app.post('/editUser/:id', checkAdmin, upload.single('userImage'), roleController.editUser);
app.get('/deleteUser/:id', checkAdmin, roleController.deleteUser);

app.get('/myself', checkAuthenticated, roleController.getMyself);
app.get('/editMyself', checkAuthenticated, roleController.editMyselfForm);
app.post('/editMyself', checkAuthenticated, upload.single('userImage'), roleController.editMyself);

//orders
app.get('/myOrders', checkAuthenticated, orderController.getmyOrders);
app.get('/orders', checkAdmin, orderController.getOrders);

//nets
app.get("/", (req, res) => { res.render("netsQRHome") })
app.post('/generateNETSQR', netsQrController.generateQrCode);
app.get("/nets-qr/success", (req, res) => {
    res.render('netsTxnSuccessStatus', { message: 'Transaction Successful!' });
});
app.get("/nets-qr/fail", (req, res) => {
    res.render('netsTxnFailStatus', { message: 'Transaction Failed. Please try again.' });
})
app.get("/checkout/:paymentMethod/:orderId/:transactionId",cartController.checkout);

//paypal routes
app.use(express.json());
 
app.post("/api/orders",paypalController.createOrderHandler);
app.post("/api/orders/:orderID/capture",paypalController.captureOrderHandler);
app.get("/checkout/:paymentMethod/:orderId/:transactionId",cartController.checkout);

app.get('/401', (req, res) => {
    res.render('401', { errors: req.flash('error') });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
