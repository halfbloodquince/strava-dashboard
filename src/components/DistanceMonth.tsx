import { useContext } from "react";
import { DataContext } from "../context/DataContextProvider";
import { getMonth } from "../utils/TimeFunctions";

const [month, monthNumeric] = getMonth();

const getTotalMonthlyDistance = (data: any[], kmToggle: boolean): string => {
  const distances = data.map((data) => data.distance);
  const meters = Math.round(distances.reduce((a, b) => a + b, 0));
  const divisor = kmToggle ? 1000 : 1609.34
  const dist = (meters / divisor).toFixed(2);

  return dist;
};

interface MonthProps {
  data: any[];
}

export default function DistanceMonth({ data }: MonthProps) {
  const {toggle, unitsKey} = useContext(DataContext)
  const [kmToggle] = toggle
  const units = unitsKey

  const dataThisMonth = data.filter(
    (run) => run.start_date.slice(0, 7) == `2023-${monthNumeric}`
  );

  return (
    <div className="widget widget--square">
      <div className="small--widget">
        <div className="small--widget--title">Distance in {month} ({units})</div>
        <div className="small--widget--number">
          <div className="large--number">
            {getTotalMonthlyDistance(dataThisMonth, kmToggle)}
          </div>
        </div>
      </div>
    </div>
  );
}
