
 import mongoose from 'mongoose';

    const userSchema = new mongoose.Schema({
        id: {
            type: String,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        secret: {
            type: String,
        },
        key: {
            type: Object,
        },
    });

    const User = mongoose.model('User', userSchema);

    export default User;