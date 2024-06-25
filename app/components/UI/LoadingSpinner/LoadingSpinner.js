import classes from './LoadingSpinner.module.css';

const LoadingSpinner = ({ containerClassName, spinnerClassName }) => {
  let containerClassNames = classes.container;
  if (containerClassName) {
    containerClassNames += ` ${containerClassName}`;
  }
  
  let spinnerClassNames = classes.spinner;
  if (spinnerClassName) {
    spinnerClassNames += ` ${spinnerClassName}`;
  }

  return (
    <div className={containerClassNames}>
      <div className={spinnerClassNames} />
    </div>
  )
}

export default LoadingSpinner;
