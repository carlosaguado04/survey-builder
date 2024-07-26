<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let questionType = '';
	let questionName = '';
	let questionLabel = '';
	let questionRequired = false;
	let nameError = '';
	let hasRelevancy = false;
	let relevantQuestion = '';
	let isValid = false;

	export let surveyQuestions = [];
	export let componentRoot;

	$: {
		if (questionType && questionName && questionLabel) {
			updateQuestion();
		}
	}

	$: {
		isValid = isValidQuestion();
	}

	const questionTypes = [
		'integer',
		'decimal',
		'time',
		'dateTime',
		'text',
		'select_one',
		'select_one_from_file',
		'select_multiple',
		'date',
		'image',
		'note',
		'calculate',
		'rank',
		'range',
		'geopoint',
		'barcode',
		'begin_group',
		'end_group'
	];

	function handleTypeChange() {
		if (questionType === 'end_group') {
			isValid = true;
		} else {
			isValid = isValidQuestion();
		}
		updateQuestion();
	}

	function handleNameInput() {
		questionName = questionName.replace(/[^a-zA-Z0-9_]/g, '');

		if (questionName.length > 0) {
			nameError = '';
			isValid = isValidQuestion();
			updateQuestion();
		} else {
			nameError = 'Name cannot be empty';
			isValid = false;
		}
	}

	function handleLabelInput() {
		isValid = isValidQuestion();
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
			required: questionRequired,
			relevant: hasRelevancy ? relevantQuestion : ''
		});
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter' && isValidQuestion()) {
			event.preventDefault(); // Prevent form submission if inside a form
			handleDone();
		}
	}

	function isValidQuestion() {
		if (questionType === 'end_group') return true;
		if (!questionType || !questionName || !questionLabel) return false;
		return !(hasRelevancy && !relevantQuestion);
	}

	function handleDone() {
		if (questionType === 'end_group') {
			dispatch('done', { type: 'end_group' });
		} else {
			dispatch('done', {
				type: questionType,
				name: questionName,
				label: questionLabel,
				required: questionRequired,
				relevant: hasRelevancy ? `\${${relevantQuestion}} = ''` : ''
			});
		}
		clearFields();
	}

	function clearFields() {
		questionType = '';
		questionName = '';
		questionLabel = '';
		questionRequired = false;
		hasRelevancy = false;
		relevantQuestion = '';
		nameError = '';
	}
</script>

<div class="flex-col w-5/6" bind:this={componentRoot}>
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
			<p>Is this question required?</p>
			<label>
				<input
					type="radio"
					name="required"
					value={true}
					bind:group={questionRequired}
					on:change={handleRequiredChange}
				/>
				TRUE
			</label>
			<label>
				<input
					type="radio"
					name="required"
					value={false}
					bind:group={questionRequired}
					on:change={handleRequiredChange}
				/>
				FALSE
			</label>
		</div>
		<div>
			<label>
				<input type="checkbox" bind:checked={hasRelevancy} />
				Does this question have relevancy?
			</label>
		</div>
		{#if hasRelevancy}
			<div>
				<label class="label" for="relevantQuestion">Choose a previous question for relevancy:</label
				>
				<select class="select" id="relevantQuestion" bind:value={relevantQuestion}>
					<option value="">Select a question</option>
					{#each surveyQuestions as question}
						{#if question.name}
							<option value={question.name}>{question.label}</option>
						{/if}
					{/each}
				</select>
			</div>
		{/if}
	{/if}

	<div class="flex w-full my-5 justify-center">
		<button class="btn variant-ghost-success" on:click={handleDone} disabled={!isValid}>
			Done
		</button>
	</div>
</div>
