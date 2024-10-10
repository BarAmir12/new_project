const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

// השתמש במשתנה סביבה עבור הפורט במקרה והוא זמין
const PORT = process.env.PORT || 3001

let persons = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
]

// אפשר שימוש ב-CORS
app.use(cors())

// אפשר עיבוד של JSON בבקשות POST
app.use(express.json())

// הגדר את ה-morgan לוגים עם טוקן מותאם
morgan.token('post-data', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-data'
  )
)

// נקודת קצה שמחזירה את כל האנשים
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// נקודת קצה שמחזירה מידע כללי
app.get('/info', (req, res) => {
  const currentTime = new Date()
  const response = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime}</p>
    `
  res.send(response)
})

// נקודת קצה שמחזירה מידע על אדם לפי ID
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find((p) => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: 'Person not found' })
  }
})

// נקודת קצה שמוחקת אדם לפי ID
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter((p) => p.id !== id)

  res.status(204).end()
})

// נקודת קצה שמוסיפה אדם חדש
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  const nameExists = persons.some((p) => p.name === body.name)
  if (nameExists) {
    return res.status(400).json({ error: 'Name must be unique' })
  }

  const newPerson = {
    id: String(Math.floor(Math.random() * 1000000)),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
