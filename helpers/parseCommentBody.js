const moment = require('moment');
module.exports = (body) => {
    const parts = body.split('\n\n').map((part) => part.trim());
    const parsed = {};
    parts.forEach((part) => {
        if(part.toLowerCase().startsWith('goals')) {
            const goals = part.match(/Goals:?\s*(.+)/i)[1].split(',').map((item) => item.trim());
            parsed.goals = goals;
        } else if(part.toLowerCase().startsWith('timeframe')) {
            const timeframe = part.split(' ')[1];
            const isBefore2019 = moment().isBefore(moment('2019-01-01', 'YYYY-MM-DD'));
            let dateOfNextUpdate;
            if(timeframe === 'monthly') {
                dateOfNextUpdate = isBefore2019 ? moment('2019-02-01', 'YYYY-MM-DD') : moment().startOf('month').add(1, 'month');
            } else if(timeframe === 'quarterly') {
                dateOfNextUpdate = isBefore2019 ? moment('2019-04-01', 'YYYY-MM-DD') : moment().startOf('quarter').add(3, 'month');
            } else if(timeframe === 'bi-annually') {
                dateOfNextUpdate = isBefore2019 ? 
                    moment('2019-06-01', 'YYYY-MM-DD') : 
                    moment().isBefore(moment('2019-06-01', 'YYYY-MM-DD')) ? moment('2019-06-01', 'YYYY-MM-DD') : moment('2020-01-01', 'YYYY-MM-DD');
            } else if(timeframe === 'annually') {
                dateOfNextUpdate = moment('2020-01-01', 'YYYY-MM-DD');
            }
            parsed.dateOfNextUpdate = dateOfNextUpdate.format('YYYY-MM-DD');
        }
    });
    return parsed;
}