import { Fragment } from 'react';
import classes from './Welcome.module.css';
import Image from '../../assets/image7.jpg';
import WelcomeSummary from './WelcomeSummary';
import Services from './Services';
const Welcome=()=>{
    return <Fragment>
        <img src={Image} className={classes['main-image']}></img>
        <WelcomeSummary></WelcomeSummary>
        <Services></Services>
    </Fragment>
}
export default Welcome