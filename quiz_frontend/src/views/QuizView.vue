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
      questionType: "single-choice",
      text: "What does the type definition <code>ref&lt;string[]&gt;([])</code> mean in TypeScript?",
      answers: [
        "A reactive reference to an array that can contain any type of values, initialized as an empty array",
        "A reactive reference to an array that can only contain strings, initialized as an empty array",
        "A non-reactive array of strings, initialized as an empty array",
        "A reactive reference to a string, initialized as an empty string"
      ],
      correctAnswers: ["A reactive reference to an array that can only contain strings, initialized as an empty array"],
      explanation: "The type definition <code>ref&lt;string[]&gt;([])</code> means: <ol><li><code>ref</code> creates a reactive reference</li><li><code>string[]</code> specifies that the array can only contain strings</li><li><code>[]</code> initializes it as an empty array</li></ol> This provides type safety by preventing non-string values from being added to the array.",
      tags: ['typescript', 'vue'],
      difficulty: "intermediate"
  },
  {
    questionType: 'single-choice',
    text: 'What is the primary benefit of using <code>defineModel()</code> in Vue 3.4 with <code>&lt;script setup&gt;</code>?',
    answers: [
      'It allows global access to all model values without props.',
      'It replaces the need to define emits manually.',
      'It simplifies the declaration of a prop that works with <code>v-model</code>.',
      'It automatically syncs state between parent and child without any binding.'
    ],
    correctAnswers: ['It simplifies the declaration of a prop that works with <code>v-model</code>.'],
    explanation: '<code>defineModel()</code> streamlines the definition of a prop and an emit event that are commonly used with <code>v-model</code>, removing boilerplate code from child components.',
    tags: ['vue', 'typescript'],
    difficulty: 'easy'
  },
  {
    questionType: 'multiple-choice',
    text: 'Which of the following are true about using <code>defineModel()</code> in Vue 3.4+?',
    answers: [
      'You can type the model value using generics.',
      'It automatically emits <code>update:modelValue</code>.',
      'It can be used multiple times in the same component for multiple v-model bindings.',
      'It replaces the need for <code>defineProps</code> and <code>defineEmits</code> entirely.',
      'It requires you to define an explicit prop named <code>modelValue</code>.'
    ],
    correctAnswers: [
      'You can type the model value using generics.',
      'It automatically emits <code>update:modelValue</code>.',
      'It can be used multiple times in the same component for multiple v-model bindings.'
    ],
    explanation: '<code>defineModel()</code> lets you define model props with types using generics, and it auto-generates the <code>update:modelValue</code> event. It also supports multiple models with named arguments like <code>defineModel("title")</code>.',
    tags: ['vue', 'typescript'],
    difficulty: 'medium'
  },
  {
    questionType: 'single-choice',
    text: 'What does "tree-shaking" mean in modern frontend development?',
    answers: [
      'It’s the process of deleting old Git branches.',
      'It’s a way to reduce memory usage during runtime.',
      'It’s a technique to remove unused code from the final JavaScript bundle.',
      'It’s a method of refreshing the DOM tree after a state update.'
    ],
    correctAnswers: ['It’s a technique to remove unused code from the final JavaScript bundle.'],
    explanation: 'Tree-shaking is a process performed by modern bundlers like Vite, Rollup, or Webpack to eliminate dead (unused) code from your final build. This helps keep your app lightweight and fast by only including the code that is actually used.',
    tags: ['javascript', 'build-tools'],
    difficulty: 'easy'
  },
  {
    questionType: 'multiple-choice',
    text: 'What are benefits of using an object with <code>as const</code> instead of a TypeScript <code>enum</code>?',
    answers: [
      'It avoids runtime code generation in the compiled JavaScript.',
      'It provides full type inference and literal types.',
      'It supports bidirectional mapping like enums.',
      'It helps keep the code tree-shakable.',
      'It allows values to be mutated at runtime.'
    ],
    correctAnswers: [
      'It avoids runtime code generation in the compiled JavaScript.',
      'It provides full type inference and literal types.',
      'It helps keep the code tree-shakable.'
    ],
    explanation: 'Using <code>as const</code> with an object keeps the structure immutable and ensures literal types. Unlike enums, it avoids extra runtime code and is tree-shakable, making it more performant and predictable.',
    tags: ['typescript'],
      difficulty: 'medium'
  },
  {
    questionType: 'single-choice',
    text: 'What is a common issue with using <code>enum</code> in TypeScript?',
    answers: [
    'Enums are not supported in JavaScript, so they cause compile-time errors.',
    'Enums cannot be used as types in TypeScript.',
    'Enums are not tree-shakable and can add unnecessary code to the bundle.',
    'Enums are always immutable by default.'
    ],
    correctAnswers: ['Enums are not tree-shakable and can add unnecessary code to the bundle.'],
    explanation: 'TypeScript <code>enum</code>s are compiled into real JavaScript objects, even if you don’t use them later in your code. This means they are always included in your final build, which can make your JavaScript files bigger than needed. That’s why they are not "tree-shakable", which means the bundler can’t remove unused code.',
    tags: ['typescript', 'javascript'],
    difficulty: 'medium'
    },
    {
    questionType: 'single-choice',
    text: 'What is the purpose of the <code>&lt;VBtn&gt;</code> component in Vuetify?',
    answers: [
      'To create routing links between pages.',
      'To define custom button behavior with native JavaScript.',
      'To provide a styled and accessible button component that follows Material Design.',
      'To handle button click events only.'
    ],
    correctAnswers: ['To provide a styled and accessible button component that follows Material Design.'],
    explanation: '<code>&lt;VBtn&gt;</code> is a Vuetify component used to create buttons that are visually consistent and follow Material Design guidelines. It includes built-in accessibility, theming, and responsiveness — no custom CSS needed.',
    tags: ['vue', 'vuetify', 'ui'],
    difficulty: 'easy'
  },
  {
  questionType: 'multiple-choice',
  text: 'Why might using Vuetify’s <code>&lt;VBtn&gt;</code> component be better than using a regular <code>&lt;button&gt;</code> element?',
  answers: [
    'It comes with built-in styles that match the app’s design system.',
    'It automatically supports themes like dark/light mode.',
    'It makes the button clickable without JavaScript.',
    'It ensures accessibility and proper keyboard interaction.',
    'It prevents double-clicks by default.'
    ],
    correctAnswers: [
      'It comes with built-in styles that match the app’s design system.',
      'It automatically supports themes like dark/light mode.',
      'It ensures accessibility and proper keyboard interaction.'
    ],
    explanation: 'Vuetify’s <code>&lt;VBtn&gt;</code> component is styled according to Material Design and integrates with Vuetify’s theming system. It also includes accessibility features out of the box, such as proper ARIA roles and keyboard navigation.',
    tags: ['vue', 'vuetify', 'ui'],
    difficulty: 'easy'
  },
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
const selectedAnswers = ref<string[]>([]);
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
