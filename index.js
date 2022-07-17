const express = require('express')
const app = express()
const cors = require('cors');
const admin = require("firebase-admin");


const bcrypt = require('bcrypt-nodejs');

require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// firebase ar admin sdk arsathe connection set
const serviceAccount = require('./school-management-firebase-adminsdk.json');
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nb5xe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }
    }
    next();
}


async function run() {
    try {
        await client.connect();
        console.log("DB connected Successfully");
        const database = client.db('school');
        const usersCollection = database.collection('users');
        const studentInfoCollection = database.collection('studentInfo');
        const classSevenStudentCollection = database.collection('classSevenStudent');
const attendanceCollection = database.collection('attendance');
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);

        });

        app.put('/users', async (req, res) => {
            const user = req.body;

            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });

                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        });


        app.get('/users/teacher/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isTeacher = false;
            if (user?.role === 'teacher') {
                isTeacher = true;
            }
            res.json({ teacher: isTeacher });
        });

        app.put('/users/addTeacher', async (req, res) => {
            const user = req.body;
            // console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'teacher' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })


        // app.get('/studentInfo', async (req, res) => {

        //     const studentId = req.query.studentId;
        //     // const query = { studentId: studentId }
        //     const query = { studentId: studentId }
        //     console.log(query);
        //     const cursor = studentInfoCollection.find(query);
        //     const studentInfo = await cursor.toArray();
        //     console.log(studentInfo);
        //     res.json(studentInfo);
        // })


        // app.get('/studentInfo', async (req, res) => {

        //     const email = req.query.email;
        //     const query = { email: email }
        //     console.log(query);
        //     const cursor = studentInfoCollection.find(query);
        //     const studentInfo = await cursor.toArray();
        //     console.log(studentInfo);
        //     res.json(studentInfo);
        // })


        app.get('/studentInfo', async (req, res) => {

            // const email = req.query.email;
            // const query = { email: email }
            // console.log(query);
            const cursor = studentInfoCollection.find({});
            const studentInfo = await cursor.toArray();
            // console.log(studentInfo);
            res.json(studentInfo);
        })
        app.post('/studentInfo', async (req, res) => {
            const studentSubmit = req.body;
            const result = await studentInfoCollection.insertOne(studentSubmit);
            // console.log(result);
            res.json(result)
        });

        app.get('/classSevenStudent', async (req, res) => {

            
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await classSevenStudentCollection.updateOne(filter, updateDoc, options);
            res.json(result);
            // const email = req.query.email;
            // const query = { email: email }
            // console.log(query);
            // const cursor = classSevenStudentCollection.find({});
            // const studentInfo = await cursor.toArray();
            // console.log(studentInfo);
            // res.json(studentInfo);
        })
        // app.get('/classSevenStudent', async (req, res) => {

            
        //     // const email = req.query.email;
        //     // const query = { email: email }
        //     // console.log(query);
        //     const cursor = classSevenStudentCollection.find({});
        //     const studentInfo = await cursor.toArray();
        //     console.log(studentInfo);
        //     res.json(studentInfo);
        // })

app.post('/banglaAttendance', async(req,res) => {

});

        app.post('/classSevenStudent', async (req, res) => {
            let {email}=req.body;
            const student = await classSevenStudentCollection.find({email}).toArray();      
            if(student.length>0){
                res.json({status:0, message:'student already exit'})
                return
            }
            const studentSubmit = req.body;
            const result = await classSevenStudentCollection.insertOne({...studentSubmit, email:studentSubmit.email.toLowerCase()});
            console.log(result);
            res.json(result)
        });


        /*  const courseCollection = database.collection('cource');
         app.post('/appointments', async (req, res) => {
 
         }) */
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Leading Light School & College!');
})

app.listen(port, () => {
    console.log(`Listening at ${port}`)
})


// app.get('/users')
// app.post('/users')
// app.get('/users:id')
// app.put('/users/:id')
// app.delete('delete/:id')

