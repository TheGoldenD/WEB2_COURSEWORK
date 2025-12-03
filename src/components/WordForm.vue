<template>
  <form action="#" @submit.prevent="onSubmit">
     <p v-if="errorsPresent" class="error">Please fill out all fields!</p>
 
     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="germany flag"></i> German
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.german" />
     </div>
 
     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="united kingdom flag"></i> English
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.english" />
     </div>

     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="italy flag"></i> Italian
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.italian" />
     </div>

     <button class="positive ui button">Submit</button>
   </form>
 </template>
 
 <script>
 export default {
   name: 'word-form',
   props: {
     word: {
       type: Object,
       required: false,
       default: () => {
        return {
         german: '',
         english: '',
         italian: ''
        };
       }
    }
   },
   data() {
     return {
       errorsPresent: false
     };
   },
   methods: {
     onSubmit: function() {
       if (this.word.english === '' || this.word.german === '' || this.word.italian === '') {
         this.errorsPresent = true;
       } else {
         this.$emit('createOrUpdate', this.word);
       }
    }
  }
}
</script>
 
 <style scoped>
 .error {
   color: red;
 }
 </style> 