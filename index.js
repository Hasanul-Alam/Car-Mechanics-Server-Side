const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// username: car-mechanic
// password: JA1BbnaVoaixNXGA

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvq0yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db("carMechanic");
        const databaseCollection = database.collection("services");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = databaseCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const service = await databaseCollection.findOne(query);
            res.json(service)
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await databaseCollection.insertOne(service);
            res.send(result);
            console.log('Alhamdulillah service is added successfully.');
        })

        // Delete API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await databaseCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}

app.get('/', (req, res) => {
    res.send('Genius server is running.');
});

app.listen(port, () => {
    console.log('Server is running on port ', port);
})

run().catch(console.dir);