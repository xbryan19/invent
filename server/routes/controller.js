const express = require('express')
const bodyParser = require('body-parser')
// const nano = require('nano')('http://root:admin@hrdapps48:5984')
// const masterlist = nano.db.use('hrd_masteruser')
const cors = require('cors')
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');

const upload = require('../utils/uploadFiles')
const excelToJson = require('convert-excel-to-json')
const csv = require('csvtojson')

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'hrdapps59',
    user: 'global',
    password: 'global',
    database: 'scadproductionwarehouse'
  }
});

var knex1 = require('knex')({
  client: 'mssql',
  connection: {
    host: 'a-sv17',
    user: 'sa',
    password: '',
    database: 'Barchart',
    options: {
      "enableArithAbort": true
    }
  },
});


// const knex1 = new sql.Connection("Barchart", "sa", "", {  
//   "host": "a-sv17",
//   "dialect": "mssql",
//   "dialectOptions": {
//     "requestTimeout": 300000
//   },
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });

var knex2 = require('knex')({
  client: 'mssql',
  connection: {
    host: 'a-sv17',
    user: 'sa',
    password: '',
    database: 'CompanyInformation'
  }
})

var knex3 = require('knex')({
  client: 'mssql',
  connection: {
    host: 'a-sv17',
    user: 'sa',
    password: '',
    database: 'InteriorProductionControl',
    options: {
      "enableArithAbort": true
    }
  }
})

router.use(cors()) //Cross-Origin Resource Sharing (CORS)
router.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
// router.use(bodyParser.urlencoded({limit: '1000mb', extended: true }))
// router.use(bodyParser.json())
router.use(bodyParser.json({ limit: '100000mb', extended: true }));

router.get('/', (req, res) => {
  res.send('production warehouse control - port5000')
});

router.get('/getImport', (req, res) => {
  knex3.select('*').from('BomPartsHinban').then(body => {
    res.send(body)
  })
})

router.get('/fetchAccounts', (req, res) => {
  knex.select('systemusers.*', 'userlevels.UserLevelName').from('systemusers')
    .join('userlevels', 'userlevels.UserLevel', '=', 'systemusers.UserLevel')
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.post('/updateUserLevel', (req, res) => {
  // console.log(req.body.passUser)
  let arr = []
  let level = req.body.passUser.level
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('systemusers')
    .where('EmployeeID', '=', req.body.passUser.idNumber)
    .update({
      UserLevel: level,
      UpdatedDate: date,
      UpdatedBy: ''
    })
    .then(data => {
      //console.log(data)
      arr.push(data)
      res.send(arr)
    }).catch((e) => {
      console.log(e)
    })
})

router.post('/deleteAccount', (req, res) => {
  let arr = []
  let gg = req.body.deleteID
  //console.log(req.body.deleteID)
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('systemusers')
    .where('EmployeeID', '=', gg)
    .update({
      UpdatedDate: date,
      DeletedDate: date,
      UpdatedBy: ''
    })
    .then(body => {
      // console.log(body)
      arr.push(body)
      res.send(arr)
    })
})

router.post('/activateAccount', (req, res) => {
  // console.log(req.body.deleteID)
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('systemusers')
    .where('EmployeeID', '=', req.body.activateID)
    .update({
      UpdatedDate: date,
      DeletedDate: null,
      UpdatedBy: ''
    })
    .then(body => {
      // console.log(body)
      arr.push(body)
      res.send(arr)
    })
})

router.get('/fetchUserLevel', (req, res) => {
  knex.select('*').from('userlevels')
    .then(data => {
      res.send(data)
    })
})

router.post('/searchID', (req, res) => {
  // console.log(req.body)
  knex2.select('*').from('Employees')
    .where('EmployeeCode', '=', req.body.idNumber)
    .whereNull('RetiredDate')
    .then(data => {
      res.send(data)
    })
})

router.post('/trapRegistration', (req, res) => {
  let data = ''
  data = req.body.id
  knex.select('*').from('systemusers')
    .where('EmployeeID', '=', data)
    .then(data => {
      res.send(data)
    })
})

router.post('/userRegistration', (req, res) => {
  // console.log(req.body, 'employee')
  knex('systemusers')
    .insert({
      EmployeeID: req.body.employee[0].EmployeeCode,
      EmployeeName: req.body.employee[0].EmployeeName,
      Gender: req.body.employee[0].Gender,
      UserLevel: req.body.insertUser,
      UpdatedBy: ''
    })
    .then(body => {
      //console.log(body)
      res.send(body)
    })
})

router.post('/login', (req, res) => {
  knex.select('*')
    .from('systemusers')
    .join('userlevels', 'userlevels.UserLevel', '=', 'systemusers.UserLevel')
    .whereNull('systemusers.DeletedDate')
    .andWhere('systemusers.EmployeeID', '=', req.body.user)
    .andWhere('systemusers.EmployeeID', '=', req.body.pass)
    .then(data => {
      console.log(data)
      userInfo = [{
        employeeCode: data[0].EmployeeID,
        fullName: data[0].EmployeeName,
        userLevel: data[0].UserLevel,
        UserLevelName: data[0].UserLevelName,
        gender: data[0].Gender
      }]
      res.send(userInfo)
    }).catch(err => {
      console.log(err)
      res.send("")
    })
})

// filtering list of plans
router.post('/requestData', (req, res) => {
  // knex1.select('*').from('Cabinet_Data')
  knex1.select('*').from('Cabinet_Data_Hinban')
    .where('DSTN', '=', req.body.dstn_data)
    .andWhere('Bs_WW', '=', req.body.week_data)
    .andWhere('Bs_YY', '=', req.body.year_data)
    .andWhere('BarchartNo', '=', req.body.req_data)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

// All data in table
router.get('/checkstock', (req, res) => {
  knex1.select('Bs_YY', 'Bs_WW', 'BarchartNo', 'CODE_NO', 'HOUSECD', 'DSTN').distinct()
    .from('Cabinet_Data_Hinban')
    // knex1.select('CODE_NO','HOUSECD').distinct().from('Cabinet_Data_Hinban')
    // .where('DSTN','=','HAMAMATSU')
    // .andWhere('Bs_WW','=',4)
    // .andWhere('Bs_YY','=',20)
    // .andWhere('BarchartNo','=',1)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

// for combobox value REQ KIND
router.get('/reqKind', (req, res) => {
  knex1.select('BarchartName', 'BarchartNo').from('M_BS_Names')
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

// for combobox value DSTN
router.get('/dstn', (req, res) => {
  knex1.select('DSTN').distinct().from('Cabinet_Data_Hinban')
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

let async = require('async');
const { Route } = require('express');
const { forEach } = require('lodash');

router.get('/expand', (req, res) => {

  Promise.resolve()
    .then(() => {
      return new Promise(resolve => {
        knex1.select('*').from('Cabinet_Data_Hinban')
          .where('HINBAN', 'LIKE', 'S%')
          .andWhere('BarchartNo', '=', 2)
          .then(data => {
            let a = _.chain(data).groupBy('CODE_NO').map((v, k) => ({
              picker: v[0].PickerID,
              isFinished: v[0].isFinished,
              codeNo: k,
              HOUSECD: v[0].HOUSECD,
              HINBAN: v.map(r => {
                return {
                  hinbanData: r.HINBAN + '-' + r.CLR,
                  qtyData: r.QTY,
                  seq: r.Seq,
                  year: r.Bs_YY,
                  week: r.Bs_WW,
                  barchartNo: r.BarchartNo
                }
              })
            })).value()
            resolve(a)
          })
      })
    }).then(hinban => {
      return new Promise(resolve => {
        async.each(hinban, (val, cb) => {
          async.each(val.HINBAN, (val2, cb2) => {
            knex.select('*').from('hinban_parts')
              .join('trial_exporthinbanparts', 'trial_exporthinbanparts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
              .join('trial_exporthinban', 'trial_exporthinban.ExportHinbanCode', '=', 'trial_exporthinbanparts.ExportHinbanCode')
              .whereNull('trial_exporthinbanparts.DeletedDate')
              .andWhere('trial_exporthinban.ExportHinbanName', '=', val2.hinbanData)
              .then(data => {
                if (data.length > 0) {
                  let b = data.map(rec => { return rec })
                  // console.log(b)
                  val2.childData = b
                } else {
                  val2.childData = []
                }
              })
            cb2()
          })
          cb()
        })
        setTimeout(() => {
          resolve(hinban)
        }, 5000);
      })
    }).then(newData => {
      let b = newData.map(rec => { return rec })
      // console.log(b)
      res.send(b)
    }).catch((e) => {
      console.log(e)
    })
})

router.get('/noPartHinban', (req, res) => {
  let sample
  Promise.resolve()
    .then(() => {
      return new Promise(resolve => {
        knex1.select('HINBAN', 'CLR')
          .from('Cabinet_Data_Hinban')
          .where('HINBAN', 'LIKE', 'S%')
          .andWhere('BarchartNo', '=', 2)
          .groupBy('HINBAN', 'CLR')
          .then(data => {
            let a = _.chain(data).map(rec => ({
              HINBAN: rec.HINBAN + '-' + rec.CLR

            })).value()
            resolve(a)
          })
      })
    }).then(hinban => {
      return new Promise(resolve => {
        async.each(hinban, (val, cb) => {
          // async.each(val.HINBAN,(val2,cb2)=>{
          // knex.select('*').from('export_hinban')
          // .where('ExportHinbanName', '=', val.HINBAN)
          // .then(body => {
          //   let c = body.map(rec => {
          //     return rec.ExportHinbanCode
          //   })
          //   val.ExportHinbanCode = c
          knex.select('*').from('hinban_parts')
            .join('export_hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
            .join('export_hinban', 'export_hinban.ExportHinbanCode', '=', 'export_hinban_parts.ExportHinbanCode')
            .whereNull('export_hinban_parts.DeletedDate')
            .andWhere('export_hinban.ExportHinbanName', '=', val.HINBAN)
            .then(data => {
              // console.log(data[0])
              if (data.length > 0) {
                let b = data.map(rec => { return rec })
                // console.log(b)
                val.childData = b
              } else {
                val.childData = []
              }
            })
          // })
          //   cb2()
          // })
          cb()
        })
        // Promise.resolve(hinban)
        setTimeout(() => {
          resolve(hinban)
        }, 2000);

      })
    }).then(newData => {
      let b = newData.map(rec => { return rec })
      // console.log(b)
      res.send(b)
    }).catch((e) => {
      console.log(e)
    })
})

router.get('/examp', (req, res) => {
  getData()
  async function getData() {
    const rows = await knex1('Cabinet_Data_Hinban').distinct('HINBAN', 'CLR')
    rows.map()
  }

})

router.get('/ggg', (req, res) => {
  let barchartArray = []
  let ExistingArray = []
  let notRegister = []

  let barchartPromise = []
  barchartPromise.push(getBarchart())
  Promise.all(barchartPromise).then(barchartData => {
    barchartArray = barchartData[0]
    let existingPromise = []
    existingPromise.push(getExisting())
    Promise.all(existingPromise).then(existingData => {
      ExistingArray = existingData[0]
      let notRegisterPromise = []
      notRegisterPromise.push(compareData())
      Promise.all(notRegisterPromise).then(notRegisterData => {
        // let data2 = notRegisterData
        // console.log(notRegisterData[0].length, 'length')
        let data2 = notRegisterData[0].map(rec => {
          // var str = rec.hinban.split('').reverse().join('')
          var str = rec.toString().split('').reverse().join('')
          var clr = str.split('-')
          var name = ""
          for (let a = 0; a <= rec.toString().split("-").length - 2; a++) {
            // name = name + rec.hinban.split("-")[a] + "-"
            name = name + rec.toString().split("-")[a] + "-"
          }
          name = name.substr(0, name.length - 1)
          return {
            // hinban: rec.hinban,
            hinban: rec,
            name: name,
            color: clr[0].split('').reverse().join('')
          }
        })
        res.send(data2)
      })
    })
  })

  function compareData() {
    // console.log(ExistingArray[0].ExportHinban, 'notRegister')
    return new Promise(resolve => {
      for (var x = 0; x < barchartArray.length; x++) {
        var mod = 0
        for (var y = 0; y < ExistingArray.length; y++) {
          if (barchartArray[x].hinban == ExistingArray[y].ExportHinban) {
            mod += 1
          }
        }
        if (mod == 0) {
          notRegister.push(barchartArray[x].hinban)
        }
      }
      resolve(notRegister)
    })
  }

  function getBarchart() {
    return new Promise(resolve => {
      knex1.raw("select DISTINCT (HINBAN +'-'+ CLR) as hinban from Cabinet_Data_Hinban " +
        "where hinban like 'S%' " +
        "and BarchartNo = 2")
        .then(f => {
          resolve(f)
        })
        .catch(e => {
          console.log(e, 'getBarchart_Error')
        })
    })
  }

  function getExisting() {
    return new Promise(resolve => {
      knex.select('ExportHinban', 'DeletedDate').from('export_hinban')
        .then(data => {
          resolve(data)
        })
        .catch(e => {
          console.log(e, 'getExisting_Error')
        })
    })
  }

})

router.get('/test', (req, res) => {
  let data = []
  let promises = []
  promises.push(checkValue(data))
  Promise.all(promises).then(arr => {
    let promises2 = []
    let data2 = []

    let a = arr[0].map(rec => {
      return "'" + rec.ExportHinban + "'"
    })
    // console.log(a)

    promises2.push(checkValue1(a, data2))
    Promise.all(promises2).then(arr => {
      res.send(arr)
    })

  })

  function checkValue(myData) {
    return new Promise(resolve => {
      knex.select('ExportHinban').from('export_hinban')
        .then(res => {
          myData = res
          resolve(myData)
        })
    })
  }

  function checkValue1(arr, data2) {
    // console.log(arr, 'arrrrrrr')
    return new Promise(resolve => {
      var stmt = "select DISTINCT (HINBAN +'-'+ CLR) as hinban from Cabinet_Data_Hinban " +
        "where HINBAN +'-'+ CLR not in (" + arr.toString() + ") " +
        "and hinban like 'S%' " +
        "and BarchartNo = 2"
      knex1.raw(stmt).then(res => {
        data2 = res.map(rec => {
          var str = rec.hinban.split('').reverse().join('')
          var clr = str.split('-')
          var name = ""
          for (let a = 0; a <= rec.hinban.split("-").length - 2; a++) {
            name = name + rec.hinban.split("-")[a] + "-"
          }
          name = name.substr(0, name.length - 1)
          return {
            hinban: rec.hinban,
            name: name,
            color: clr[0].split('').reverse().join('')
          }
        })
        // data2 = res
        resolve(data2)
      })
    })
  }
})

router.get('/experimentHinban', (req, res) => {
  knex.select('ExportHinban').from('export_hinban')
    .then(data => {
      console.log(data.length, 'data')
      if (data.length > 0) {
        console.log('pumasok')
        gg()
        async function gg() {
          let a
          a = await data.map(rec => {
            return "'" + rec.ExportHinban + "'"
          })
          console.log(a, 'a')
          fetch()
          function fetch() {
            var stmt = "select DISTINCT (HINBAN +'-'+ CLR) as hinban from Cabinet_Data_Hinban " +
              "where HINBAN +'-'+ CLR not in (" + a.toString() + ") " +
              "and hinban like 'S%' " +
              "and BarchartNo = 2"
            // console.log(stmt)
            knex1.raw(stmt)
              .then(data => {
                console.log(data, '.then')
                // let b = data.map(rec => {
                //   var str = rec.hinban.split('').reverse().join('')
                //   var clr = str.split('-')
                //   var name = ""
                //   for(let a=0; a<=rec.hinban.split("-").length-2; a++){
                //     name = name + rec.hinban.split("-")[a] + "-"
                //     // console.log(name)
                //   }
                //   name = name.substr(0, name.length-1)
                //   return {
                //     hinban: rec.hinban,
                //     name: name,
                //     color: clr[0].split('').reverse().join('')
                //   } 
                // })
                // res.status(200).send(b)
                setTimeout(() => {
                  res.status(200).send(data)
                }, 12000)

              })
              .catch(error => {
                console.log(error, '2')
                res.sendStatus(404)
              })
          }
        }
      } else {
        res.send(data)
        console.log('else')
      }
      // .then(result=>{res.send(result)})
    })
    .catch(error => {
      console.log(error, '1')
      res.sendStatus(404)
    })
})

router.get('/unregisterHinban', (req, res) => {
  knex.select('ExportHinban').from('export_hinban')
    .then(data => {
      // console.log(data.length, 'data')
      if (data.length > 0) {
        console.log('pumasok')
        let a = data.map(rec => {
          return "'" + rec.ExportHinban + "'"
        })
        console.log(a, 'aaaa')
        var s = a.toString()
        var stmt = "select DISTINCT (HINBAN +'-'+ CLR) as hinban from Cabinet_Data_Hinban " +
          "where HINBAN +'-'+ CLR not in (" + a.toString() + ") " +
          "and hinban like 'S%' " +
          "and BarchartNo = 2"
        // console.log(stmt)
        knex1.raw(stmt)
          .then(data => {
            console.log(data, '.then')
            // let b = data.map(rec => {
            //   var str = rec.hinban.split('').reverse().join('')
            //   var clr = str.split('-')
            //   var name = ""
            //   for(let a=0; a<=rec.hinban.split("-").length-2; a++){
            //     name = name + rec.hinban.split("-")[a] + "-"
            //     // console.log(name)
            //   }
            //   name = name.substr(0, name.length-1)
            //   return {
            //     hinban: rec.hinban,
            //     name: name,
            //     color: clr[0].split('').reverse().join('')
            //   } 
            // })
            // res.status(200).send(b)
            res.status(200).send(data)
          })
          .catch(error => {
            console.log(error, '2')
            res.sendStatus(404)
          })
      } else {
        res.send(data)
        console.log('else')
      }
      // .then(result=>{res.send(result)})
    })
    .catch(error => {
      console.log(error, '1')
      res.sendStatus(404)
    })
})

router.post('/registerAllHinban', (req, res) => {
  var data = req.body.hinban.map(rec => {
    return {
      ExportHinban: rec.hinban,
      ExportHinbanName: rec.name,
      ExportHinbanColor: rec.color,
      GroupID: null
    }
  })
  let promises = []

  promises.push(selectMax())
  Promise.all(promises)
    .then(result => {
      // console.log(result, 'res 1')
      let promises2 = []
      promises2.push(arrangID(result))
      Promise.all(promises2)
        .then(res => {
          console.log('res 2')
          let promises3 = []
          promises3.push(insert())
          Promise.all(promises3)
            .then(body => {
              // res.send(body)
              // console.log(body, 'finale')
            })
        })
    })

  function insert() {
    return new Promise(resolve => {
      knex('export_hinban')
        .insert(data)
        .then(body => {
          res.send(body)
          resolve(body)
        })
        .catch(error => {
          console.log(error)
        })
    })
  }

  function arrangID(result) {
    var gg = parseInt(result.toString())
    return new Promise(resolve => {
      for (var z = 0; z < data.length; z++) {
        data[z].GroupID = gg
        gg++
      }
      resolve(data)
    })
  }

  function selectMax() {
    return new Promise(resolve => {
      knex.raw(`SELECT 
      CASE 
      WHEN MAX(GroupID) + 1 IS null THEN 1
      ELSE MAX(GroupID) + 1
      END AS 'GroupID'
      FROM export_hinban`)
        .then(res => {
          resolve(res[0][0].GroupID)
        })
        .catch(e => {
          console.log(e)
        })
    })
  }

})

router.get('/newTrial', (req, res) => {

  Promise.resolve()
    .then(() => {
      return new Promise(resolve => {
        knex1.select('*').from('Cabinet_Data_Hinban')
          .where('HINBAN', 'LIKE', 'S%')
          .andWhere('BarchartNo', '=', 2)
          .then(data => {
            let a = _.chain(data).groupBy('CODE_NO').map((v, k) => ({
              picker: v[0].PickerID,
              isFinished: v[0].isFinished,
              codeNo: k,
              HOUSECD: v[0].HOUSECD,
              HINBAN: v.map(r => {
                return {
                  hinbanData: r.HINBAN + '-' + r.CLR,
                  qtyData: r.QTY,
                  seq: r.Seq,
                  year: r.Bs_YY,
                  week: r.Bs_WW,
                  barchartNo: r.BarchartNo
                }
              })

            })).value()
            resolve(a)
          })
      })
    }).then(hinban => {
      return new Promise(resolve => {
        async.each(hinban, (val, cb) => {
          async.each(val.HINBAN, (val2, cb2) => {
            // var trap = []
            // knex('trial_exporthinban').select(knex.raw(`concat(ExportHinbanName, '-', ExportHinbanColor) as hinban`))
            // .then(gg=> {
            //   // console.log(gg, 'haba')
            //   for (let x = 0; x < gg.length; x++) {
            //     trap.push(gg[x].hinban)
            //   }
            // })
            knex.select('*').from('hinban_parts')
              .join('export_hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
              .join('export_hinban', 'export_hinban.GroupID', '=', 'export_hinban_parts.GroupID')
              .whereNull('export_hinban_parts.DeletedDate')
              .andWhere('export_hinban.ExportHinban', '=', val2.hinbanData)
              // .andWhere(trap, '=', val2.hinbanData) 
              .then(data => {
                if (data.length > 0) {
                  let b = data.map(rec => { return rec })
                  // console.log(b)
                  val2.childData = b
                } else {
                  val2.childData = []
                }
              })
            cb2()
          })
          cb()
        })
        setTimeout(() => {
          resolve(hinban)
        }, 5000);
      })
    }).then(newData => {
      let b = newData.map(rec => { return rec })
      // console.log(b)
      res.send(b)
    }).catch((e) => {
      console.log(e)
    })
})

router.get('/sample', (req, res) => {
  var gg = []
  knex('trial_exporthinban').select(knex.raw(`concat(ExportHinbanName, '-', ExportHinbanColor) as hinban`))
    // knex('trial_exporthinban').select(knex.raw(`concat(ExportHinbanName, '-', ExportHinbanColor) as hinban`))
    // var gg = knex.raw("select concat(ExportHinbanName, '-', ExportHinbanColor) as hinban from trial_exporthinban")
    .then(data => {
      for (let x = 0; x < data.length; x++) {
        gg.push(data[x].hinban)
      }
      console.log(gg, 'data')
      knex.select('*').from('export_hinban')
        .whereIn('ExportHinbanName', gg)
        .then(body => {
          console.log(body, 'dataaa')
        })
    })
  // console.log(gg, 'haha')
  // knex.select('*').from('export_hinban')
  // .whereIn('ExportHinbanName', '=', gg)
  // .then(data => {
  //   res.send(data)
  // })
})

router.post('/checkboxParts', (req, res) => {
  // console.log(req.body.checkboxParts[0].hinbanData)
  let lengthParts = req.body.checkboxParts.length
  let y
  for (y = 0; y < lengthParts; y++) {
    console.log(y)
    knex.select('*').from('hinban_parts')
      .join('export_hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
      .join('export_hinban', 'export_hinban.ExportHinbanCode', '=', 'export_hinban_parts.ExportHinbanCode')
      .where('export_hinban.ExportHinbanName', '=', req.body.checkboxParts[y].hinbanData)
      .then(data => {
        console.log(data)
        res.send(data)
      })
  }
})

router.post('/partsHinban', (req, res) => {
  // console.log(req.body.partHinban)
  knex.select('*').from('hinban_parts')
    .join('export_hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
    .join('export_hinban', 'export_hinban.ExportHinbanCode', '=', 'export_hinban_parts.ExportHinbanCode')
    .whereNull('export_hinban_parts.DeletedDate')
    .andWhere('export_hinban.ExportHinbanName', '=', req.body.partHinban)
    .then(data => {
      res.send(data)
      // console.log(data)
    })
})

router.post('/chips', (req, res) => {
  var arr = []
  var hinban = []
  for (var x = 0; x < req.body.length; x++) {
    hinban.push(req.body[x].mother)
  }
  // console.log(hinban, 'code')
  // console.log(hinban[0])
  knex.select('*').from('export_hinban')
    .whereIn('ExportHinbanCode', hinban)
    .then(result => {
      res.send(result)
    })
})

router.post('/hinbanParts', (req, res) => {
  let max_stock = req.body.insertdata.maximumStockQty
  let min_stock = req.body.insertdata.minimumStockQty
  let hinbanPartCode = req.body.insertdata.itemPart
  let cabinet = req.body.insertdata.cabinetNo
  let kanban = req.body.insertdata.kanbanCard

  var parts = {
    HinbanPartCode: hinbanPartCode,
    KanbanCard: kanban,
    RangeQty: null,
    MaximumStockQty: max_stock,
    MinimumStockQty: min_stock,
    OnStockQty: 0,
    AvailableQty: 0,
    Location: '',
    Cabinet: cabinet,
    DeletedDate: null,
    UpdatedBy: ''
  }

  knex('hinban_parts')
    .insert(parts)
    .then(body => {
      res.send(body)
    })
    .catch((error) => {
      console.log('this is an error ' + error.message)
    })

})

// getting data from export_hinban
router.post('/exportHinbanData', (req, res) => {
  // console.log(req.body.fetchHinban)
  knex.select('ExportHinbanCode', 'ExportHinbanName')
    .from('export_hinban')
    .where('ExportHinbanName', '=', req.body.fetchHinban)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.get('/checkItemParts', (req, res) => {
  knex.select('*').from('hinban_parts')
    .then(data => {
      res.send(data)
    })
})

router.get('/fetchMotherHinban', (req, res) => {
  knex.select('*').from('export_hinban')
    .whereNull('DeletedDate')
    .then(data => {
      res.send(data)
      // console.log(data)
    })
})

router.get('/monitoringTable', (req, res) => {
  knex.select('*').from('hinban_parts')
    // .join('export_hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
    // .join('export_hinban', 'export_hinban.ExportHinbanCode', '=', 'export_hinban_parts.ExportHinbanCode')
    .leftJoin('cabinet', 'hinban_parts.Cabinet', '=', 'cabinet.CabinetNo')
    .leftJoin('rack', 'cabinet.RackNo', '=', 'rack.RackNo')
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

// getting cabinet
router.get('/cabinet', (req, res) => {
  knex.select('*').from('cabinet')
    .whereNull('DeletedDate')
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.get('/monitoringCabinet', (req, res) => {
  knex.select('*').from('cabinet')
    .then(data => {
      res.send(data)
    })
})

//firstprocess
router.get('/stockdata', (req, res) => {
  knex.select('*').from('hinban_parts')
    .join('cabinet', 'hinban_parts.Cabinet', '=', 'cabinet.CabinetNo')
    .then(data => {
      // console.log(data)
      res.send(data)
    }).catch((e) => {
      console.log(e)
    })
})

router.post('/updateKanban', (req, res) => {
  let arr = []
  knex('hinban_parts')
    .update({ KanbanCard: req.body.kanban })
    .where('HinbanPartCode', '=', req.body.part)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/updateHinbanPart', (req, res) => {
  //console.log(req.body)
  let arr = []
  let date = moment().format("YYYY/MM/DD HH:mm:ss")
  // console.log(kans)
  knex('hinban_parts')
    .update({
      HinbanPartCode: req.body.onUpdate.itemPart,
      KanbanCard: req.body.onUpdate.kanbanCard,
      OnStockQty: req.body.onUpdate.onStock,
      AvailableQty: req.body.onUpdate.onStock,
      MaximumStockQty: req.body.onUpdate.maximum,
      MinimumStockQty: req.body.onUpdate.criticalLevel,
      RangeQty: null,
      Cabinet: req.body.onUpdate.cabinet,
      UpdatedDate: date,
      UpdatedBy: ''
    })
    .where('HinbanPartCode', '=', req.body.current.HinbanPartCode)
    .then(body => {
      arr.push(body)
      res.send(arr)
    }).catch(error => {
      console.log(error, 'ERROR')
    })

})

router.post('/motherChild', (req, res) => {
  // console.log(req.body.motherChild)
  knex.select('*').from('hinban_parts')
    .join('export_hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
    .join('export_hinban', 'export_hinban.ExportHinbanCode', '=', 'export_hinban_parts.ExportHinbanCode')
    //.leftJoin('orders', 'orders.ExportHinbanName', '=', 'export_hinban.ExportHinbanName')
    .where('export_hinban.ExportHinbanName', '=', req.body.motherChild)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.get('/getKanban', (req, res) => {
  knex.select('*', 'cabinet.CabinetCode', 'rack.RackCode').from('hinban_parts')
    .leftJoin('cabinet', 'cabinet.CabinetNo', '=', 'hinban_parts.Cabinet')
    .leftJoin('rack', 'rack.RackNo', '=', 'cabinet.RackNo')
    .then(data => {
      //console.log(data,'<=======')
      res.send(data)
    })
    .catch((e) => {
      console.log(e)
    })
})

router.get('/getMaxID', (req, res) => {
  knex('export_hinban').max('ExportHinbanCode', { as: 'id' })
    .then(data => {
      res.send(data)
    })
})

router.get('/getMotherHinban', (req, res) => {
  knex.select('*').from('export_hinban')
    .then(data => {
      res.send(data)
    })
    .catch((e) => {
      console.log(e)
    })
})

router.post('/checkSerial/:serial', (req, res) => {
  getSerial()
  async function getSerial() {
    const sql = 'SELECT * FROM HinbanSerial H ' +
      'WHERE H.Serial = ?'
    let gg = knex3.raw(sql, [req.params.serial]).then(data => {
      if (data.length > 0) {
        return data
      } else {
        return []
      }
    })
    let serialNo = await gg
    // console.log(serialNo)
    if (serialNo.length > 0) {
      const del = 'DELETE FROM HinbanSerial ' +
        'WHERE Serial = ?'
      knex3.raw(del, [serialNo[0].Serial]).then(data => {
        // if there's data
        res.send('0')
      })
    } else {
      // if no data
      res.send('1')
    }
  }
})

router.post('/updateQty', (req, res) => {
  getInfo()
  async function getInfo() {
    const sql = 'SELECT * FROM hinban_parts h ' +
      'LEFT JOIN cabinet c ' +
      'ON c.CabinetNo = h.Cabinet ' +
      'LEFT JOIN rack r ' +
      'ON r.RackNo = c.RackNo ' +
      'WHERE h.HinbanPartCode = ?'
    let gg = knex.raw(sql, [req.body.qrHinban]).then(data => {
      return data
    })
    let result = await gg
    if (result[0].length > 0) {
      res.send(result[0])
    } else {
      res.send('0')
    }
  }
})

router.post('/addQty', (req, res) => {
  let arr = []
  let x = req.body.addqty
  let y = req.body.search
  let z = req.body.scan
  // let ext = (z) ? 'HBC.KanbanCard ' : 'HBC.HinbanPartCode '
  let sql = 'UPDATE hinban_parts HBC SET HBC.AvailableQty = HBC.AvailableQty + ?, ' +
    'HBC.OnStockQty = HBC.OnStockQty + ? WHERE HBC.HinbanPartCode = ?'
  // console.log(sql)
  knex.raw(sql, [parseInt(x), parseInt(x), y])
    .then(data => {
      arr.push(data)
      res.send(arr)
    }).catch((e) => {
      console.log(e)
    })
})
// original -------------
// router.post('/addQty', (req, res) => {
//   let arr = []
//   let x = req.body.addqty
//   let y = req.body.search
//   let z = req.body.scan
//   let ext = (z) ? 'HBC.KanbanCard ' : 'HBC.HinbanPartCode '
//   let sql = 'UPDATE hinban_parts_copy HBC SET HBC.AvailableQty = HBC.AvailableQty + ?, ' +
//             'HBC.OnStockQty = HBC.OnStockQty + ? WHERE '     
//   sql += ext + '= ?'
//   console.log(sql)
//   knex.raw(sql, [parseInt(x), parseInt(x), y])
//     .then(data => {
//       arr.push(data)
//       res.send(arr)
//     }).catch((e) => {
//       console.log(e)
//     })
// })
//  ----------------------
router.post('/trappingInsert', (req, res) => {
  knex.select('*').from('export_hinban')
    .where('ExportHinban', '=', req.body.name)
    .then(data => {
      // console.log(data, 'data')
      res.send(data)
    })
})

router.post('/insertMotherHinban', (req, res) => {
  let x = req.body.insertData
  var hinbanName = ''
  var hinbanColor = ''


  var maxPromise = []
  maxPromise.push(getMax())
  Promise.all(maxPromise).then(dd => {
    var splitHinban = x.split('-')
    hinbanColor = splitHinban[splitHinban.length - 1]
    for (var y = 0; y < splitHinban.length - 1; y++) {
      if (hinbanName == '') {
        hinbanName = splitHinban[y]
      } else {
        hinbanName = hinbanName + '-' + splitHinban[y]
      }
    }

    var comparePromise = []
    comparePromise.push(compareHinban())
    Promise.all(comparePromise).then(ee => {
      // console.log(ee, 'ee')
      var insert = {
        ExportHinban: x.toUpperCase(),
        ExportHinbanName: hinbanName.toUpperCase(),
        ExportHinbanColor: hinbanColor.toUpperCase(),
        GroupID: null,
        CreatedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        UpdatedDate: moment().format("YYYY-MM-DD HH:mm:ss")
      }
      if (ee[0] == 'empty') {
        insert.GroupID = dd[0]
      } else {
        insert.GroupID = ee[0].GroupID
      }
      knex('export_hinban')
        .insert(insert).then(body => {
          // console.log(body)
          res.send(body)
        })
    })

  })

  function getMax() {
    return new Promise(resolve => {
      knex('export_hinban').max('GroupID', { as: 'GroupID' })
        .then(data => {
          var id = parseInt(data[0].GroupID) + 1
          resolve(id)
        })
    })
  }

  function compareHinban() {
    return new Promise(resolve => {
      knex.select('ExportHinbanName', 'GroupID').from('export_hinban')
        .where('ExportHinbanName', '=', hinbanName)
        .then(data => {
          if (data.length > 1) {
            resolve(data[0])
          } else {
            resolve('empty')
          }
        })
    })
  }
})

router.post('/deleteItem', (req, res) => {
  // let status = res
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  // console.log(req.body)
  let x = req.body
  // console.log(x.ExportHinbanCode)
  let id = x.ExportHinbanCode
  knex('export_hinban')
    .update({
      DeletedDate: date,
      UpdatedBy: ''
    })
    .where('ExportHinbanCode', '=', id)
    .then(data => {
      // console.log(data)
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error, '====> error')
    })
})

router.post('/activateItem', (req, res) => {
  let x = req.body
  let id = x.ExportHinbanCode
  let arr = []
  knex('export_hinban')
    .update({
      DeletedDate: null,
      UpdatedBy: ''
    })
    .where('ExportHinbanCode', '=', id)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error, '====> error')
    })
})

router.post('/toEditMother', (req, res) => {
  let arr = []
  new Promise((resolve, reject) => {
    var splitHinban = '', hinban = '', color = ''
    let name = req.body.name
    let x = req.body
    let id = x.code
    let updatedID = x.updated
    splitHinban = x.name.split("-")
    for (var g = 0; g < splitHinban.length - 1; g++) {
      if (hinban == '') {
        hinban = splitHinban[g]
      } else {
        hinban += '-' + splitHinban[g]
      }
    }
    color = splitHinban[splitHinban.length - 1]
    resolve([hinban.toUpperCase(), color.toUpperCase(), id, name.toUpperCase(), updatedID])
  }).then(first => {
    // console.log(first)
    knex.raw("SELECT GroupID FROM export_hinban " +
      "WHERE ExportHinbanName IN (SELECT ExportHinbanName FROM export_hinban " +
      "GROUP BY ExportHinbanName " +
      "HAVING ExportHinbanName = " + "'" + first[0] + "'" + ")" +
      "GROUP BY GroupID")
      .then(data => {
        var groupID
        if (data[0].length > 0) {
          groupID = data[0][0].GroupID
          knex('export_hinban')
            .where('ExportHinbancode', '=', first[2])
            .update({
              ExportHinban: first[3],
              ExportHinbanName: first[0],
              ExportHinbanColor: first[1],
              GroupID: groupID,
              DeletedDate: null,
              UpdatedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
              UpdatedBy: first[4]
            })
            .then(updated => {
              // console.log(updated, 'updated')
              arr.push(updated)
              res.send(arr)
            })
        } else {
          // console.log('nulllllll')
          var stmt = "CALL `NewGroup_ExportHinban`();"
          knex.raw(stmt)
            .then(newGroup => {
              var newID = newGroup[0][0][0].GroupID
              // console.log(newID, 'newIDDDD')
              knex('export_hinban')
                .where('ExportHinbancode', '=', first[2])
                .update({
                  ExportHinban: first[3],
                  ExportHinbanName: first[0],
                  ExportHinbanColor: first[1],
                  GroupID: newID,
                  DeletedDate: null,
                  UpdatedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                  UpdatedBy: first[4]
                })
                .then(updated => {
                  // console.log(updated, 'updated new group')
                  arr.push(updated)
                  res.send(arr)
                })
            })
        }
      })
  })
})

router.get('/picker', (req, res) => {
  knex.select('systemusers.*').countDistinct('orders.CustomerCode as PickCount')
    .from('systemusers')
    .leftJoin('orders', 'systemusers.EmployeeID', '=', 'orders.PickerID')
    .whereNull('systemusers.DeletedDate')
    .andWhere('systemusers.UserLevel', '=', 2)
    .groupBy('systemusers.EmployeeID')
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.post('/assignPicker', (req, res) => {
  // console.log(req.body.order)
  let arr = []
  let data = req.body
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  var errcount = 0

  for (let x = 0; x < data.mother.length; x++) {
    knex1('Cabinet_Data_Hinban')
      .update({
        pickerID: data.picker.EmployeeID,
        isFinished: null
      })
      .where('Seq', '=', data.mother[x].seq)
      .andWhere('Bs_YY', '=', data.mother[x].year)
      .andWhere('Bs_WW', '=', data.mother[x].week)
      .andWhere('BarchartNo', '=', data.mother[x].barchartNo)
      .then(body => {
        if (x == data.mother.length - 1 && errcount == 0) {
          arr.push(body)
          // console.log(arr, 'first table', x)
          orders()
          if (errcount == 0) {
            res.send(arr)
          }
        }
      })
      .catch(error => {
        errcount += 1
        console.log(error, 'first table')
      })
  }

  function orders() {
    knex('orders')
      .insert(data.actualOrder)
      .then(body => {
        if (errcount == 0) {
          arr.push(body)
          hinbanParts()
        }
      })
      .catch(error => {
        errcount += 1
        console.log(error, 'orders')
      })
  }

  function hinbanParts() {
    for (let z = 0; z < data.order.length; z++) {
      // console.log(data.order[z].motherQty * data.order[z].qty)
      // var updatedAvailableQty = data.order[z].motherQty * data.order[z].qty
      if (data.order[z].qty == data.AvailableQty) {
        knex('hinban_parts')
          .update({
            AvailableQty: 0,
            UpdatedDate: date,
            UpdatedBy: ''
          })
          .where('HinbanPartCode', '=', data.order[z].child)
          .then(body => {
            // console.log(body, z)
            arr.push(body)
          })
          .catch(error => {
            errcount += 1
            console.log(error, 'if third table')
          })
      }
      else {
        knex('hinban_parts')
          .update({
            UpdatedDate: date,
            UpdatedBy: ''
          })
          .decrement({
            // AvailableQty: updatedAvailableQty,
            AvailableQty: data.order[z].qty,
          })
          .where('HinbanPartCode', '=', data.order[z].child)
          .then(body => {
            // console.log(body, z)
            arr.push(body)
          })
          .catch(error => {
            console.log(error, 'else third table')
            errcount += 1
          })
      }
    }
  }

})

router.post('/getAssignItems', (req, res) => {
  knex1.select('*').from('Cabinet_Data_Hinban')
    .where('pickerID', '=', req.body.pickerID)
    // .whereNull('isFinished')
    .then(data => {
      let a = _.chain(data).groupBy('CODE_NO').map((v, k) => ({
        picker: v[0].PickerID,
        codeNo: k,
        HOUSECD: v[0].HOUSECD,
        isFinished: v[0].isFinished,
        HINBAN: v.map(r => {
          return {
            hinban: r.HINBAN,
            hinbanData: r.HINBAN + '-' + r.CLR,
            qtyData: r.QTY,
            // isFinished: r.isFinished,
            seq: r.Seq,
            year: r.Bs_YY,
            week: r.Bs_WW,
            barchartNo: r.BarchartNo
          }
        })
      })).value()
      // console.log(data)
      res.send(a)
    })

})

router.get('/trappingFinish', (req, res) => {
  knex.select('*').from('orders')
    .then(data => {

      let a = _.chain(data).groupBy('CustomerCode').map((v, k) => ({
        CustomerCode: k,
        HINBAN: v.map(r => {
          return {
            ExportHinbanCode: r.ExportHinbanName,
            HinbanPartCode: r.HinbanPartCode,
            isFinished: r.isFinished
          }
        })
      })).value()
      // console.log(data)
      res.send(a)
    })
})

router.post('/pickerGetHinbanParts', (req, res) => {
  knex.select('*').from('orders')
    .join('hinban_parts', 'hinban_parts.HinbanPartCode', '=', 'orders.HinbanPartCode')
    // .join('cabinet', 'cabinet.CabinetNo', '=', 'hinban_parts_copy.Cabinet')
    // .join('rack', 'rack.RackNo', '=', 'cabinet.RackNo')
    .where('orders.ExportHinbanName', '=', req.body.motherHinban)
    .andWhere('orders.CustomerCode', '=', req.body.customerCode)
    .then(data => {
      // console.log(data, 'dataaaaa')
      res.send(data)
    })

})

router.post('/pickerCheckExport', (req, res) => {
  // console.log(req.body.exportHinban)
  knex.select('*').from('export_hinban_parts')
    .join('export_hinban', 'export_hinban.ExportHinbanCode', 'export_hinban_parts.ExportHinbanCode')
    .where('export_hinban.ExportHinbanName', '=', req.body.exportHinban)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.get('/monitoringRack', (req, res) => {
  knex.select('*')
    .from('rack')
    .then(data => {
      res.send(data)
    })
})

router.get('/getRackActive', (req, res) => {
  knex.select('*')
    .from('rack')
    .whereNull('DeletedDate')
    .then(data => {
      res.send(data)
    })
})

router.get('/getRack', (req, res) => {
  knex.select('*')
    .from('rack')
    .then(data => {
      res.send(data)
    })
})

router.post('/saveRack', (req, res) => {
  // console.log(req.body.rackName)
  // let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('rack')
    .insert({
      RackCode: req.body.rackName,
      UpdatedBy: ''
    })
    .then(body => {
      //console.log(body)
      res.send(body)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/updateRack', (req, res) => {
  let arr = []
  // console.log(req.body.rack)
  knex('rack')
    .update({
      RackCode: req.body.racktxt,
      UpdatedBy: ''
    })
    .where('RackNo', '=', req.body.rack.RackNo)
    .then(data => {
      //console.log(data)
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error, 'error')
    })
})

router.post('/deleteRack', (req, res) => {
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('rack')
    .update({
      DeletedDate: date,
      UpdatedBy: ''
    })
    .where('RackNo', '=', req.body.delete)
    .then(data => {
      // console.log(data)
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/activateRack', (req, res) => {
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('rack')
    .update({
      DeletedDate: null,
      UpdatedBy: ''
    })
    .where('RackNo', '=', req.body.activate)
    .then(data => {
      // console.log(data)
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.get('/getCabinet', (req, res) => {
  knex.select('cabinet.*', 'rack.RackCode')
    .join('rack', 'rack.RackNo', '=', 'cabinet.RackNo')
    .from('cabinet')
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.get('/hinbanSetup', (req, res) => {
  knex.select('*').from('export_hinban')
    .join('export_hinban_parts', 'export_hinban.ExportHinbanCode', '=', 'export_hinban_parts.ExportHinbanCode')
    .join('hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
    .whereNull('export_hinban_parts.DeletedDate')
    .then(data => {
      // console.log(data)
      let a = _.chain(data).groupBy('ExportHinbanCode').map((v, k) => ({
        ExportHinbanCode: k,
        ExportHinbanName: v[0].ExportHinbanName,
        Parts: v.map(r => {
          return {
            HinbanPartCode: r.HinbanPartCode,
            StockQty: r.Quantity
          }
        })

      })).value()
      res.send(a)
    })
})

router.get('/hinbanSetup1', (req, res) => {
  knex.select('*').from('trial_exporthinban')
    .join('trial_exporthinbanparts', 'trial_exporthinban.GroupID', '=', 'trial_exporthinbanparts.GroupID')
    .join('hinban_parts', 'trial_exporthinbanparts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
    .whereNull('trial_exporthinbanparts.DeletedDate')
    .then(data => {
      // res.send(data)
      // console.log(data)
      let a = _.chain(data).groupBy('ExportHinban').map((v, k) => ({
        // ExportHinbanCode : k,
        GroupID: v[0].GroupID,
        ExportHinbanName: v[0].ExportHinban,
        Parts: v.map(r => {
          return {
            HinbanPartCode: r.HinbanPartCode,
            StockQty: r.Quantity
          }
        })

      })).value()
      res.send(a)
    })
})

router.post('/getCode', (req, res) => {
  knex.select('ExportHinbanCode').from('export_hinban')
    .where('ExportHinbanName', '=', req.body.hinban)
    .then(data => {
      res.send(data)
    })
})

router.post('/getPartHinbanSetup', (req, res) => {
  // console.log(req.body, 'req')
  knex.select('*').from('export_hinban_parts')
    .whereNull('DeletedDate')
    .andWhere('ExportHinbanCode', '=', req.body.code)
    .then(data => {
      // console.log(data, 'res')
      res.send(data)
    })
})

router.post('/currentPart', (req, res) => {
  // console.log(req.body.parts)
  knex.select('*').from('hinban_parts')
    .whereNull('DeletedDate')
    .whereNotIn('HinbanPartCode', req.body.parts)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.post('/addingPart', (req, res) => {
  // console.log(req.body, 'addingpart')
  let arr = []
  let val = {
    ExportHinbanCode: req.body.code,
    HinbanPartCode: req.body.obj.itemPart,
    Quantity: req.body.obj.qty,
    CreatedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    UpdatedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    UpdatedBy: ''
  }
  // console.log(val)
  knex.select('*').from('export_hinban_parts')
    .where('ExportHinbanCode', '=', req.body.code)
    .andWhere('HinbanPartCode', '=', req.body.obj.itemPart)
    .then(body => {
      if (body.length > 0) {
        knex('export_hinban_parts')
          .update({
            Quantity: req.body.obj.qty,
            DeletedDate: null,
            UpdatedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            UpdatedBy: ''
          })
          .where('ExportHinbanCode', '=', req.body.code)
          .andWhere('HinbanPartCode', '=', req.body.obj.itemPart)
          .then(data => {
            arr.push(data)
            res.send(arr)
          })
      } else {
        knex('export_hinban_parts')
          .insert(val)
          .then(data => {
            console.log(data)
            res.send(data)
          })
      }
    })
})

router.post('/updatingPart', (req, res) => {
  let arr = []
  console.log(req.body, 'update')
  knex('export_hinban_parts')
    .update({
      Quantity: req.body.obj.qty,
      CreatedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      UpdatedDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      UpdatedBy: ''
    })
    .where('ExportHinbanCode', '=', req.body.code)
    .andWhere('HinbanPartCode', '=', req.body.obj.itemPart)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
})

router.post('/showTbl', (req, res) => {
  knex.select('*').from('export_hinban_parts')
    .whereNull('DeletedDate')
    .andWhere('ExportHinbanCode', '=', req.body.code)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.post('/deleteSetup', (req, res) => {
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('export_hinban_parts')
    .update({ DeletedDate: date })
    .where('ExportHinbanCode', '=', req.body.code)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
})

router.post('/deletePart', (req, res) => {
  // console.log(req.body)
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('export_hinban_parts')
    .update({ DeletedDate: date })
    .where('ExportHinbanCode', '=', req.body.code)
    .andWhere('HinbanPartCode', '=', req.body.part)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
})

router.post('/deletePart1', (req, res) => {
  // console.log(req.body)
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('trial_exporthinbanparts')
    .update({ DeletedDate: date })
    .where('GroupID', '=', req.body.group)
    .andWhere('HinbanPartCode', '=', req.body.part)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
})

router.post('/getPartDelete', (req, res) => {
  // console.log(req.body)
  knex.select('*').from('hinban_parts')
    .join('export_hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
    .join('cabinet', 'cabinet.CabinetNo', '=', 'hinban_parts.Cabinet')
    .where('export_hinban_parts.ExportHinbanCode', '=', req.body.code)
    .andWhere('export_hinban_parts.HinbanPartCode', '=', req.body.part)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
})

router.post('/editPartHinbanSetup', (req, res) => {
  let errcount = 0
  let arr = []
  // console.log(req.body)
  knex('export_hinban_parts')
    .update({ hinbanPartCode: req.body.part.itemPart })
    .where('ExportHinbanCode', '=', req.body.k[0].ExportHinbanCode)
    .andWhere('HinbanPartCode', '=', req.body.k[0].HinbanPartCode)
    .then(data => {
      arr.push(data)
      if (errcount == 0) {
        knex('hinban_parts')
          .update({
            HinbanPartCode: req.body.part.itemPart,
            KanbanCard: req.body.part.kanban,
            RangeQty: req.body.part.range,
            MaximumStockQty: req.body.part.maximum,
            MinimumStockQty: req.body.part.minimum,
            OnStockQty: req.body.part.qty,
            AvailableQty: req.body.part.qty,
            Location: '',
            Cabinet: req.body.part.cabinet
          })
          .where('HinbanPartCode', '=', req.body.k[0].HinbanPartCode)
          .andWhere('KanbanCard', '=', req.body.k[0].KanbanCard)
          .then(body => {
            arr.push(body)
            res.send(arr)
          }).catch(error => {
            console.log(error)
          })
      }
    }).catch(error => {
      errcount += 1
      console.log(error)
    })
})

router.get('/getGroup', (req, res) => {
  knex.select('*').from('export_hinban_parts')
    .whereNull('DeletedDate')
    .then(data => {
      let a = _.chain(data).groupBy('GroupID').map((v, k) => ({
        GroupID: k,
        GroupName: v[0].GroupName,
        Part: v.map(r => {
          return {
            Child: r.HinbanPartCode,
            Quantity: r.Quantity
          }
        })
      })).value()
      // console.log(a)
      res.send(a)
    })
})

router.get('/selectMaxGroup', (req, res) => {
  knex.select('*').from('trial_exporthinbanparts')
    .then(data => {
      if (data.length == 0) {
        var id = '1'
        res.send(id)
      } else {
        knex('trial_exporthinbanparts').max('GroupID', { as: 'id' })
          .then(body => {
            // console.log(body)
            res.send(body)
          })
      }
    })
})

router.post('/addGroup', (req, res) => {
  function partArrange() {
    part = {
      GroupID: req.body.id,
      GroupName: req.body.groupName,
      HinbanPartCode: req.body.part,
      Quantity: req.body.qty
    }
  }
  partArrange()
  knex('export_hinban_parts')
    .insert(part)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
    .catch(error => {
      console.log(error)
    })
})

router.get('/getMax', (req, res) => {
  knex('export_hinban_parts').max('GroupID', { as: 'id' })
    .then(data => {
      res.send(data)
    })
})

router.post('/addPartGroup', (req, res) => {
  var part = {
    GroupID: req.body.id,
    GroupName: req.body.groupName,
    HinbanPartCode: req.body.part,
    Quantity: req.body.qty
  }
  knex('export_hinban_parts')
    .insert(part)
    .then(data => {
      res.send(data)
    })
})

router.post('/updatePartGroup', (req, res) => {
  let arr = []
  knex('export_hinban_parts')
    .update({
      Quantity: req.body.qty
    })
    .where('GroupID', '=', req.body.id)
    .andWhere('HinbanPartCode', '=', req.body.part)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
})

router.post('/deleteGroup', (req, res) => {
  let arr = []
  var id = req.body.id
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('export_hinban_parts')
    .update({ DeletedDate: date })
    .where('GroupID', '=', id)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/deleteHinbanPartGroup', (req, res) => {
  // console.log(req.body)
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('export_hinban_parts')
    .update({ DeletedDate: date })
    .where('GroupID', '=', req.body.id)
    .andWhere('HinbanPartCode', '=', req.body.part)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
})

router.post('/filterGetPart', (req, res) => {
  var id = req.body.id
  var part = req.body.part
  // console.log(req.body.part)
  knex.select('*').from('hinban_parts')
    .whereNull('DeletedDate')
    .whereNotIn('HinbanPartCode', part)
    // .andWhere('GroupID', '=', id)
    .then(data => {
      res.send(data)
    })
})

router.get('/getAllPart', (req, res) => {
  knex.select('*').from('hinban_parts')
    .whereNull('DeletedDate')
    .then(data => {
      res.send(data)
    })
})

router.post('/getCurrentPart', (req, res) => {
  var groupID = req.body.id
  knex.select('*').from('export_hinban_parts')
    .whereNull('DeletedDate')
    .where('GroupID', '=', groupID)
    .then(data => {
      res.send(data)
    })
})

router.post('/compareName', (req, res) => {
  knex.select('*').from('export_hinban_parts')
    .where('GroupName', '=', req.body.name)
    .then(data => {
      res.send(data)
    })
    .catch(error => {
      console.log(error)
    })
})

router.get('/getSetup', (req, res) => {
  knex.select('*').from('trial_exporthinban')
    .join('trial_exporthinbanparts', 'trial_exporthinbanparts.GroupID', '=', 'trial_exporthinban.GroupID')
    .then(data => {
      let a = _.chain(data).groupBy('ExportHinban').map((v, k) => ({
        ExportHinban: k,
        GroupID: v[0].GroupID,
        Part: v.map(rec => {
          return {
            HinbanPartCode: rec.HinbanPartCode,
            Quantity: rec.Quantity
          }
        })
      })).value()
      res.send(a)
    })
})

router.get('/getAddSetup', (req, res) => {
  var hinban = []
  knex.select('ExportHinban').from('trial_exporthinban')
    .whereNotNull('GroupID')
    .whereNull('DeletedDate')
    .then(data => {
      for (let x = 0; x < data.length; x++) {
        hinban.push(data[x].ExportHinban)
      }
      // res.send(hinban)
      knex.select('*').from('trial_exporthinban')
        .whereNotIn('ExportHinban', hinban)
        .then(body => {
          res.send(body)
        })
    })
})

router.post('/setupHinban', (req, res) => {
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('trial_exporthinban')
    .update({
      GroupID: req.body.group,
      UpdatedDate: date
    })
    .where('ExportHinban', '=', req.body.hinban)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/deleteHinbanSetup', (req, res) => {
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('trial_exporthinban')
    .update({
      GroupID: null,
      UpdatedDate: date
    })
    .where('ExportHinban', '=', req.body.hinban)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/saveCabinet', (req, res) => {
  // console.log(req.body)
  knex('cabinet')
    .insert({
      RackNo: req.body.cabinetRackNo,
      CabinetCode: req.body.cabinetName,
      UpdatedBy: ''
    })
    .then(body => {
      // console.log(body)
      res.send(body)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/updateCabinet', (req, res) => {
  let arr = []
  // console.log(req.body)
  knex('cabinet')
    .update({
      RackNo: req.body.cabinetRackNo,
      CabinetCode: req.body.cabinetName,
      UpdatedBy: ''
    })
    .where('CabinetNo', '=', req.body.rack.CabinetNo)
    .then(data => {
      // console.log(data)
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/deleteCabinet', (req, res) => {
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('cabinet')
    .update({
      DeletedDate: date,
      UpdatedBy: ''
    })
    .where('CabinetNo', '=', req.body.delete)
    .then(data => {
      // console.log(data)
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/activateCabinet', (req, res) => {
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex('cabinet')
    .update({
      DeletedDate: null,
      UpdatedBy: ''
    })
    .where('CabinetNo', '=', req.body.activate)
    .then(data => {
      // console.log(data)
      arr.push(data)
      res.send(arr)
    })
    .catch(error => {
      console.log(error)
    })
})

router.post('/finishedOne', (req, res) => {
  // console.log(req.body.itemParts, 'itemParts')
  let arr = []
  // return new Promise(resolve=>{
  knex('orders')
    .update({
      isFinished: true,
      PickerID: req.body.picker
    })
    .increment({
      TotalPick: req.body.itemQty
    })
    .where('Year', '=', req.body.year)
    .andWhere('Week', '=', req.body.week)
    .andWhere('CustomerCode', '=', req.body.customerCode)
    .andWhere('ExportHinbanName', '=', req.body.motherHinban)
    .andWhere('HinbanPartCode', '=', req.body.itemParts)
    .then(data => {
      knex('hinban_parts')
        .decrement({
          OnStockQty: req.body.itemQty
        })
        .where('HinbanPartCode', '=', req.body.itemParts)
        .then(body => {
          arr.push(body)
          res.send(arr)
        })
        .catch(error => {
          arr.push('error')
          res.send(arr)
          console.log(error.message)
        })
    })
})

router.post('/finishedOrder', (req, res) => {
  // console.log(req.body.itemParts, 'itemParts')
  return new Promise(resolve => {
    for (let y = 0; y < req.body.itemParts.length; y++) {
      if (req.body.itemParts[y].isFinished == null) {
        knex('orders')
          .update({
            isFinished: true,
            PickerID: req.body.picker
          })
          .increment({
            TotalPick: req.body.itemParts[y].TotalOrders
          })
          .where('Year', '=', req.body.year)
          .andWhere('Week', '=', req.body.week)
          .andWhere('CustomerCode', '=', req.body.customerCode)
          .andWhere('ExportHinbanName', '=', req.body.motherHinban)
          .andWhere('HinbanPartCode', '=', req.body.itemParts[y].HinbanPartCode)
          // .increment('TotalPick', req.body.itemParts[y].TotalOrders)
          .then(data => {
            // console.log(data, y, 'promise')
          })
      } else {
        // console.log(req.body.itemParts[y].HinbanPartCode, req.body.itemParts[y].isFinished, 'hayst')
      }
    }

    let arr = []
    async.each(req.body.itemParts, (rec, cb) => {
      // console.log(rec.HinbanPartCode, rec.isFinished, 'rec')
      if (rec.isFinished == null) {
        // console.log(rec.HinbanPartCode, 'hatdug')
        knex('hinban_parts')
          .decrement({
            OnStockQty: rec.TotalOrders
          })
          .where('HinbanPartCode', '=', rec.HinbanPartCode)
          .then(data => {
            arr.push(data)
          })
          .catch(error => {
            arr.push('error')
            console.log(error.message)
          })
      }
      cb()
    }, (err) => {
      if (!err) {
        setTimeout(() => {
          resolve(arr)
        }, 1000);
      }
    })
  }).then(test => {
    if (test.includes('error')) {
      res.send('error')
    } else {
      res.send(test)
    }
  })
  // console.log(req.body)

})

router.post('/finishedStatus', (req, res) => {
  //console.log(req.body, 'FINISHED')
  let arr = []

  for (let x = 0; x < req.body.finishedHinban.length; x++) {
    knex1('Cabinet_Data_Hinban')
      .update({
        isFinished: true
      })
      .where('HOUSECD', '=', req.body.houseCode)
      .andWhere('CODE_NO', '=', req.body.customerCode)
      .andWhere('HINBAN', '=', req.body.finishedHinban[x].hinban)
      .then(data => {
        arr.push(data)
        if (arr.length == req.body.finishedHinban.length) {
          if (arr.includes('error')) {
            res.send('error')
          } else {
            // console.log(arr, 'data')
            res.send(arr)
          }
        }
      })
      .catch(error => {
        arr.push('error')
        console.log(error)
      }), (err) => {
        if (!err) {
          setTimeout(() => {
            resolve(arr)
          }, 1000);
        }
      }
  }
})

router.post('/statusExportHinban', (req, res) => {
  // console.log(req.body)
  knex1.select('*').from('Cabinet_Data_Hinban')
    .where('HINBAN', 'LIKE', 'S%')
    .andWhere('BarchartNo', '=', 2)
    .andWhere('CODE_NO', '=', req.body.construction)
    .andWhere('HOUSECD', '=', req.body.house)
    .then(data => {
      // console.log(data)
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/checkbox', (req, res) => {
  // console.log(req.body.pasa.length)
  // console.log(req.body.customerCode, 'pasa')
  Promise.resolve()
    .then(() => {
      return new Promise(resolve => {
        knex1.select('*').from('Cabinet_Data_Hinban')
          .where('HINBAN', 'LIKE', 'S%')
          .andWhere('BarchartNo', '=', 2)
          .andWhere('CODE_NO', req.body.customerCode)
          .then(data => {
            let a = _.chain(data).groupBy('CODE_NO').map((v, k) => ({
              picker: v[0].PickerID,
              isFinished: v[0].isFinished,
              codeNo: k,
              HOUSECD: v[0].HOUSECD,
              HINBAN: v.map(r => {
                return {
                  hinbanData: r.HINBAN + '-' + r.CLR,
                  qtyData: r.QTY,
                  seq: r.Seq,
                  year: r.Bs_YY,
                  week: r.Bs_WW,
                  barchartNo: r.BarchartNo
                }
              })

            })).value()
            resolve(a)
          })
      })
    }).then(hinban => {
      return new Promise(resolve => {
        async.each(hinban, (val, cb) => {
          async.each(val.HINBAN, (val2, cb2) => {
            knex.select('*').from('hinban_parts')
              .join('export_hinban_parts', 'export_hinban_parts.HinbanPartCode', '=', 'hinban_parts.HinbanPartCode')
              .join('export_hinban', 'export_hinban.ExportHinbanCode', '=', 'export_hinban_parts.ExportHinbanCode')
              .where('export_hinban.ExportHinbanName', '=', val2.hinbanData)
              .then(data => {
                if (data.length > 0) {
                  let b = data.map(rec => { return rec })
                  // console.log(b)
                  val2.childData = b
                } else {
                  val2.childData = []
                }
              })
            cb2()
          })
          cb()
        })
        setTimeout(() => {
          resolve(hinban)
        }, 500);

      })
    }).then(newData => {
      let b = newData.map(rec => { return rec })
      // console.log(b)
      res.send(b)
    }).catch((e) => {
      console.log(e)
    })

})

router.post('/updateHinban', (req, res) => {
  let bom = req.body.BomHinban
  let hinban = req.body.Hinban
  let arr = []
  let date = moment().format("YYYY-MM-DD HH:mm:ss")
  knex3('BomPartsHinban').update({
    BomHinban: bom,
    UpdatedDate: date
  }).where('Hinban', '=', hinban)
    .then(data => {
      arr.push(data)
      res.send(arr)
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/uploadFiles', upload.array('files[]'), (req, res) => {
  if (req.files[0].filename.toLowerCase().includes('.csv')) {

    let inputCsv = `./upload/${req.files[0].filename}`
    let data = []
    let date = moment().format("YYYY-MM-DD HH:mm:ss")
    csv()
      .fromFile(inputCsv)
      .then((jsonObj) => {

        jsonObj.filter(r => {
          data.push({
            Hinban: r.Hinban,
            BomHinban: r.BomHinban,
            CreatedDate: date,
            UpdatedDate: date
          })
        })

        let promises = []
        data.forEach(val => {
          promises.push(insertData(val))
        })
        Promise.all(promises)
          .then(result => {
            // console.log(result)
            res.send(result)
            // return knex3.select('*').from('BomPartsHinban')
          })
        // .then(body=>{
        //   res.send(body)
        // })

        // console.log(data)
        /**
         * [
         * 	{a:"1", b:"2", c:"3"},
         * 	{a:"4", b:"5". c:"6"}
         * ]
         */
      })

  } else {
    const result = excelToJson({
      sourceFile: `./upload/${req.files[0].filename}`,
      header: {
        // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
        rows: 1 // 2, 3, 4, etc.
      }
    });

    let data = []
    let date = moment().format("YYYY-MM-DD HH:mm:ss")
    // res.send(result)
    result.Sheet1.find(a => {
      data.push({
        Hinban: a.A,
        BomHinban: a.B,
        CreatedDate: date,
        UpdatedDate: date
      })
    })

    let promises = []
    data.forEach(val => {
      promises.push(insertData(val))
    })

    Promise.all(promises)
      .then(result => {
        res.send(result)
        // return knex3.select('*').from('BomPartsHinban')
      })
    // .then(body=>{
    //   res.send(body)
    // })
  }


})

function insertData(data) {
  return new Promise(resolve => {
    knex3.select('*').from('BomPartsHinban')
      .where('Hinban', data.Hinban)
      .then(newData => {
        if (newData.length == 0) {
          knex3('BomPartsHinban').insert({
            Hinban: data.Hinban,
            BomHinban: data.BomHinban,
            CreatedDate: data.CreatedDate,
            UpdatedDate: data.UpdatedDate
          }).then(body => {
            resolve('Successfully Inserted!')
          }).catch((e) => {
            resolve(e.message)
          })
        } else {
          resolve('Hinban Already Exists!')
        }

      })


  })
}

module.exports = router;

