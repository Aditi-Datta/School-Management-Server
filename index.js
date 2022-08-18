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
        // const studentInfoCollection = database.collection('studentInfo');

        const classSixStudentCollection = database.collection('classSixStudent');
        const sixBanglaAttendanceCollection = database.collection('sixBangla');
        const sixEnglishAttendanceCollection = database.collection('sixEnglish');
        const sixMathAttendanceCollection = database.collection('sixMath');
        const sixScienceAttendanceCollection = database.collection('sixScience');
        const sixSociologyAttendanceCollection = database.collection('sixSociology');
        const sixICTAttendanceCollection = database.collection('sixICT');

        const classSevenStudentCollection = database.collection('classSevenStudent');
        const sevenBanglaAttendanceCollection = database.collection('sevenBangla');
        const sevenEnglishAttendanceCollection = database.collection('sevenEnglish');
        const sevenMathAttendanceCollection = database.collection('sevenMath');
        const sevenScienceAttendanceCollection = database.collection('sevenScience');
        const sevenSociologyAttendanceCollection = database.collection('sevenSociology');
        const sevenICTAttendanceCollection = database.collection('sevenICT');

        const classEightStudentCollection = database.collection('classEightStudent');
        const eightBanglaAttendanceCollection = database.collection('eightBangla');
        const eightEnglishAttendanceCollection = database.collection('eightEnglish');
        const eightMathAttendanceCollection = database.collection('eightMath');
        const eightScienceAttendanceCollection = database.collection('eightScience');
        const eightSociologyAttendanceCollection = database.collection('eightSociology');
        const eightICTAttendanceCollection = database.collection('eightICT');

        const classNineStudentCollection = database.collection('classNineStudent');
        const nineBanglaAttendanceCollection = database.collection('nineBangla');
        const nineEnglishAttendanceCollection = database.collection('nineEnglish');
        const nineMathAttendanceCollection = database.collection('nineMath');
        const nineScienceAttendanceCollection = database.collection('nineScience');
        const nineSociologyAttendanceCollection = database.collection('nineSociology');
        const nineICTAttendanceCollection = database.collection('nineICT');

        const classTenStudentCollection = database.collection('classTenStudent');
        const tenBanglaAttendanceCollection = database.collection('tenBangla');
        const tenEnglishAttendanceCollection = database.collection('tenEnglish');
        const tenMathAttendanceCollection = database.collection('tenMath');
        const tenScienceAttendanceCollection = database.collection('tenScience');
        const tenSociologyAttendanceCollection = database.collection('tenSociology');
        const tenICTAttendanceCollection = database.collection('tenICT');


        const contactUsCollection = database.collection('review');
        const resultSubmitCollection = database.collection('result');

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

        app.get('/users', async(req,res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
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
        app.put('/users/admin/:email',verifyToken, async (req, res) => {     
             const email = req.params.email;
             const filter = { email: email };

             console.log(filter);   
             const updateDoc = { $set: { role: 'admin' } };
             const result = await usersCollection.updateOne(filter, updateDoc);
             res.json(result);         
        });
        // app.put('/users/admin', verifyToken, async (req, res) => {
        //     const user = req.body;
        //     const requester = req.decodedEmail;
        //     if (requester) {
        //         const requesterAccount = await usersCollection.findOne({ email: requester });

        //         if (requesterAccount.role === 'admin') {
        //             const filter = { email: user.email };
        //             const updateDoc = { $set: { role: 'admin' } };
        //             const result = await usersCollection.updateOne(filter, updateDoc);
        //             res.json(result);
        //         }
        //     }
        //     else {
        //         res.status(403).json({ message: 'you do not have access to make admin' })
        //     }

        // });


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
        // app.get('/banglaAttendance', async(req,res) => {
        //     const total = req.params;
        //     const query = {total};
        //     const store = await attendanceCollection.findOne(query);
        //     res.json(store) 
        // });
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
        // app.get('/studentInfo', async (req, res) => {

        //     // const email = req.query.email;
        //     // const query = { email: email }
        //     // console.log(query);
        //     const cursor = studentInfoCollection.find({});
        //     const studentInfo = await cursor.toArray();
        //     // console.log(studentInfo);
        //     res.json(studentInfo);
        // })
        // app.post('/studentInfo', async (req, res) => {
        //     const studentSubmit = req.body;
        //     const result = await studentInfoCollection.insertOne(studentSubmit);
        //     // console.log(result);
        //     res.json(result)
        // });

        app.post('/classSixStudent', async (req, res) => {
            let {email}=req.body;
            const student = await classSixStudentCollection.find({email}).toArray();      
            if(student.length>0){
                res.json({status:0, message:'student already exit'})
                return
            }
            const studentSubmit = req.body;
            const result = await classSixStudentCollection.insertOne({...studentSubmit, email:studentSubmit.email.toLowerCase()});
            console.log(result);
            res.json(result)
        });

        app.get('/classSixStudent', async (req, res) => {       
            const cursor = await classSixStudentCollection.find({}).toArray();
            res.json(cursor);
        })
        app.post('/banglaSixAttendance', async(req,res) => {
            const data = req.body;
            const store = await sixBanglaAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/englishSixAttendance', async(req,res) => {
            const data = req.body;
            const store = await sixEnglishAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/mathSixAttendance', async(req,res) => {
            const data = req.body;
            const store = await sixMathAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/scienceSixAttendance', async(req,res) => {
            const data = req.body;
            const store = await sixScienceAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/sociologySixAttendance', async(req,res) => {
            const data = req.body;
            const store = await sixSociologyAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/ictSixAttendance', async(req,res) => {
            const data = req.body;
            const store = await sixICTAttendanceCollection.insertMany(data);
            res.json(store);
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

        app.get('/classSevenStudent', async (req, res) => {       
            const cursor = await classSevenStudentCollection.find({}).toArray();
            res.json(cursor);
        })
        app.post('/banglaSevenAttendance', async(req,res) => {
            const data = req.body;
            const store = await sevenBanglaAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/englishSevenAttendance', async(req,res) => {
            const data = req.body;
            const store = await sevenEnglishAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/mathSevenAttendance', async(req,res) => {
            const data = req.body;
            const store = await sevenMathAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/scienceSevenAttendance', async(req,res) => {
            const data = req.body;
            const store = await sevenScienceAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/sociologySevenAttendance', async(req,res) => {
            const data = req.body;
            const store = await sevenSociologyAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/ictSevenAttendance', async(req,res) => {
            const data = req.body;
            const store = await sevenICTAttendanceCollection.insertMany(data);
            res.json(store);
        });



        app.post('/classEightStudent', async (req, res) => {
            let {email}=req.body;
            const student = await classEightStudentCollection.find({email}).toArray();      
            if(student.length>0){
                res.json({status:0, message:'student already exit'})
                return
            }
            const studentSubmit = req.body;
            const result = await classEightStudentCollection.insertOne({...studentSubmit, email:studentSubmit.email.toLowerCase()});
            console.log(result);
            res.json(result)
        });
        app.get('/classEightStudent', async (req, res) => {       
            const cursor = await classEightStudentCollection.find({}).toArray();
            res.json(cursor);
        })
        app.post('/banglaEightAttendance', async(req,res) => {
            const data = req.body;
            const store = await eightBanglaAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/englishEightAttendance', async(req,res) => {
            const data = req.body;
            const store = await eightEnglishAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/mathEightAttendance', async(req,res) => {
            const data = req.body;
            const store = await eightMathAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/scienceEightAttendance', async(req,res) => {
            const data = req.body;
            const store = await eightScienceAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/sociologyEightAttendance', async(req,res) => {
            const data = req.body;
            const store = await eightSociologyAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/ictEightAttendance', async(req,res) => {
            const data = req.body;
            const store = await eightICTAttendanceCollection.insertMany(data);
            res.json(store);
        });





        app.post('/classNineStudent', async (req, res) => {
            let {email}=req.body;
            const student = await classNineStudentCollection.find({email}).toArray();      
            if(student.length>0){
                res.json({status:0, message:'student already exit'})
                return
            }
            const studentSubmit = req.body;
            const result = await classNineStudentCollection.insertOne({...studentSubmit, email:studentSubmit.email.toLowerCase()});
            console.log(result);
            res.json(result)
        });
        app.get('/classNineStudent', async (req, res) => {       
            const cursor = await classNineStudentCollection.find({}).toArray();
            res.json(cursor);
        })
        app.post('/banglaNineAttendance', async(req,res) => {
            const data = req.body;
            const store = await nineBanglaAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/englishNineAttendance', async(req,res) => {
            const data = req.body;
            const store = await nineEnglishAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/mathNineAttendance', async(req,res) => {
            const data = req.body;
            const store = await nineMathAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/scienceNineAttendance', async(req,res) => {
            const data = req.body;
            const store = await nineScienceAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/sociologyNineAttendance', async(req,res) => {
            const data = req.body;
            const store = await nineSociologyAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/ictNineAttendance', async(req,res) => {
            const data = req.body;
            const store = await nineICTAttendanceCollection.insertMany(data);
            res.json(store);
        });





        app.post('/classTenStudent', async (req, res) => {
            let {email}=req.body;
            const student = await classTenStudentCollection.find({email}).toArray();      
            if(student.length>0){
                res.json({status:0, message:'student already exit'})
                return
            }
            const studentSubmit = req.body;
            const result = await classTenStudentCollection.insertOne({...studentSubmit, email:studentSubmit.email.toLowerCase()});
            console.log(result);
            res.json(result)
        });
        app.get('/classTenStudent', async (req, res) => {       
            const cursor = await classTenStudentCollection.find({}).toArray();
            res.json(cursor);
        })
        app.post('/banglaTenAttendance', async(req,res) => {
            const data = req.body;
            const store = await tenBanglaAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/englishTenAttendance', async(req,res) => {
            const data = req.body;
            const store = await tenEnglishAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/mathTenAttendance', async(req,res) => {
            const data = req.body;
            const store = await tenMathAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/scienceTenAttendance', async(req,res) => {
            const data = req.body;
            const store = await tenScienceAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/sociologyTenAttendance', async(req,res) => {
            const data = req.body;
            const store = await tenSociologyAttendanceCollection.insertMany(data);
            res.json(store);
        });
        app.post('/ictTenAttendance', async(req,res) => {
            const data = req.body;
            const store = await tenICTAttendanceCollection.insertMany(data);
            res.json(store);
        });



        app.post('/contactUs', async(req,res) => {
            const data = req.body;
            const store = await contactUsCollection.insertOne(data);
            res.json(store);
        });
        app.post('/result', async(req,res) => {
            const data = req.body;
            const store = await resultSubmitCollection.insertOne(data);
            res.json(store);
        });

        app.get('/result/:studentId', async(req,res) => {
            const studentId = req.params.studentId;
            const query = { studentId: studentId };
            console.log(query); 
            const store = await resultSubmitCollection.findOne(query);
            res.json(store) 
        }); 
        // app.get('/result', async(req,res) => {
        //     // const studentId = req.query.studentId;
        //     const store = await resultSubmitCollection.find({}).toArray();
        //     res.json(store) 
        // });

    //     app.put('/users/admin/:email',verifyToken, async (req, res) => {     
    //         const email = req.params.email;
    //         const filter = { email: email };

    //         console.log(filter);   
    //         const updateDoc = { $set: { role: 'admin' } };
    //         const result = await usersCollection.updateOne(filter, updateDoc);
    //         res.json(result);         
    //    });

        
        // app.get('/banglaAttendance', async(req,res) => {
        //     const store = await attendanceCollection.find({});
        //     res.json(store) 
        // });
        
       
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

