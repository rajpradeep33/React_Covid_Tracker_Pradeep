import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { sortData } from '../../utils';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    }
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textTransform: 'uppercase'
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function TableForStatewiseData({ header, body }) {
    const sortedData = sortData(body, 'cases');
    const classes = useStyles();
    return (
        <TableContainer>
            <Table className={classes.table} aria-label="state-wise data">
                <TableHead>
                    <TableRow>
                        {
                            header.map(cell => (
                                <StyledTableCell key={cell} component={'th'}>{cell}</StyledTableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        sortedData.map(data => (
                            <StyledTableRow key={data.state}>
                                <TableCell>{data.state}</TableCell>
                                <TableCell>
                                    {numeral(data.cases).format("0,0")}
                                </TableCell>
                                <TableCell>
                                    {numeral(data.active).format("0,0")}
                                </TableCell>
                                <TableCell>
                                    {numeral(data.recovered).format("0,0")}
                                </TableCell>
                                <TableCell>
                                    {numeral(data.deaths).format("0,0")}
                                </TableCell>
                            </StyledTableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

TableForStatewiseData.propTypes = {
    header: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.array
};

export default TableForStatewiseData;

