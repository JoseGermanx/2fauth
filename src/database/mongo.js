
import mongoose from 'mongoose';

const connMongo = async () => {
    await mongoose.connect('mongodb://mongo-user:123456@localhost:27017/',{
    dbName: 'two-factor-auth',
})
.then(()=> console.log('Conectado a mongo'))
.catch((e)=> console.log('Error al conectar a mongo: ', e));
}
export default connMongo;