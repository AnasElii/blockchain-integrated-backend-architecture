const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const expressPlayground = require('graphql-playground-middleware-express').default;
const multer = require('multer');

const connectDB = require('./config/db');
const nftEventHandler = require('./event/nftEventHandler');
const { rootValue, schema } = require('./graphql/index');
const mintNFT = require('./api/mintNFT');
const { POST } = require('./api/nftToIPFS');

// Create an express server
const app = express();

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

// Handle POST requests
app.post('/api/nftToIPFS', upload.single('image'), POST);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}/playground`);
});




