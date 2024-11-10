import connMongo from "./src/database/mongo.js";
import app from "./src/server.js";


(() => {
    main();
})();



async function main() {

    await connMongo();

    app.listen(3000, () => {
        console.log('Server on port 3000');
    });




}
