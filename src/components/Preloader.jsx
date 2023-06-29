import {Planets} from 'react-preloaders';
function Preloader() {
  return (
 <Planets
    background="#000000"
    color="#ffffff"
    customLoading={false}
    customBackgroundSpeedInMs={500}
    customFadeOutSpeed={500}
    customSpinner={false}
    customSpinnerColor="#000000"
    customSpinnerClassName="spinner"
    customSpinnerSize={100}
    fadeIn="none"
    fadeOut="none"
    height={100}
    loading={true}
    position="center"

    time={3700}
    />
  );
}

export default Preloader;
