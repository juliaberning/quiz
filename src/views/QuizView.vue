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
                :id="`answer-${index}`"
                type="radio"
                :value="answer"
                v-model="selectedAnswer"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
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
          View Solution
        </button>

        <!-- Result Message -->
        <p v-if="showResult" :class="resultClass" class="mt-3 text-center font-semibold">
          {{ resultMessage }}
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
    text: 'What is Vue.js?',
    answers: ['A JavaScript framework', 'A CSS library', 'A backend language', 'A database'],
    correctAnswer: 'A JavaScript framework'
  },
  {
    text: 'Which directive is used for two-way data binding in Vue?',
    answers: ['v-if', 'v-for', 'v-bind', 'v-model'],
    correctAnswer: 'v-model'
  },
  {
    text: 'Which lifecycle hook is called after the component is mounted?',
    answers: ['beforeCreate', 'created', 'mounted', 'beforeUnmount'],
    correctAnswer: 'mounted'
  }
]);

const currentIndex = ref(0);
const currentQuestion = ref(questions.value[currentIndex.value]);
const selectedAnswer = ref('');
const showResult = ref(false);
const resultMessage = ref('');
const resultClass = ref('');

const checkAnswer = () => {
  showResult.value = true;
  if (selectedAnswer.value === currentQuestion.value.correctAnswer) {
    resultMessage.value = '✅ Correct answer!';
    resultClass.value = 'text-green-600';
  } else {
    resultMessage.value = '❌ Wrong answer. Try again!';
    resultClass.value = 'text-red-600';
  }
};

const nextQuestion = () => {
  showResult.value = false;
  selectedAnswer.value = '';
  currentIndex.value = (currentIndex.value + 1) % questions.value.length;
  currentQuestion.value = questions.value[currentIndex.value];
};
</script>
