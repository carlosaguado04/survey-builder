<script>
	import * as XLSX from 'xlsx';
	import QuestionBuilder from '../components/QuestionBuilder.svelte';

	let surveyQuestions = [];
	let addError = '';
	let questionBuilderRoot;
	let questionBuilder;
	let excelFileName = '';
	let additionalExcelData = {
		calculation: '',
		rr_mapping: '',
		constraint: '',
		'constraint_message::English': '',
		choice_filter: '',
		'hint::English': '',
		appearance: '',
		default: '',
		rr_view: '',
		parameters: '',
		'rr_label::English': ''
	};

	const predeterminedRows = [
		{
			type: 'start',
			name: 'start',
			rr_mapping: 'm.creationDate',
			'rr_label::English': 'Form Filling Start'
		},
		{ type: 'end', name: 'end', rr_mapping: 'm.version', 'rr_label::English': 'Form Filling End' },
		{ type: 'today', name: 'today', rr_view: 'INVISIBLE' },
		{ type: 'deviceid', name: 'deviceid', rr_view: 'INVISIBLE' },
		{ type: 'simserial', name: 'simserial', rr_view: 'INVISIBLE' },
		{ type: 'imei', name: 'imei', rr_view: 'INVISIBLE' },
		{ type: 'phonenumber', name: 'phonenumber', rr_view: 'INVISIBLE' }
	];

	function handleQuestionDone(event) {
		const { type, name, label, required, relevant } = event.detail;

		if (type === 'end_group') {
			surveyQuestions = [...surveyQuestions, { type: 'end_group' }];
		} else if (type && name && label) {
			// Check if the name is unique
			if (surveyQuestions.some((q) => q.name === name)) {
				addError = 'Question name must be unique';
				return;
			}

			surveyQuestions = [...surveyQuestions, { type, name, label, required, relevant }];
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
		const wb = XLSX.utils.book_new();
		const combinedData = [
			...predeterminedRows,
			...surveyQuestions.map((question) => ({
				...question,
				...additionalExcelData
			}))
		];

		const columnOrder = [
			'type',
			'name',
			'label',
			'rr_mapping',
			'required',
			'relevant',
			'calculation',
			'constraint',
			'constraint_message::English',
			'choice_filter',
			'hint::English',
			'appearance',
			'parameters',
			'rr_label::English'
		];

		const orderedData = combinedData.map((row) => {
			const orderedRow = {};
			columnOrder.forEach((col) => {
				orderedRow[col] = row[col] !== undefined ? row[col] : '';
			});
			return orderedRow;
		});

		const surveyWs = XLSX.utils.json_to_sheet(orderedData, { header: columnOrder });
		XLSX.utils.book_append_sheet(wb, surveyWs, 'survey');

		// Create and add the "choices" sheet
		const choicesData = [
			{ list_name: 'yn', name: 'yes', label: 'Yes' },
			{ list_name: 'yn', name: 'no', label: 'No' },
			{ list_name: 'gender', name: 'male', label: 'Male' },
			{ list_name: 'gender', name: 'female', label: 'Female' },
			{ list_name: 'gender', name: 'NotSet', label: 'NotSet' }
		];
		const choicesWs = XLSX.utils.json_to_sheet(choicesData);
		XLSX.utils.book_append_sheet(wb, choicesWs, 'choices');

		// Create and add the "settings" sheet
		const settingsData = [
			{
				form_title: '',
				form_id: '',
				public_key: '',
				submission_url: '',
				default_language: 'English',
				version: '',
				instance_name: '',
				rr_form_type: '',
				rr_matcher_field: '',
				rr_auto_group: ''
			}
		];
		const settingsWs = XLSX.utils.json_to_sheet(settingsData);
		XLSX.utils.book_append_sheet(wb, settingsWs, 'settings');

		// Generate Excel file and trigger download
		XLSX.writeFile(wb, `${excelFileName}.xlsx`);
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
	<h1 class="text-2xl">Form Builder</h1>

	<QuestionBuilder
		on:done={handleQuestionDone}
		bind:componentRoot={questionBuilderRoot}
		{surveyQuestions}
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
				<th>Relevant</th>
			</tr>
		</thead>
		<tbody>
			{#each surveyQuestions as question}
				<tr>
					<td>{question.type}</td>
					<td>{question.name}</td>
					<td>{question.label}</td>
					<td>{question.required ? 'TRUE' : 'FALSE'}</td>
					<td>{question.relevant}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="my-5 flex-col w-2/3 items-center my-20d">
		<label class="label" for="excelFileName">Excel File Name:</label>
		<input
			class="input"
			id="excelFileName"
			bind:value={excelFileName}
			placeholder="Enter file id (all lowercase no spaces and without .xlsx)"
		/>
		<div class="flex w-full justify-center">
			<button
				class="btn variant-soft-primary my-5 mr-1.5"
				on:click={downloadExcel}
				disabled={surveyQuestions.length === 0}
			>
				Download Excel
			</button>
			<button class="btn variant-ghost-error my-5 ml-1.5" on:click={resetSurvey}>
				Reset Survey
			</button>
		</div>
	</div>
</main>
