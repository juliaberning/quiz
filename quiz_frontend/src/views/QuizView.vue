<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="elevation-4">
          <v-card-title class="text-h5 pa-4 text-wrap">
            <span v-html="currentQuestion.text"></span>
          </v-card-title>

          <v-card-text>
            <v-radio-group
              v-if="currentQuestion.questionType === 'single-choice'"
              v-model="selectedAnswer"
              class="pa-2"
            >
              <v-radio
                v-for="(answer, index) in currentQuestion.answers"
                :key="index"
                :value="answer"
                class="mb-0"
              >
                <template v-slot:label>
                  <span v-html="answer"></span>
                </template>
              </v-radio>
            </v-radio-group>

            <div v-else class="pa-2">
              <v-checkbox
                v-for="(answer, index) in currentQuestion.answers"
                :key="index"
                :value="answer"
                class="mb-0"
                density="compact"
                @update:model-value="(checked) => toggleAnswer(answer, checked)"
              >
                <template v-slot:label>
                  <span v-html="answer"></span>
                </template>
              </v-checkbox>
            </div>
            <div class="d-flex flex-start ga-2">
              <v-btn
              :disabled="!selectedAnswer && currentQuestion.questionType === 'single-choice' || !selectedAnswers.length && currentQuestion.questionType === 'multiple-choice'"
              color="primary"
              class="mt-4"
              @click="checkAnswer"
            >
              Submit
            </v-btn>
            <v-btn
              v-if="showResult"
              color="deep-purple-accent-4"
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
                <span v-html="resultExplanation"></span>
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
    answers: ['<code>v-if</code>', '<code>v-for</code>', '<code>v-bind</code>', '<code>v-model</code>'],
    correctAnswers: ['<code>v-model</code>'],
    explanation: 'The <code>v-model</code> directive is used for two-way data binding in Vue.',
    tags: ['vue'],
    difficulty: 'easy'
  },
  {
    questionType: 'single-choice',
    text: 'Which lifecycle hook is called after the component is mounted?',
    answers: ['<code>beforeCreate</code>', '<code>created</code>', '<code>mounted</code>', '<code>beforeUnmount</code>'],
    correctAnswers: ['<code>mounted</code>'],
    explanation: 'The <code>mounted</code> hook is called after the component is mounted.',
    tags: ['vue'],
    difficulty: 'easy'
  },
  {
    questionType: 'multiple-choice',
    text: 'Which lifecycle hooks from the Options API are not available as dedicated hooks in the Composition API?',
    answers: ['<code>beforeCreate</code>', '<code>created</code>', '<code>beforeMount</code>', '<code>mounted</code>', '<code>beforeUpdate</code>', '<code>updated</code>', '<code>beforeUnmount</code>', '<code>unmounted</code>'],
    correctAnswers: ['<code>beforeCreate</code>', '<code>created</code>'],
    explanation: 'In the Composition API, <code>setup()</code> runs before any lifecycle hooks and serves the same purpose as <code>beforeCreate</code> and <code>created</code>, so those two hooks are no longer needed or exposed as separate functions.',
    tags: ['vue'],
    difficulty: 'medium'
  }, 
  {
    questionType: "single-choice",
    text: "What is the main advantage of using <code>&lt;script setup&gt;</code> in Vue 3?",
    answers: [
      "It automatically exposes all top-level bindings to the template",
      "It provides better TypeScript support than the Options API",
      "It reduces the amount of boilerplate code needed",
      "All of the above"
    ],
    correctAnswers: ["All of the above"],
    explanation: "The <code>&lt;script setup&gt;</code> syntax in Vue 3 combines several benefits: it automatically exposes all top-level bindings to the template, provides better TypeScript support through better type inference, and significantly reduces boilerplate code by eliminating the need for the <code>setup()</code> function and explicit returns.",
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
