import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function DropdownWithSearchInput({
    dropdownData,
    onSelected,
    selectedValue,
    placeholder = ""
}) {
    const [inputValue, setInputValue] = useState('');
    const [selectedOption, setSelectedOption] = useState(selectedValue);

    return (
        <Autocomplete
            className="dorpdown__typeahead"
            options={dropdownData}
            getOptionLabel={option => option.name}
            inputValue={inputValue}
            onInputChange={
                (event, value) => setInputValue(value)
            }
            onChange={
                (event, selected) => {
                    setSelectedOption(selected);
                    onSelected(selected);
                }
            }
            style={{ width: "200px" }}
            openOnFocus={true}
            blurOnSelect={true}
            value={selectedOption}
            renderInput={params => <TextField  {...params} variant="outlined" label={placeholder} />}
        />
    )
}

export default DropdownWithSearchInput;

