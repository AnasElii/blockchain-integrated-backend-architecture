const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const expressPlayground = require('graphql-playground-middleware-express').default;
const multer = require('multer');
const cors = require('cors'); // ALERT DELETE THIS LINE IN PRODUCTION

const connectDB = require('./config/db');
const nftEventHandler = require('./event/nftEventHandler');
const { rootValue, schema } = require('./graphql/index');

// Routes
const mintNFT = require('./api/mintNFT');
const { POST } = require('./api/nftToIPFS');
const { fetchNFTs, fetchNFT, fetchNFTQuery, fetchNFTsQuery } = require('./api/getNFTs');
const { fetchMyNFTQuery } = require('./api/getMyNFTs');
const buyNFT = require('./api/buyNFT');
const { updateNFTQuery } = require('./api/updateNFT');

// Create an express server
const app = express();

// Middleware for handling CORS
app.use(cors()); // ALERT DELETE THIS LINE IN PRODUCTION

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// MIddleware for handling multipart/form-data
const upload = multer();

// Connect to the database
connectDB();

// Create express server and GraphQl endpoint
app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
}));

// Listen for NFT events
nftEventHandler();

// Routes
app.post('/api/mintNFT', upload.single('image'), mintNFT);
app.post('/api/fetchNFTs', fetchNFTs);
app.post('/api/fetchNFT', upload.none(), fetchNFT);
app.post('/api/fetchNFTsQuery', fetchNFTsQuery);
app.post('/api/fetchNFTQuery', upload.none(), fetchNFTQuery);
app.post('/api/fetchMyNFTQuery', upload.none(), fetchMyNFTQuery);
app.post('/api/buyNFT', upload.none(), buyNFT);
app.post('/api/updateNFTQuery', upload.none(), updateNFTQuery);

// Handle POST requests
app.post('/api/nftToIPFS', upload.single('image'), POST);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}/playground`);
});




