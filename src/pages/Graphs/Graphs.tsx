import LineGraph from '../../components/LineGraph'
import "./Graphs.css"
import { useContext, useEffect } from "react"
import { DataContext } from "../../context/DataContextProvider"
import demoData from "../../assets/data.json"
import { BestEfforts } from '../../types/Types'

export default function Graphs() {
  const { stravaDataKey, activeKey, dataIsLoadedKey } = useContext(DataContext)
  const [data] = stravaDataKey
  const [, setActive] = activeKey
  const [dataIsLoaded] = dataIsLoadedKey

  useEffect(() => {
    setActive("Graphs")
  }, [])

  const getTenKmRuns = (data: BestEfforts[]) => {

    const runData = data.filter(data => data.best_efforts.length > 6).map((data) => ({ name: new Date(data.start_date), ["ten"]: data.best_efforts[6]?.moving_time }))
    return runData.length
  }

  const tenKm = getTenKmRuns(data)

  return (
    <div className="Graphs">
      <div className='five--graph'>
          <LineGraph data={dataIsLoaded ? data : demoData} distance="one" position={2} minmax={20} label={"1km"}/>
      </div>
      <div className='five--graph'>
          <LineGraph data={dataIsLoaded ? data : demoData} distance="five" position={5} minmax={100} label={"5km"}/>
      </div>

      {tenKm > 1 &&      
      <div className='five--graph'>
          <LineGraph data={dataIsLoaded ? data : demoData} distance="ten" position={6} minmax={100} label={"10km"}/>
      </div>
      }
    </div>
  )
}
