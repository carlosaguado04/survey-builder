<script>
  import { onMount } from 'svelte';
  import * as XLSX from 'xlsx';
  import QuestionBuilder from '../components/QuestionBuilder.svelte';

  let surveyQuestions = [];
  let addError = '';
  let questionBuilder;

  onMount(() => {
    questionBuilder = document.querySelector('svelte-component-wrapper').shadowRoot.querySelector('div');
  });

 function handleQuestionDone(event) {
    const { type, name, label, required } = event.detail;

    if (type === 'end_group') {
      surveyQuestions = [...surveyQuestions, { type: 'end_group' }];
    } else if (type && name && label) {
      // Check if the name is unique
      if (surveyQuestions.some(q => q.name === name)) {
        addError = 'Question name must be unique';
        return;
      }

      surveyQuestions = [...surveyQuestions, { type, name, label, required }];
      addError = '';

      // Reset the QuestionBuilder
      if (questionBuilder && typeof questionBuilder.reset === 'function') {
        questionBuilder.reset();
      }
    } else {
      addError = 'Type, name, and label are all required';
    }
  }

  function downloadExcel() {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create and add the "survey" sheet
    const surveyWs = XLSX.utils.json_to_sheet(surveyQuestions);
    XLSX.utils.book_append_sheet(wb, surveyWs, "survey");

    // Create and add the "choices" sheet
    const choicesData = [
      { list_name: 'yn', name: 'yes', label: 'Yes' },
      { list_name: 'yn', name: 'no', label: 'No' },
      { list_name: 'gender', name: 'male', label: 'Male' },
      { list_name: 'gender', name: 'female', label: 'Female' },
      { list_name: 'gender', name: 'NotSet', label: 'NotSet' }
    ];
    const choicesWs = XLSX.utils.json_to_sheet(choicesData);
    XLSX.utils.book_append_sheet(wb, choicesWs, "choices");

    // Create and add the "settings" sheet
    const settingsData = [
      { form_title: 'My Survey', form_id: 'my_survey_2023', version: '2023-07-26', default_language: 'english' }
    ];
    const settingsWs = XLSX.utils.json_to_sheet(settingsData);
    XLSX.utils.book_append_sheet(wb, settingsWs, "settings");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "survey.xlsx");
  }

  function resetSurvey() {
    // Clear all survey questions
    surveyQuestions = [];
    
    // Clear any error messages
    addError = '';
    
    // Reset the QuestionBuilder
    if (questionBuilder && typeof questionBuilder.reset === 'function') {
      questionBuilder.reset();
    }
  }

</script>

<main class="flex items-center flex-col">
  <h1 class="text-2xl">Survey Builder</h1>
  
  <QuestionBuilder 
    on:done={handleQuestionDone}
    bind:this={questionBuilder}
  />

  {#if addError}
    <p class="error">{addError}</p>
  {/if}

  <h2 class="my-5">Preview:</h2>
  <table class="table table-hover w-5/6">
    <thead>
      <tr>
        <th>Type</th>
        <th>Name</th>
        <th>Label</th>
        <th>Required</th>
      </tr>
    </thead>
    <tbody>
      {#each surveyQuestions as question}
        <tr>
          <td>{question.type}</td>
          <td>{question.name}</td>
          <td>{question.label}</td>
          <td>{question.required ? 'TRUE' : 'FALSE'}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="my-5">
    <button class="btn variant-filled-success" on:click={downloadExcel} disabled={surveyQuestions.length === 0}>
      Download Excel
    </button>
    <button class="btn variant-filled-error" on:click={resetSurvey}>
      Reset Survey
    </button>
  </div>
</main>

