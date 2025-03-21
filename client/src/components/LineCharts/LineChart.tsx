import { values } from 'lodash';
import { useContext } from 'react';

import { useMeasure } from '@uidotdev/usehooks';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import {
    DomainPaddingPropType,
    DomainTuple,
    ForAxes,
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryScatter,
    VictoryTooltip,
    VictoryVoronoiContainer,
} from 'victory';
import { COLORS, convertDate, DAY_MONTH_LONG_FORMAT, TIME_FORMAT } from '../../constants';
import { useChartThemeState } from '../../routes/ChartThemeProvider';
import { SummaryContext } from '../../SummaryContext';
import { formatDurationInternal } from '../../utils';
import { BlackBox } from '../BlackBox';
import { BAR_WIDTH } from '../Timeline/timeline.constants';
import { dateToDayLabel, formatToHours } from './LineChart.util';

const scale: { x: 'time'; y: 'linear' } = { x: 'time', y: 'linear' };
const padding = { left: 25, top: 20, bottom: 30, right: 10 };
const domainPadding: DomainPaddingPropType = { y: 0, x: [BAR_WIDTH, 0] };

const labelComponent = (theme) => (
    <VictoryTooltip
        style={theme.tooltip.style}
        cornerRadius={theme.tooltip.cornerRadius}
        pointerLength={theme.tooltip.pointerLength}
        flyoutStyle={theme.tooltip.flyoutStyle}
        renderInPortal
        horizontal={false}
    />
);

const formatToTime = (d) => convertDate(d).toFormat(TIME_FORMAT);
const formatToLong = (d) => convertDate(d).toFormat(DAY_MONTH_LONG_FORMAT);

const dateToMinutes = (useStartDate) => (d) => {
    const m = convertDate(useStartDate ? d.beginDate : d.endDate);
    const hours = m.hour + m.minute / 60;

    return hours / 24;
};

const ScatterPoint = ({ x = 0, y = 0, showMoon = false, showSun = false }) => {
    if (showMoon) {
        return <IoMdMoon fontSize="20px" x={x - 10} y={y - 10} />;
    }
    if (showSun) {
        return <IoMdSunny fontSize="20px" x={x - 10} y={y - 10} />;
    }
    return null;
};

const getXAxisDay = (d) => convertDate(d.beginDate).startOf('day').valueOf();

export const LineChart = () => {
    const { chartTheme } = useChartThemeState();
    const [ref, { width }] = useMeasure();
    const { onlineTimesSummary, selectedDate } = useContext(SummaryContext);

    const onlineTimesValues = values(onlineTimesSummary);

    const daysInMonth = selectedDate?.daysInMonth;

    const maxOnline = Math.max(...onlineTimesValues.map((d) => d.online));

    const domain: ForAxes<DomainTuple> = {
        x: [selectedDate.startOf('month').toJSDate(), selectedDate.endOf('month').toJSDate()],
        y: [0, 1],
    };

    const axisStyle = {
        grid: { strokeWidth: 0 },
        ticks: { stroke: 'gray', size: 5 },
    };

    const isNarrow = width ? width < 1400 : false;

    return (
        <div ref={ref}>
            <BlackBox position="absolute" width={(width ?? 0) - 34} height={770} right={0} mr="25px" />
            <VictoryChart
                theme={chartTheme}
                scale={scale}
                domain={domain}
                width={width ?? 0}
                height={800}
                padding={padding}
                domainPadding={domainPadding}
                containerComponent={
                    <VictoryVoronoiContainer
                        voronoiDimension="x"
                        responsive={false}
                        labelComponent={labelComponent(chartTheme)}
                        labels={({ datum }) => {
                            const { childName, beginDate, endDate, online } = datum;
                            if (childName === 'beginDate') {
                                return `Start time: ${formatToTime(beginDate)}`;
                            }
                            if (childName === 'endDate') {
                                return `End time: ${formatToTime(endDate)}`;
                            }
                            if (childName === 'online') {
                                return `${formatToLong(datum.beginDate)}\r\nWorked: ${formatDurationInternal(online)}`;
                            }
                            return '';
                        }}
                    />
                }
            >
                <VictoryAxis orientation="left" tickFormat={formatToHours(maxOnline)} dependentAxis />
                <VictoryAxis
                    orientation="bottom"
                    name="time-axis"
                    scale="linear"
                    tickCount={daysInMonth}
                    tickFormat={dateToDayLabel(isNarrow)}
                    style={axisStyle}
                    offsetY={20}
                />

                <VictoryBar
                    name="online"
                    x={getXAxisDay}
                    y={(d) => d.online / maxOnline}
                    barWidth={BAR_WIDTH}
                    style={{ data: { fill: COLORS.green } }}
                    data={onlineTimesValues}
                />
                <VictoryScatter
                    name="beginDate"
                    data={onlineTimesValues}
                    x={getXAxisDay}
                    y={dateToMinutes(true)}
                    dataComponent={<ScatterPoint showSun />}
                />
                <VictoryScatter
                    name="endDate"
                    data={onlineTimesValues}
                    x={getXAxisDay}
                    y={dateToMinutes(false)}
                    dataComponent={<ScatterPoint showMoon />}
                />
            </VictoryChart>
        </div>
    );
};
