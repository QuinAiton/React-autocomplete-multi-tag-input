import { useState } from 'react';

export function AutocompleteTagInput({ suggestionsArray, state, setState, checkEmail }) {
	const regex = { email: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/ };
	const [autoCompleteState, setAutoCompleteState] = useState({
		activeSuggestion: 0,
		filteredSuggestions: [],
		showSuggestions: false,
		userInput: '',
	});
	const [validationMessage, setValidationMessage] = useState('');
	const { activeSuggestion, filteredSuggestions, showSuggestions, userInput } = autoCompleteState;
	let suggestionsListComponent;

	const itemExists = (input, arr) => {
		return arr.includes(input);
	};

	const onChangeHandler = (event) => {
		setValidationMessage('');
		const input = event.target.value;
		const filteredSuggestions = suggestionsArray.filter(
			(suggestion) => suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1,
		);
		setAutoCompleteState((prev) => ({
			activeSuggestion: 0,
			filteredSuggestions,
			showSuggestions: true,
			userInput: input,
		}));
	};

	const onSelectHandler = (event) => {
		const innerText = event.target.innerText;
		const selectedItem = filteredSuggestions[activeSuggestion];
		setAutoCompleteState((prev) => ({
			activeSuggestion: 0,
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: innerText,
		}));
		setState(!itemExists(selectedItem, state) ? [...state, selectedItem] : state);
	};

	const onDeleteHandler = (index) => {
		let updatedArr = state.filter((item, itemIndex) => itemIndex !== index);

		setState([...updatedArr]);
	};

	const onKeyDownHandler = (event) => {
		const keyCode = event.keyCode;
		if (keyCode === 13) {
			const selectedItem = filteredSuggestions[activeSuggestion];
			let updatedArr;
			if (selectedItem) {
				updatedArr = !itemExists(selectedItem, state) ? [...state, selectedItem] : state;
				setState([...updatedArr]);
			} else {
				let newValue = event.target.value;
				updatedArr = !itemExists(newValue, state) ? [...state, newValue] : state;
				if (checkEmail) {
					const isValidEmail = regex.email.test(newValue);
					isValidEmail ? setState([...updatedArr]) : setValidationMessage('Please enter a valid email');
				} else {
					setState([...updatedArr]);
				}
			}
			setAutoCompleteState((prev) => ({
				...prev,
				activeSuggestion: 0,
				showSuggestions: false,
				userInput: '',
			}));
		} else if (keyCode === 38) {
			if (activeSuggestion === 0) {
				return;
			}
			setAutoCompleteState((prev) => ({
				...prev,
				activeSuggestion: activeSuggestion - 1,
			}));
		} else if (keyCode === 40) {
			if (activeSuggestion - 1 === filteredSuggestions.length) {
				return;
			}
			setAutoCompleteState((prev) => ({
				...prev,
				activeSuggestion: activeSuggestion + 1,
			}));
		}
	};

	if (showSuggestions && userInput) {
		if (filteredSuggestions.length) {
			suggestionsListComponent = (
				<ul className=" border-2 rounded-md mt-0 max-h-[143px] overflow-y-auto ">
					{filteredSuggestions.map((suggestion, index) => {
						let className;
						// Flag the active suggestion with a className
						if (index === activeSuggestion) {
							className = ' bg-customSkyBlue text-white cursor-pointer font-medium py-1 rounded-sm';
						}
						return (
							<li
								className={className + ' px-2 hover:bg-customSkyBlue hover:cursor-pointer hover:text-white'}
								key={suggestion}
								onClick={onSelectHandler}
							>
								{suggestion}
							</li>
						);
					})}
				</ul>
			);
		} else {
			suggestionsListComponent = (
				<div className=" text-customLightGray">
					<em>No suggestions available.</em>
				</div>
			);
		}
	}

	const inputTags = state.map((item, index) => (
		<div key={item} className=" px-4 py-1 border rounded-md bg-gray-200 flex items-end gap-2">
			{item}
			<button onClick={() => onDeleteHandler(index)} class="opacity-90" type="button">
				<span class="sr-only"> Close </span>
				<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 
4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	));

	return (
		<>
			<span className="text-red-500 relative bottom-1 ">{validationMessage}</span>
			<div className="flex items-end py-1 border w-full  gap-5">
				<div className="w-full px-2 ">
					<span className="flex flex-wrap gap-1">{inputTags}</span>
					<input
						className=" outline-none border-0 w-full"
						data-role="taginput"
						data-tag-trigger="Space"
						type="text"
						onChange={onChangeHandler}
						onKeyDown={onKeyDownHandler}
						value={userInput}
					/>
				</div>
			</div>
			{suggestionsListComponent}
		</>
	);
}

