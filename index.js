const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ybh5qdc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const servicesCollection = client.db('carDoctor').collection('services');
        const orderCollection = client.db('carDoctor').collection('orders');

        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })
        
        //order api
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
    }

    finally{

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res)=>{
    res.send('Car doctor server is running');
})

app.listen(port, () =>{
    console.log(`Car Doctor server is running on port: ${port}`);
})