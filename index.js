const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
  res.send('Hello World!')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.0pthw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)
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
    // await client.connect();

    const database = client.db("insertVisa");
    const visaDb = database.collection("Visa");
    const applyVisaDb=database.collection("applyVisaDb")



    app.get("/addApplyVisa",async(req,res)=>{

        let {email}= req.query
        let query ={email}
        const cursor = applyVisaDb.find(query);
        let result= await cursor.toArray()
        res.send(result)


    })
    app.get("/addAddedVisa",async(req,res)=>{

        let {email}= req.query
        let query ={email}
        const cursor = visaDb.find(query);
        let result= await cursor.toArray()
        res.send(result)


    })

    app.delete("/cancelApplication/:id",async(req,res)=>{

        let idx= req.params.id
        const query = { _id: new ObjectId(idx) };
        const result = await applyVisaDb.deleteOne(query);
        res.send(result)
    })
    app.delete("/delete-visa/:id", async (req, res) => {
        let idx = req.params.id;
        const query = { _id: new ObjectId(idx) };
        const result = await visaDb.deleteOne(query);
        res.send(result);
    });

    // Route to Get Latest Visas with Limit
app.get("/latest-visas", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6; // Default limit is 6 if not provided
    const latestVisas = await visaDb
      .find({})
      .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
      .limit(limit)
      .toArray();
    res.status(200).json(latestVisas);
  } catch (error) {
    console.error("Error fetching latest visas:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
    





    app.put("/update-visa/:id", async (req, res) => {
        const { id } = req.params;
        const updatedData = req.body;
        delete updatedData._id; // Ensure _id is not included in the update
  
        const query = { _id: new ObjectId(id) };
        const update = { $set: updatedData };
        const result = await visaDb.updateOne(query, update);
        res.send(result);
      });
      


    


    app.post("/addApplyVisa",async(req,res)=>{

        let applyVisa= req.body

        //console.log(visa)

        const result = await applyVisaDb.insertOne(applyVisa);
        res.send(result)


    })

    app.get("/visa/:id",async(req,res)=>{

        let idx= req.params.id
        const query = { _id: new ObjectId(idx) };
        const result = await visaDb.findOne(query);
        res.send(result)


    })


    app.get("/addvisa",async(req,res)=>{
        const cursor = visaDb.find();
        let result= await cursor.toArray()
        res.send(result)

    })
    

    app.post("/addvisa",async(req,res)=>{

        let visa= req.body
        console.log(visa)

        const result = await visaDb.insertOne(visa);
        res.send(result)



    })




    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})