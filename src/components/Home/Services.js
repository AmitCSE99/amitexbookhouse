import classes from './Services.module.css';
import image1 from '../../assets/offer-image1.jpg';
import image2 from '../../assets/offer-image2.jpg';
import image3 from '../../assets/offer-image3.jpg';
const Services=()=>{
    return <section className={classes.services}>
        <h2>Our Services</h2>
        <div className={classes.imagesContainer}>
            <div className={classes.imageContainer}>
                <img src={image1}></img>
                <p>We offer high discounts on the books which makes makes for a really affordable price!</p>
            </div>
            <div className={classes.imageContainer}>
                <img src={image2}></img>
                <p>Fast and Easy delivery service, FREE OF COST!!</p>
            </div>
            <div className={classes.imageContainer}>
                <img src={image3}></img>
                <p>We offer CASH ON DELIVERY and easy returns if returned within 30 days!</p>
            </div>
            
        </div>
    </section>
}
export default Services;