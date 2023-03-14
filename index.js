
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require("mysql");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'pbsofficeinfo',
});

app.get('/', (req, res) => {
    res.send('Working Office Info SQL');
})
// get users  
app.get('/users', async (req, res) => {
    const sqlSelect =
        "SELECT * FROM users";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

// add User 
app.post('/userAdd', async (req, res) => {

    const displayName = req.body.displayName;
    const trg_id = req.body.trg_id;
    const email = req.body.email;
    const password = req.body.password;
    const designation = req.body.designation;
    const phone = req.body.phone;
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const add_by = req.body.add_by;

    const sqlInsert =
        "INSERT INTO users (displayName,trg_id,email,password,designation,phone,pbs_code,zonal_code,add_by) VALUES (?,?,?,?,?,?,?)";
    db.query(sqlInsert, [displayName, trg_id, email, password, designation, phone, pbs_code, zonal_code, add_by], (err, result) => {
        res.send(result);
    });
});
// get single user 
app.get('/user/:email', async (req, res) => {
    // console.log(req.params.username)
    const email = req.params.email;
    const sqlSelect =
        "SELECT * FROM users WHERE email=(?)";
    db.query(sqlSelect, [email], (err, result) => {
        res.send(result);
    });
})
// get single user  by id
app.get('/userId/:id', async (req, res) => {
    // console.log(req.params.username)
    const id = req.params.id;
    console.log(id);
    const sqlSelect =
        "SELECT * FROM users WHERE id=(?)";
    db.query(sqlSelect, [id], (err, result) => {
        res.send(result);
    });
})

app.put('/user/:id', async (req, res) => {
    // console.log(req.params.username)
    const email = req.body.email;
    const photoURL = req.body.photoURL;
    const designation = req.body.designation;
    const phone = req.body.phone;
    const id = req.params.id;
    const data = [email, photoURL, designation, phone, id];
    console.log(data);
    const sqlInsert =
        `UPDATE users SET email=?,photoURL=?,designation=?,phone=? WHERE id=?`;
    db.query(sqlInsert, data, (err, result) => {
        res.send({ result });
        console.log(result.affectedRows + " record(s) updated");
        // res.send({ err });
    });
})
// Employee Postiong 
app.put('/userPosting/:id', async (req, res) => {
    // console.log(req.params.username)
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const displayName = req.body.displayName;
    const designation = req.body.designation;
    const email = req.body.email;
    const phone = req.body.phone;
    const photoURL = req.body.photoURL;
    const trg_id = req.body.trg_id;
    const posted_by = req.body.posted_by;

    const id = req.params.id;
    const data = [pbs_code, zonal_code, displayName, designation, email, phone, photoURL, trg_id, posted_by, id];
    console.log(data);

    const sqlInsert =
        `UPDATE users SET pbs_code=?,zonal_code=?,displayName=?,designation=?,email=?,phone=?,photoURL=?,trg_id=?,posted_by=? WHERE id=?`;
    db.query(sqlInsert, data, (err, result) => {
        res.send({ result });
        console.log(result.affectedRows + " record(s) updated");
        // res.send({ err });
    });
})
// // get single user 
// app.get('/user/:trg_id', async (req, res) => {
//     // console.log(req.params.username)
//     const trg_id = req.params.trg_id;
//     const sqlSelect =
//         "SELECT * FROM users WHERE trg_id=(?)";
//     db.query(sqlSelect, [trg_id], (err, result) => {
//         res.send(result);
//     });
// })
// get Zonal  
app.get('/zonals', async (req, res) => {
    const sqlSelect =
        "SELECT * FROM tbl_zonal where pbs_code=29";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});
// get CC  
app.get('/ccs', async (req, res) => {
    const sqlSelect =
        "SELECT * FROM tbl_cc where zonal_code=2902";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});
// add book 
app.post('/dnpBookAdd', async (req, res) => {
    // const newBook = req.body;
    // const result = await bookCollection.insertOne(newBook);
    // res.send(result);
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const cc_code = req.body.cc_code;
    const bookNo = req.body.bookNo;
    const numberOfConsumer = req.body.numberOfConsumer;
    const numberOfDcConsumer = req.body.numberOfDcConsumer;
    const assign_to = req.body.assign_to;
    const kw = req.body.kw;
    const add_by = req.body.enteredBy;

    const sqlInsert =
        "INSERT INTO book_information (pbs_code,zonal_code,cc_code,bookNo,numberOfConsumer,numberOfDcConsumer,assign_to,kw,add_by) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(sqlInsert, [pbs_code, zonal_code, cc_code, bookNo, numberOfConsumer, numberOfDcConsumer, assign_to, kw, add_by], (err, result) => {
        res.send(result);
    });

});
// get Books  
app.get('/books', async (req, res) => {
    const sqlSelect =
        "(SELECT book_information.id,book_information.bookNo,book_information.numberOfConsumer,book_information.numberOfDcConsumer,book_information.pbs_code,book_information.zonal_code,book_information.cc_code,users.displayName,users.designation FROM book_information INNER JOIN tbl_pbs ON book_information.pbs_code = tbl_pbs.pbs_code INNER JOIN tbl_zonal ON book_information.zonal_code = tbl_zonal.zonal_code INNER JOIN tbl_cc ON book_information.cc_code = tbl_cc.cc_code INNER JOIN users ON book_information.assign_to = users.trg_id ORDER BY book_information.assign_to DESC)";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});
// get single Book 
app.get('/bookbyId/:id', async (req, res) => {
    // console.log(req.params.username)
    const id = req.params.id;
    const sqlSelect =

        "SELECT * FROM book_information  INNER JOIN users ON book_information.assign_to = users.trg_id WHERE book_information.id=?";
    db.query(sqlSelect, [id], (err, result) => {
        res.send(result);
    });
})
// Update Book 

app.put('/book/:id', async (req, res) => {
    const pbs_code = req.body.pbs_code;
    const zonal_code = req.body.zonal_code;
    const cc_code = req.body.cc_code;

    const numberOfConsumer = req.body.numberOfConsumer;
    const numberOfDcConsumer = req.body.numberOfDcConsumer;
    const kw = req.body.kw;
    const assign_to = req.body.assign_to;
    const update_by = req.body.update_by;
    const id = req.body.id;
    const data = [pbs_code, zonal_code, cc_code, numberOfConsumer, numberOfDcConsumer, kw, assign_to, update_by, id];
    console.log(data);
    const sqlInsert =
        `UPDATE book_information SET pbs_code=?,zonal_code=?,cc_code=?,numberOfConsumer=?,numberOfDcConsumer=?,kw=?,assign_to=?,update_by=? WHERE id=?`;
    db.query(sqlInsert, data, (err, result) => {
        res.send({ result });
        console.log(result.affectedRows + " record(s) updated");
        // res.send({ err });
    });
    // const newBook = req.body;
    // const filter = { _id: ObjectId(id) };
    // const options = { upsert: true };
    // const updatedDoc = {
    //     $set:
    //         newBook
    // }
    // const product = await bookCollection.updateOne(filter, updatedDoc, options);
    // res.send(product);
})
app.listen(port, () => {
    console.log(`Office Info app listening on port ${port}`)
})