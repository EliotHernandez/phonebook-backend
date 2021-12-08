const express = require("express")
const app = express()

app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    const dateString = new Date().toString()
    const info = `<div><p>Phonebook has info for ${persons.length} people</p><p>${dateString}</p></div>`
    response.send(info)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) return response.json(person)
    response.status(404).end()
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * (500 - 10)) + 10
}

const validName = name => {
    const duplicated = persons.filter(person => person.name === name)
    return duplicated.length > 0 ? false : true
}

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        }).eventNames()
    }

    if (!validName(body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = [...persons, newPerson]
    response.status(201).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)