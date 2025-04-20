<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="elevation-4">
          <v-card-title class="text-h5 pa-4">
            {{ currentQuestion.text }}
          </v-card-title>

          <v-card-text>
            <v-radio-group
              v-if="currentQuestion.questionType === 'single-choice'"
              v-model="selectedAnswer"
            >
              <v-radio
                v-for="(answer, index) in currentQuestion.answers"
                :key="index"
                :value="answer"
                :label="answer"
                class="mb-2"
              ></v-radio>
            </v-radio-group>

            <div v-else>
              <v-checkbox
                v-for="(answer, index) in currentQuestion.answers"
                :key="index"
                :value="answer"
                :label="answer"
                class="mb-2"
                @update:model-value="(checked) => toggleAnswer(answer, checked)"
              ></v-checkbox>
            </div>
            <div class="d-flex flex-start ga-2">
              <v-btn
              color="primary"
              class="mt-4"
              @click="checkAnswer"
            >
              Submit
            </v-btn>
            <v-btn
              v-if="showResult"
              color="success"
              class="mt-4"
              @click="nextQuestion"
            >
              Next Question
            </v-btn>
            </div>
            

            <v-alert
              v-if="showResult"
              :type="isAnswerCorrect ? 'success' : 'error'"
              class="mt-4"
            >
              {{ resultMessage }}
            </v-alert>
              <div v-if="resultExplanation" class="mt-2">
                {{ resultExplanation }}
              </div>
            


          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';

const questions = ref([
  { 
    questionType: 'single-choice',
    text: 'What is Vue.js?',
    answers: ['A JavaScript framework', 'A CSS library', 'A backend language', 'A database'],
    correctAnswers: ['A JavaScript framework'],
    explanation: 'Vue.js is a progressive JavaScript framework for building user interfaces.',
    tags: ['vue'],
    difficulty: 'easy'
  },
  {
    questionType: 'single-choice',
    text: 'Which directive is used for two-way data binding in Vue?',
    answers: ['v-if', 'v-for', 'v-bind', 'v-model'],
    correctAnswers: ['v-model'],
    explanation: 'The v-model directive is used for two-way data binding in Vue.',
    tags: ['vue'],
    difficulty: 'easy'
  },
  {
    questionType: 'single-choice',
    text: 'Which lifecycle hook is called after the component is mounted?',
    answers: ['beforeCreate', 'created', 'mounted', 'beforeUnmount'],
    correctAnswers: ['mounted'],
    explanation: 'The mounted hook is called after the component is mounted.',
    tags: ['vue'],
    difficulty: 'easy'
  },
  {
    questionType: 'multiple-choice',
    text: 'Which lifecycle hooks from the Options API are not available as dedicated hooks in the Composition API?',
    answers: ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeUnmount', 'unmounted'],
    correctAnswers: ['beforeCreate', 'created'],
    explanation: 'In the Composition API, `setup()` runs before any lifecycle hooks and serves the same purpose as `beforeCreate` and `created`, so those two hooks are no longer needed or exposed as separate functions.',
    tags: ['vue'],
    difficulty: 'medium'
  }, 
  {
    questionType: "single-choice",
    text: "What is the main advantage of using `<script setup>` in Vue 3?",
    answers: [
      "It automatically exposes all top-level bindings to the template",
      "It provides better TypeScript support than the Options API",
      "It reduces the amount of boilerplate code needed",
      "All of the above"
    ],
    correctAnswers: ["All of the above"],
    explanation: "The `<script setup>` syntax in Vue 3 combines several benefits: it automatically exposes all top-level bindings to the template, provides better TypeScript support through better type inference, and significantly reduces boilerplate code by eliminating the need for the `setup()` function and explicit returns.",
    tags: ['vue', 'typescript'],
    difficulty: "intermediate"
  }
]);

const currentIndex = ref(0);
const currentQuestion = ref(questions.value[currentIndex.value]);
const selectedAnswer = ref('');
const selectedAnswers = ref([]);
const showResult = ref(false);
const resultMessage = ref('');
const resultExplanation = ref('');
const isAnswerCorrect = ref(false);

// Add a watch to debug selectedAnswers changes
watch(selectedAnswers, (newVal) => {
  console.log('selectedAnswers changed:', newVal);
}, { deep: true });

const toggleAnswer = (answer, checked) => {
  console.log('Toggle answer:', answer, checked);
  if (checked) {
    selectedAnswers.value = [...selectedAnswers.value, answer];
  } else {
    selectedAnswers.value = selectedAnswers.value.filter(a => a !== answer);
  }
  console.log('Updated selectedAnswers:', selectedAnswers.value);
};

const checkAnswer = () => {
  showResult.value = true;
  
  if (currentQuestion.value.questionType === 'single-choice') {
    console.log('Single choice question');
    console.log('Selected answer:', selectedAnswer.value);
    console.log('Correct answer:', currentQuestion.value.correctAnswers[0]);
    
    isAnswerCorrect.value = selectedAnswer.value === currentQuestion.value.correctAnswers[0];
    
    if (isAnswerCorrect.value) {
      resultMessage.value = 'Correct answer!'
      resultExplanation.value = currentQuestion.value.explanation;
    } else {
      resultMessage.value = 'Wrong answer. Try again!';
    }
  } else if (currentQuestion.value.questionType === 'multiple-choice') {
    console.log('Multiple choice question');
    console.log('Selected answers:', selectedAnswers.value);
    console.log('Correct answers:', currentQuestion.value.correctAnswers);
    
    // Convert to arrays and sort for consistent comparison
    const selected = [...selectedAnswers.value].sort();
    const correct = [...currentQuestion.value.correctAnswers].sort();
    
    console.log('Sorted selected:', selected);
    console.log('Sorted correct:', correct);
    
    // Check if arrays are exactly equal
    isAnswerCorrect.value = selected.length === correct.length && 
      selected.every((value, index) => value === correct[index]);
    
    console.log('Is correct:', isAnswerCorrect.value);
    
    if (isAnswerCorrect.value) {
      resultMessage.value = 'All correct answers selected!'
      resultExplanation.value = currentQuestion.value.explanation;
    } else {
      resultMessage.value = 'Not all correct answers were selected. Try again!';
    }
  }
};

const nextQuestion = () => {
  showResult.value = false;
  selectedAnswer.value = '';
  selectedAnswers.value = [];
  resultMessage.value = '';
  resultExplanation.value = '';
  isAnswerCorrect.value = false;
  currentIndex.value = (currentIndex.value + 1) % questions.value.length;
  currentQuestion.value = questions.value[currentIndex.value];
};
</script>
