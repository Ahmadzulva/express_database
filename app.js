const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
const connection = require('./database');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  connection.query('SELECT * FROM siswa', function(err, rows) {
    if (err) {
      console.error('Error executing query:', err);
      res.render('index', {
        data: []
      });
    } else {
      console.log('Query result:', rows);
      res.render('index', {
        data: rows
      });
    }
  });
});

app.get('/insert', (req, res) => {
  res.render('form', {
    nis: '',
    nama: '',
    kelas: '',
    form: 'simpan',
    tombol: 'Simpan',
  });
});

app.post('/simpan', (req, res) => {
  const { nis, nama, kelas } = req.body;
  
  const data = { nis, nama, kelas };

  connection.query('INSERT INTO siswa SET ?', data, function(err) {
    if (err) {
      console.error('Error inserting data:', err);
      res.render('form', {
        nis,
        nama,
        kelas,
        form: 'simpan',
        tombol: 'Simpan',
      });
    } else {
      res.redirect('/');
    }
  });
});

app.get('/edit/:nis', (req, res) => {
  const nis = req.params.nis;
  connection.query('SELECT * FROM siswa WHERE nis = ?', [nis], function(err, data) {
    if (err || data.length === 0) {
      console.error('Error fetching data for edit:', err);
      res.redirect('/');
    } else {
      const student = data[0];
      res.render('form', {
        nis: student.nis,
        nama: student.nama,
        kelas: student.kelas,
        form: '/ubah/' + student.nis,
        tombol: 'Ubah',
      });
    }
  });
});

app.post('/ubah/:nis', (req, res) => {
  const nis = req.params.nis;
  const { nama, kelas } = req.body;
  
  const data = { nama, kelas };

  connection.query('UPDATE siswa SET ? WHERE nis = ?', [data, nis], function(err) {
    if (err) {
      console.error('Error updating data:', err);
      res.render('form', {
        nis,
        nama,
        kelas,
        form: '/ubah/' + nis,
        tombol: 'Ubah',
      });
    } else {
      res.redirect('/');
    }
  });
});

app.get('/delete/:nis', (req, res) => {
  const nis = req.params.nis;
  connection.query('DELETE FROM siswa WHERE nis = ?', [nis], function(err) {
    if (err) {
      console.error('Error deleting data:', err);
    }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
