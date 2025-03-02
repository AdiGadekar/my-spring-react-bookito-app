import '../../styles/style.css'
export const SpinnerAnimation = () => {
  return(
    <div className="spinner-overlay">
    <div className="spinner"></div>
  </div>
  )
};


export const LocalSpinnerAnimation = () => {
  return(
    <div className="local-spinner-overlay">
    <div className="local-spinner"></div>
  </div>
  )
};


export const PageLoadingSpinnerAnimation = () => {
  return(
    <div className="pageLoading-spinner-overlay">
    <div className="pageLoading-spinner"></div>
  </div>
  )
};