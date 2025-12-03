<template>
  <!----------------------------------------------- Vocab Test UI ------------------------------------------------------->
  <div>

    <!-- Difficulty Selection -->
    <div v-if="!testStarted" class="ui segment"> <!-- show the ui component when the test is NOT started (! mark)-->
      <h3>Select Difficulty</h3>

      <div class="ui buttons">
        <button  
          v-for="diff in difficulties" 
          :key="diff.level"
          class="ui button"
          :class="{ [diff.color]: selectedDifficulty === diff.level }"
          @click="selectedDifficulty = diff.level"
        >
          {{ diff.label }}       <!-- show the diff options -->
        </button>
      </div>

      <!-- Question Count -->           <!--drop down list to choose number of question-->
      <div class="mt-2">
        <h3>Number of Questions</h3>
        <select class="ui dropdown" v-model.number="questionAmount">
          <option v-for="n in [5,10,15,20]" :key="n" :value="n">
            {{ n }} Questions
          </option>
        </select>
      </div>

      <!-- Start Test -->         <!--button to start the test-->
      <div class="mt-2" v-if="selectedDifficulty">
        <button class="ui primary button" @click="startTest">Start Test</button>
      </div>
    </div>

    <!-- Test Running -->
    <div v-else-if="!testEnded && currentQuestion">

      <div class="ui top right attached label">
        Time Left: {{ timeLeft }}s
        <div>Question: {{ currentIndex + 1 }} / {{ questionAmount }}</div>
        <div>Score: {{ score }} / {{ questionAmount }}</div>
      </div>

      <div class="ui segment">
        <h3>
          {{ fromLangLabel }}:
          <strong>{{ currentQuestion.question }}</strong>
        </h3>

        <div class="ui input">
          <input
            type="text"
            v-model="userAnswer" 
            @keyup.enter="checkAnswer"
            :placeholder="`Enter ${toLangLabel} translation`"
          />
        </div>

        <button class="ui primary button mt-1" @click="checkAnswer">Submit</button>
  <!-- show feedback using ternary operator, positive return green color, negative return red color-->
        <div
          v-if="showFeedback"
          :class="['ui message', isCorrect ? 'positive' : 'negative']"    
        >
          {{ feedbackMessage }}
          <div>Score: {{ score }} / {{ questionAmount }}</div>
        </div>
      </div>
    </div>

    <!-- Completed -->
    <div v-else class="ui message positive">
      <h3>Test Completed</h3>
      <p>Your Score: {{ score }} / {{ questionAmount }}</p>
      <button class="ui button" @click="reset">Try Again</button>
    </div>

  </div>
</template>

<script>
//Start of the script ------------------------------------------------------------------------------------------------------------------------
import { api } from "@/helpers/helpers";

const LANG_LABELS = {       //basically a dictionary
  english: "English",
  german: "German",
  italian: "Italian",
};

const LANGUAGES = Object.keys(LANG_LABELS);

function shuffle(arr) {      //for shufflinig the question order
  return arr
    .map((x) => ({ sort: Math.random(), value: x }))  //random get a value between 0 and 1
    .sort((a, b) => a.sort - b.sort)  // sort based on random value
    .map((x) => x.value);  // return the value
}

function generateCombinations(word) {
  let list = [];

  // function to create language combinations (for mor variety)
  for (let from of LANGUAGES) {    //go through all languages and mark as from
    for (let to of LANGUAGES) {    //go through all languages and mark as to
      if (from !== to && word[from] && word[to]) {   // check if from and to are diff langs and if the two both exists
        list.push({       // create a list with items below
          question: word[from],
          correctAnswer: word[to],
          fromLang: from,
          toLang: to,
        });
      }
    }
  }

  return shuffle(list);   // shuffle language question order
}

export default {     //define component for usage
  name: "VocabTest",

  data() {  //default data that can be change
    return {
      words: [],
      questions: [],
      currentIndex: 0,
      userAnswer: "",
      score: 0,

      // UI state
      selectedDifficulty: null,
      questionAmount: 5,
      testStarted: false,
      testEnded: false,

      // Timer
      timer: null,
      timeLeft: 0,
      showFeedback: false,
      isCorrect: false,
      expectedAnswer: "",
    };
  },
//computed data---------------------------------------------------------------------------------------------
  computed: {
    difficulties() {
      return [  //generate button, color and time base on difficulty
        { level: "easy", label: "Easy (30s)", time: 30, color: "green" },
        { level: "normal", label: "Normal (20s)", time: 20, color: "yellow" },
        { level: "hard", label: "Hard (10s)", time: 10, color: "red" },
      ];
    },

    selectedTime() {   //set time for each question 
      return this.difficulties.find((d) => d.level === this.selectedDifficulty)
        ?.time;
    },

    currentQuestion() { //display question
      return this.questions[this.currentIndex];
    },

    fromLangLabel() {
      return LANG_LABELS[this.currentQuestion?.fromLang] || "";
    },

    toLangLabel() {
      return LANG_LABELS[this.currentQuestion?.toLang] || "";
    },

    feedbackMessage() {
      return this.isCorrect
        ? "Correct! +1 point"
        : `Wrong! Correct answer: ${this.expectedAnswer}`;
    },
  },
//methods----------------------------------------------------------------------------------------------------------
  methods: {
    async startTest() {
      this.testStarted = true;   // Mark test as started

      this.timeLeft = this.selectedTime;   //change time left based on selected difficulty
      await this.loadWords();          //wait for words to load, await is need or else buildQuest can run before words are loaded -> no questions
      this.buildQuestions();    //generate the questions
      this.startTimer();        //self explanatory
    },

    async loadWords() {          //load words from the api
      try {
        this.words = await api.getWords();     //getWords func from the helpers
      } catch (err) {    //handle error 
        this.$flashMessage.error({
          message: "Failed to load words",
          time: 2500,
        });
      }
    },

    buildQuestions() {             //build the questions for the test
      const pool = shuffle([...this.words]);  //shuffle the words to get random order
      const output = [];  //hold the generated questions

      let index = 0;  //index to track position in pool      
      while (output.length < this.questionAmount) {   //generate question until output reach question amount
        let word = pool[index % pool.length];   //pick word from pool, use loop to avoid running out of words
        output.push(...generateCombinations(word));   //generate questions from the word and add to output, call generateCombinations func to get diff lang combinations  
        index++;  //move to next word in pool
      }

      this.questions = shuffle(output).slice(0, this.questionAmount);  //shuffle the output and slice to get only the amount of questions needed
    },

    checkAnswer() {          //check if the answer is correct
      if (!this.currentQuestion) return;  // if no current question 

      clearInterval(this.timer);   //stop the timer when showing feedback

      const answer = this.userAnswer.trim().toLowerCase();        // trim to remove spaces and lower case so it more forgiving
      const expected = this.currentQuestion.correctAnswer.toLowerCase();  // same as above but for correct answer

      this.expectedAnswer = this.currentQuestion.correctAnswer; // store correct answer to show in feedback
      this.isCorrect = answer === expected;    //if user answer is correct true else false, isCorr is used to show feedback color
      if (this.isCorrect) this.score++;

      this.showFeedback = true;

      setTimeout(() => {
        this.showFeedback = false;
        this.userAnswer = "";
        this.currentIndex++;

        if (this.currentIndex >= this.questionAmount) {
          this.testEnded = true;
        } else {
          this.startTimer();
        }
      }, 900);
    },

    startTimer() {
      this.timeLeft = this.selectedTime; // reset time left for new question

      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {  // countdown
          this.timeLeft--;
        } else {
          clearInterval(this.timer);  //stop timer
          this.checkAnswer(); // auto check answer when time is up or when submit is clicked
        }
      }, 1000);
    },

    reset() {
      clearInterval(this.timer);

      Object.assign(this.$data, this.$options.data());
    },
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.mt-1 {
  margin-top: 10px;
}
.mt-2 {
  margin-top: 20px;
}
</style>
