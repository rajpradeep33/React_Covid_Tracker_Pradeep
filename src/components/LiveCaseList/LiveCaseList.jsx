import React, { useEffect, useState, memo, useMemo } from 'react';
import numeral from 'numeral';
import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import DialogForStateData from '../DialogForStateData/DialogForStateData';
import './LiveCaseList.scss';

function LiveCaseList({ countriesWithData }) {

    const [filtterdCountries, setFiltterdCountries] = useState([]);
    const [filteredInput, setFilteredInput] = useState("");
    const [country, setCountry] = useState("");
    const [showDialog, setShowDialog] = useState(false);

    const stateDataDialog = useMemo(() => (
        <DialogForStateData
            country={country}
            showDialog={showDialog}
            onClose={() => setShowDialog(false)}
        />
    ), [country, showDialog])

    useEffect(() => {
        if (filteredInput) {
            const filtterdData = countriesWithData.filter(
                data => data.country.toLowerCase().includes(filteredInput.toLowerCase())
            );
            setFiltterdCountries(filtterdData);
        } else {
            setFiltterdCountries(countriesWithData);
        }
    }, [filteredInput, countriesWithData])

    const handleChange = ({ target: { value } }) => setFilteredInput(value);

    return (
        <div className="liveCaselist">
            <h3 className="liveCaselist__title">LIVE CASES</h3>
            <TextField
                label="Search by country"
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start"><SearchIcon /></InputAdornment>
                    )
                }}
                variant="outlined"
            />
            <div className="liveCaselist__body">
                {
                    filtterdCountries?.length > 0 ? (
                        filtterdCountries.map(({ country, cases }, index) => (
                            <div className="liveCaseList__row" key={index}>
                                <div className="liveCaseList__country">
                                    <span>{country}</span>
                                    {
                                        country.toLowerCase() === "india" && (
                                            <small onClick={
                                                () => {
                                                    setCountry(country);
                                                    setShowDialog(!showDialog);
                                                }
                                            }>(statewise)</small>
                                        )
                                    }

                                </div>
                                <div className="liveCaseList__totalcase">
                                    <strong>{numeral(cases).format("0,0")}</strong>
                                </div>
                            </div>
                        ))
                    ) : (
                            <div className="liveCaselist__loading">
                                {filteredInput ? 'No data found.' : 'Loading ...'}
                            </div>
                        )
                }
            </div>
            {stateDataDialog}
        </div >
    );
}

export default memo(LiveCaseList, (prevProps, nextProps) => {
    return prevProps.countriesWithData.length === nextProps.countriesWithData.length
});
