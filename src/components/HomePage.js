import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import FarmsDataService from "../services/farms";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import "./HomePage.css";
import Marquee from "react-fast-marquee";
import { GiPeach, GiShinyApple, GiStrawberry, GiCherry, GiFruitTree, GiHealing } from "react-icons/gi";
import { DiRasberryPi } from "react-icons/di";
import { SiIfood } from "react-icons/si";
import Carousel from 'react-bootstrap/Carousel';

const HomePage = () => {

    const [farms, setFarms] = useState([]);

    const retrieveFarms = useCallback(() => {
        FarmsDataService.getAll(0)
            .then(response => {
                setFarms(response.data.farms);
            })
            .catch(e => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        retrieveFarms();
    }, [retrieveFarms]);

    return (
        <div className="App">
            {/* Introduction */}
            <div className="web-intro">
                <Carousel>
                    <Carousel.Item>
                        <Image className="intro-img" src={`${process.env.PUBLIC_URL}/images/blueberry.jpeg`}
                            alt={`${process.env.PUBLIC_URL}/images/pineapple.jpg`} />
                        <span className="intro-word intro-word1">Welcome to All U Can Pick</span>
                        {/* <span className="intro-word intro-word2">Pick Your Favorite Fruits In The Bay Area</span> */}
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image className="intro-img" src={`${process.env.PUBLIC_URL}/images/cherry.jpeg`}
                            alt={`${process.env.PUBLIC_URL}/images/pineapple.jpg`} />
                        <span className="intro-word intro-word3">Pick Your Favorite Fruits In The Bay Area</span>
                    </Carousel.Item>
                </Carousel>
            </div>

            {/* Recommendation */}
            <div className="farm-recommendation">
                <h1 className="title-recommendation">Farm Recommendation</h1>
                <Marquee pauseOnHover>
                    <Row className='farmListRow'>
                        {farms.map((farm) => {
                            return (
                                <Col key={farm._id}>
                                    <Card className='farmsListPageCard'>
                                        <Card.Img
                                            className='smallPoster'
                                            src={farm.cover_image}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = `${process.env.PUBLIC_URL}/images/cherry2.jpeg`;
                                            }}
                                        />
                                        <Card.Body className='cardBody'>
                                            <Card.Title> {farm.farm_name}</Card.Title>
                                            <Card.Text>
                                                {farm.address}
                                            </Card.Text>
                                            <Link to={"/farms/" + farm._id}>
                                                <Button variant="outline-secondary">
                                                    See Details
                                                </Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Marquee>
            </div>

            {/* Features */}
            <section className="features">
                <Row>
                    <Col className="feature-box col-lg-4">
                        <GiFruitTree className="icon icon-local" />
                        <h3 className="feature-title">Buy Local.</h3>
                        <p className="feature-desc">Heading To These Farms For Fruit Picking</p>
                    </Col>
                    <Col className="feature-box col-lg-4">
                        <SiIfood className="icon icon-fresh" />
                        <h3 className="feature-title">Experience Fresh.</h3>
                        <p className="feature-desc">Picking Season Starts In April to September.</p>
                    </Col>


                    <Col className="feature-box col-lg-4">
                        <GiHealing className="icon icon-healthy" />
                        <h3 className="feature-title">Stay Healthy.</h3>
                        <p className="feature-desc">Best Tasting Organic Fruits</p>
                    </Col>
                </Row>
            </section>

            <GiPeach className="fruit fruit-peach" />
            <GiShinyApple className="fruit fruit-apple" />
            <DiRasberryPi className="fruit fruit-berry" />
            <GiStrawberry className="fruit fruit-strawberry" />
            <GiCherry className="fruit fruit-cherry" />
        </div >

    )
}
export default HomePage;