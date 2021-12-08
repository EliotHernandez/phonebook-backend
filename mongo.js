const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length === 4) {
    console.log('Name or number missing')
    process.exit(1)
}

let action = "get"
if (process.argv.length >= 5) {
    action = "post"
}

const password = process.argv[2]
const url = `mongodb+srv://fullstackopen:${password}@cluster0.vwd8z.mongodb.net/fullopenstack?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (action === 'get') {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name + ' ' + person.number)
        })
        mongoose.connection.close()
    })
} else if (action === 'post') {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}