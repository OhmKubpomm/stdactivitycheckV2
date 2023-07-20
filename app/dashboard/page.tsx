'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import { Stepper, Step, StepLabel, TextField, Button, Box, Container, Grid, Typography,Card } from '@mui/material'


export default function Admin() {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [quizTitle, setQuizTitle] = useState<string>('')
  const [question, setQuestion] = useState<string>('')
  const [answers, setAnswers] = useState<string[]>(['', '', '', ''])


  const steps = ['กำหนดหัวข้อกิจกรรม', 'เพิ่มคำถาม', 'เพิ่มตัวเลือกคำตอบ']

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, index: number): void => {
    const newAnswers = [...answers]
    newAnswers[index] = event.target.value
    setAnswers(newAnswers)
  }

  const handleAddAnswer = (): void => {
    setAnswers([...answers, ''])
  }

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()

    if (activeStep === steps.length - 1) {
      const quiz = {
        title: quizTitle,
        questions: [{
          question,
          answers,
        }],
      }

      try {
        await axios.post('/api/quizzes', quiz)
        alert('Quiz created!')
      } catch (error) {
        alert('An error occurred while creating the quiz.')
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
  }

  const handleDeleteAnswer = (indexToDelete: number): void => {
    setAnswers(answers.filter((_, index) => index !== indexToDelete))
  }


  return (
    <Container maxWidth="md">
    <Box sx={{ width: '100%', pt: 3, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>เพิ่มแบบฟอร์มกิจกรรมนักศึกษา</Typography>
      <Card sx={{ p: 4, mt: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {activeStep === 0 && (
              <Grid item xs={12}>
                <TextField
                  label="Quiz Title"
                  variant="outlined"
                  fullWidth
                  value={quizTitle}
                  onChange={(event) => setQuizTitle(event.target.value)}
                />
              </Grid>
            )}
            {activeStep === 1 && (
              <Grid item xs={12}>
                <TextField
                  label="Question"
                  variant="outlined"
                  fullWidth
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                />
              </Grid>
            )}
           {activeStep === 2 && (
                <Box sx={{ mt: 4 }}>
                  <Button onClick={handleAddAnswer} variant="outlined" color="primary" sx={{ mb: 2 }}>
                    Add Answer
                  </Button>
                  {answers.map((answer, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={8} key={index}>
                      {answers.length > 1 && (
                        <Button onClick={() => handleDeleteAnswer(index)} variant="outlined" color="secondary" sx={{ mb: 2 }}>
                          Delete Answer
                        </Button>
                      )}
                      <TextField
                        label={`Answer ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        value={answer}
                        onChange={(event) => handleInputChange(event as ChangeEvent<HTMLInputElement>, index)}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  ))}
                </Box>
              )}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Grid>
            </Grid>
          </form>
          </Card>
      </Box>
    </Container>
  )
}