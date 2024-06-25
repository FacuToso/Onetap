import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const VoteAverage = ({ voteAverage }) => (
  <div className="d-flex align-items-center justify-content-between">
    <CircularProgressbar
      value={voteAverage}
      text={`${voteAverage}%`}
      styles={buildStyles({
        pathColor: 'red',
        textColor: 'white',
        textSize: '30px'
      })}
    />
    <strong className="ms-3">User score</strong>
  </div>
);

export default VoteAverage;