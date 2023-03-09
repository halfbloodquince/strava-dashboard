import "./About.css";
import {
  handleLogin,
  clientId,
  scope,
  redirectUrl,
} from "../../utils/LoginFunctions";
import {
  dashOne,
  dashTwo,
  dashThree,
  dashFour,
  aboutStrava,
  dashTable,
  dashMap,
  dashGraph,
} from "../../assets/about";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  framerImageVariants,
  framerTextVariants,
  secondBlockChildren,
  secondBlockVariants,
} from "./utils/FramerVaraints";
import { useShowAndHideAnimation } from "../../utils/customHooks";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContextProvider";
import { Image } from "../../types/Types";



const About = () => {
  const {activeKey} = useContext(DataContext);
  const [, setActive] = activeKey;
  const [listArray, setListArray] = useState([
    {key: 1, id: "image--off", text: "Your total number of runs this year." },
    {key: 2, id: "image--off", text: "Your total distance for the current year." },
    {key: 3, id: "image--off", text: "Your total distance for the current month." },
    {key: 4, id: "image--off", text: "Your last recorded run." },
  ])
  const { ref: blockOne, inView: blockOneInView } = useInView({
    threshold: 0.2,
  });
  const { ref: blockTwo, inView: blockTwoInView } = useInView({
    threshold: 0.2,
  });

  const { ref: blockThree, inView: blockThreeInView } = useInView({
    threshold: 0.3,
  });
  const { ref: blockFour, inView: blockFourInView } = useInView({
    threshold: 0.3,
  });
  const { ref: blockFive, inView: blockFiveInView } = useInView({
    threshold: 0.3,
  });


  useEffect(() => {
    setActive("About")
  }, [])

  const handleHoverOn = (listIndex:number) => {
    const newArray = [...listArray]
    newArray[listIndex].id = "image--on"
    setListArray(newArray)
  }

  const handleHoverOff = (listIndex:number) => {
    const newArray = [...listArray]
    newArray[listIndex].id = "image--off"
    setListArray(newArray)
  }

  const animation = useAnimation();
  const textAnimation = useAnimation();
  const animationTwo = useAnimation();
  const textAnimationTwo = useAnimation();
  const animationThree = useAnimation();
  const textAnimationThree = useAnimation();
  const animationFour = useAnimation();
  const textAnimationFour = useAnimation();
  const animationFive = useAnimation();
  const textAnimationFive = useAnimation();

  useShowAndHideAnimation(blockOneInView, animation, textAnimation);
  useShowAndHideAnimation(blockTwoInView, animationTwo, textAnimationTwo);
  useShowAndHideAnimation(blockThreeInView, animationThree, textAnimationThree);
  useShowAndHideAnimation(blockFourInView, animationFour, textAnimationFour);
  useShowAndHideAnimation(blockFiveInView, animationFive, textAnimationFive);

  return (
    <div className="About">
      <div className="about--opening">
        <h1 className="about--title">Your Personal Training Partner</h1>
        <div className="title--description">
          The Strava Dashboard is a web application to help visualize all of
          your running data in one place. Get access to information they store
          but don't share with you on their application. For example, your
          fastest times over 1km and 5km for each run.
        </div>

        <h1 className="about--sub--title">How it works</h1>
      </div>
      <div className="timeline">
        <div className="timeline--element">
          <div className="timeline--first--line--container">
            <div className="timeline--first--line"></div>
          </div>
        </div>

        <div className="circle">1km</div>
        <div className="timeline--element">
          <div className="timeline--line--container">
            <div className="timeline--line"></div>
          </div>
          <div ref={blockOne} className="timeline--block">
            <motion.img
              className="strava--timeline--image"
              variants={framerImageVariants}
              initial="visible"
              animate={animation}
              src={aboutStrava}
            />
            <motion.div
              animate={textAnimation}
              variants={framerTextVariants}
              initial="visible"
              className="timeline--text"
            >
              <h2 className="timeline--title">Connect with Strava</h2>
              <p className="timeline--description">
                Access all your running data by logging into Strava. Login to
                Strava via the homepage, or by clicking{" "}
                <span
                  className="about--link"
                  onClick={(e) => handleLogin(clientId, scope, redirectUrl)}
                >
                  Strava
                </span>{" "}
                on the menu. This is done by making an oAuth2 API request to the
                Strava API.
              </p>
            </motion.div>
          </div>
        </div>
        <div className="circle">5km</div>
        <div className="timeline--element">
          <div className="timeline--line--container">
            <div className="timeline--line"></div>
          </div>
          <div className="timeline--block four--image--block" ref={blockTwo}>
            <motion.div
              className="timeline--image--container four--image--block"
              variants={secondBlockVariants}
              initial="hidden"
              animate={animationTwo}
            >
              <motion.img
                variants={secondBlockChildren}
                onHoverStart={(e) => handleHoverOn(Image.ONE)}
                onHoverEnd={(e) => handleHoverOff(Image.ONE)}
                className="timeline--image image--focus"
                src={dashOne}
              />
              <motion.img
                variants={secondBlockChildren}
                onHoverStart={(e) => handleHoverOn(Image.TWO)}
                onHoverEnd={(e) => handleHoverOff(Image.TWO)}
                className="timeline--image image--focus"
                src={dashTwo}
              />
              <motion.img
                variants={secondBlockChildren}
                onHoverStart={(e) => handleHoverOn(Image.THREE)}
                onHoverEnd={(e) => handleHoverOff(Image.THREE)}
                className="timeline--image image--focus"
                src={dashThree}
              />
              <motion.img
                variants={secondBlockChildren}
                onHoverStart={(e) => handleHoverOn(Image.FOUR)}
                onHoverEnd={(e) => handleHoverOff(Image.FOUR)}
                className="timeline--image image--focus"
                src={dashFour}
              />
            </motion.div>
            <motion.div
              className="timeline--text"
              animate={textAnimationTwo}
              variants={framerTextVariants}
            >
              <h2 className="timeline--title">Keep on track</h2>
              <p className="timeline--description">
                Get up-to-date information on your training so far this year.
                Here you can view:
              </p>
              <ul className="timeline--list">
                {listArray.map((item) => (
                  <li key={item.key} id={item.id}>{item.text}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        <div className="circle">10km</div>
        <div className="timeline--element">
          <div className="timeline--line--container">
            <div className="timeline--line"></div>
          </div>
          <div className="timeline--block" ref={blockThree}>
            <motion.img
              className="timeline--image timeline--image--table"
              variants={framerImageVariants}
              initial="visible"
              animate={animationThree}
              src={dashTable}
            />
            <motion.div
              className="timeline--text"
              animate={textAnimationThree}
              variants={framerTextVariants}
              initial="visible"
            >
              <h2 className="timeline--title">Stay on top</h2>
              <p className="timeline--description">
                The table gives a more detailed breakdown of each run can be
                found in the table. Here you can see your fastest times over
                specific distances for each run.
              </p>
            </motion.div>
          </div>
        </div>
        <div className="circle">20km</div>
        <div className="timeline--element">
          <div className="timeline--line--container">
            <div className="timeline--line"></div>
          </div>
          <div ref={blockFour} className="timeline--block">
            <motion.img
              className="timeline--image timeline--image--table"
              variants={framerImageVariants}
              initial="visible"
              animate={animationFour}
              src={dashMap}
            />
            <motion.div
              className="timeline--text"
              animate={textAnimationFour}
              variants={framerTextVariants}
              initial="visible"
            >
              <h2 className="timeline--title">See where you've been</h2>
              <p className="timeline--description">
                The map gives a view of all of your runs, centered on your most
                recent run.
              </p>
            </motion.div>
          </div>
        </div>
        <div className="circle">42km</div>
        <div className="timeline--element">
          <div className="timeline--line--container">
            <div className="timeline--line"></div>
          </div>
          <div ref={blockFive} className="timeline--block">
            <motion.img
              className="timeline--image timeline--image--table"
              variants={framerImageVariants}
              initial="visible"
              animate={animationFive}
              src={dashGraph}
            />
            <motion.div
              className="timeline--text"
              animate={textAnimationFive}
              variants={framerTextVariants}
              initial="visible"
            >
              <h2 className="timeline--title">Get that PB</h2>
              <p className="timeline--description">
                This graph let's you see your progression over time. Strava
                records your fastest time over certain distances, every time you
                run. Good luck chasing that PB!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
