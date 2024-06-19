const {readFileSync} = require('fs');
const {buildSchema} = require('graphql');

const userResolver = require('./resolvers/userResolver');
const nftResolver = require('./resolvers/nftResolver');

function getSchema(){
    return readFileSync('./graphql/schemas/schema.graphql', 'utf-8');
}

const schema = buildSchema(getSchema());

const rootValue = {
    ...userResolver.Query,
    ...userResolver.Mutation,
    ...nftResolver.Query,
    ...nftResolver.Mutation
}

module.exports = {
    schema,
    rootValue
}