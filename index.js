require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('reqJson', (req, res) => JSON.stringify(req.body))

app.use(morgan('tiny', {
    skip: function (req, res) { return req.method === 'POST' }
}))

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.reqJson(req, res)
    ].join(' ')
}, {
    skip: function (req, res) { return req.method !== 'POST' }
}))

app.get("/api/persons", (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get("/info", (request, response) => {
    Person.find({})
        .then(persons => {
            let numPersons = persons.length
            const dateString = new Date().toString()
            const info = `<div><p>Phonebook has info for ${numPersons} people</p><p>${dateString}</p></div>`
            response.send(info)
        })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    Person.findByIdAndRemove(request.params.id)
        .then(person => {
            response.json(person)
        })
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    }

    Person.find({ "name": body.name })
        .then(persons => {
            if (persons.length > 0) {
                return response.status(400).json({
                    error: "name must be unique"
                })
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number
                })

                person.save()
                    .then(savedPerson => {
                        response.status(201).json(savedPerson)
                    })
            }
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)