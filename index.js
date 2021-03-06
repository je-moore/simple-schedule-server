const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./db.js')
const database = db.database
const Sequelize = db.Sequelize

const app = express()
const port = 3001
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// parse various different custom JSON types as JSON
app.use(bodyParser.json())
app.use(cors())

const Plan = database.define(
  'plan',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    month: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    day: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'plans',
    timestamps: false,
  }
)

app.get('/plans', (request, response) => {
  Plan.findAll({
    attributes: ['day', 'text'],
  })
    .then(plans => {
      response.send({ plans })
    })
    .catch(err => {
      response.send(405)
    })
})

app.get('/plans/:month', (req, res) => {
  Plan.findAll({
    where: {
      month: Number(req.params.month),
    },
    attributes: ['day', 'text'],
  })
    .then(result => {
      res.status(200)
      res.send({ result })
    })
    .catch(err => {
      res.status(404)
    })
})

app.post('/plans', (req, res) => {
  const plan = req.body

  Plan.findOne({ where: { id: plan.id } }).then(item => {
    if (!item) {
      // Item doesn't exist, so we create it
      Plan.create(plan).then(item => ({ item, created: true }))
    }
    // Item already exists, so we update it
    return Plan.update(plan, { where: { id: plan.id } }).then(item => ({
      item,
      created: false,
    }))
  })
})

app.put('/plans/:id', (req, res) => {
  const planId = Number(req.params.id)
  const updates = req.body
  console.log(updates)
  // find the plan in the DB
  Plan.findAll({
    where: {
      id: planId,
    },
  })
    .then(result => {
      if (!result) {
        res.status(404).send('Not found')
      } else {
        // change the plan and store in DB
        return result.update(updates).then(result => {
          // respond with the changed plan and status code 200 OK
          res.send(result)
        })
      }
    })
    .catch(err => handleError(err, res))
})

app.delete('/plans/:id', (req, res) => {
  const planId = Number(req.params.id)
  const updates = req.body

  Plan.findById(planId)
    .then(result => {
      result.destroy()
      res.status(200).send('Good job.')
    })
    .catch(err => {
      res.status(500).send(err)
    })
  res.end()
})
