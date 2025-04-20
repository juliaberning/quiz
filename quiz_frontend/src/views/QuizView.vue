<template>
  <div class="quiz-card">
    <div
      class="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-lg transition-all cursor-pointer w-96"
    >
      <div class="p-4">
        <!-- Question Title -->
        <h5 class="mb-2 text-slate-800 text-xl font-semibold">
          {{ currentQuestion.text }}
        </h5>

        <!-- Answer Choices -->
        <ul class="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <li 
            v-for="(answer, index) in currentQuestion.answers" 
            :key="index" 
            class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
          >
            <div class="flex items-center ps-3">
              <input
                v-if="currentQuestion.questionType === 'single-choice'"
                :id="`answer-${index}`"
                type="radio"
                :value="answer"
                v-model="selectedAnswer"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />
              <input
                v-else
                :id="`answer-${index}`"
                type="checkbox"
                :value="answer"
                v-model="selectedAnswers"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              />
              <label
                :for="`answer-${index}`"
                class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {{ answer }}
              </label>
            </div>
          </li>
        </ul>

        <!-- View Solution Button -->
        <button 
          @click="checkAnswer"
          class="mt-4 w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
        >
          Submit
        </button>

        <!-- Result Message -->
        <p v-if="showResult" class="mt-3 text-center font-semibold">
          <span :class="resultMessageClass">
            {{ resultMessage }}
          </span>
          <br>
          <span :class="resultExplanationClass">
            {{ resultExplanation }}
          </span>
        </p>

        <!-- Next Question Button -->
        <button 
          v-if="showResult"
          @click="nextQuestion"
          class="mt-3 w-full px-4 py-2 text-white bg-green-600 hover:bg-green-500 rounded-lg transition"
        >
          Next Question
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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
const resultMessageClass = ref('');
const resultExplanation = ref('');
const resultExplanationClass = ref('');

const checkAnswer = () => {
  showResult.value = true;
  console.log('Selected:', currentQuestion.value.questionType === 'single-choice' ? selectedAnswer.value : selectedAnswers.value);
  console.log('Correct:', currentQuestion.value.correctAnswers);

  if (currentQuestion.value.questionType === 'single-choice') {
    if (selectedAnswer.value === currentQuestion.value.correctAnswers[0]) {
      resultMessage.value = '✅ Correct answer!'
      resultMessageClass.value = 'text-green-600';
      resultExplanation.value = currentQuestion.value.explanation;
      resultExplanationClass.value = 'text-black';
    } else {
      resultMessage.value = '❌ Wrong answer. Try again!';
      resultMessageClass.value = 'text-red-600';
    }
  } else if (currentQuestion.value.questionType === 'multiple-choice') {
    const selected = new Set(selectedAnswers.value);
    const correct = new Set(currentQuestion.value.correctAnswers);
    
    // Check if all correct answers are selected and no incorrect answers are selected
    const isCorrect = currentQuestion.value.correctAnswers.every(answer => selected.has(answer)) &&
      selectedAnswers.value.every(answer => correct.has(answer));
    
    if (isCorrect) { + currentQuestion.value.explanation;
      resultMessage.value = '✅ All correct answers selected!'
      resultMessageClass.value = 'text-green-600';
      resultExplanation.value = currentQuestion.value.explanation;
      resultExplanationClass.value = 'text-black';
    } else {
      resultMessage.value = '❌ Not all correct answers were selected. Try again!';
      resultMessageClass.value = 'text-red-600';
    }
  }
};

const nextQuestion = () => {
  showResult.value = false;
  selectedAnswer.value = '';
  selectedAnswers.value = [];
  resultMessage.value = '';
  resultExplanation.value = '';
  currentIndex.value = (currentIndex.value + 1) % questions.value.length;
  currentQuestion.value = questions.value[currentIndex.value];
};
</script>
