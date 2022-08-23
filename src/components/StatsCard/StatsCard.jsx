import React, { Fragment } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './StatsCard.scss';

function StatsCard({ isLoading, active, type, title, cases, total, onClick }) {
    return (
        <Card
            className={`statsCard ${active && 'statsCard--selected'} ${type}`}
            onClick={onClick}>
            <CardContent>
                <Typography color="textSecondary" className="statsCard__title">
                    {title}
                </Typography>
                {
                    isLoading ? (
                        <div className="statsCard__title">Loading ...</div>
                    ) : (
                            <Fragment>
                                <h2 className={`statsCard__cases ${type}`}>{cases}</h2>
                                <Typography color="textSecondary" className="statsCard__total">
                                    {
                                        total ? `${total} Total` : (<small>(Registered - Recovered - Deaths)</small>)
                                    }
                                </Typography>
                            </Fragment>
                        )
                }
            </CardContent>
        </Card>
    )
}

export default StatsCard;
