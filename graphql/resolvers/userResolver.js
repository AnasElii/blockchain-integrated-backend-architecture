const userModel = require('../../models/userModel');

const userResolver = {
    Query: {
        users: async () => {
            try {
                const users = await userModel.find();
                return users;
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createUser: async (args) => {
            try {

                const { address, name, email } = args;
                if (!address || !name || !email) {
                    throw new Error("All fields are required to create a user");
                }

                const newUser = new userModel({
                    address,
                    name,
                    email,
                    nfts: []
                });

                // Save the new user to the database
                const savedUser = await newUser.save()
                    .then(result => {
                        console.log("User Created:", result);
                    });

                return savedUser;
            } catch (error) {
                console.error("Error creating User: ", error);
            }
        },
        updateUser: async (args) => {
            try {
                const { id, address, name, email, nfts } = args;
                
                if (!id) {
                    throw new Error("User ID is required to update a user");
                }

                const updatedUser = await userModel.findByIdAndUpdate(id, {
                    address,
                    name,
                    email,
                    nfts,
                }, { new: true });

                return updatedUser;
            } catch (error) {
                console.error("Error updating User: ", error);
            }
        }
    }
}

module.exports = userResolver;