<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let questionType = '';
  let questionName = '';
  let questionLabel = '';
  let questionRequired = false;
  let nameError = '';

  const questionTypes = [
    'integer',
    'text',
    'select_one',
    'select_multiple',
    'date',
    'image',
    'note',
    'begin_group',
    'end_group'
  ];

  function handleTypeChange() {
    if (questionType === 'end_group') {
      handleDone();
    } else {
      updateQuestion();
    }
  }

  function handleNameInput() {
    questionName = questionName.replace(/[^a-zA-Z0-9_]/g, '');
    
    if (questionName.length > 0) {
      nameError = '';
      updateQuestion();
    } else {
      nameError = 'Name cannot be empty';
    }
  }

  function handleLabelInput() {
    updateQuestion();
  }

  function handleRequiredChange() {
    updateQuestion();
  }

  function updateQuestion() {
    dispatch('update', { 
      type: questionType, 
      name: questionName, 
      label: questionLabel,
      required: questionRequired
    });
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && isValidQuestion()) {
      handleDone();
    }
  }

  function handleDoneClick() {
    if (isValidQuestion()) {
      handleDone();
    }
  }

  function isValidQuestion() {
    return questionType === 'end_group' || (questionType && questionName && questionLabel);
  }

  function handleDone() {
    if (questionType === 'end_group') {
      dispatch('done', { type: 'end_group' });
    } else {
      dispatch('done', { 
        type: questionType, 
        name: questionName, 
        label: questionLabel,
        required: questionRequired
      });
    }
    clearFields();
  }

  function clearFields() {
    questionType = '';
    questionName = '';
    questionLabel = '';
    questionRequired = false;
    nameError = '';
  }

  export function reset() {
    clearFields();
  }
</script>

<div class="flex-col w-5/6">
  <label class="label" for="questionType">Select question type:</label>
  <select class="select" id="questionType" bind:value={questionType} on:change={handleTypeChange}>
    <option value="">Choose a type</option>
    {#each questionTypes as type}
      <option value={type}>{type}</option>
    {/each}
  </select>

  {#if questionType && questionType !== 'end_group'}
    <div>
      <label class="label" for="questionName">Enter question name:</label>
      <input
        class="input w-full"
        id="questionName" 
        type="text" 
        bind:value={questionName} 
        on:input={handleNameInput} 
        on:keydown={handleKeyDown}
        placeholder="Enter question name (letters, numbers, and underscores only)"
      />
      {#if nameError}
        <p class="error">{nameError}</p>
      {/if}
    </div>

    <div>
      <label class="label" for="questionLabel">Enter question label:</label>
      <input
        class="input"
        id="questionLabel" 
        type="text" 
        bind:value={questionLabel} 
        on:input={handleLabelInput}
        on:keydown={handleKeyDown}
        placeholder="Enter question label (displayed text)"
      />
    </div>

    <div>
      <label>Is this question required?</label>
      <label>
        <input type="radio" name="required" value={true} bind:group={questionRequired} on:change={handleRequiredChange}>
        TRUE
      </label>
      <label>
        <input type="radio" name="required" value={false} bind:group={questionRequired} on:change={handleRequiredChange}>
        FALSE
      </label>
    </div>
  {/if}

  <div class="flex w-full justify-center">
  <button class="btn variant-filled-success my-5" on:click={handleDoneClick} disabled={!isValidQuestion()}>
    Done
  </button>
</div>
</div>